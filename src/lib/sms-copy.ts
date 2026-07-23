/**
 * SMS s sumniki se kodira v UCS-2, kjer je en segment dolg 70 znakov namesto 160.
 * Zato vsa besedila pretvorimo v GSM-7 in jih omejimo na en segment.
 *
 * Vsebina prihaja iz obrazca, ki ga izpolni stranka, zato lahko vsebuje karkoli
 * (pomisljaje, narekovaje, emoji). Karkoli od tega bi tiho podvojilo ceno SMS-a,
 * zato besedilo pocistimo do osnovnega nabora GSM-7.
 */
export const SMS_MAX_LENGTH = 160;

const GSM7_BASIC = new Set(
  "@£$¥èéùìòÇ\nØø\rÅåΔ_ΦΓΛΩΠΨΣΘΞÆæßÉ !\"#¤%&'()*+,-./0123456789:;<=>?¡ABCDEFGHIJKLMNOPQRSTUVWXYZÄÖÑÜ§¿abcdefghijklmnopqrstuvwxyzäöñüà",
);

/** Znaki, ki jih NFD ne razstavi na osnovno crko, zato jih preslikamo rocno. */
const GSM7_REPLACEMENTS: Record<string, string> = {
  "–": "-",
  "—": "-",
  "−": "-",
  "•": "-",
  "‘": "'",
  "’": "'",
  "‚": "'",
  "“": '"',
  "”": '"',
  "„": '"',
  "…": "...",
  "€": "EUR",
  "đ": "d",
  "Đ": "D",
  "ø": "o",
  "Ø": "O",
  " ": " ",
};

export function toGsm7(text: string) {
  return [...text]
    .map((char) => GSM7_REPLACEMENTS[char] ?? char)
    .join("")
    // Razstavi crke z diakritiki (c -> c + stresica) in strehice odstrani.
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .split("")
    .filter((char) => GSM7_BASIC.has(char))
    .join("")
    .replace(/\s+/g, " ")
    .trim();
}

function truncate(value: string, maxLength: number) {
  if (value.length <= maxLength) return value;

  const cut = value.slice(0, maxLength);
  const lastSpace = cut.lastIndexOf(" ");
  const atWordBoundary = lastSpace > maxLength * 0.6 ? cut.slice(0, lastSpace) : cut;

  return atWordBoundary.replace(/[\s,.;:_-]+$/, "");
}

function build(prefix: string, value: string, suffix: string) {
  const body = truncate(toGsm7(value), SMS_MAX_LENGTH - prefix.length - suffix.length);
  // Prepreci dvojno locilo, ce se vsebina ze konca s piko ali klicajem.
  const joined = suffix.startsWith(".") && /[.!?]$/.test(body) ? suffix.slice(1) : suffix;

  return `${prefix}${body}${joined}`;
}

export function contractorLeadSms(name: string, location: string | null | undefined, service: string) {
  const details = [name, location, service].filter(Boolean).join(", ");

  return build("New inquiry: ", details, ". Open Obrtio for details.");
}

export function customerLeadConfirmationSms(companyName: string) {
  return build("Thanks for your inquiry. ", companyName, " will get back to you as soon as possible.");
}

export function googleReviewSms(reviewUrl: string) {
  // Povezave ne krajsamo in ne ciscimo, ker bi postala neuporabna.
  return `Thank you for choosing us. Please review our service: ${reviewUrl}`;
}
