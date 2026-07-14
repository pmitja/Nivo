import { Resend } from "resend";

import {
  contactInquiryConfirmationEmail,
  leadConfirmationEmail,
  type ContactInquiry,
  type LeadConfirmation,
} from "@/lib/email-templates";

const DEFAULT_FROM = "Obrtio <info@obrtio.si>";

/**
 * RESEND_DEV_RECIPIENT preusmeri vso pošto na testni naslov. V produkciji tega
 * nikoli ne upoštevamo, sicer stranka svojega potrdila ne dobi. Vercel tudi na
 * preview deploymentih nastavi NODE_ENV=production, zato ločimo po VERCEL_ENV.
 */
function isProduction() {
  return process.env.VERCEL_ENV ? process.env.VERCEL_ENV === "production" : process.env.NODE_ENV === "production";
}

function recipient(intended: string) {
  if (isProduction()) return intended;
  return process.env.RESEND_DEV_RECIPIENT || intended;
}

type LeadConfirmationEmail = LeadConfirmation & { customerEmail: string };

export async function sendLeadConfirmationEmail({ customerEmail, ...lead }: LeadConfirmationEmail) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("RESEND_API_KEY ni nastavljen.");
  }

  const template = leadConfirmationEmail(lead);
  const { error } = await new Resend(apiKey).emails.send({
    from: process.env.EMAIL_FROM || DEFAULT_FROM,
    to: recipient(customerEmail),
    // Odgovor stranke gre obrtniku, ne Obrtiu.
    replyTo: lead.companyEmail,
    subject: template.subject,
    text: template.text,
    html: template.html,
  });

  if (error) {
    throw new Error(error.message);
  }
}

export async function sendContactInquiryConfirmationEmail(inquiry: ContactInquiry) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("RESEND_API_KEY ni nastavljen.");
  }

  const resend = new Resend(apiKey);
  const from = process.env.EMAIL_FROM || DEFAULT_FROM;

  const confirmation = contactInquiryConfirmationEmail(inquiry);
  const { error: confirmationError } = await resend.emails.send({
    from,
    to: recipient(inquiry.email),
    subject: confirmation.subject,
    html: confirmation.html,
    text: confirmation.text,
  });

  if (confirmationError) {
    throw new Error(confirmationError.message);
  }
}
