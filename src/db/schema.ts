import {
  boolean,
  index,
  integer,
  jsonb,
  numeric,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

export const companyStatusEnum = pgEnum("company_status", [
  "active",
  "setup",
  "waiting_for_content",
  "waiting_for_payment",
  "suspended",
  "cancelled",
]);

export const planEnum = pgEnum("plan", ["basic"]);
export const userRoleEnum = pgEnum("user_role", ["super_admin", "client_admin", "client_user"]);
export const leadPauseReasonEnum = pgEnum("lead_pause_reason", ["vacation", "capacity"]);
export const leadStatusEnum = pgEnum("lead_status", [
  "new",
  "contacted",
  "quote_sent",
  "won",
  "completed",
  "lost",
]);
export const customerStatusEnum = pgEnum("customer_status", [
  "new_contact",
  "prospect",
  "customer",
  "past_customer",
  "inactive",
]);
export const smsTypeEnum = pgEnum("sms_type", [
  "contractor_new_lead",
  "customer_auto_reply",
  "google_review_request",
  "campaign_sms",
  "test_sms",
]);
export const smsStatusEnum = pgEnum("sms_status", ["pending", "sent", "delivered", "failed"]);
export const reviewRequestStatusEnum = pgEnum("review_request_status", ["pending", "sent", "failed"]);
export const campaignTypeEnum = pgEnum("campaign_type", [
  "sms",
  "referral",
  "google_ads",
  "facebook_ads",
  "instagram_ads",
  "tiktok_ads",
]);
export const campaignStatusEnum = pgEnum("campaign_status", [
  "draft",
  "prepared",
  "active",
  "paused",
  "completed",
  "cancelled",
]);
export const websiteRequestStatusEnum = pgEnum("website_request_status", [
  "new",
  "in_progress",
  "waiting_for_info",
  "waiting_for_approval",
  "completed",
  "closed",
]);
export const requestPriorityEnum = pgEnum("request_priority", ["low", "normal", "high", "urgent"]);
export const supportTicketStatusEnum = pgEnum("support_ticket_status", [
  "new",
  "in_progress",
  "waiting_for_info",
  "completed",
  "closed",
]);
export const serviceTypeEnum = pgEnum("service_type", [
  "basic_plan",
  "ai_addon",
  "google_business_profile",
  "seo",
  "advertising",
  "website_changes",
  "campaigns",
  "referral_system",
]);
export const billingTypeEnum = pgEnum("billing_type", ["monthly", "one_time", "custom"]);
export const serviceStatusEnum = pgEnum("service_status", [
  "not_ordered",
  "ordered",
  "setup",
  "waiting_for_data",
  "active",
  "completed",
  "cancelled",
]);

const timestamps = {
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
};

export const companies = pgTable("companies", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  industry: text("industry"),
  contactName: text("contact_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  address: text("address"),
  city: text("city"),
  domain: text("domain"),
  status: companyStatusEnum("status").default("setup").notNull(),
  plan: planEnum("plan").default("basic").notNull(),
  hasAiAddon: boolean("has_ai_addon").default(false).notNull(),
  acceptingLeads: boolean("accepting_leads").default(true).notNull(),
  leadPauseReason: leadPauseReasonEnum("lead_pause_reason"),
  googleReviewUrl: text("google_review_url"),
  websiteStatus: text("website_status").default("V pripravi").notNull(),
  googleBusinessProfileStatus: text("google_business_profile_status").default("Ni naročeno").notNull(),
  seoStatus: text("seo_status").default("Ni naročeno").notNull(),
  advertisingStatus: text("advertising_status").default("Ni naročeno").notNull(),
  logoUrl: text("logo_url"),
  logoKey: text("logo_key"),
  logoName: text("logo_name"),
  internalNotes: text("internal_notes"),
  ...timestamps,
});

export const users = pgTable(
  "users",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    companyId: uuid("company_id").references(() => companies.id, { onDelete: "set null" }),
    name: text("name").notNull(),
    email: text("email").notNull().unique(),
    passwordHash: text("password_hash").notNull(),
    role: userRoleEnum("role").default("client_user").notNull(),
    ...timestamps,
  },
  (table) => [index("users_company_id_idx").on(table.companyId), index("users_role_idx").on(table.role)],
);

