import { DashboardShell, EmptyState, Panel, StatCard, StatusPill } from "@/components/dashboard/dashboard-shell";
import { PaginationFooter } from "@/components/dashboard/pagination-footer";
import { requireSuperAdmin } from "@/lib/auth";
import { getAdminReviewOverview } from "@/lib/dashboard-data";
import { formatDate } from "@/lib/labels";

export default async function AdminReviewsPage({
  searchParams,
}: {
  searchParams: Promise<{ requestsPage?: string; feedbacksPage?: string }>;
}) {
  const user = await requireSuperAdmin();
  const params = await searchParams;
  const requestsPage = Number(params.requestsPage ?? "1");
  const feedbacksPage = Number(params.feedbacksPage ?? "1");
  const data = await getAdminReviewOverview(
    Number.isFinite(requestsPage) ? requestsPage : 1,
    Number.isFinite(feedbacksPage) ? feedbacksPage : 1,
  );

  return (
    <DashboardShell user={user} mode="admin" title="Google ocene" subtitle="Zahteve za ocene in interne povratne informacije vseh strank.">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Zahteve za ocene" value={data.requestCount} helper="Skupaj poslano" />
        <StatCard label="Prejete ocene" value={data.feedbackCount} helper="Vse ocene 1-5" tone="amber" />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <Panel title="Zadnje zahteve">
          <div className="grid gap-2">
            {data.requests.length ? data.requests.map((request) => (
              <div key={request.id} className="rounded-[14px] border border-[#EEEAF5] px-4 py-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="text-sm font-extrabold">{request.companyName} · {request.phone}</div>
                    <div className="mt-1 text-xs font-semibold text-[#777382]">{request.leadService || "Brez storitve"} · {formatDate(request.createdAt)}</div>
                  </div>
                  <StatusPill>{request.status === "sent" ? "Poslano" : request.status}</StatusPill>
                </div>
              </div>
            )) : <EmptyState text="Zahtev za ocene še ni." />}
          </div>
          <PaginationFooter
            page={data.requestsPage}
            pageCount={data.requestsPageCount}
            pageSize={data.pageSize}
            total={data.requestCount}
            basePath="/admin/google-ocene"
            pageParam="requestsPage"
            extraParams={{ feedbacksPage: data.feedbacksPage }}
          />
        </Panel>

        <Panel title="Interne povratne informacije">
          <div className="grid gap-2">
            {data.feedbacks.length ? data.feedbacks.map((feedback) => (
              <div key={feedback.id} className="rounded-[14px] border border-[#EEEAF5] px-4 py-3">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="text-sm font-extrabold">{feedback.companyName} · {feedback.name || "Brez imena"}</div>
                    <div className="mt-1 text-xs font-semibold text-[#777382]">{feedback.leadService || "Brez storitve"} · {formatDate(feedback.createdAt)}</div>
                  </div>
                  <StatusPill>{feedback.rating}/5</StatusPill>
                </div>
                <p className="mt-2 line-clamp-2 text-sm leading-5 text-[#55515F]">
                  {feedback.feedback || "Stranka je bila preusmerjena na Google, brez dodatnega komentarja."}
                </p>
              </div>
            )) : <EmptyState text="Ocen strank še ni." />}
          </div>
          <PaginationFooter
            page={data.feedbacksPage}
            pageCount={data.feedbacksPageCount}
            pageSize={data.pageSize}
            total={data.feedbackCount}
            basePath="/admin/google-ocene"
            pageParam="feedbacksPage"
            extraParams={{ requestsPage: data.requestsPage }}
          />
        </Panel>
      </div>
    </DashboardShell>
  );
}
