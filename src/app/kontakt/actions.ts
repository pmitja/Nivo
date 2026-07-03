"use server";

import { z } from "zod";

import { sendContactInquiryEmails } from "@/lib/email";

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
  website: z.string().default(""),
});

export type ContactInquiryResult = { ok: true } | { ok: false; error: string };

export async function submitContactInquiry(input: unknown): Promise<ContactInquiryResult> {
  const parsed = inquirySchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Preverite vnesene podatke." };
  }

  const { website, ...inquiry } = parsed.data;
  if (website) {
    return { ok: true };
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