export const sessions = pgTable(
  "sessions",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    tokenHash: text("token_hash").notNull().unique(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [index("sessions_user_id_idx").on(table.userId), index("sessions_expires_at_idx").on(table.expiresAt)],
);

export const formRateLimits = pgTable(
  "form_rate_limits",
  {
    key: text("key").primaryKey(),
    scope: text("scope").notNull(),
    requestCount: integer("request_count").default(1).notNull(),
    windowStartedAt: timestamp("window_started_at", { withTimezone: true }).notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [index("form_rate_limits_expires_at_idx").on(table.expiresAt)],
);

export const customers = pgTable(
  "customers",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    phone: text("phone").notNull(),
    email: text("email"),
    address: text("address"),
    city: text("city"),
    notes: text("notes"),
    source: text("source").default("spletni obrazec").notNull(),
    status: customerStatusEnum("status").default("new_contact").notNull(),
    marketingConsent: boolean("marketing_consent").default(false).notNull(),
    marketingConsentAt: timestamp("marketing_consent_at", { withTimezone: true }),
    marketingConsentSource: text("marketing_consent_source"),
    optOut: boolean("opt_out").default(false).notNull(),
    ...timestamps,
  },
  (table) => [index("customers_company_id_idx").on(table.companyId), index("customers_phone_idx").on(table.phone)],
);

export const leads = pgTable(
  "leads",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
    customerId: uuid("customer_id").references(() => customers.id, { onDelete: "set null" }),
    name: text("name").notNull(),
    phone: text("phone").notNull(),
    email: text("email"),
    location: text("location"),
    service: text("service").notNull(),
    message: text("message").notNull(),
    status: leadStatusEnum("status").default("new").notNull(),
    receivedWhilePaused: boolean("received_while_paused").default(false).notNull(),
    pauseReason: leadPauseReasonEnum("pause_reason"),
    source: text("source").default("spletni obrazec").notNull(),
    aiSummary: text("ai_summary"),
    attachmentUrl: text("attachment_url"),
    attachmentKey: text("attachment_key"),
    attachmentName: text("attachment_name"),
    attachmentSize: integer("attachment_size"),
    ...timestamps,
  },
  (table) => [
    index("leads_company_id_idx").on(table.companyId),
    index("leads_status_idx").on(table.status),
    index("leads_created_at_idx").on(table.createdAt),
  ],
);

export const contactInquiries = pgTable(
  "contact_inquiries",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull(),
    phone: text("phone").notNull(),
    industry: text("industry"),
    message: text("message"),
    status: leadStatusEnum("status").default("new").notNull(),
    source: text("source").default("obrtio.si/kontakt").notNull(),
    confirmationEmailSentAt: timestamp("confirmation_email_sent_at", { withTimezone: true }),
    confirmationEmailError: text("confirmation_email_error"),
    ...timestamps,
  },
  (table) => [
    index("contact_inquiries_status_idx").on(table.status),
    index("contact_inquiries_created_at_idx").on(table.createdAt),
  ],
);

export const smsMessages = pgTable(
  "sms_messages",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
    customerId: uuid("customer_id").references(() => customers.id, { onDelete: "set null" }),
    leadId: uuid("lead_id").references(() => leads.id, { onDelete: "set null" }),
    phone: text("phone").notNull(),
    message: text("message").notNull(),
    type: smsTypeEnum("type").notNull(),
    status: smsStatusEnum("status").default("pending").notNull(),
    provider: text("provider").default("mvp_stub").notNull(),
    providerMessageId: text("provider_message_id"),
    cost: numeric("cost", { precision: 10, scale: 4 }),
    errorMessage: text("error_message"),
    sentAt: timestamp("sent_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("sms_messages_company_id_idx").on(table.companyId),
    index("sms_messages_lead_id_idx").on(table.leadId),
    index("sms_messages_created_at_idx").on(table.createdAt),
    index("sms_messages_provider_message_id_idx").on(table.providerMessageId),
  ],
);

