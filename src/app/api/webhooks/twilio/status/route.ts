import { eq } from "drizzle-orm";
import twilio from "twilio";
import { db } from "@/db";
import { smsMessages } from "@/db/schema";

const finalStatus = {
  delivered: "delivered",
  failed: "failed",
  undelivered: "failed",
} as const;

export async function POST(request: Request) {
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const signature = request.headers.get("x-twilio-signature");
  const messageId = new URL(request.url).searchParams.get("messageId");
  const formData = await request.formData();
  const params = Object.fromEntries(
    Array.from(formData.entries(), ([key, value]) => [key, String(value)]),
  );

  if (!authToken || !signature || !messageId) {
    return new Response("Neveljavna zahteva.", { status: 400 });
  }

  const requestUrl = new URL(request.url);
  const publicBaseUrl = process.env.TWILIO_WEBHOOK_BASE_URL || process.env.APP_URL || process.env.NEXT_PUBLIC_APP_URL;
  const validationUrl = publicBaseUrl
    ? `${publicBaseUrl.replace(/\/$/, "")}${requestUrl.pathname}${requestUrl.search}`
    : request.url;

  if (!twilio.validateRequest(authToken, signature, validationUrl, params)) {
    return new Response("Neveljaven podpis.", { status: 403 });
  }

  const twilioStatus = params.MessageStatus;
  const status = finalStatus[twilioStatus as keyof typeof finalStatus];
  if (!status) {
    return new Response(null, { status: 204 });
  }

  const error = [params.ErrorCode, params.ErrorMessage].filter(Boolean).join(": ");
  await db
    .update(smsMessages)
    .set({
      status,
      errorMessage: status === "failed" ? error || "Twilio sporočila ni dostavil." : null,
    })
    .where(eq(smsMessages.id, messageId));

  return new Response(null, { status: 204 });
}
