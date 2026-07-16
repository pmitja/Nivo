const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "https://obrtio.si";
const BRAND = "#6A5AE0";
const BRAND_DARK = "#4B3BC9";
const INK = "#16151D";
const MUTED = "#54515E";
const FAINT = "#9A97A5";
const BORDER = "#ECEAF3";

export function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function layout({ preheader, body }: { preheader: string; body: string }) {
  return `<!DOCTYPE html>
<html lang="sl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Obrtio</title>
</head>
<body style="margin:0;padding:0;background-color:#F3F1FA;">
<div style="display:none;max-height:0;overflow:hidden;mso-hide:all;">${escapeHtml(preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#F3F1FA;padding:32px 12px;">
<tr><td align="center">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:100%;max-width:600px;">

<tr><td style="padding:0 8px 18px;">
<span style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:22px;font-weight:800;letter-spacing:-0.5px;color:${INK};">obrtio<span style="color:${BRAND};">.</span></span>
</td></tr>

<tr><td style="background-color:#ffffff;border:1px solid ${BORDER};border-radius:20px;overflow:hidden;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0">
<tr><td style="height:6px;background:linear-gradient(90deg,${BRAND},${BRAND_DARK});font-size:0;line-height:0;">&nbsp;</td></tr>
<tr><td style="padding:36px 36px 40px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
${body}
</td></tr>
</table>
</td></tr>

<tr><td style="padding:22px 8px 0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:12.5px;line-height:1.6;color:${FAINT};">
Obrtio — Vi opravljate delo. Mi poskrbimo za stranke.<br>
To sporočilo ste prejeli, ker je bil oddan obrazec na spletni strani obrtio.si.
</td></tr>

</table>
</td></tr>
</table>
</body>
</html>`;
}

function detailRow(label: string, value: string, options?: { multiline?: boolean }) {
  const content = options?.multiline
    ? escapeHtml(value).replaceAll("\n", "<br>")
    : escapeHtml(value);
  return `<tr>
<td style="padding:11px 16px;border-bottom:1px solid ${BORDER};font-size:12.5px;font-weight:700;text-transform:uppercase;letter-spacing:0.4px;color:${FAINT};vertical-align:top;width:130px;">${escapeHtml(label)}</td>
<td style="padding:11px 16px;border-bottom:1px solid ${BORDER};font-size:15px;font-weight:600;color:${INK};line-height:1.5;">${content}</td>
</tr>`;
}

function ctaButton(href: string, label: string) {
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:28px 0 0;">
<tr><td style="border-radius:12px;background-color:${BRAND};">
<a href="${href}" style="display:inline-block;padding:14px 28px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:15px;font-weight:700;color:#ffffff;text-decoration:none;border-radius:12px;">${escapeHtml(label)}</a>
</td></tr>
</table>`;
}

export type ContactInquiry = {
  name: string;
  email: string;
  phone: string;
  panoga: string;
  message: string;
};

export function contactInquiryNotificationEmail(inquiry: ContactInquiry) {
  const rows = [
    detailRow("Ime", inquiry.name),
    detailRow("E-pošta", inquiry.email),
    detailRow("Telefon", inquiry.phone),
    detailRow("Panoga", inquiry.panoga || "Ni izbrana"),
    inquiry.message.trim() ? detailRow("Sporočilo", inquiry.message, { multiline: true }) : "",
  ].join("");

  const html = layout({
    preheader: `${inquiry.name} · ${inquiry.panoga || "brez panoge"} · ${inquiry.phone}`,
    body: `
<div style="font-size:12.5px;font-weight:700;text-transform:uppercase;letter-spacing:0.8px;color:${BRAND};">Novo povpraševanje · obrtio.si/kontakt</div>
<h1 style="margin:12px 0 0;font-size:26px;font-weight:800;letter-spacing:-0.5px;color:${INK};line-height:1.2;">${escapeHtml(inquiry.name)} želi brezplačen posvet</h1>
<p style="margin:12px 0 0;font-size:15px;line-height:1.6;color:${MUTED};">Oddano prek kontaktnega obrazca na spletni strani. Obljubljen odziv: 24 ur.</p>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:24px;border:1px solid ${BORDER};border-radius:14px;border-collapse:separate;overflow:hidden;">
${rows}
</table>
${ctaButton(`tel:${inquiry.phone.replace(/\s+/g, "")}`, `Pokliči ${inquiry.name.split(" ")[0]}`)}
<p style="margin:14px 0 0;font-size:13px;color:${FAINT};">Odgovor na to e-pošto gre neposredno stranki (reply-to).</p>
`,
  });

  const text = [
    "Novo povpraševanje — obrtio.si/kontakt",
    "",
    `Ime: ${inquiry.name}`,
    `E-pošta: ${inquiry.email}`,
    `Telefon: ${inquiry.phone}`,
    `Panoga: ${inquiry.panoga || "Ni izbrana"}`,
    inquiry.message.trim() ? `Sporočilo: ${inquiry.message}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  return { subject: `Novo povpraševanje: ${inquiry.name} (${inquiry.panoga || "brez panoge"})`, html, text };
}

