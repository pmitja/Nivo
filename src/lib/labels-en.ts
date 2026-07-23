export const leadStatusLabels = {
  new: "New",
  contacted: "Contacted",
  quote_sent: "Quote sent",
  won: "Won",
  completed: "Completed",
  lost: "Lost",
} as const;

export const leadPauseReasonLabels = {
  vacation: "Received while away",
  capacity: "Received while fully booked",
} as const;

export const customerStatusLabels = {
  new_contact: "New contact",
  prospect: "Prospect",
  customer: "Customer",
  past_customer: "Past customer",
  inactive: "Inactive",
} as const;

export const smsTypeLabels = {
  contractor_new_lead: "New inquiry",
  customer_auto_reply: "Automatic reply",
  google_review_request: "Google review",
  campaign_sms: "Campaign",
  test_sms: "Test",
} as const;

export const smsStatusLabels = {
  pending: "Pending",
  sent: "Sent",
  delivered: "Delivered",
  failed: "Failed",
} as const;

export const websiteRequestStatusLabels = {
  new: "New",
  in_progress: "In progress",
  waiting_for_info: "Waiting for information",
  waiting_for_approval: "Waiting for approval",
  completed: "Completed",
  closed: "Closed",
} as const;

export const supportTicketStatusLabels = {
  new: "New",
  in_progress: "In progress",
  waiting_for_info: "Waiting for information",
  completed: "Completed",
  closed: "Closed",
} as const;

export const priorityLabels = {
  low: "Low",
  normal: "Normal",
  high: "High",
  urgent: "Urgent",
} as const;

export function formatDate(date?: Date | string | null) {
  if (!date) return "No date";
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(new Date(date));
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);
}
