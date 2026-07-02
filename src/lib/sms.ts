import { eq } from "drizzle-orm";
import twilio from "twilio";
import { db } from "@/db";
import { smsMessages } from "@/db/schema";
export { contractorLeadSms, customerAutoReplySms, defaultCustomerAutoReply, googleReviewSms } from "@/lib/sms-copy";

function toE164(phone: string) {
  const cleaned = phone.trim().replace(/[^\d+]/g, "");
  if (cleaned.startsWith("+")) return cleaned;
  if (cleaned.startsWith("00")) return `+${cleaned.slice(2)}`;
  if (cleaned.startsWith("386")) return `+${cleaned}`;
  if (cleaned.startsWith("0")) return `+386${cleaned.slice(1)}`;
  return `+386${cleaned}`;
}

function getStatusCallbackUrl(messageId: string) {
  const appUrl = process.env.TWILIO_WEBHOOK_BASE_URL || process.env.APP_URL || process.env.NEXT_PUBLIC_APP_URL;
  if (!appUrl) return undefined;

  return `${appUrl.replace(/\/$/, "")}/api/webhooks/twilio/status?messageId=${encodeURIComponent(messageId)}`;
}

export async function sendSms(messageId: string, phone: string, message: string) {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_PHONE_NUMBER;

  if (!accountSid || !authToken || !from) {
    throw new Error("Twilio okoljske spremenljivke niso nastavljene.");
  }

  try {
    await twilio(accountSid, authToken).messages.create({
      body: message,
      from,
      to: toE164(phone),
      statusCallback: getStatusCallbackUrl(messageId),
    });

    await db
      .update(smsMessages)
      .set({
        status: "sent",
        provider: "twilio",
        sentAt: new Date(),
        errorMessage: null,
      })
      .where(eq(smsMessages.id, messageId));
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Pošiljanje SMS-a ni uspelo.";

    await db
      .update(smsMessages)
      .set({ status: "failed", provider: "twilio", errorMessage })
      .where(eq(smsMessages.id, messageId));

    throw error;
  }
}
