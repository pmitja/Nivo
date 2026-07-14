import { DashboardShell, EmptyState, Panel, StatCard } from "@/components/dashboard/dashboard-shell";
import { requireSuperAdmin } from "@/lib/auth";
import { getAdminCompanyActivity } from "@/lib/dashboard-data";

export default async function AdminSmsPage() {
  const user = await requireSuperAdmin();
  const activity = await getAdminCompanyActivity();

  const total = activity.reduce((sum, company) => sum + company.sms, 0);
  const delivered = activity.reduce((sum, company) => sum + company.smsDelivered, 0);
  const failed = activity.reduce((sum, company) => sum + company.smsFailed, 0);

  return (
    <DashboardShell
      user={user}
      mode="admin"
      title="SMS statistika"
      subtitle="Koliko SMS-ov gre skozi sistem. Vsebine sporočil in telefonskih številk strank ne prikazujemo."
    >
      <div className="grid gap-3 sm:grid-cols-3">
        <StatCard label="Vsi SMS-i" value={total} helper="Od začetka" />
        <StatCard label="Dostavljeni" value={delivered} tone="green" />
        <StatCard label="Neuspeli" value={failed} tone={failed ? "red" : "default"} helper="Če jih je veliko, preveri nastavitve" />
      </div>

      <Panel title="Po podjetjih" eyebrow="Samo števci" className="mt-6">
        {activity.length ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[520px] text-left">
              <thead>
                <tr className="text-[11px] font-bold uppercase tracking-[.08em] text-[#90939A]">
                  <th className="pb-3">Podjetje</th>
                  <th className="pb-3 text-right">Skupaj</th>
                  <th className="pb-3 text-right">Dostavljeni</th>
                  <th className="pb-3 text-right">Neuspeli</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#ECEDEF]">
                {activity.map((company) => (
                  <tr key={company.id} className="text-sm">
                    <td className="py-3 font-bold">{company.name}</td>
                    <td className="py-3 text-right font-semibold text-[#55515F]">{company.sms}</td>
                    <td className="py-3 text-right font-semibold text-[#16805A]">{company.smsDelivered}</td>
                    <td className={`py-3 text-right font-semibold ${company.smsFailed ? "text-[#B42318]" : "text-[#8A8D95]"}`}>
                      {company.smsFailed}
                    </td>
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
