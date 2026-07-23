import { DashboardShell, EmptyState, Panel, StatusPill } from "@/components/dashboard/dashboard-shell";
import { PaginationFooter } from "@/components/dashboard/pagination-footer";
import { ReviewFeedbackTable } from "@/components/dashboard/review-feedback-table";
import { SendReviewRequestButton } from "@/components/dashboard/send-review-request-button";
import { requireClientUser } from "@/lib/auth";
import {
  getClientReviewFeedbacksPage,
  getClientReviewRequestsPage,
  getCompany,
  getCompletedReviewCandidatesPage,
} from "@/lib/dashboard-data";
import { formatDate } from "@/lib/labels-en";

export default async function ClientReviewsPage({
  searchParams,
}: {
  searchParams: Promise<{
    feedbackPage?: string;
    feedbackRating?: string;
    candidatesPage?: string;
    requestsPage?: string;
  }>;
}) {
  const user = await requireClientUser();
  const params = await searchParams;
  const feedbackPage = Number(params.feedbackPage ?? "1");
  const feedbackRating = params.feedbackRating ? Number(params.feedbackRating) : undefined;
  const safeRating = feedbackRating && [1, 2, 3, 4, 5].includes(feedbackRating) ? feedbackRating : undefined;
  const candidatesPage = Number(params.candidatesPage ?? "1");
  const requestsPage = Number(params.requestsPage ?? "1");

  const [company, candidatesData, requestsData, feedbacks] = await Promise.all([
    getCompany(user.companyId!),
    getCompletedReviewCandidatesPage(user.companyId!, Number.isFinite(candidatesPage) ? candidatesPage : 1),
    getClientReviewRequestsPage(user.companyId!, Number.isFinite(requestsPage) ? requestsPage : 1),
    getClientReviewFeedbacksPage(user.companyId!, Number.isFinite(feedbackPage) ? feedbackPage : 1, 5, safeRating),
  ]);
  const candidates = candidatesData.candidates;
  const requests = requestsData.requests;

  return (
    <DashboardShell user={user} mode="client" title="Google reviews" subtitle="Send a review request to customers after a completed job.">
      <div className="grid gap-6 xl:grid-cols-[1.15fr_.85fr]">
        <Panel title="Completed customers">
          {company?.googleReviewUrl ? (
            <div className="overflow-hidden rounded-[16px] border border-[#EEEAF5]">
              <div className="hidden grid-cols-[1fr_.8fr_.8fr_auto] gap-3 border-b border-[#EEEAF5] bg-[#FBFAFF] px-4 py-3 text-xs font-extrabold uppercase tracking-[.06em] text-[#8D8999] md:grid">
                <div>Customer</div>
                <div>Service</div>
                <div>Latest request</div>
                <div className="text-right">Action</div>
              </div>
              <div className="divide-y divide-[#EEEAF5] bg-white">
                {candidates.length ? (
                  candidates.map((candidate) => (
                    <div key={candidate.id} className="grid gap-3 px-4 py-3 md:grid-cols-[1fr_.8fr_.8fr_auto] md:items-center">
                      <div>
                        <div className="text-sm font-extrabold">{candidate.displayName}</div>
                        <div className="mt-1 text-xs font-semibold text-[#8A8694]">{candidate.phone} · {candidate.email || "No email"}</div>
                      </div>
                      <div>
                        <div className="text-sm font-bold text-[#28262F]">{candidate.service}</div>
                        <div className="mt-1 text-xs font-semibold text-[#8A8694]">{candidate.location || "No location"}</div>
                      </div>
                      <div className="text-sm font-semibold text-[#686473]">
                        {candidate.latestReviewSentAt ? formatDate(candidate.latestReviewSentAt) : "Not sent"}
                      </div>
                      <div className="md:justify-self-end">
                        <SendReviewRequestButton leadId={candidate.id} size="sm" alreadySent={candidate.reviewAlreadySent} />
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-4">
                    <EmptyState text="Customers appear here when an inquiry is marked as completed." />
                  </div>
                )}
              </div>
            </div>
          ) : (
            <EmptyState text="Your Google review link is not set up yet. Send us the link or contact us and we will set it up." />
          )}
          {company?.googleReviewUrl ? (
            <PaginationFooter
              page={candidatesData.page}
              pageCount={candidatesData.pageCount}
              pageSize={candidatesData.pageSize}
              total={candidatesData.total}
              basePath="/dashboard/google-ocene"
              pageParam="candidatesPage"
            />
          ) : null}
        </Panel>

        <Panel title="Recent requests">
          <div className="grid gap-2">
            {requests.length ? (
              requests.map((request) => (
                <div key={request.id} className="flex flex-wrap items-center justify-between gap-3 rounded-[14px] border border-[#EEEAF5] px-4 py-3">
                  <div>
                    <div className="text-sm font-extrabold">{request.phone}</div>
                    <div className="mt-1 text-xs font-semibold text-[#777382]">{formatDate(request.createdAt)}</div>
                  </div>
                  <StatusPill>{request.status === "sent" ? "Poslano" : request.status}</StatusPill>
                </div>
              ))
            ) : (
              <EmptyState text="No review requests yet." />
            )}
          </div>
          <PaginationFooter
            page={requestsData.page}
            pageCount={requestsData.pageCount}
            pageSize={requestsData.pageSize}
            total={requestsData.total}
            basePath="/dashboard/google-ocene"
            pageParam="requestsPage"
          />
        </Panel>
      </div>

      <div className="mt-6">
        <Panel title="Received feedback">
          <ReviewFeedbackTable data={feedbacks} />
        </Panel>
      </div>
    </DashboardShell>
  );
}
