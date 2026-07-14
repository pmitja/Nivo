import { eq } from "drizzle-orm";
import { db } from "@/db";
import { smsMessages } from "@/db/schema";
export { contractorLeadSms, customerLeadConfirmationSms, googleReviewSms, SMS_MAX_LENGTH, toGsm7 } from "@/lib/sms-copy";

const SEVEN_SMS_URL = "https://gateway.seven.io/api/sms";

export const SMS_PROVIDER = "seven.io";

/** Seven.io vrne "100", ko je sporočilo sprejeto. Vse ostalo je napaka. */
const SEVEN_SUCCESS = "100";

const SEVEN_ERRORS: Record<string, string> = {
  "101": "Pošiljanje ni uspelo za vsaj enega prejemnika.",
  "201": "Neveljaven pošiljatelj.",
  "202": "Neveljavna telefonska številka prejemnika.",
  "301": "Manjka prejemnik.",
  "305": "Neveljavno besedilo sporočila.",
  "401": "Besedilo je predolgo.",
  "402": "Enako sporočilo je bilo poslano v zadnjih 180 sekundah.",
  "403": "Dnevna omejitev za tega prejemnika je dosežena.",
  "500": "Na računu seven.io ni dovolj dobroimetja.",
  "600": "Napaka pri pošiljanju.",
  "900": "Napačen API ključ za seven.io.",
  "902": "API ključ nima dostopa do pošiljanja SMS.",
  "903": "IP naslov ni na seznamu dovoljenih.",
};

type SevenSendResponse = {
  success?: string;
  total_price?: number;
  messages?: {
    id?: string;
    price?: number;
    success?: boolean;
    error?: string | null;
    error_text?: string | null;
  }[];
};

function toE164(phone: string) {
  const cleaned = phone.trim().replace(/[^\d+]/g, "");
  if (cleaned.startsWith("+")) return cleaned;
  if (cleaned.startsWith("00")) return `+${cleaned.slice(2)}`;
  if (cleaned.startsWith("386")) return `+${cleaned}`;
  if (cleaned.startsWith("0")) return `+386${cleaned.slice(1)}`;
  return `+386${cleaned}`;
}

function sevenError(payload: SevenSendResponse | null, httpStatus: number) {
  const code = payload?.success;
  const message = payload?.messages?.[0];

  if (code && code !== SEVEN_SUCCESS) {
    return SEVEN_ERRORS[code] ?? `Seven.io je vrnil kodo ${code}.`;
  }

  if (message?.error_text || message?.error) {
    return message.error_text || `Seven.io je vrnil napako ${message.error}.`;
  }

  return `Seven.io je vrnil status ${httpStatus}.`;
}

export async function sendSms(messageId: string, phone: string, message: string) {
  const apiKey = process.env.SEVEN_API_KEY;

  if (!apiKey) {
    throw new Error("Okoljska spremenljivka SEVEN_API_KEY ni nastavljena.");
  }

  try {
    const response = await fetch(SEVEN_SMS_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "X-Api-Key": apiKey,
      },
      body: JSON.stringify({
        to: toE164(phone),
        text: message,
        from: process.env.SEVEN_SMS_FROM || undefined,
        // Naš ID sporočila potujemo naprej, da ga vidimo v seven.io dnevniku.
        foreign_id: messageId,
      }),
    });

    const payload: SevenSendResponse | null = await response.json().catch(() => null);
    const sent = payload?.messages?.[0];

    if (!response.ok || payload?.success !== SEVEN_SUCCESS || sent?.success === false) {
      throw new Error(sevenError(payload, response.status));
    }

    await db
      .update(smsMessages)
      .set({
        status: "sent",
        provider: SMS_PROVIDER,
        providerMessageId: sent?.id ?? null,
        cost: sent?.price != null ? String(sent.price) : null,
        sentAt: new Date(),
        errorMessage: null,
      })
      .where(eq(smsMessages.id, messageId));
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Pošiljanje SMS-a ni uspelo.";

    await db
      .update(smsMessages)
      .set({ status: "failed", provider: SMS_PROVIDER, errorMessage })
      .where(eq(smsMessages.id, messageId));

    throw error;
  }
}
