import { eq } from "drizzle-orm";
import { db } from "@/db";
import { smsMessages } from "@/db/schema";
export { contractorLeadSms, customerAutoReplySms, defaultCustomerAutoReply, googleReviewSms } from "@/lib/sms-copy";

export async function markSmsAsSent(messageId: string) {
  await db
    .update(smsMessages)
    .set({
      status: "sent",
      provider: process.env.SMS_PROVIDER ?? "mvp_stub",
      sentAt: new Date(),
    })
    .where(eq(smsMessages.id, messageId));
}
