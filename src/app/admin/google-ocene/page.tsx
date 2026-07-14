import { DashboardShell, EmptyState, Panel, StatCard } from "@/components/dashboard/dashboard-shell";
import { requireSuperAdmin } from "@/lib/auth";
import { getAdminCompanyActivity } from "@/lib/dashboard-data";

export default async function AdminReviewsPage() {
  const user = await requireSuperAdmin();
  const activity = await getAdminCompanyActivity();

  const requests = activity.reduce((sum, company) => sum + company.reviewRequests, 0);
  const feedbacks = activity.reduce((sum, company) => sum + company.reviewFeedbacks, 0);

  return (
    <DashboardShell
      user={user}
      mode="admin"
      title="Google ocene"
      subtitle="Koliko zahtev za oceno gre skozi sistem. Vsebine ocen in podatkov strank ne prikazujemo."
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <StatCard label="Zahteve za ocene" value={requests} helper="Skupaj poslano" />
        <StatCard label="Prejete ocene" value={feedbacks} helper="Vse ocene 1–5" tone="amber" />
      </div>

      <Panel title="Po podjetjih" eyebrow="Samo števci" className="mt-6">
        {activity.length ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[420px] text-left">
              <thead>
                <tr className="text-[11px] font-bold uppercase tracking-[.08em] text-[#90939A]">
                  <th className="pb-3">Podjetje</th>
                  <th className="pb-3 text-right">Zahteve</th>
                  <th className="pb-3 text-right">Prejete ocene</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#ECEDEF]">
                {activity.map((company) => (
                  <tr key={company.id} className="text-sm">
                    <td className="py-3 font-bold">{company.name}</td>
                    <td className="py-3 text-right font-semibold text-[#55515F]">{company.reviewRequests}</td>
                    <td className="py-3 text-right font-semibold text-[#55515F]">{company.reviewFeedbacks}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState text="Ni še podjetij." />
        )}
      </Panel>
    </DashboardShell>
  );
}
