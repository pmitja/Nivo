import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/db";
import { analyticsEvents, companies, companySmsSettings, customers, leads, smsMessages } from "@/db/schema";
import { contractorLeadSms, customerAutoReplySms } from "@/lib/sms-copy";
import { markSmsAsSent } from "@/lib/sms";

const leadSchema = z.object({
  companyId: z.string().uuid(),
  name: z.string().min(2),
  phone: z.string().min(5),
  email: z.string().email().optional().or(z.literal("")),
  location: z.string().optional(),
  service: z.string().min(2),
  message: z.string().min(10),
  privacyConsent: z.literal(true),
  marketingConsent: z.boolean().default(false),
});

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = leadSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ message: "Preverite obvezna polja obrazca." }, { status: 400 });
  }

  const data = parsed.data;
  const [company] = await db.select().from(companies).where(eq(companies.id, data.companyId)).limit(1);

  if (!company || company.status === "cancelled" || company.status === "suspended") {
    return NextResponse.json({ message: "Obrazec trenutno ni aktiven." }, { status: 404 });
  }

  const [smsSettings] = await db
    .select()
    .from(companySmsSettings)
    .where(eq(companySmsSettings.companyId, company.id))
    .limit(1);

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
      source: "spletni obrazec",
    })
    .returning();

  const contractorMessage = contractorLeadSms(data.name, data.location, data.service);
  const customerMessage = customerAutoReplySms(smsSettings?.autoReplyMessage);

  const createdSms = await db
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

  await Promise.all(createdSms.map((sms) => markSmsAsSent(sms.id)));

  await db.insert(analyticsEvents).values({
    companyId: company.id,
    type: "lead_submitted",
    source: "spletni obrazec",
    metadata: { leadId: lead.id, service: data.service },
  });

  return NextResponse.json({ ok: true, leadId: lead.id });
}
