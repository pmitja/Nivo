import { DashboardShell, Panel, StatCard } from "@/components/dashboard/dashboard-shell";
import { requireClientUser } from "@/lib/auth";
import { getClientAnalyticsDetails, getClientOverview } from "@/lib/dashboard-data";
import { formatDate } from "@/lib/labels";

export default async function ClientAnalyticsPage() {
  const user = await requireClientUser();
  const [data, details] = await Promise.all([
    getClientOverview(user.companyId!),
    getClientAnalyticsDetails(user.companyId!),
  ]);
  const conversionRate = data.visits > 0 ? Math.round((data.formConversions / data.visits) * 100) : 0;

  return (
    <DashboardShell user={user} mode="client" title="Analitika" subtitle="Osnovni rezultati zadnjih 30 dni.">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Obiski spletne strani" value={data.visits} helper="Zadnjih 30 dni" />
        <StatCard label="Oddana povpraševanja" value={data.formConversions} helper="Zadnjih 30 dni" tone="green" />
        <StatCard label="Delež obrazcev" value={`${conversionRate}%`} helper="Povpraševanja glede na obiske" />
        <StatCard label="Poslani SMS-i" value={data.smsCount} helper="Vsa sporočila" />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_.85fr]">
        <Panel title="Trend zadnjih 30 dni">
          <div className="grid gap-2">
            {details.days.slice(-10).map((day) => (
              <div key={day.key} className="grid grid-cols-[1fr_auto_auto_auto] items-center gap-3 rounded-[12px] border border-[#EEEAF5] px-4 py-3 text-sm">
                <div className="font-bold">{formatDate(day.date)}</div>
                <div className="font-semibold text-[#686473]">Povpraševanja: {day.leads}</div>
                <div className="font-semibold text-[#686473]">SMS: {day.sms}</div>
                <div className="font-semibold text-[#686473]">Ocene: {day.reviews}</div>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Zadnje aktivnosti">
          <div className="grid gap-2">
            {details.leadRows.slice(0, 6).map((lead) => (
              <div key={lead.id} className="rounded-[12px] border border-[#EEEAF5] px-4 py-3">
                <div className="text-sm font-extrabold">{lead.name} · {lead.service}</div>
                <div className="mt-1 text-xs font-semibold text-[#8A8694]">{formatDate(lead.createdAt)}</div>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </DashboardShell>
  );
}
