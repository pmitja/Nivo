"use server";

import { compare, hash } from "bcryptjs";
import { and, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/db";
import {
  auditLogs,
  campaigns,
  companies,
  companyDocuments,
  contactForms,
  companySmsSettings,
  leads,
  reviewFeedbacks,
  reviewRequests,
  services,
  smsMessages,
  supportTickets,
  users,
  websiteChangeRequests,
  websiteChangeRequestComments,
} from "@/db/schema";
import type { ContactFormField } from "@/db/schema";
import { requireClientUser, requireSuperAdmin, requireUser } from "@/lib/auth";
import { googleReviewSms } from "@/lib/sms-copy";
import { sendSms } from "@/lib/sms";
import {
  isUploadableCompanyDocument,
  prepareDocumentFile,
  prepareLogoFile,
  uploadPreparedFile,
} from "@/lib/uploadthing";

const defaultContactFormFields: ContactFormField[] = [
  { name: "name", label: "Ime in priimek", type: "text", required: true, enabled: true },
  { name: "phone", label: "Telefon", type: "tel", required: true, enabled: true },
  { name: "email", label: "E-pošta", type: "email", required: true, enabled: true },
  { name: "location", label: "Lokacija", type: "text", required: false, enabled: true },
  { name: "service", label: "Kaj potrebujete?", type: "text", required: true, enabled: true },
  { name: "message", label: "Sporočilo", type: "textarea", required: true, enabled: true },
];

export async function createCompanyAction(formData: FormData) {
  const admin = await requireSuperAdmin();
  const email = String(formData.get("email") ?? "").toLowerCase().trim();
  const password = String(formData.get("password") ?? "");

  const [company] = await db
    .insert(companies)
    .values({
      name: String(formData.get("name") ?? ""),
      contactName: String(formData.get("contactName") ?? ""),
      email,
      phone: String(formData.get("phone") ?? ""),
      industry: String(formData.get("industry") ?? ""),
      city: String(formData.get("city") ?? ""),
      domain: String(formData.get("domain") ?? ""),
      status: String(formData.get("status") ?? "setup") as "setup",
      hasAiAddon: false,
      googleReviewUrl: String(formData.get("googleReviewUrl") ?? "") || null,
      internalNotes: String(formData.get("internalNotes") ?? "") || null,
    })
    .returning();

  await db.insert(users).values({
    companyId: company.id,
    name: company.contactName,
    email,
    passwordHash: await hash(password || crypto.randomUUID(), 12),
    role: "client_admin",
  });

  await db.insert(services).values({
    companyId: company.id,
    name: "Osnovni paket",
    type: "basic_plan",
    price: "99",
    billingType: "monthly",
    status: "active",
    startedAt: new Date(),
  });

  await db.insert(contactForms).values({
    companyId: company.id,
    fields: defaultContactFormFields,
  });

  await db.insert(auditLogs).values({
    companyId: company.id,
    userId: admin.id,
    action: "company_created",
    entityType: "company",
    entityId: company.id,
    metadata: { source: "super_admin_dashboard" },
  });

  revalidatePath("/admin");
  revalidatePath("/admin/stranke");
  redirect(`/admin/stranke?created=${company.id}`);
}

export async function updateContactFormAction(formData: FormData) {
  const admin = await requireSuperAdmin();
  const companyId = String(formData.get("companyId") ?? "");
  if (!companyId) return;

  const fields = defaultContactFormFields.map((field) => ({
    ...field,
    label: String(formData.get(`${field.name}Label`) ?? field.label).trim() || field.label,
    enabled: field.name === "name" || field.name === "phone" || field.name === "email" || field.name === "message"
      ? true
      : formData.get(`${field.name}Enabled`) === "on",
    required: field.name === "name" || field.name === "phone" || field.name === "email" || field.name === "message"
      ? true
      : formData.get(`${field.name}Required`) === "on",
  }));

  await db.insert(contactForms).values({
    companyId,
    title: String(formData.get("title") ?? "").trim() || "Pošljite povpraševanje",
    intro: String(formData.get("intro") ?? "").trim() || "Opišite, kaj potrebujete.",
    submitLabel: String(formData.get("submitLabel") ?? "").trim() || "Pošlji povpraševanje",
    successMessage: String(formData.get("successMessage") ?? "").trim() || "Hvala za povpraševanje.",
    active: formData.get("active") === "on",
    fields,
  }).onConflictDoUpdate({
    target: contactForms.companyId,
    set: {
      title: String(formData.get("title") ?? "").trim() || "Pošljite povpraševanje",
      intro: String(formData.get("intro") ?? "").trim() || "Opišite, kaj potrebujete.",
      submitLabel: String(formData.get("submitLabel") ?? "").trim() || "Pošlji povpraševanje",
      successMessage: String(formData.get("successMessage") ?? "").trim() || "Hvala za povpraševanje.",
      active: formData.get("active") === "on",
      fields,
      updatedAt: new Date(),
    },
  });

  await db.insert(auditLogs).values({
    companyId,
    userId: admin.id,
    action: "contact_form_updated",
    entityType: "contact_form",
    metadata: { source: "super_admin_company_profile" },
  });
  revalidatePath(`/admin/stranke/${companyId}`);
  revalidatePath(`/obrazec/${companyId}`);
}

export async function updateCompanyAction(formData: FormData) {
  const admin = await requireSuperAdmin();
  const companyId = String(formData.get("companyId") ?? "");

  if (!companyId) {
    return;
  }

  await db
    .update(companies)
    .set({
      name: String(formData.get("name") ?? "").trim(),
      contactName: String(formData.get("contactName") ?? "").trim(),
      email: String(formData.get("email") ?? "").toLowerCase().trim(),
      phone: String(formData.get("phone") ?? "").trim(),
      industry: String(formData.get("industry") ?? "").trim() || null,
      address: String(formData.get("address") ?? "").trim() || null,
      city: String(formData.get("city") ?? "").trim() || null,
      domain: String(formData.get("domain") ?? "").trim() || null,
      status: String(formData.get("status") ?? "setup") as "setup",
      hasAiAddon: false,
      googleReviewUrl: String(formData.get("googleReviewUrl") ?? "").trim() || null,
      websiteStatus: String(formData.get("websiteStatus") ?? "").trim() || "V pripravi",
      googleBusinessProfileStatus: String(formData.get("googleBusinessProfileStatus") ?? "").trim() || "Ni naročeno",
      seoStatus: String(formData.get("seoStatus") ?? "").trim() || "Ni naročeno",
      advertisingStatus: String(formData.get("advertisingStatus") ?? "").trim() || "Ni naročeno",
      internalNotes: String(formData.get("internalNotes") ?? "").trim() || null,
      updatedAt: new Date(),
    })
    .where(eq(companies.id, companyId));

  await db.insert(auditLogs).values({
    companyId,
    userId: admin.id,
    action: "company_updated",
    entityType: "company",
    entityId: companyId,
    metadata: { source: "super_admin_company_profile" },
  });

  revalidatePath("/admin/stranke");
  revalidatePath(`/admin/stranke/${companyId}`);
}

export async function uploadCompanyLogoAction(formData: FormData) {
  const admin = await requireSuperAdmin();
  const companyId = String(formData.get("companyId") ?? "");
  const file = formData.get("logo");

  if (!companyId || !(file instanceof File) || file.size === 0) {
    return;
  }

  const prepared = await prepareLogoFile(companyId, file);
  const uploaded = await uploadPreparedFile(prepared.file);

  await db
    .update(companies)
    .set({
      logoUrl: uploaded.url,
      logoKey: uploaded.key,
      logoName: uploaded.name,
      updatedAt: new Date(),
    })
    .where(eq(companies.id, companyId));

  await db.insert(auditLogs).values({
    companyId,
    userId: admin.id,
    action: "company_logo_uploaded",
    entityType: "company",
    entityId: companyId,
    metadata: {
      fileKey: uploaded.key,
      customId: uploaded.customId ?? prepared.customId,
      fileName: uploaded.name,
    },
  });

  revalidatePath(`/admin/stranke/${companyId}`);
  revalidatePath("/admin/stranke");
}

export async function uploadCompanyDocumentAction(formData: FormData) {
  const admin = await requireSuperAdmin();
  const companyId = String(formData.get("companyId") ?? "");
  const file = formData.get("document");
  const title = String(formData.get("title") ?? "").trim();
  const notes = String(formData.get("notes") ?? "").trim();

  if (!companyId || !(file instanceof File) || file.size === 0) {
    return;
  }

  if (file.size > 15 * 1024 * 1024) {
    throw new Error("Dokument je lahko velik največ 15 MB.");
  }

  if (!isUploadableCompanyDocument(file)) {
    throw new Error("Dovoljeni so PDF, Word, Excel, SVG, PNG, JPG in WebP dokumenti.");
  }

  const prepared = prepareDocumentFile(companyId, file);
  const uploaded = await uploadPreparedFile(prepared.file);

  const [document] = await db
    .insert(companyDocuments)
    .values({
      companyId,
      uploadedById: admin.id,
      title: title || uploaded.name,
      fileName: uploaded.name,
      fileUrl: uploaded.url,
      fileKey: uploaded.key,
      fileType: file.type || "application/octet-stream",
      fileSize: uploaded.size,
      customId: uploaded.customId ?? prepared.customId,
      notes: notes || null,
    })
    .returning();

  await db.insert(auditLogs).values({
    companyId,
    userId: admin.id,
    action: "company_document_uploaded",
    entityType: "company_document",
    entityId: document.id,
    metadata: {
      fileKey: uploaded.key,
      customId: uploaded.customId ?? prepared.customId,
      fileName: uploaded.name,
    },
  });

  revalidatePath(`/admin/stranke/${companyId}`);
}

export async function createCompanyServiceAction(formData: FormData) {
  const admin = await requireSuperAdmin();
  const companyId = String(formData.get("companyId") ?? "");
  const name = String(formData.get("name") ?? "").trim();

  if (!companyId || !name) {
    return;
  }

  await db.insert(services).values({
    companyId,
    name,
    type: String(formData.get("type") ?? "website_changes") as "website_changes",
    price: String(formData.get("price") ?? "").trim() || null,
    billingType: String(formData.get("billingType") ?? "one_time") as "one_time",
    status: String(formData.get("status") ?? "ordered") as "ordered",
    startedAt: new Date(),
    notes: String(formData.get("notes") ?? "").trim() || null,
  });

  await db.insert(auditLogs).values({
    companyId,
    userId: admin.id,
    action: "service_created",
    entityType: "service",
    metadata: { source: "super_admin_company_profile", name },
  });

  revalidatePath(`/admin/stranke/${companyId}`);
  revalidatePath("/admin/storitve");
  revalidatePath("/admin/placila");
}

export async function updateCompanyServiceStatusAction(formData: FormData) {
  const admin = await requireSuperAdmin();
  const companyId = String(formData.get("companyId") ?? "");
  const serviceId = String(formData.get("serviceId") ?? "");
  const status = String(formData.get("status") ?? "ordered") as typeof services.$inferSelect.status;

  if (!companyId || !serviceId) {
    return;
  }

  await db
    .update(services)
    .set({
      status,
      completedAt: status === "completed" ? new Date() : null,
    })
    .where(and(eq(services.id, serviceId), eq(services.companyId, companyId)));

  await db.insert(auditLogs).values({
    companyId,
    userId: admin.id,
    action: "service_status_updated",
    entityType: "service",
    entityId: serviceId,
    metadata: { status },
  });

  revalidatePath(`/admin/stranke/${companyId}`);
  revalidatePath("/admin/storitve");
  revalidatePath("/admin/placila");
}

export async function changePasswordAction(_: unknown, formData: FormData) {
  const user = await requireUser();
  const currentPassword = String(formData.get("currentPassword") ?? "");
  const newPassword = String(formData.get("newPassword") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");

  if (newPassword.length < 10) {
    return { message: "Novo geslo naj ima vsaj 10 znakov.", ok: false };
  }

  if (newPassword !== confirmPassword) {
    return { message: "Novo geslo in potrditev se ne ujemata.", ok: false };
  }

  const [dbUser] = await db.select().from(users).where(eq(users.id, user.id)).limit(1);
  if (!dbUser) {
    return { message: "Uporabnik ni najden.", ok: false };
  }

  const validCurrentPassword = await compare(currentPassword, dbUser.passwordHash);
  if (!validCurrentPassword) {
    return { message: "Trenutno geslo ni pravilno.", ok: false };
  }

  await db
    .update(users)
    .set({
      passwordHash: await hash(newPassword, 12),
      updatedAt: new Date(),
    })
    .where(eq(users.id, user.id));

  await db.insert(auditLogs).values({
    companyId: user.companyId,
    userId: user.id,
    action: "password_changed",
    entityType: "user",
    entityId: user.id,
    metadata: { source: "dashboard_settings" },
  });

  return { message: "Geslo je uspešno posodobljeno.", ok: true };
}

export async function updateClientCompanySettingsAction(_: unknown, formData: FormData) {
  const user = await requireClientUser();

  await db
    .update(companies)
    .set({
      contactName: String(formData.get("contactName") ?? "").trim(),
      email: String(formData.get("email") ?? "").toLowerCase().trim(),
      phone: String(formData.get("phone") ?? "").trim(),
      address: String(formData.get("address") ?? "").trim() || null,
      city: String(formData.get("city") ?? "").trim() || null,
      googleReviewUrl: String(formData.get("googleReviewUrl") ?? "").trim() || null,
      updatedAt: new Date(),
    })
    .where(eq(companies.id, user.companyId!));

  await db.insert(auditLogs).values({
    companyId: user.companyId!,
    userId: user.id,
    action: "client_company_settings_updated",
    entityType: "company",
    entityId: user.companyId!,
    metadata: { source: "client_settings" },
  });

  revalidatePath("/dashboard/nastavitve");
  return { message: "Podatki podjetja so shranjeni.", ok: true };
}

export async function updateLeadStatusAction(formData: FormData) {
  const user = await requireUserForLeadAction();
  const leadId = String(formData.get("leadId") ?? "");
  const status = String(formData.get("status") ?? "new") as "new";

  const where =
    user.role === "super_admin" ? eq(leads.id, leadId) : and(eq(leads.id, leadId), eq(leads.companyId, user.companyId!));

  await db.update(leads).set({ status, updatedAt: new Date() }).where(where);
  revalidateLeadPaths();
}

async function requireUserForLeadAction() {
  const { requireUser } = await import("@/lib/auth");
  return requireUser();
}

function revalidateLeadPaths() {
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/povprasevanja");
  revalidatePath("/dashboard/povprasevanja/kontaktirano");
  revalidatePath("/dashboard/povprasevanja/ponudbe-poslane");
  revalidatePath("/dashboard/povprasevanja/dogovorjeno");
  revalidatePath("/dashboard/povprasevanja/zakljuceno");
  revalidatePath("/dashboard/povprasevanja/izgubljeno");
  revalidatePath("/admin/povprasevanja");
}

export type CreateManualLeadState = { ok: boolean; message: string } | null;

export async function createManualLeadAction(
  _prevState: CreateManualLeadState,
  formData: FormData,
): Promise<CreateManualLeadState> {
  const user = await requireClientUser();

  const name = String(formData.get("name") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const location = String(formData.get("location") ?? "").trim();
  const service = String(formData.get("service") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();
  const status = String(formData.get("status") ?? "new") as "new";

  if (!name || !phone || !service || !message) {
    return { ok: false, message: "Izpolnite ime, telefon, vrsto dela in opis dela." };
  }

  await db.insert(leads).values({
    companyId: user.companyId!,
    name,
    phone,
    email: email || null,
    location: location || null,
    service,
    message,
    status,
    source: "ročni vnos",
  });

  revalidateLeadPaths();
  return { ok: true, message: "Povpraševanje je dodano." };
}

export async function createWebsiteRequestAction(formData: FormData) {
  const user = await requireClientUser();

  await db.insert(websiteChangeRequests).values({
    companyId: user.companyId!,
    userId: user.id,
    title: String(formData.get("title") ?? ""),
    message: String(formData.get("message") ?? ""),
    priority: String(formData.get("priority") ?? "normal") as "normal",
  });

  revalidatePath("/dashboard/spletna-stran");
  redirect("/dashboard/spletna-stran?sent=1");
}

export async function updateWebsiteRequestStatusAction(formData: FormData) {
  const admin = await requireSuperAdmin();
  const requestId = String(formData.get("requestId") ?? "");
  const status = String(formData.get("status") ?? "new") as typeof websiteChangeRequests.$inferSelect.status;

  if (!requestId) {
    return;
  }

  const [request] = await db
    .update(websiteChangeRequests)
    .set({
      status,
      resolvedAt: ["completed", "closed"].includes(status) ? new Date() : null,
    })
    .where(eq(websiteChangeRequests.id, requestId))
    .returning();

  if (!request) {
    return;
  }

  await db.insert(auditLogs).values({
    companyId: request.companyId,
    userId: admin.id,
    action: "website_request_status_updated",
    entityType: "website_change_request",
    entityId: request.id,
    metadata: { status },
  });

  revalidatePath("/admin/zahtevki");
  revalidatePath(`/admin/stranke/${request.companyId}`);
  revalidatePath("/dashboard/spletna-stran");
}

export async function addWebsiteRequestCommentAction(formData: FormData) {
  const user = await requireUser();
  const requestId = String(formData.get("requestId") ?? "");
  const message = String(formData.get("message") ?? "").trim();

  if (!requestId || message.length < 2) {
    return;
  }

  const where =
    user.role === "super_admin"
      ? eq(websiteChangeRequests.id, requestId)
      : and(eq(websiteChangeRequests.id, requestId), eq(websiteChangeRequests.companyId, user.companyId!));

  const [request] = await db.select().from(websiteChangeRequests).where(where).limit(1);

  if (!request) {
    return;
  }

  await db.insert(websiteChangeRequestComments).values({
    requestId: request.id,
    senderId: user.id,
    message,
  });

  await db.insert(auditLogs).values({
    companyId: request.companyId,
    userId: user.id,
    action: "website_request_comment_added",
    entityType: "website_change_request",
    entityId: request.id,
    metadata: { source: user.role === "super_admin" ? "super_admin_requests" : "client_website" },
  });

  revalidatePath("/admin/zahtevki");
  revalidatePath(`/admin/stranke/${request.companyId}`);
  revalidatePath("/dashboard/spletna-stran");
}

export async function createSupportTicketAction(formData: FormData) {
  const user = await requireClientUser();

  await db.insert(supportTickets).values({
    companyId: user.companyId!,
    userId: user.id,
    category: String(formData.get("category") ?? "splošno vprašanje"),
    title: String(formData.get("title") ?? ""),
    message: String(formData.get("message") ?? ""),
  });

  revalidatePath("/dashboard/podpora");
  redirect("/dashboard/podpora?sent=1");
}

export async function updateSupportTicketStatusAction(formData: FormData) {
  const admin = await requireSuperAdmin();
  const ticketId = String(formData.get("ticketId") ?? "");
  const status = String(formData.get("status") ?? "new") as typeof supportTickets.$inferSelect.status;

  if (!ticketId) {
    return;
  }

  const [ticket] = await db
    .update(supportTickets)
    .set({
      status,
      resolvedAt: ["completed", "closed"].includes(status) ? new Date() : null,
    })
    .where(eq(supportTickets.id, ticketId))
    .returning();

  if (!ticket) {
    return;
  }

  await db.insert(auditLogs).values({
    companyId: ticket.companyId,
    userId: admin.id,
    action: "support_ticket_status_updated",
    entityType: "support_ticket",
    entityId: ticket.id,
    metadata: { status },
  });

  revalidatePath("/admin/zahtevki");
  revalidatePath(`/admin/stranke/${ticket.companyId}`);
  revalidatePath("/dashboard/podpora");
}

export async function createCampaignRequestAction(formData: FormData) {
  const user = await requireClientUser();

  await db.insert(supportTickets).values({
    companyId: user.companyId!,
    userId: user.id,
    category: "pomoč pri kampanji",
    title: String(formData.get("title") ?? "Nova kampanja"),
    message: String(formData.get("message") ?? ""),
  });

  revalidatePath("/dashboard/kampanje");
  redirect("/dashboard/kampanje?sent=1");
}

export async function createCampaignAction(formData: FormData) {
  await requireSuperAdmin();

  const companyId = String(formData.get("companyId") ?? "");
  const name = String(formData.get("name") ?? "").trim();

  if (!companyId || !name) {
    return;
  }

  await db.insert(campaigns).values({
    companyId,
    name,
    type: String(formData.get("type") ?? "sms") as "sms",
    channel: String(formData.get("channel") ?? "SMS"),
    status: String(formData.get("status") ?? "draft") as "draft",
    message: String(formData.get("message") ?? "") || null,
  });

  revalidatePath("/admin/kampanje");
  revalidatePath("/dashboard/kampanje");
  redirect("/admin/kampanje?created=1");
}

export async function confirmPreparedCampaignAction(formData: FormData) {
  const user = await requireClientUser();
  const campaignId = String(formData.get("campaignId") ?? "");

  if (!campaignId) {
    return;
  }

  const [campaign] = await db
    .update(campaigns)
    .set({
      status: "active",
      updatedAt: new Date(),
    })
    .where(and(eq(campaigns.id, campaignId), eq(campaigns.companyId, user.companyId!), eq(campaigns.status, "prepared")))
    .returning();

  if (!campaign) {
    return;
  }

  await db.insert(auditLogs).values({
    companyId: user.companyId!,
    userId: user.id,
    action: "campaign_confirmed",
    entityType: "campaign",
    entityId: campaign.id,
    metadata: { source: "client_campaigns" },
  });

  revalidatePath("/dashboard/kampanje");
  revalidatePath("/admin/kampanje");
}

export async function updateAutoReplyMessageAction(_: unknown, formData: FormData) {
  const user = await requireClientUser();
  const autoReplyMessage = String(formData.get("autoReplyMessage") ?? "").trim();

  if (autoReplyMessage.length < 20) {
    return { ok: false, message: "Sporočilo naj ima vsaj 20 znakov." };
  }

  if (autoReplyMessage.length > 480) {
    return { ok: false, message: "Sporočilo naj bo krajše od 480 znakov." };
  }

  await db
    .insert(companySmsSettings)
    .values({
      companyId: user.companyId!,
      autoReplyMessage,
      updatedAt: new Date(),
    })
    .onConflictDoUpdate({
      target: companySmsSettings.companyId,
      set: {
        autoReplyMessage,
        updatedAt: new Date(),
      },
    });

  await db.insert(auditLogs).values({
    companyId: user.companyId!,
    userId: user.id,
    action: "auto_reply_message_updated",
    entityType: "company_sms_settings",
    entityId: user.companyId!,
    metadata: { source: "sms_dashboard" },
  });

  revalidatePath("/dashboard/sms");
  return { ok: true, message: "Avtomatski SMS odgovor je shranjen." };
}

export async function sendReviewRequestAction(formData: FormData) {
  const user = await requireClientUser();
  const customerId = String(formData.get("customerId") ?? "");
  const phone = String(formData.get("phone") ?? "");
  const reviewUrl = String(formData.get("reviewUrl") ?? "");

  if (!reviewUrl || !phone) {
    return;
  }

  const [request] = await db
    .insert(reviewRequests)
    .values({
      companyId: user.companyId!,
      customerId: customerId || null,
      phone,
      reviewUrl,
      status: "sent",
      sentAt: new Date(),
    })
    .returning();

  const [sms] = await db
    .insert(smsMessages)
    .values({
      companyId: user.companyId!,
      customerId: customerId || null,
      phone,
      message: googleReviewSms(reviewUrl),
      type: "google_review_request",
      status: "pending",
    })
    .returning();

  await sendSms(sms.id, phone, sms.message);
  await db.update(reviewRequests).set({ status: "sent", sentAt: new Date() }).where(eq(reviewRequests.id, request.id));

  revalidatePath("/dashboard/google-ocene");
}

export type SendReviewRequestState = { ok: boolean; message: string } | null;

export async function sendReviewRequestForLeadAction(
  _prevState: SendReviewRequestState,
  formData: FormData,
): Promise<SendReviewRequestState> {
  const user = await requireClientUser();
  const leadId = String(formData.get("leadId") ?? "");

  const [lead] = await db.select().from(leads).where(and(eq(leads.id, leadId), eq(leads.companyId, user.companyId!))).limit(1);
  const [company] = await db.select().from(companies).where(eq(companies.id, user.companyId!)).limit(1);

  if (!lead || !company?.googleReviewUrl || lead.status !== "completed") {
    return { ok: false, message: "Zahteve za oceno trenutno ni mogoče poslati." };
  }

  const [request] = await db
    .insert(reviewRequests)
    .values({
      companyId: user.companyId!,
      customerId: lead.customerId || null,
      leadId: lead.id,
      phone: lead.phone,
      reviewUrl: company.googleReviewUrl,
      status: "pending",
    })
    .returning();

  const publicReviewUrl = `${await getAppBaseUrl()}/ocena/${request.id}`;

  const [sms] = await db
    .insert(smsMessages)
    .values({
      companyId: user.companyId!,
      customerId: lead.customerId || null,
      leadId: lead.id,
      phone: lead.phone,
      message: googleReviewSms(publicReviewUrl),
      type: "google_review_request",
      status: "pending",
    })
    .returning();

  try {
    await sendSms(sms.id, lead.phone, sms.message);
    await db.update(reviewRequests).set({ status: "sent", sentAt: new Date() }).where(eq(reviewRequests.id, request.id));
    revalidatePath("/dashboard/google-ocene");
    revalidatePath("/dashboard/povprasevanja");
    return { ok: true, message: "Zahteva za oceno je bila poslana." };
  } catch {
    await db.update(reviewRequests).set({ status: "failed" }).where(eq(reviewRequests.id, request.id));
    revalidatePath("/dashboard/google-ocene");
    revalidatePath("/dashboard/povprasevanja");
    return { ok: false, message: "Pošiljanje ni uspelo. Poskusite znova kasneje." };
  }
}

export async function submitPublicReviewAction(_: unknown, formData: FormData) {
  const requestId = String(formData.get("requestId") ?? "");
  const rating = Number(formData.get("rating") ?? 0);
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const feedback = String(formData.get("feedback") ?? "").trim();

  const [request] = await db.select().from(reviewRequests).where(eq(reviewRequests.id, requestId)).limit(1);

  if (!request || rating < 1 || rating > 5) {
    return { ok: false, message: "Ocene trenutno ni mogoče oddati." };
  }

  if (rating >= 4) {
    await db.insert(reviewFeedbacks).values({
      companyId: request.companyId,
      reviewRequestId: request.id,
      customerId: request.customerId,
      leadId: request.leadId,
      rating,
      name: name || null,
      email: email || null,
      feedback: feedback || null,
    });

    redirect(request.reviewUrl);
  }

  if (feedback.length < 5) {
    return { ok: false, message: "Prosimo napišite kratek komentar, da lahko izboljšamo storitev." };
  }

  await db.insert(reviewFeedbacks).values({
    companyId: request.companyId,
    reviewRequestId: request.id,
    customerId: request.customerId,
    leadId: request.leadId,
    rating,
    name: name || null,
    email: email || null,
    feedback,
  });

  return { ok: true, message: "Hvala za povratno informacijo. Vaše sporočilo smo prejeli." };
}

async function getAppBaseUrl() {
  const configuredUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.APP_URL;
  if (configuredUrl) {
    return configuredUrl.replace(/\/$/, "");
  }

  const headerStore = await headers();
  const host = headerStore.get("host") ?? "localhost:3001";
  const proto = headerStore.get("x-forwarded-proto") ?? (host.includes("localhost") ? "http" : "https");
  return `${proto}://${host}`;
}
