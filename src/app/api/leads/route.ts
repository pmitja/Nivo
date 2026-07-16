import { and, eq, gte } from "drizzle-orm";
import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/db";
import { analyticsEvents, companies, contactForms, customers, leads, smsMessages } from "@/db/schema";
import { sendLeadConfirmationEmail } from "@/lib/email";
import { enforceRateLimits, getClientIdentifier, isSuspiciouslyFast } from "@/lib/form-spam-protection";
import { contractorLeadSms, customerLeadConfirmationSms } from "@/lib/sms-copy";
import { sendSms } from "@/lib/sms";
import { isUploadableLeadAttachment, prepareLeadAttachment, uploadPreparedFile } from "@/lib/uploadthing";

const MAX_ATTACHMENT_SIZE = 10 * 1024 * 1024;
const MAX_JSON_BODY_SIZE = 32 * 1024;
const DUPLICATE_WINDOW_MS = 2 * 60 * 1000;

const leadSchema = z.object({
  companyId: z.string().uuid(),
  name: z.string().trim().min(2).max(120),
  phone: z.string().trim().min(5).max(32).refine((value) => (value.match(/\d/g) ?? []).length >= 6),
  email: z.string().trim().email().max(254),
  location: z.string().trim().max(200).optional(),
  service: z.string().trim().min(2).max(200),
  message: z.string().trim().max(2000).default(""),
  privacyConsent: z.literal(true),
  marketingConsent: z.boolean().default(false),
  website: z.string().max(200).default(""),
  formStartedAt: z.coerce.number().int().positive().optional(),
});

/** Domene strank, ki smejo oddajati povpraševanja s svojega obrazca. */
export function allowedOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return null;

  const allowlist = (process.env.LEAD_FORM_ALLOWED_ORIGINS ?? "")
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean);

  if (origin === new URL(request.url).origin || allowlist.includes(origin)) {
    return origin;
  }

  return null;
}

export function corsHeaders(origin: string) {
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  };
}

export async function OPTIONS(request: Request) {
  const origin = allowedOrigin(request);
  if (!origin) return new Response(null, { status: 403 });

  return new Response(null, { status: 204, headers: corsHeaders(origin) });
}

