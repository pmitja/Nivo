import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { smsMessages } from "@/db/schema";

/** Statusi seven.io, ki so končni. Vmesne (TRANSMITTED, ACCEPTED, BUFFERED) ignoriramo. */
const finalStatus = {
  DELIVERED: "delivered",
  NOTDELIVERED: "failed",
  EXPIRED: "failed",
  REJECTED: "failed",
  FAILED: "failed",
} as const;

const failureReason: Record<string, string> = {
  NOTDELIVERED: "Seven.io sporočila ni dostavil.",
  EXPIRED: "Sporočilo je poteklo pred dostavo.",
  REJECTED: "Operater je sporočilo zavrnil.",
  FAILED: "Napaka pri pošiljanju sporočila.",
};

const MAX_SIGNATURE_AGE_SECONDS = 5 * 60;

/**
 * Seven.io podpiše webhook z računskim signing key-em:
 * HMAC-SHA256(timestamp \n nonce \n metoda \n cilnji URL \n MD5(telo)), izpis v hex.
 * Ker mora URL točno ustrezati registriranemu, preverimo obe možni obliki.
 */
function targetUrls(request: Request) {
  const configured = process.env.SEVEN_WEBHOOK_URL;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

  return [
    configured,
    siteUrl ? new URL("/api/webhooks/seven", siteUrl).toString() : undefined,
    request.url,
  ].filter((url): url is string => Boolean(url));
}

function isValidSignature(rawBody: string, request: Request, secret: string) {
  const signature = request.headers.get("x-signature");
  const timestamp = request.headers.get("x-timestamp");
  const nonce = request.headers.get("x-nonce");

  if (!signature || !timestamp || !nonce) return false;

  const age = Math.abs(Date.now() / 1000 - Number(timestamp));
  if (!Number.isFinite(age) || age > MAX_SIGNATURE_AGE_SECONDS) return false;

  const bodyHash = createHash("md5").update(rawBody).digest("hex");
  const received = Buffer.from(signature, "hex");

  return targetUrls(request).some((url) => {
    const stringToSign = [timestamp, nonce, "POST", url, bodyHash].join("\n");
    const expected = createHmac("sha256", secret).update(stringToSign).digest();

    return expected.length === received.length && timingSafeEqual(expected, received);
  });
}

type SevenDlrPayload = {
  webhook_event?: string;
  data?: { msg_id?: string | number; status?: string };
};

/**
 * Seven.io webhook lahko pošlje JSON telo (metoda JSON) ali form-encoded polja (metoda POST).
 * Podpiramo obe obliki, da nastavitev v seven.io nadzorni plošči ne more zlomiti dostave.
 */
function parseDlr(rawBody: string, contentType: string | null): { msgId?: string; status?: string } {
  if (contentType?.includes("application/x-www-form-urlencoded")) {
    const form = new URLSearchParams(rawBody);
    return {
      msgId: form.get("msg_id") ?? form.get("id") ?? undefined,
      status: form.get("status") ?? undefined,
    };
  }

  const payload = JSON.parse(rawBody) as SevenDlrPayload;
  return {
    msgId: payload.data?.msg_id != null ? String(payload.data.msg_id) : undefined,
    status: payload.data?.status,
  };
}

export async function POST(request: Request) {
  const secret = process.env.SEVEN_SIGNING_SECRET;
  if (!secret) {
    return new Response("Webhook ni nastavljen.", { status: 500 });
  }

  const rawBody = await request.text();
  if (!isValidSignature(rawBody, request, secret)) {
    return new Response("Neveljaven podpis.", { status: 403 });
  }

  const { msgId, status: sevenStatus } = parseDlr(rawBody, request.headers.get("content-type"));
  const normalized = sevenStatus?.toUpperCase();
  const status = finalStatus[normalized as keyof typeof finalStatus];

  if (!msgId || !status) {
    return new Response(null, { status: 204 });
  }

  await db
    .update(smsMessages)
    .set({
      status,
      errorMessage: status === "failed" ? (failureReason[normalized!] ?? "Sporočilo ni bilo dostavljeno.") : null,
    })
    .where(eq(smsMessages.providerMessageId, msgId));

  return new Response(null, { status: 204 });
}
