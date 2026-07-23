import { and, count, desc, eq, gte, inArray, sql } from "drizzle-orm";
import { db } from "@/db";
import {
  auditLogs,
  analyticsEvents,
  campaigns,
  companies,
  companyDocuments,
  contactInquiries,
  contactForms,
  customers,
  leadStatusEnum,
  leads,
  outreachMessages,
  reviewFeedbacks,
  reviewRequests,
  services,
  smsMessages,
  supportTickets,
  users,
  websiteChangeRequests,
  websiteChangeRequestComments,
} from "@/db/schema";

const monthStart = () => {
  const date = new Date();
  date.setDate(1);
  date.setHours(0, 0, 0, 0);
  return date;
};

const last30Days = () => new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

export async function getAdminOverview() {
  const [activeCompanies] = await db.select({ value: count() }).from(companies).where(eq(companies.status, "active"));
  const [newCompanies] = await db.select({ value: count() }).from(companies).where(gte(companies.createdAt, monthStart()));
  const [allSms] = await db.select({ value: count() }).from(smsMessages);
  const [newLeads] = await db.select({ value: count() }).from(leads).where(eq(leads.status, "new"));
  const [newContactInquiries] = await db
    .select({ value: count() })
    .from(contactInquiries)
    .where(eq(contactInquiries.status, "new"));
  const [openRequests] = await db
    .select({ value: count() })
    .from(websiteChangeRequests)
    .where(sql`${websiteChangeRequests.status} not in ('completed', 'closed')`);
  const [activeCampaigns] = await db.select({ value: count() }).from(campaigns).where(eq(campaigns.status, "active"));

  // Povpraševanja naročnikov so njihova last — admin vidi samo števce, ne vsebine.
  const recentInquiries = await db
    .select({
      id: contactInquiries.id,
      name: contactInquiries.name,
      service: contactInquiries.industry,
      createdAt: contactInquiries.createdAt,
      status: contactInquiries.status,
    })
    .from(contactInquiries)
    .orderBy(desc(contactInquiries.createdAt))
    .limit(5);

  const recentCompanies = await db.select().from(companies).orderBy(desc(companies.createdAt)).limit(5);

  return {
    activeCompanies: activeCompanies.value,
    newCompanies: newCompanies.value,
    mrr: activeCompanies.value * 199,
    allSms: allSms.value,
    newClientLeads: newLeads.value,
    newInquiries: newContactInquiries.value,
    openRequests: openRequests.value,
    activeCampaigns: activeCampaigns.value,
    recentInquiries,
    recentCompanies,
  };
}

export type AdminCompanyActivity = Awaited<ReturnType<typeof getAdminCompanyActivity>>[number];

/**
 * Agregirana aktivnost po podjetjih: samo števci, brez imen strank, telefonov
 * in vsebine sporočil. Admin s tem vidi, ali sistem pri stranki deluje, ne pa
 * česa, kar pripada stranki.
 */
export async function getAdminCompanyActivity() {
  const [companyRows, leadRows, smsRows, requestRows, feedbackRows] = await Promise.all([
    db.select({ id: companies.id, name: companies.name, status: companies.status }).from(companies).orderBy(companies.name),
    db.select({ companyId: leads.companyId, status: leads.status, value: count() }).from(leads).groupBy(leads.companyId, leads.status),
    db
      .select({ companyId: smsMessages.companyId, status: smsMessages.status, value: count() })
      .from(smsMessages)
      .groupBy(smsMessages.companyId, smsMessages.status),
    db.select({ companyId: reviewRequests.companyId, value: count() }).from(reviewRequests).groupBy(reviewRequests.companyId),
    db.select({ companyId: reviewFeedbacks.companyId, value: count() }).from(reviewFeedbacks).groupBy(reviewFeedbacks.companyId),
  ]);

  const sumFor = <T extends { companyId: string; value: number }>(rows: T[], companyId: string, match?: (row: T) => boolean) =>
    rows
      .filter((row) => row.companyId === companyId && (!match || match(row)))
      .reduce((total, row) => total + row.value, 0);

  return companyRows.map((company) => ({
    id: company.id,
    name: company.name,
    status: company.status,
    leads: sumFor(leadRows, company.id),
    newLeads: sumFor(leadRows, company.id, (row) => row.status === "new"),
    sms: sumFor(smsRows, company.id),
    smsDelivered: sumFor(smsRows, company.id, (row) => row.status === "delivered"),
    smsFailed: sumFor(smsRows, company.id, (row) => row.status === "failed"),
    reviewRequests: sumFor(requestRows, company.id),
    reviewFeedbacks: sumFor(feedbackRows, company.id),
  }));
}