export type LeadConfirmation = {
  customerName: string;
  companyName: string;
  companyEmail: string;
  companyPhone: string;
  service: string;
  pauseReason?: "vacation" | "capacity" | null;
};

/** Potrdilo stranki, ki je oddala povpraševanje pri obrtniku. */
export function leadConfirmationEmail(lead: LeadConfirmation) {
  const firstName = lead.customerName.trim().split(/\s+/)[0];
  const isPaused = Boolean(lead.pauseReason);
  const availabilityMessage = lead.pauseReason === "capacity"
    ? `Podjetje <strong style="color:${INK};">${escapeHtml(lead.companyName)}</strong> ima trenutno zapolnjene kapacitete. Vaše povpraševanje za <strong style="color:${INK};">${escapeHtml(lead.service)}</strong> je vseeno varno shranjeno in ga bodo pregledali, ko bodo ponovno sprejemali nova dela.`
    : `Podjetje <strong style="color:${INK};">${escapeHtml(lead.companyName)}</strong> je trenutno odsotno. Vaše povpraševanje za <strong style="color:${INK};">${escapeHtml(lead.service)}</strong> je vseeno varno shranjeno in ga bodo pregledali po vrnitvi.`;
  const rows = [
    detailRow("Storitev", lead.service),
    detailRow("Izvajalec", lead.companyName),
    detailRow("Telefon", lead.companyPhone),
    detailRow("E-pošta", lead.companyEmail),
  ].join("");

  const html = layout({
    preheader: isPaused
      ? `${lead.companyName} trenutno ne sprejema novih povpraševanj, vaše sporočilo pa je shranjeno.`
      : `${lead.companyName} je prejel vaše povpraševanje za ${lead.service}.`,
    body: `
<div style="font-size:12.5px;font-weight:700;text-transform:uppercase;letter-spacing:0.8px;color:${BRAND};">${isPaused ? "Povpraševanje shranjeno" : "Povpraševanje prejeto"}</div>
<h1 style="margin:12px 0 0;font-size:26px;font-weight:800;letter-spacing:-0.5px;color:${INK};line-height:1.2;">Hvala, ${escapeHtml(firstName)}!</h1>
<p style="margin:12px 0 0;font-size:15px;line-height:1.6;color:${MUTED};">${isPaused ? availabilityMessage : `Podjetje <strong style="color:${INK};">${escapeHtml(lead.companyName)}</strong> je prejelo vaše povpraševanje za <strong style="color:${INK};">${escapeHtml(lead.service)}</strong> in se vam javi v najkrajšem možnem času.`}</p>
<div style="margin-top:26px;font-size:12.5px;font-weight:700;text-transform:uppercase;letter-spacing:0.8px;color:${FAINT};">Vaš izvajalec</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:14px;border:1px solid ${BORDER};border-radius:14px;border-collapse:separate;overflow:hidden;">
${rows}
</table>
${isPaused ? "" : ctaButton(`tel:${lead.companyPhone.replace(/\s+/g, "")}`, `Pokličite ${lead.companyName}`)}
<p style="margin:28px 0 0;font-size:15px;line-height:1.6;color:${MUTED};">Če želite kaj dodati ali popraviti, kar odgovorite na to sporočilo — odgovor gre neposredno podjetju ${escapeHtml(lead.companyName)}, ne Obrtiu.</p>
<p style="margin:20px 0 0;font-size:15px;line-height:1.6;color:${MUTED};">Lep pozdrav,<br><strong style="color:${INK};">ekipa Obrtio</strong></p>
`,
  });

  const statusText = lead.pauseReason === "capacity"
    ? `podjetje ${lead.companyName} ima trenutno zapolnjene kapacitete. Vaše povpraševanje za ${lead.service} je shranjeno in ga bodo pregledali, ko bodo ponovno sprejemali nova dela.`
    : `podjetje ${lead.companyName} je trenutno odsotno. Vaše povpraševanje za ${lead.service} je shranjeno in ga bodo pregledali po vrnitvi.`;

  const text = [
    `Pozdravljeni ${firstName},`,
    "",
    isPaused ? statusText : `podjetje ${lead.companyName} je prejelo vaše povpraševanje za ${lead.service} in se vam javi v najkrajšem možnem času.`,
    "",
    "Vaš izvajalec:",
    `${lead.companyName}`,
    `Telefon: ${lead.companyPhone}`,
    `E-pošta: ${lead.companyEmail}`,
    "",
    `Če želite kaj dodati, odgovorite na to sporočilo — odgovor gre neposredno podjetju ${lead.companyName}.`,
    "",
    "Lep pozdrav,",
    "ekipa Obrtio",
  ].join("\n");

  return {
    subject: isPaused
      ? `Vaše povpraševanje za ${lead.service} je shranjeno`
      : `Prejeli smo vaše povpraševanje za ${lead.service}`,
    html,
    text,
  };
}

