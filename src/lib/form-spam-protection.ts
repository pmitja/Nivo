import { createHmac } from "node:crypto";
import { sql } from "drizzle-orm";

import { db } from "@/db";
import { formRateLimits } from "@/db/schema";

type HeaderReader = Pick<Headers, "get">;

type RateLimitRule = {
  scope: string;
  identifier: string;
  limit: number;
  windowMs: number;
};

export type RateLimitResult =
  | { allowed: true }
  | { allowed: false; retryAfterSeconds: number };

function signingSecret() {
  return (
    process.env.FORM_RATE_LIMIT_SECRET ??
    process.env.SEVEN_SIGNING_SECRET ??
    process.env.DATABASE_URL ??
    "obrtio-local-rate-limit"
  );
}

function rateLimitKey(scope: string, identifier: string) {
  return createHmac("sha256", signingSecret())
    .update(scope)
    .update("\0")
    .update(identifier)
    .digest("hex");
}

export function getClientIdentifier(headers: HeaderReader) {
  const directIp = headers.get("cf-connecting-ip") ?? headers.get("x-real-ip");
  if (directIp) return directIp.trim();

  // The last address cannot be forged by prepending a value to X-Forwarded-For.
  const forwarded = headers.get("x-forwarded-for");
  const forwardedIp = forwarded?.split(",").at(-1)?.trim();
  if (forwardedIp) return forwardedIp;

  // Railway normally supplies an IP header. This fallback still puts a bound on
  // traffic if a local proxy is configured incorrectly.
  return `unknown:${headers.get("user-agent")?.slice(0, 160) ?? "no-user-agent"}`;
}

export async function enforceRateLimits(rules: RateLimitRule[]): Promise<RateLimitResult> {
  for (const rule of rules) {
    const now = new Date();
    const cutoff = new Date(now.getTime() - rule.windowMs);
    const expiresAt = new Date(now.getTime() + rule.windowMs);
    const nowIso = now.toISOString();
    const cutoffIso = cutoff.toISOString();
    const key = rateLimitKey(rule.scope, rule.identifier);

    const [row] = await db
      .insert(formRateLimits)
      .values({
        key,
        scope: rule.scope,
        requestCount: 1,
        windowStartedAt: now,
        expiresAt,
        updatedAt: now,
      })
      .onConflictDoUpdate({
        target: formRateLimits.key,
        set: {
          requestCount: sql<number>`case
            when ${formRateLimits.windowStartedAt} <= ${cutoffIso}::timestamptz then 1
            else ${formRateLimits.requestCount} + 1
          end`,
          windowStartedAt: sql<Date>`case
            when ${formRateLimits.windowStartedAt} <= ${cutoffIso}::timestamptz then ${nowIso}::timestamptz
            else ${formRateLimits.windowStartedAt}
          end`,
          expiresAt,
          updatedAt: now,
        },
      })
      .returning({
        requestCount: formRateLimits.requestCount,
        windowStartedAt: formRateLimits.windowStartedAt,
      });

    if (row.requestCount > rule.limit) {
      const retryAt = row.windowStartedAt.getTime() + rule.windowMs;
      return {
        allowed: false,
        retryAfterSeconds: Math.max(1, Math.ceil((retryAt - now.getTime()) / 1000)),
      };
    }
  }

  return { allowed: true };
}

export function isSuspiciouslyFast(startedAt: number, minimumMs = 1_500) {
  const elapsed = Date.now() - startedAt;
  return !Number.isFinite(elapsed) || elapsed < minimumMs || elapsed > 24 * 60 * 60 * 1000;
}
