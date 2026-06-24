export const defaultCustomerAutoReply =
  "Hvala za povpraševanje. Prejeli smo vaše sporočilo in se vam javimo v najkrajšem možnem času.";

export function contractorLeadSms(name: string, location: string | null | undefined, service: string) {
  const place = location ? `${location}, ` : "";
  return `Novo povpraševanje: ${name}, ${place}${service}. Odprite dashboard za več informacij.`;
}

export function customerAutoReplySms(message?: string | null) {
  return message?.trim() || defaultCustomerAutoReply;
}

export function googleReviewSms(reviewUrl: string) {
  return `Hvala za zaupanje. Prosimo ocenite našo storitev: ${reviewUrl}`;
}