export function contactInquiryConfirmationEmail(inquiry: ContactInquiry) {
  const firstName = inquiry.name.trim().split(/\s+/)[0];
  const steps = [
    ["1", "Pregledamo vaše povpraševanje", "Pogledamo panogo in kaj potrebujete."],
    ["2", "Pokličemo vas v 24 urah", "20-minutni pogovor, brez obveznosti."],
    ["3", "Predlagamo rešitev", "Pokažemo, kako sistem deluje za vašo panogo."],
  ]
    .map(
      ([num, title, desc]) => `<tr>
<td style="padding:0 0 16px;vertical-align:top;width:40px;">
<span style="display:inline-block;width:28px;height:28px;line-height:28px;text-align:center;border-radius:9px;background-color:#EFEBFF;color:${BRAND};font-size:14px;font-weight:800;">${num}</span>
</td>
<td style="padding:0 0 16px;">
<div style="font-size:15px;font-weight:700;color:${INK};">${title}</div>
<div style="margin-top:2px;font-size:13.5px;line-height:1.5;color:${MUTED};">${desc}</div>
</td>
</tr>`,
    )
    .join("");

  const html = layout({
    preheader: "Prejeli smo vaše povpraševanje. Oglasimo se v 24 urah.",
    body: `
<div style="font-size:12.5px;font-weight:700;text-transform:uppercase;letter-spacing:0.8px;color:${BRAND};">Povpraševanje prejeto</div>
<h1 style="margin:12px 0 0;font-size:26px;font-weight:800;letter-spacing:-0.5px;color:${INK};line-height:1.2;">Hvala, ${escapeHtml(firstName)}!</h1>
<p style="margin:12px 0 0;font-size:15px;line-height:1.6;color:${MUTED};">Vaše povpraševanje smo prejeli. Oglasimo se <strong style="color:${INK};">v 24 urah</strong>, običajno mnogo prej — pokličemo vas na <strong style="color:${INK};">${escapeHtml(inquiry.phone)}</strong>.</p>
<div style="margin-top:26px;font-size:12.5px;font-weight:700;text-transform:uppercase;letter-spacing:0.8px;color:${FAINT};">Kaj sledi</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:14px;">
${steps}
</table>
<p style="margin:6px 0 0;font-size:15px;line-height:1.6;color:${MUTED};">Medtem si lahko ogledate, kako sistem deluje v praksi.</p>
${ctaButton(`${SITE_URL}/kako-deluje`, "Kako deluje Obrtio")}
<p style="margin:28px 0 0;font-size:15px;line-height:1.6;color:${MUTED};">Lep pozdrav,<br><strong style="color:${INK};">ekipa Obrtio</strong></p>
`,
  });

  const text = [
    `Pozdravljeni ${firstName},`,
    "",
    `vaše povpraševanje smo prejeli. Oglasimo se v 24 urah, običajno mnogo prej — pokličemo vas na ${inquiry.phone}.`,
    "",
    "Kaj sledi:",
    "1. Pregledamo vaše povpraševanje",
    "2. Pokličemo vas v 24 urah (20 minut, brez obveznosti)",
    "3. Predlagamo rešitev za vašo panogo",
    "",
    `Kako deluje Obrtio: ${SITE_URL}/kako-deluje`,
    "",
    "Lep pozdrav,",
    "ekipa Obrtio",
  ].join("\n");

  return { subject: "Prejeli smo vaše povpraševanje — oglasimo se v 24 urah", html, text };
}
