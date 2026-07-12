import { createHmac, timingSafeEqual } from "node:crypto";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { smsMessages } from "@/db/schema";

const finalStatus = {
  DELIVERED: "delivered",
  FAILED: "failed",
} as const;

function isValidSignature(rawBody: string, headers: Headers, secret: string) {
  const signature = headers.get("x-webhook-signature");
  const webhookId = headers.get("x-webhook-id");
  const timestamp = headers.get("x-webhook-timestamp");

  if (!signature || !webhookId || !timestamp) return false;

  const secretKey = Buffer.from(secret.replace("whsec_", ""), "base64");
  const expected = Buffer.from(
    createHmac("sha256", secretKey).update(`${webhookId}.${timestamp}.${rawBody}`).digest("base64"),
  );
  const received = Buffer.from(signature.split(",")[1] ?? "");

  return expected.length === received.length && timingSafeEqual(expected, received);
}

export async function POST(request: Request) {
  const secret = process.env.SENT_WEBHOOK_SECRET;
  if (!secret) {
    return new Response("Webhook ni nastavljen.", { status: 500 });
  }

  const rawBody = await request.text();
  if (!isValidSignature(rawBody, request.headers, secret)) {
    return new Response("Neveljaven podpis.", { status: 403 });
  }

  const payload = JSON.parse(rawBody) as { message_id?: string; message_status?: string };
  const status = finalStatus[payload.message_status as keyof typeof finalStatus];

  if (!payload.message_id || !status) {
    return new Response(null, { status: 204 });
  }

  await db
    .update(smsMessages)
    .set({
      status,
      errorMessage: status === "failed" ? "Sent.dm sporočila ni dostavil." : null,
    })
    .where(eq(smsMessages.providerMessageId, payload.message_id));

  return new Response(null, { status: 204 });
}
