"use server";

import { compare, hash } from "bcryptjs";
import { and, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/db";
import {
  auditLogs,
  companies,
  companySmsSettings,
  leads,
  reviewFeedbacks,
  reviewRequests,
  services,
  smsMessages,
  supportTickets,
  users,
  websiteChangeRequests,
} from "@/db/schema";
import { requireClientUser, requireSuperAdmin, requireUser } from "@/lib/auth";
import { googleReviewSms } from "@/lib/sms-copy";
import { markSmsAsSent } from "@/lib/sms";

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
      hasAiAddon: formData.get("hasAiAddon") === "on",
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

export async function updateLeadStatusAction(formData: FormData) {
  const user = await requireUserForLeadAction();
  const leadId = String(formData.get("leadId") ?? "");
  const status = String(formData.get("status") ?? "new") as "new";

  const where =
    user.role === "super_admin" ? eq(leads.id, leadId) : and(eq(leads.id, leadId), eq(leads.companyId, user.companyId!));

  await db.update(leads).set({ status, updatedAt: new Date() }).where(where);
  revalidatePath("/dashboard/povprasevanja");
  revalidatePath("/admin/povprasevanja");
}

async function requireUserForLeadAction() {
  const { requireUser } = await import("@/lib/auth");
  return requireUser();
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

  await markSmsAsSent(sms.id);
  await db.update(reviewRequests).set({ status: "sent", sentAt: new Date() }).where(eq(reviewRequests.id, request.id));

  revalidatePath("/dashboard/google-ocene");
}

export async function sendReviewRequestForLeadAction(formData: FormData) {
  const user = await requireClientUser();
  const leadId = String(formData.get("leadId") ?? "");

  const [lead] = await db.select().from(leads).where(and(eq(leads.id, leadId), eq(leads.companyId, user.companyId!))).limit(1);
  const [company] = await db.select().from(companies).where(eq(companies.id, user.companyId!)).limit(1);

  if (!lead || !company?.googleReviewUrl || lead.status !== "completed") {
    return;
  }

  const [request] = await db
    .insert(reviewRequests)
    .values({
      companyId: user.companyId!,
      customerId: lead.customerId || null,
      leadId: lead.id,
      phone: lead.phone,
      reviewUrl: company.googleReviewUrl,
      status: "sent",
      sentAt: new Date(),
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

  await markSmsAsSent(sms.id);
  revalidatePath("/dashboard/google-ocene");
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