export async function getAdminContactInquiriesPage(page = 1, pageSize = 5) {
  const safePage = Math.max(1, page);
  const offset = (safePage - 1) * pageSize;

  const [total] = await db.select({ value: count() }).from(contactInquiries);
  const rows = await db
    .select()
    .from(contactInquiries)
    .orderBy(desc(contactInquiries.createdAt))
    .limit(pageSize)
    .offset(offset);

  return {
    inquiries: rows,
    total: total.value,
    page: safePage,
    pageSize,
    pageCount: Math.max(1, Math.ceil(total.value / pageSize)),
  };
}

export async function getAdminOutreachPage(page = 1, pageSize = 20) {
  const safePage = Math.max(1, page);
  const offset = (safePage - 1) * pageSize;

  const [total] = await db.select({ value: count() }).from(outreachMessages);
  const rows = await db
    .select()
    .from(outreachMessages)
    .orderBy(desc(outreachMessages.createdAt))
    .limit(pageSize)
    .offset(offset);

  const statusCounts = await db
    .select({ status: outreachMessages.status, value: count() })
    .from(outreachMessages)
    .groupBy(outreachMessages.status);

  const counts = Object.fromEntries(statusCounts.map((row) => [row.status, row.value]));

  return {
    messages: rows,
    total: total.value,
    delivered: counts.delivered ?? 0,
    sent: counts.sent ?? 0,
    failed: (counts.failed ?? 0) + (counts.bounced ?? 0),
    replied: counts.replied ?? 0,
    page: safePage,
    pageSize,
    pageCount: Math.max(1, Math.ceil(total.value / pageSize)),
  };
}

export async function getClientOverview(companyId: string) {
  const [newLeads] = await db.select({ value: count() }).from(leads).where(and(eq(leads.companyId, companyId), eq(leads.status, "new")));
  const [openLeads] = await db
    .select({ value: count() })
    .from(leads)
    .where(and(eq(leads.companyId, companyId), sql`${leads.status} in ('new', 'contacted', 'quote_sent')`));
  const [smsCount] = await db.select({ value: count() }).from(smsMessages).where(eq(smsMessages.companyId, companyId));
  const [reviewCount] = await db.select({ value: count() }).from(reviewRequests).where(eq(reviewRequests.companyId, companyId));
  const [campaignCount] = await db
    .select({ value: count() })
    .from(campaigns)
    .where(and(eq(campaigns.companyId, companyId), eq(campaigns.status, "active")));
  const [visits] = await db
    .select({ value: count() })
    .from(analyticsEvents)
    .where(and(eq(analyticsEvents.companyId, companyId), eq(analyticsEvents.type, "page_view"), gte(analyticsEvents.createdAt, last30Days())));
  const [formConversions] = await db
    .select({ value: count() })
    .from(leads)
    .where(and(eq(leads.companyId, companyId), gte(leads.createdAt, last30Days())));

  const recentLeads = await db.select().from(leads).where(eq(leads.companyId, companyId)).orderBy(desc(leads.createdAt)).limit(5);
  const requests = await db
    .select()
    .from(websiteChangeRequests)
    .where(eq(websiteChangeRequests.companyId, companyId))
    .orderBy(desc(websiteChangeRequests.createdAt))
    .limit(5);

  return {
    newLeads: newLeads.value,
    openLeads: openLeads.value,
    smsCount: smsCount.value,
    reviewCount: reviewCount.value,
    campaignCount: campaignCount.value,
    visits: visits.value,
    formConversions: formConversions.value,
    recentLeads,
    requests,
  };
}

export async function getCompany(companyId: string) {
  const [company] = await db.select().from(companies).where(eq(companies.id, companyId)).limit(1);
  return company;
}