export const companySmsSettings = pgTable("company_sms_settings", {
  companyId: uuid("company_id").primaryKey().references(() => companies.id, { onDelete: "cascade" }),
  autoReplyMessage: text("auto_reply_message")
    .default("Hvala za povpraševanje. Prejeli smo vaše sporočilo in se vam javimo v najkrajšem možnem času.")
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export type ContactFormField = {
  name: "name" | "phone" | "email" | "location" | "service" | "message";
  label: string;
  type: "text" | "email" | "tel" | "textarea" | "select";
  options?: string[];
  required: boolean;
  enabled: boolean;
};

export const contactForms = pgTable(
  "contact_forms",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    companyId: uuid("company_id").notNull().unique().references(() => companies.id, { onDelete: "cascade" }),
    title: text("title").default("Pošljite povpraševanje").notNull(),
    intro: text("intro").default("Opišite, kaj potrebujete, in kontaktirali vas bomo v najkrajšem možnem času.").notNull(),
    submitLabel: text("submit_label").default("Pošlji povpraševanje").notNull(),
    successMessage: text("success_message").default("Hvala za povpraševanje. Prejeli smo vaše sporočilo.").notNull(),
    fields: jsonb("fields").$type<ContactFormField[]>().notNull(),
    active: boolean("active").default(true).notNull(),
    ...timestamps,
  },
  (table) => [index("contact_forms_company_id_idx").on(table.companyId)],
);

export const reviewRequests = pgTable(
  "review_requests",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
    customerId: uuid("customer_id").references(() => customers.id, { onDelete: "set null" }),
    leadId: uuid("lead_id").references(() => leads.id, { onDelete: "set null" }),
    phone: text("phone").notNull(),
    reviewUrl: text("review_url").notNull(),
    status: reviewRequestStatusEnum("status").default("pending").notNull(),
    sentAt: timestamp("sent_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [index("review_requests_company_id_idx").on(table.companyId)],
);

export const reviewFeedbacks = pgTable(
  "review_feedbacks",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
    reviewRequestId: uuid("review_request_id").references(() => reviewRequests.id, { onDelete: "set null" }),
    customerId: uuid("customer_id").references(() => customers.id, { onDelete: "set null" }),
    leadId: uuid("lead_id").references(() => leads.id, { onDelete: "set null" }),
    rating: integer("rating").notNull(),
    name: text("name"),
    email: text("email"),
    feedback: text("feedback"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("review_feedbacks_company_id_idx").on(table.companyId),
    index("review_feedbacks_review_request_id_idx").on(table.reviewRequestId),
  ],
);

export const campaigns = pgTable(
  "campaigns",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    type: campaignTypeEnum("type").notNull(),
    channel: text("channel").notNull(),
    status: campaignStatusEnum("status").default("draft").notNull(),
    message: text("message"),
    scheduledAt: timestamp("scheduled_at", { withTimezone: true }),
    sentAt: timestamp("sent_at", { withTimezone: true }),
    ...timestamps,
  },
  (table) => [index("campaigns_company_id_idx").on(table.companyId)],
);

export const campaignRecipients = pgTable("campaign_recipients", {
  id: uuid("id").defaultRandom().primaryKey(),
  campaignId: uuid("campaign_id").notNull().references(() => campaigns.id, { onDelete: "cascade" }),
  customerId: uuid("customer_id").references(() => customers.id, { onDelete: "set null" }),
  phone: text("phone").notNull(),
  status: smsStatusEnum("status").default("pending").notNull(),
  sentAt: timestamp("sent_at", { withTimezone: true }),
  errorMessage: text("error_message"),
});

export const websiteChangeRequests = pgTable(
  "website_change_requests",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
    userId: uuid("user_id").references(() => users.id, { onDelete: "set null" }),
    title: text("title").notNull(),
    message: text("message").notNull(),
    status: websiteRequestStatusEnum("status").default("new").notNull(),
    priority: requestPriorityEnum("priority").default("normal").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    resolvedAt: timestamp("resolved_at", { withTimezone: true }),
  },
  (table) => [index("website_change_requests_company_id_idx").on(table.companyId)],
);

