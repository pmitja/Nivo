"use server";

import { z } from "zod";
import { headers } from "next/headers";

import { sendContactInquiryEmails } from "@/lib/email";
import { enforceRateLimits, getClientIdentifier, isSuspiciouslyFast } from "@/lib/form-spam-protection";

const inquirySchema = z.object({
  name: z.string().trim().min(1, "Vnesite ime in priimek.").max(200),
  email: z.string().trim().email("Neveljaven e-naslov.").max(200),
  phone: z
    .string()
    .trim()
    .min(1, "Vnesite telefon.")
    .max(50)
    .refine((value) => (value.match(/\d/g) || []).length >= 6, "Neveljavna številka."),
  panoga: z.string().trim().max(100).default(""),
  message: z.string().trim().max(5000).default(""),
  website: z.string().max(200).default(""),
  formStartedAt: z.coerce.number().int().positive(),
});

export type ContactInquiryResult = { ok: true } | { ok: false; error: string };

export async function submitContactInquiry(input: unknown): Promise<ContactInquiryResult> {
  const parsed = inquirySchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Preverite vnesene podatke." };
  }

  const { website, formStartedAt, ...inquiry } = parsed.data;
  if (website || isSuspiciouslyFast(formStartedAt)) {
    return { ok: true };
  }

  const headerStore = await headers();
  const clientIdentifier = getClientIdentifier(headerStore);
  const rateLimit = await enforceRateLimits([
    { scope: "contact:ip:15m", identifier: clientIdentifier, limit: 3, windowMs: 15 * 60 * 1000 },
    { scope: "contact:ip:24h", identifier: clientIdentifier, limit: 10, windowMs: 24 * 60 * 60 * 1000 },
  ]);

  if (!rateLimit.allowed) {
    return { ok: false, error: "Preveč poskusov. Poskusite znova pozneje." };
  }

  try {
    await sendContactInquiryEmails(inquiry);
    return { ok: true };
  } catch (error) {
    console.error("Pošiljanje povpraševanja ni uspelo:", error);
    return {
      ok: false,
      error: "Pošiljanje trenutno ne deluje. Poskusite znova ali nas pokličite.",
    };
  }
}