export async function getAdminCompaniesPage(page = 1, pageSize = 5) {
  const safePage = Math.max(1, page);
  const offset = (safePage - 1) * pageSize;

  const [total] = await db.select({ value: count() }).from(companies);
  const rows = await db
    .select()
    .from(companies)
    .orderBy(desc(companies.createdAt))
    .limit(pageSize)
    .offset(offset);

  return {
    companies: rows,
    total: total.value,
    page: safePage,
    pageSize,
    pageCount: Math.max(1, Math.ceil(total.value / pageSize)),
  };
}

export async function getAdminCompanyProfile(companyId: string) {
  const [company] = await db.select().from(companies).where(eq(companies.id, companyId)).limit(1);

  if (!company) {
    return null;
  }

  // Povpraševanja, stranke, SMS-i in ocene pripadajo naročniku. Admin dobi
  // samo števce; vsebine in osebnih podatkov njegovih strank ne vidi.
  const [
    companyUsers,
    companyCampaigns,
    companyServices,
    companyDocumentsRows,
    companyWebsiteRequests,
    companySupportTickets,
    companyAuditLogs,
    companyContactForms,
    [leadCount],
    [customerCount],
    [smsCount],
    [reviewRequestCount],
    [reviewFeedbackCount],
  ] = await Promise.all([
    db.select().from(users).where(eq(users.companyId, companyId)).orderBy(desc(users.createdAt)).limit(5),
    db.select().from(campaigns).where(eq(campaigns.companyId, companyId)).orderBy(desc(campaigns.createdAt)).limit(5),
    db.select().from(services).where(eq(services.companyId, companyId)).orderBy(desc(services.startedAt)).limit(5),
    db.select().from(companyDocuments).where(eq(companyDocuments.companyId, companyId)).orderBy(desc(companyDocuments.createdAt)).limit(5),
    db
      .select()
      .from(websiteChangeRequests)
      .where(eq(websiteChangeRequests.companyId, companyId))
      .orderBy(desc(websiteChangeRequests.createdAt))
      .limit(5),
    db.select().from(supportTickets).where(eq(supportTickets.companyId, companyId)).orderBy(desc(supportTickets.createdAt)).limit(5),
    db.select().from(auditLogs).where(eq(auditLogs.companyId, companyId)).orderBy(desc(auditLogs.createdAt)).limit(5),
    db.select().from(contactForms).where(eq(contactForms.companyId, companyId)).limit(1),
    db.select({ value: count() }).from(leads).where(eq(leads.companyId, companyId)),
    db.select({ value: count() }).from(customers).where(eq(customers.companyId, companyId)),
    db.select({ value: count() }).from(smsMessages).where(eq(smsMessages.companyId, companyId)),
    db.select({ value: count() }).from(reviewRequests).where(eq(reviewRequests.companyId, companyId)),
    db.select({ value: count() }).from(reviewFeedbacks).where(eq(reviewFeedbacks.companyId, companyId)),
  ]);

  return {
    company,
    users: companyUsers,
    campaigns: companyCampaigns,
    services: companyServices,
    documents: companyDocumentsRows,
    websiteRequests: companyWebsiteRequests,
    supportTickets: companySupportTickets,
    auditLogs: companyAuditLogs,
    contactForm: companyContactForms[0] ?? null,
    stats: {
      leads: leadCount.value,
      customers: customerCount.value,
      sms: smsCount.value,
      reviewRequests: reviewRequestCount.value,
      reviewFeedbacks: reviewFeedbackCount.value,
      campaigns: companyCampaigns.length,
      openRequests: companyWebsiteRequests.filter((request) => !["completed", "closed"].includes(request.status)).length,
    },
  };
}

