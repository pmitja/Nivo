export const companyStatusLabels = {
  active: "Aktivna",
  setup: "V pripravi",
  waiting_for_content: "Čaka na vsebino",
  waiting_for_payment: "Čaka na plačilo",
  suspended: "Začasno ustavljena",
  cancelled: "Odpovedana",
} as const;

export const leadStatusLabels = {
  new: "Novo",
  contacted: "Kontaktirano",
  quote_sent: "Ponudba poslana",
  won: "Dogovorjeno",
  completed: "Zaključeno",
  lost: "Izgubljeno",
} as const;

export const outreachStatusLabels = {
  queued: "V čakalni vrsti",
  sent: "Poslano",
  delivered: "Dostavljeno",
  bounced: "Zavrnjeno",
  failed: "Napaka",
  replied: "Odgovoril",
} as const;

export const leadPauseReasonLabels = {
  vacation: "Prejeto med dopustom",
  capacity: "Prejeto ob zapolnjenih kapacitetah",
} as const;

export const customerStatusLabels = {
  new_contact: "Nov kontakt",
  prospect: "Potencialna stranka",
  customer: "Stranka",
  past_customer: "Pretekla stranka",
  inactive: "Neaktiven",
} as const;

export const smsTypeLabels = {
  contractor_new_lead: "Novo povpraševanje",
  customer_auto_reply: "Avtomatski odgovor",
  google_review_request: "Google ocena",
  campaign_sms: "Akcija",
  test_sms: "Test",
} as const;

export const smsStatusLabels = {
  pending: "V čakanju",
  sent: "Poslano",
  delivered: "Dostavljeno",
  failed: "Napaka",
} as const;

export const websiteRequestStatusLabels = {
  new: "Novo",
  in_progress: "V obdelavi",
  waiting_for_info: "Čaka na informacije",
  waiting_for_approval: "Čaka na potrditev",
  completed: "Urejeno",
  closed: "Zaprto",
} as const;

export const serviceTypeLabels = {
  basic_plan: "Osnovni paket",
  ai_addon: "AI dodatek (pride kmalu)",
  google_business_profile: "Google Business Profil",
  seo: "SEO",
  advertising: "Oglaševanje",
  website_changes: "Spremembe spletne strani",
  campaigns: "Kampanje",
  referral_system: "Referral sistem",
} as const;

export const serviceStatusLabels = {
  not_ordered: "Ni naročeno",
  ordered: "Naročeno",
  setup: "V pripravi",
  waiting_for_data: "Čaka na podatke",
  active: "Aktivno",
  completed: "Zaključeno",
  cancelled: "Odpovedano",
} as const;

export const billingTypeLabels = {
  monthly: "Mesečno",
  one_time: "Enkratno",
  custom: "Po ponudbi",
} as const;

export const campaignStatusLabels = {
  draft: "Osnutek",
  prepared: "Pripravljeno",
  active: "Aktivno",
  paused: "Pavzirano",
  completed: "Zaključeno",
  cancelled: "Odpovedano",
} as const;

export const supportTicketStatusLabels = {
  new: "Novo",
  in_progress: "V obdelavi",
  waiting_for_info: "Čaka na informacije",
  completed: "Urejeno",
  closed: "Zaprto",
} as const;

export const priorityLabels = {
  low: "Nizka",
  normal: "Običajna",
  high: "Visoka",
  urgent: "Nujno",
} as const;

export function formatDate(date?: Date | string | null) {
  if (!date) {
    return "Brez datuma";
  }

  return new Intl.DateTimeFormat("sl-SI", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(date));
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}
