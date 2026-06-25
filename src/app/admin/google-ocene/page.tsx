import { DashboardShell, EmptyState, Panel, StatCard, StatusPill } from "@/components/dashboard/dashboard-shell";
import { requireSuperAdmin } from "@/lib/auth";
import { getAdminReviewOverview } from "@/lib/dashboard-data";
import { formatDate } from "@/lib/labels";

export default async function AdminReviewsPage() {
  const user = await requireSuperAdmin();
  const data = await getAdminReviewOverview();

  return (
    <DashboardShell user={user} mode="admin" title="Google ocene" subtitle="Zahteve za ocene in interne povratne informacije vseh strank.">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Zahteve za ocene" value={data.requestCount} helper="Skupaj poslano" />
        <StatCard label="Interne povratne informacije" value={data.feedbackCount} helper="Ocene 1-3" tone="amber" />
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
                <p className="mt-2 line-clamp-2 text-sm leading-5 text-[#55515F]">{feedback.feedback}</p>
              </div>
            )) : <EmptyState text="Interne povratne informacije se prikažejo pri ocenah 1-3." />}
          </div>
        </Panel>
      </div>
    </DashboardShell>
  );
}
