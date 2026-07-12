import { eq } from "drizzle-orm";
import { db } from "@/db";
import { smsMessages } from "@/db/schema";
export { contractorLeadSms, customerLeadConfirmationSms, googleReviewSms, SMS_MAX_LENGTH, toGsm7 } from "@/lib/sms-copy";

const SENT_MESSAGES_URL = "https://api.sent.dm/v3/messages";

type SentSendResponse = {
  success?: boolean;
  data?: { recipients?: { message_id?: string }[] };
  error?: { message?: string };
};

function toE164(phone: string) {
  const cleaned = phone.trim().replace(/[^\d+]/g, "");
  if (cleaned.startsWith("+")) return cleaned;
  if (cleaned.startsWith("00")) return `+${cleaned.slice(2)}`;
  if (cleaned.startsWith("386")) return `+${cleaned}`;
  if (cleaned.startsWith("0")) return `+386${cleaned.slice(1)}`;
  return `+386${cleaned}`;
}

export async function sendSms(messageId: string, phone: string, message: string) {
  const apiKey = process.env.SENT_API_KEY;

  if (!apiKey) {
    throw new Error("Okoljska spremenljivka SENT_API_KEY ni nastavljena.");
  }

  try {
    const response = await fetch(SENT_MESSAGES_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "Idempotency-Key": messageId,
      },
      body: JSON.stringify({
        to: [toE164(phone)],
        text: message,
        channel: ["sms"],
      }),
    });

    const payload: SentSendResponse | null = await response.json().catch(() => null);

    if (!response.ok || payload?.success === false) {
      throw new Error(payload?.error?.message || `Sent.dm je vrnil status ${response.status}.`);
    }

    await db
      .update(smsMessages)
      .set({
        status: "sent",
        provider: "sent.dm",
        providerMessageId: payload?.data?.recipients?.[0]?.message_id ?? null,
        sentAt: new Date(),
        errorMessage: null,
      })
      .where(eq(smsMessages.id, messageId));
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Pošiljanje SMS-a ni uspelo.";

    await db
      .update(smsMessages)
      .set({ status: "failed", provider: "sent.dm", errorMessage })
      .where(eq(smsMessages.id, messageId));

    throw error;
  }
}