export async function getAdminWebsiteRequestsPage(page = 1, pageSize = 5) {
  const safePage = Math.max(1, page);
  const offset = (safePage - 1) * pageSize;

  const [total] = await db.select({ value: count() }).from(websiteChangeRequests);
  const requests = await db
    .select({
      id: websiteChangeRequests.id,
      companyId: websiteChangeRequests.companyId,
      title: websiteChangeRequests.title,
      message: websiteChangeRequests.message,
      status: websiteChangeRequests.status,
      priority: websiteChangeRequests.priority,
      createdAt: websiteChangeRequests.createdAt,
      resolvedAt: websiteChangeRequests.resolvedAt,
      companyName: companies.name,
    })
    .from(websiteChangeRequests)
    .innerJoin(companies, eq(companies.id, websiteChangeRequests.companyId))
    .orderBy(desc(websiteChangeRequests.createdAt))
    .limit(pageSize)
    .offset(offset);

  const comments = await getWebsiteRequestComments(requests.map((request) => request.id));

  return {
    requests: requests.map((request) => ({
      ...request,
      comments: comments.filter((comment) => comment.requestId === request.id),
    })),
    total: total.value,
    page: safePage,
    pageSize,
    pageCount: Math.max(1, Math.ceil(total.value / pageSize)),
  };
}

export async function getAdminSupportTicketsPage(page = 1, pageSize = 5) {
  const safePage = Math.max(1, page);
  const offset = (safePage - 1) * pageSize;

  const [total] = await db.select({ value: count() }).from(supportTickets);
  const tickets = await db
    .select({
      id: supportTickets.id,
      companyId: supportTickets.companyId,
      category: supportTickets.category,
      title: supportTickets.title,
      message: supportTickets.message,
      status: supportTickets.status,
      createdAt: supportTickets.createdAt,
      resolvedAt: supportTickets.resolvedAt,
      companyName: companies.name,
      userName: users.name,
    })
    .from(supportTickets)
    .innerJoin(companies, eq(companies.id, supportTickets.companyId))
    .leftJoin(users, eq(users.id, supportTickets.userId))
    .orderBy(desc(supportTickets.createdAt))
    .limit(pageSize)
    .offset(offset);

  return {
    tickets,
    total: total.value,
    page: safePage,
    pageSize,
    pageCount: Math.max(1, Math.ceil(total.value / pageSize)),
  };
}

export async function getAdminServicesPage(page = 1, pageSize = 5) {
  const safePage = Math.max(1, page);
  const offset = (safePage - 1) * pageSize;

  const [total] = await db.select({ value: count() }).from(services);
  const rows = await db
    .select({
      id: services.id,
      name: services.name,
      type: services.type,
      price: services.price,
      billingType: services.billingType,
      status: services.status,
      companyName: companies.name,
    })
    .from(services)
    .innerJoin(companies, eq(companies.id, services.companyId))
    .orderBy(desc(services.startedAt))
    .limit(pageSize)
    .offset(offset);

  return {
    services: rows,
    total: total.value,
    page: safePage,
    pageSize,
    pageCount: Math.max(1, Math.ceil(total.value / pageSize)),
  };
}

export async function getAdminCampaigns() {
  return db
    .select({
      id: campaigns.id,
      name: campaigns.name,
      type: campaigns.type,
      channel: campaigns.channel,
      status: campaigns.status,
      message: campaigns.message,
      createdAt: campaigns.createdAt,
      companyName: companies.name,
      companyId: companies.id,
    })
    .from(campaigns)
    .innerJoin(companies, eq(companies.id, campaigns.companyId))
    .orderBy(desc(campaigns.createdAt));
}

export async function getAdminBillingOverview() {
  const companyRows = await db.select().from(companies).orderBy(desc(companies.createdAt));
  const serviceRows = await db
    .select({
      id: services.id,
      companyId: services.companyId,
      companyName: companies.name,
      name: services.name,
      price: services.price,
      billingType: services.billingType,
      status: services.status,
      startedAt: services.startedAt,
    })
    .from(services)
    .innerJoin(companies, eq(companies.id, services.companyId))
    .orderBy(desc(services.startedAt));

  const monthlyServices = serviceRows.filter((service) => service.billingType === "monthly" && service.status === "active");
  const waitingForPayment = companyRows.filter((company) => company.status === "waiting_for_payment");

  return {
    activeCompanies: companyRows.filter((company) => company.status === "active").length,
    mrr: monthlyServices.reduce((sum, service) => sum + Number(service.price ?? 0), 0),
    waitingForPayment,
    services: serviceRows,
  };
}