export async function POST(request: Request) {
  const origin = allowedOrigin(request);

  // Zahtevek brez Origin glave (strežnik, curl) pustimo skozi; brskalnik ga vedno poslje.
  if (request.headers.get("origin") && !origin) {
    return NextResponse.json({ message: "Domena ni dovoljena." }, { status: 403 });
  }

  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > MAX_JSON_BODY_SIZE) {
    return NextResponse.json({ message: "Zahtevek je prevelik." }, { status: 413 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Neveljaven zahtevek." }, { status: 400 });
  }

  const response = await submitLead(body, undefined, null, request.headers);

  if (origin) {
    Object.entries(corsHeaders(origin)).forEach(([key, value]) => response.headers.set(key, value));
  }

  return response;
}

export async function submitLead(
  body: unknown,
  companyId?: string,
  attachment?: File | null,
  requestHeaders?: Headers,
) {
  const parsed = leadSchema.safeParse(
    typeof body === "object" && body !== null ? { ...body, companyId: companyId ?? (body as { companyId?: string }).companyId } : body,
  );

  if (!parsed.success) {
    return NextResponse.json({ message: "Preverite obvezna polja obrazca." }, { status: 400 });
  }

  if (parsed.data.website || (parsed.data.formStartedAt && isSuspiciouslyFast(parsed.data.formStartedAt))) {
    return NextResponse.json({ ok: true });
  }

  if (attachment && attachment.size > 0) {
    if (attachment.size > MAX_ATTACHMENT_SIZE) {
      return NextResponse.json({ message: "Priloga je lahko velika največ 10 MB." }, { status: 400 });
    }
    if (!isUploadableLeadAttachment(attachment)) {
      return NextResponse.json({ message: "Priloga mora biti Excel (XLS, XLSX) ali CSV datoteka." }, { status: 400 });
    }
  }

  const data = parsed.data;
  const [company] = await db.select().from(companies).where(eq(companies.id, data.companyId)).limit(1);

  if (!company || company.status === "cancelled" || company.status === "suspended") {
    return NextResponse.json({ message: "Obrazec trenutno ni aktiven." }, { status: 404 });
  }

  const [contactForm] = await db.select().from(contactForms).where(eq(contactForms.companyId, company.id)).limit(1);
  if (contactForm?.active === false) {
    return NextResponse.json({ message: "Obrazec trenutno ni aktiven." }, { status: 404 });
  }
  const clientIdentifier = getClientIdentifier(requestHeaders ?? new Headers());
  const normalizedPhone = data.phone.replace(/\D/g, "");
  const rateLimit = await enforceRateLimits([
    { scope: "lead:ip:10m", identifier: clientIdentifier, limit: 8, windowMs: 10 * 60 * 1000 },
    { scope: `lead:company:${company.id}:ip:10m`, identifier: clientIdentifier, limit: 4, windowMs: 10 * 60 * 1000 },
    { scope: `lead:company:${company.id}:phone:1h`, identifier: normalizedPhone, limit: 2, windowMs: 60 * 60 * 1000 },
  ]);

  if (!rateLimit.allowed) {
    return NextResponse.json(
      { message: "Preveč poskusov. Poskusite znova pozneje." },
      { status: 429, headers: { "Retry-After": String(rateLimit.retryAfterSeconds) } },
    );
  }

  // Preprecimo podvojena povprasevanja in morebitna podvojena obvestila.
  const [recentLead] = await db
    .select({ id: leads.id })
    .from(leads)
    .where(
      and(
        eq(leads.companyId, company.id),
        eq(leads.phone, data.phone),
        gte(leads.createdAt, new Date(Date.now() - DUPLICATE_WINDOW_MS)),
      ),
    )
    .limit(1);

  if (recentLead) {
    return NextResponse.json({ message: "Povpraševanje smo že prejeli." }, { status: 429 });
  }

  const missingRequiredField = contactForm?.fields.some((field) => {
    if (!field.enabled || !field.required) return false;
    return String(data[field.name] ?? "").trim().length === 0;
  });
  if (missingRequiredField) {
    return NextResponse.json({ message: "Izpolnite vsa obvezna polja." }, { status: 400 });
  }

  const [customer] = await db
    .insert(customers)
    .values({
      companyId: company.id,
      name: data.name,
      phone: data.phone,
      email: data.email || null,
      city: data.location || null,
      source: "spletni obrazec",
      marketingConsent: data.marketingConsent,
      marketingConsentAt: data.marketingConsent ? new Date() : null,
      marketingConsentSource: data.marketingConsent ? "spletni obrazec" : null,
    })
    .returning();

  let attachmentFields: {
    attachmentUrl: string;
    attachmentKey: string;
    attachmentName: string;
    attachmentSize: number;
  } | null = null;

  if (attachment && attachment.size > 0) {
    const prepared = prepareLeadAttachment(company.id, attachment);
    const uploaded = await uploadPreparedFile(prepared.file);
    attachmentFields = {
      attachmentUrl: uploaded.url,
      attachmentKey: uploaded.key,
      attachmentName: uploaded.name,
      attachmentSize: uploaded.size,
    };
  }

  const [lead] = await db
    .insert(leads)
    .values({
      companyId: company.id,
      customerId: customer.id,
      name: data.name,
      phone: data.phone,
      email: data.email || null,
      location: data.location || null,
      service: data.service,
      message: data.message,
      receivedWhilePaused: !company.acceptingLeads,
      pauseReason: company.acceptingLeads ? null : company.leadPauseReason ?? "vacation",
      source: "spletni obrazec",
      ...attachmentFields,
    })
    .returning();

  const notifications: Promise<unknown>[] = [];

  // Med dopustom oziroma zapolnjeno kapaciteto povpraševanje shranimo,
  // ne ustvarimo pa nobenega SMS sporočila.
  if (company.acceptingLeads) {
    const contractorMessage = contractorLeadSms(data.name, data.location, data.service);
    const customerMessage = customerLeadConfirmationSms(company.name);
    const [contractorSms, customerSms] = await db
      .insert(smsMessages)
      .values([
        {
          companyId: company.id,
          customerId: customer.id,
          leadId: lead.id,
          phone: company.phone,
          message: contractorMessage,
          type: "contractor_new_lead",
        },
        {
          companyId: company.id,
          customerId: customer.id,
          leadId: lead.id,
          phone: data.phone,
          message: customerMessage,
          type: "customer_auto_reply",
        },
      ])
      .returning();

    notifications.push(
      sendSms(contractorSms.id, company.phone, contractorMessage),
      sendSms(customerSms.id, data.phone, customerMessage),
    );
  }

  if (data.email) {
    notifications.push(
      sendLeadConfirmationEmail({
        customerEmail: data.email,
        customerName: data.name,
        companyName: company.name,
        companyEmail: company.email,
        companyPhone: company.phone,
        service: data.service,
        pauseReason: company.acceptingLeads ? null : company.leadPauseReason ?? "vacation",
      }),
    );
  }

  const notificationResults = await Promise.allSettled(notifications);
  notificationResults.forEach((result) => {
    if (result.status === "rejected") {
      console.error("Obvestilo po oddaji povpraševanja ni uspelo:", result.reason);
    }
  });

  await db.insert(analyticsEvents).values({
    companyId: company.id,
    type: "lead_submitted",
    source: "spletni obrazec",
    metadata: {
      leadId: lead.id,
      service: data.service,
      receivedWhilePaused: !company.acceptingLeads,
      pauseReason: company.acceptingLeads ? null : company.leadPauseReason,
    },
  });

  return NextResponse.json({ ok: true, leadId: lead.id });
}