export const websiteChangeRequestComments = pgTable("website_change_request_comments", {
  id: uuid("id").defaultRandom().primaryKey(),
  requestId: uuid("request_id").notNull().references(() => websiteChangeRequests.id, { onDelete: "cascade" }),
  senderId: uuid("sender_id").references(() => users.id, { onDelete: "set null" }),
  message: text("message").notNull(),
  attachments: jsonb("attachments").$type<string[]>().default([]).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const supportTickets = pgTable(
  "support_tickets",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
    userId: uuid("user_id").references(() => users.id, { onDelete: "set null" }),
    category: text("category").notNull(),
    title: text("title").notNull(),
    message: text("message").notNull(),
    status: supportTicketStatusEnum("status").default("new").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    resolvedAt: timestamp("resolved_at", { withTimezone: true }),
  },
  (table) => [index("support_tickets_company_id_idx").on(table.companyId)],
);

export const companyDocuments = pgTable(
  "company_documents",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
    uploadedById: uuid("uploaded_by_id").references(() => users.id, { onDelete: "set null" }),
    title: text("title").notNull(),
    fileName: text("file_name").notNull(),
    fileUrl: text("file_url").notNull(),
    fileKey: text("file_key").notNull(),
    fileType: text("file_type").notNull(),
    fileSize: integer("file_size").notNull(),
    customId: text("custom_id"),
    notes: text("notes"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("company_documents_company_id_idx").on(table.companyId),
    index("company_documents_created_at_idx").on(table.createdAt),
  ],
);

export const services = pgTable(
  "services",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    type: serviceTypeEnum("type").notNull(),
    price: numeric("price", { precision: 10, scale: 2 }),
    billingType: billingTypeEnum("billing_type").notNull(),
    status: serviceStatusEnum("status").default("ordered").notNull(),
    startedAt: timestamp("started_at", { withTimezone: true }),
    completedAt: timestamp("completed_at", { withTimezone: true }),
    notes: text("notes"),
  },
  (table) => [index("services_company_id_idx").on(table.companyId)],
);

export const auditLogs = pgTable(
  "audit_logs",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    companyId: uuid("company_id").references(() => companies.id, { onDelete: "set null" }),
    userId: uuid("user_id").references(() => users.id, { onDelete: "set null" }),
    action: text("action").notNull(),
    entityType: text("entity_type").notNull(),
    entityId: uuid("entity_id"),
    metadata: jsonb("metadata").$type<Record<string, unknown>>().default({}).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [index("audit_logs_company_id_idx").on(table.companyId)],
);

export const analyticsEvents = pgTable(
  "analytics_events",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
    type: text("type").notNull(),
    source: text("source"),
    metadata: jsonb("metadata").$type<Record<string, unknown>>().default({}).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [index("analytics_events_company_id_idx").on(table.companyId)],
);

export const outreachStatusEnum = pgEnum("outreach_status", [
  "queued",
  "sent",
  "delivered",
  "bounced",
  "failed",
  "replied",
]);

// Hladni prodajni nagovori, ki jih Obrtio pošlje potencialnim strankam.
// Podatek pripada Obrtiu (kot obrtio.si posveti), zato ga Super Admin vidi v celoti.
export const outreachMessages = pgTable(
  "outreach_messages",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    companyName: text("company_name").notNull(),
    recipientName: text("recipient_name"),
    email: text("email").notNull(),
    activity: text("activity"),
    town: text("town"),
    subject: text("subject").notNull(),
    campaign: text("campaign").default("maribor-okolica").notNull(),
    resendId: text("resend_id"),
    status: outreachStatusEnum("status").default("queued").notNull(),
    error: text("error"),
    sentAt: timestamp("sent_at", { withTimezone: true }),
    ...timestamps,
  },
  (table) => [
    index("outreach_messages_status_idx").on(table.status),
    index("outreach_messages_created_at_idx").on(table.createdAt),
  ],
);

export type Company = typeof companies.$inferSelect;
export type User = typeof users.$inferSelect;
export type OutreachMessage = typeof outreachMessages.$inferSelect;