export async function getClientLeadsPage(
  companyId: string,
  status: (typeof leadStatusEnum.enumValues)[number] | undefined,
  page = 1,
  pageSize = 5,
) {
  const safePage = Math.max(1, page);
  const offset = (safePage - 1) * pageSize;
  const where = status ? and(eq(leads.companyId, companyId), eq(leads.status, status)) : eq(leads.companyId, companyId);

  const [total] = await db.select({ value: count() }).from(leads).where(where);
  const rows = await db
    .select()
    .from(leads)
    .where(where)
    .orderBy(desc(leads.createdAt))
    .limit(pageSize)
    .offset(offset);

  return {
    leads: rows,
    total: total.value,
    page: safePage,
    pageSize,
    pageCount: Math.max(1, Math.ceil(total.value / pageSize)),
  };
}

export async function getClientCustomers(companyId: string) {
  return db.select().from(customers).where(eq(customers.companyId, companyId)).orderBy(desc(customers.createdAt));
}

export type ClientCustomerBoardItem = Awaited<ReturnType<typeof getClientCustomerBoard>>[number];

export async function getClientCustomerBoard(companyId: string) {
  const [customerRows, leadRows] = await Promise.all([
    db.select().from(customers).where(eq(customers.companyId, companyId)).orderBy(desc(customers.createdAt)),
    db.select().from(leads).where(eq(leads.companyId, companyId)).orderBy(desc(leads.createdAt)),
  ]);

  return customerRows.map((customer) => {
    const customerLeads = leadRows.filter((lead) => lead.customerId === customer.id);
    const latestLead = customerLeads[0] ?? null;

    return {
      id: customer.id,
      name: customer.name,
      phone: customer.phone,
      email: customer.email,
      address: customer.address,
      city: customer.city,
      notes: customer.notes,
      source: customer.source,
      customerStatus: customer.status,
      marketingConsent: customer.marketingConsent,
      marketingConsentAt: customer.marketingConsentAt?.toISOString() ?? null,
      marketingConsentSource: customer.marketingConsentSource,
      optOut: customer.optOut,
      createdAt: customer.createdAt.toISOString(),
      latestLead: latestLead
        ? {
            id: latestLead.id,
            service: latestLead.service,
            status: latestLead.status,
            message: latestLead.message,
            location: latestLead.location,
            source: latestLead.source,
            aiSummary: latestLead.aiSummary,
            createdAt: latestLead.createdAt.toISOString(),
          }
        : null,
      leads: customerLeads.map((lead) => ({
        id: lead.id,
        service: lead.service,
        status: lead.status,
        message: lead.message,
        location: lead.location,
        source: lead.source,
        aiSummary: lead.aiSummary,
        createdAt: lead.createdAt.toISOString(),
      })),
    };
  });
}

export async function getClientSms(companyId: string) {
  return db.select().from(smsMessages).where(eq(smsMessages.companyId, companyId)).orderBy(desc(smsMessages.createdAt));
}

export async function getClientSmsPage(companyId: string, page = 1, pageSize = 10) {
  const safePage = Math.max(1, page);
  const offset = (safePage - 1) * pageSize;
  const [total] = await db.select({ value: count() }).from(smsMessages).where(eq(smsMessages.companyId, companyId));
  const messages = await db
    .select()
    .from(smsMessages)
    .where(eq(smsMessages.companyId, companyId))
    .orderBy(desc(smsMessages.createdAt))
    .limit(pageSize)
    .offset(offset);

  return {
    messages,
    total: total.value,
    page: safePage,
    pageSize,
    pageCount: Math.max(1, Math.ceil(total.value / pageSize)),
  };
}

export async function getClientReviewRequestsPage(companyId: string, page = 1, pageSize = 5) {
  const safePage = Math.max(1, page);
  const offset = (safePage - 1) * pageSize;
  const where = eq(reviewRequests.companyId, companyId);

  const [total] = await db.select({ value: count() }).from(reviewRequests).where(where);
  const rows = await db
    .select()
    .from(reviewRequests)
    .where(where)
    .orderBy(desc(reviewRequests.createdAt))
    .limit(pageSize)
    .offset(offset);

  return {
    requests: rows,
    total: total.value,
    page: safePage,
    pageSize,
    pageCount: Math.max(1, Math.ceil(total.value / pageSize)),
  };
}

