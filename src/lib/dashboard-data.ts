import { and, count, desc, eq, gte, sql } from "drizzle-orm";
import { db } from "@/db";
import {
  analyticsEvents,
  campaigns,
  companies,
  companySmsSettings,
  customers,
  leads,
  reviewFeedbacks,
  reviewRequests,
  services,
  smsMessages,
  supportTickets,
  websiteChangeRequests,
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
  const [openRequests] = await db
    .select({ value: count() })
    .from(websiteChangeRequests)
    .where(sql`${websiteChangeRequests.status} not in ('completed', 'closed')`);
  const [activeCampaigns] = await db.select({ value: count() }).from(campaigns).where(eq(campaigns.status, "active"));

  const recentLeads = await db
    .select({
      id: leads.id,
      name: leads.name,
      service: leads.service,
      createdAt: leads.createdAt,
      companyName: companies.name,
      status: leads.status,
    })
    .from(leads)
    .innerJoin(companies, eq(companies.id, leads.companyId))
    .orderBy(desc(leads.createdAt))
    .limit(6);

  const recentCompanies = await db.select().from(companies).orderBy(desc(companies.createdAt)).limit(6);

  return {
    activeCompanies: activeCompanies.value,
    newCompanies: newCompanies.value,
    mrr: activeCompanies.value * 99,
    allSms: allSms.value,
    newLeads: newLeads.value,
    openRequests: openRequests.value,
    activeCampaigns: activeCampaigns.value,
    recentLeads,
    recentCompanies,
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

  const recentLeads = await db.select().from(leads).where(eq(leads.companyId, companyId)).orderBy(desc(leads.createdAt)).limit(6);
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

export async function getAdminCompanies() {
  return db.select().from(companies).orderBy(desc(companies.createdAt));
}

export async function getAdminLeads() {
  return db
    .select({
      id: leads.id,
      name: leads.name,
      phone: leads.phone,
      email: leads.email,
      location: leads.location,
      service: leads.service,
      status: leads.status,
      createdAt: leads.createdAt,
      companyName: companies.name,
    })
    .from(leads)
    .innerJoin(companies, eq(companies.id, leads.companyId))
    .orderBy(desc(leads.createdAt));
}

export async function getAdminSms() {
  return db
    .select({
      id: smsMessages.id,
      phone: smsMessages.phone,
      message: smsMessages.message,
      type: smsMessages.type,
      status: smsMessages.status,
      provider: smsMessages.provider,
      cost: smsMessages.cost,
      createdAt: smsMessages.createdAt,
      companyName: companies.name,
    })
    .from(smsMessages)
    .innerJoin(companies, eq(companies.id, smsMessages.companyId))
    .orderBy(desc(smsMessages.createdAt));
}

export async function getAdminWebsiteRequests() {
  return db
    .select({
      id: websiteChangeRequests.id,
      title: websiteChangeRequests.title,
      message: websiteChangeRequests.message,
      status: websiteChangeRequests.status,
      priority: websiteChangeRequests.priority,
      createdAt: websiteChangeRequests.createdAt,
      companyName: companies.name,
    })
    .from(websiteChangeRequests)
    .innerJoin(companies, eq(companies.id, websiteChangeRequests.companyId))
    .orderBy(desc(websiteChangeRequests.createdAt));
}

export async function getAdminServices() {
  return db
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
    .orderBy(desc(services.startedAt));
}

export async function getClientLeads(companyId: string) {
  return db.select().from(leads).where(eq(leads.companyId, companyId)).orderBy(desc(leads.createdAt));
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

export async function getClientSmsSettings(companyId: string) {
  const [settings] = await db
    .select()
    .from(companySmsSettings)
    .where(eq(companySmsSettings.companyId, companyId))
    .limit(1);

  return settings;
}

export async function getClientReviewRequests(companyId: string) {
  return db
    .select()
    .from(reviewRequests)
    .where(eq(reviewRequests.companyId, companyId))
    .orderBy(desc(reviewRequests.createdAt));
}

export async function getCompletedReviewCandidates(companyId: string) {
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
    .where(and(eq(leads.companyId, companyId), eq(leads.status, "completed")))
    .orderBy(desc(leads.updatedAt));

  const requests = await db
    .select({
      leadId: reviewRequests.leadId,
      sentAt: reviewRequests.sentAt,
      createdAt: reviewRequests.createdAt,
    })
    .from(reviewRequests)
    .where(eq(reviewRequests.companyId, companyId))
    .orderBy(desc(reviewRequests.createdAt));

  return completedLeads.map((lead) => {
    const latestRequest = requests.find((request) => request.leadId === lead.id);

    return {
      ...lead,
      displayName: lead.customerName || lead.name,
      latestReviewSentAt: latestRequest?.sentAt?.toISOString() ?? latestRequest?.createdAt?.toISOString() ?? null,
    };
  });
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

export async function getClientWebsiteRequests(companyId: string) {
  return db
    .select()
    .from(websiteChangeRequests)
    .where(eq(websiteChangeRequests.companyId, companyId))
    .orderBy(desc(websiteChangeRequests.createdAt));
}

export async function getClientSupportTickets(companyId: string) {
  return db.select().from(supportTickets).where(eq(supportTickets.companyId, companyId)).orderBy(desc(supportTickets.createdAt));
}
