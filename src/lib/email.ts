import { Resend } from "resend";

import {
  contactInquiryConfirmationEmail,
  contactInquiryNotificationEmail,
  type ContactInquiry,
} from "@/lib/email-templates";

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

type LeadConfirmationEmail = {
  customerEmail: string;
  customerName: string;
  companyName: string;
  service: string;
};

export async function sendLeadConfirmationEmail({
  customerEmail,
  customerName,
  companyName,
  service,
}: LeadConfirmationEmail) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("RESEND_API_KEY ni nastavljen.");
  }

  const to = process.env.RESEND_DEV_RECIPIENT || customerEmail;
  const from = process.env.EMAIL_FROM || "Obrtio <onboarding@resend.dev>";
  const { error } = await new Resend(apiKey).emails.send({
    from,
    to,
    subject: `Prejeli smo vaše povpraševanje za ${service}`,
    text: `Pozdravljeni ${customerName},\n\npodjetje ${companyName} je prejelo vaše povpraševanje za ${service}. Kontaktirali vas bodo v najkrajšem možnem času.\n\nLep pozdrav,\nObrtio`,
    html: `
      <p>Pozdravljeni ${escapeHtml(customerName)},</p>
      <p>podjetje <strong>${escapeHtml(companyName)}</strong> je prejelo vaše povpraševanje za
      <strong>${escapeHtml(service)}</strong>.</p>
      <p>Kontaktirali vas bodo v najkrajšem možnem času.</p>
      <p>Lep pozdrav,<br>Obrtio</p>
    `,
  });

  if (error) {
    throw new Error(error.message);
  }
}

export async function sendContactInquiryEmails(inquiry: ContactInquiry) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("RESEND_API_KEY ni nastavljen.");
  }

  const resend = new Resend(apiKey);
  const from = process.env.EMAIL_FROM || "Obrtio <onboarding@resend.dev>";
  const inbox = process.env.CONTACT_INBOX_EMAIL || "pozdravljeni@obrtio.si";

  const notification = contactInquiryNotificationEmail(inquiry);
  const { error: notificationError } = await resend.emails.send({
    from,
    to: process.env.RESEND_DEV_RECIPIENT || inbox,
    replyTo: inquiry.email,
    subject: notification.subject,
    html: notification.html,
    text: notification.text,
  });

  if (notificationError) {
    throw new Error(notificationError.message);
  }

  const confirmation = contactInquiryConfirmationEmail(inquiry);
  const { error: confirmationError } = await resend.emails.send({
    from,
    to: process.env.RESEND_DEV_RECIPIENT || inquiry.email,
    subject: confirmation.subject,
    html: confirmation.html,
    text: confirmation.text,
  });

  if (confirmationError) {
    console.error("Potrditvene e-pošte stranki ni bilo mogoče poslati:", confirmationError.message);
  }
}