export async function getCompletedReviewCandidatesPage(companyId: string, page = 1, pageSize = 5) {
  const safePage = Math.max(1, page);
  const offset = (safePage - 1) * pageSize;
  const where = and(eq(leads.companyId, companyId), eq(leads.status, "completed"));

  const [total] = await db.select({ value: count() }).from(leads).where(where);
  const completedLeads = await db
    .select({
      id: leads.id,
      customerId: leads.customerId,
      name: leads.name,
      phone: leads.phone,
      email: leads.email,
      location: leads.location,
      service: leads.service,
      completedAt: leads.updatedAt,
      customerName: customers.name,
    })
    .from(leads)
    .leftJoin(customers, eq(customers.id, leads.customerId))
    .where(where)
    .orderBy(desc(leads.updatedAt))
    .limit(pageSize)
    .offset(offset);

  const requests = await db
    .select({
      leadId: reviewRequests.leadId,
      status: reviewRequests.status,
      sentAt: reviewRequests.sentAt,
      createdAt: reviewRequests.createdAt,
    })
    .from(reviewRequests)
    .where(eq(reviewRequests.companyId, companyId))
    .orderBy(desc(reviewRequests.createdAt));

  const candidates = completedLeads.map((lead) => {
    const latestRequest = requests.find((request) => request.leadId === lead.id);

    return {
      ...lead,
      displayName: lead.customerName || lead.name,
      latestReviewSentAt: latestRequest?.sentAt?.toISOString() ?? latestRequest?.createdAt?.toISOString() ?? null,
      reviewAlreadySent: latestRequest?.status === "sent",
    };
  });

  return {
    candidates,
    total: total.value,
    page: safePage,
    pageSize,
    pageCount: Math.max(1, Math.ceil(total.value / pageSize)),
  };
}

export async function getSentReviewRequestLeadIds(companyId: string) {
  const rows = await db
    .select({ leadId: reviewRequests.leadId })
    .from(reviewRequests)
    .where(and(eq(reviewRequests.companyId, companyId), eq(reviewRequests.status, "sent")));

  return new Set(rows.map((row) => row.leadId).filter((leadId): leadId is string => Boolean(leadId)));
}

export async function getClientReviewFeedbacks(companyId: string) {
  return db
    .select({
      id: reviewFeedbacks.id,
      rating: reviewFeedbacks.rating,
      name: reviewFeedbacks.name,
      email: reviewFeedbacks.email,
      feedback: reviewFeedbacks.feedback,
      createdAt: reviewFeedbacks.createdAt,
      leadService: leads.service,
    })
    .from(reviewFeedbacks)
    .leftJoin(leads, eq(leads.id, reviewFeedbacks.leadId))
    .where(eq(reviewFeedbacks.companyId, companyId))
    .orderBy(desc(reviewFeedbacks.createdAt))
    .limit(10);
}

export async function getClientReviewFeedbacksPage(
  companyId: string,
  page = 1,
  pageSize = 10,
  rating?: number,
) {
  const safePage = Math.max(1, page);
  const offset = (safePage - 1) * pageSize;
  const where = rating
    ? and(eq(reviewFeedbacks.companyId, companyId), eq(reviewFeedbacks.rating, rating))
    : eq(reviewFeedbacks.companyId, companyId);

  const [total] = await db.select({ value: count() }).from(reviewFeedbacks).where(where);
  const feedbacks = await db
    .select({
      id: reviewFeedbacks.id,
      rating: reviewFeedbacks.rating,
      name: reviewFeedbacks.name,
      email: reviewFeedbacks.email,
      feedback: reviewFeedbacks.feedback,
      createdAt: reviewFeedbacks.createdAt,
      leadService: leads.service,
    })
    .from(reviewFeedbacks)
    .leftJoin(leads, eq(leads.id, reviewFeedbacks.leadId))
    .where(where)
    .orderBy(desc(reviewFeedbacks.createdAt))
    .limit(pageSize)
    .offset(offset);

  return {
    feedbacks,
    total: total.value,
    page: safePage,
    pageSize,
    pageCount: Math.max(1, Math.ceil(total.value / pageSize)),
    rating,
  };
}

export async function getClientCampaigns(companyId: string) {
  return db.select().from(campaigns).where(eq(campaigns.companyId, companyId)).orderBy(desc(campaigns.createdAt));
}

export async function getClientCampaignRequests(companyId: string) {
  return db
    .select()
    .from(supportTickets)
    .where(and(eq(supportTickets.companyId, companyId), eq(supportTickets.category, "pomoč pri kampanji")))
    .orderBy(desc(supportTickets.createdAt))
    .limit(10);
}

export async function getClientCompanyDocuments(companyId: string) {
  return db
    .select()
    .from(companyDocuments)
    .where(eq(companyDocuments.companyId, companyId))
    .orderBy(desc(companyDocuments.createdAt))
    .limit(30);
}

export async function getClientAnalyticsDetails(companyId: string) {
  const since = last30Days();
  const [leadRows, smsRows, reviewRows] = await Promise.all([
    db.select().from(leads).where(and(eq(leads.companyId, companyId), gte(leads.createdAt, since))).orderBy(desc(leads.createdAt)),
    db.select().from(smsMessages).where(and(eq(smsMessages.companyId, companyId), gte(smsMessages.createdAt, since))).orderBy(desc(smsMessages.createdAt)),
    db.select().from(reviewRequests).where(and(eq(reviewRequests.companyId, companyId), gte(reviewRequests.createdAt, since))).orderBy(desc(reviewRequests.createdAt)),
  ]);

  const days = Array.from({ length: 30 }).map((_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (29 - index));
    const key = date.toISOString().slice(0, 10);
    return {
      key,
      date,
      leads: leadRows.filter((lead) => lead.createdAt.toISOString().slice(0, 10) === key).length,
      sms: smsRows.filter((sms) => sms.createdAt.toISOString().slice(0, 10) === key).length,
      reviews: reviewRows.filter((review) => review.createdAt.toISOString().slice(0, 10) === key).length,
    };
  });

  return { days, leadRows, smsRows, reviewRows };
}

export async function getClientWebsiteRequestsPage(companyId: string, page = 1, pageSize = 5) {
  const safePage = Math.max(1, page);
  const offset = (safePage - 1) * pageSize;
  const where = eq(websiteChangeRequests.companyId, companyId);

  const [total] = await db.select({ value: count() }).from(websiteChangeRequests).where(where);
  const requests = await db
    .select()
    .from(websiteChangeRequests)
    .where(where)
    .orderBy(desc(websiteChangeRequests.createdAt))
    .limit(pageSize)
    .offset(offset);

  const comments = await getWebsiteRequestComments(requests.map((request) => request.id));

  return {
    requests: requests.map((request) => ({
      ...request,
      comments: comments.filter((comment) => comment.requestId === request.id),
    })),
    total: total.value,
    page: safePage,
    pageSize,
    pageCount: Math.max(1, Math.ceil(total.value / pageSize)),
  };
}

export async function getClientSupportTicketsPage(companyId: string, page = 1, pageSize = 5) {
  const safePage = Math.max(1, page);
  const offset = (safePage - 1) * pageSize;
  const where = eq(supportTickets.companyId, companyId);

  const [total] = await db.select({ value: count() }).from(supportTickets).where(where);
  const rows = await db
    .select()
    .from(supportTickets)
    .where(where)
    .orderBy(desc(supportTickets.createdAt))
    .limit(pageSize)
    .offset(offset);

  return {
    tickets: rows,
    total: total.value,
    page: safePage,
    pageSize,
    pageCount: Math.max(1, Math.ceil(total.value / pageSize)),
  };
}

async function getWebsiteRequestComments(requestIds: string[]) {
  if (!requestIds.length) {
    return [];
  }

  return db
    .select({
      id: websiteChangeRequestComments.id,
      requestId: websiteChangeRequestComments.requestId,
      message: websiteChangeRequestComments.message,
      createdAt: websiteChangeRequestComments.createdAt,
      senderName: users.name,
      senderRole: users.role,
    })
    .from(websiteChangeRequestComments)
    .leftJoin(users, eq(users.id, websiteChangeRequestComments.senderId))
    .where(inArray(websiteChangeRequestComments.requestId, requestIds))
    .orderBy(desc(websiteChangeRequestComments.createdAt));
}
