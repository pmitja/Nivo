import { DashboardShell, Panel, StatCard } from "@/components/dashboard/dashboard-shell";
import { requireClientUser } from "@/lib/auth";
import { getClientAnalyticsDetails, getClientOverview } from "@/lib/dashboard-data";
import { formatDate } from "@/lib/labels-en";

export default async function ClientAnalyticsPage() {
  const user = await requireClientUser();
  const [data, details] = await Promise.all([
    getClientOverview(user.companyId!),
    getClientAnalyticsDetails(user.companyId!),
  ]);
  const conversionRate = data.visits > 0 ? Math.round((data.formConversions / data.visits) * 100) : 0;

  return (
    <DashboardShell user={user} mode="client" title="Analytics" subtitle="Core results from the last 30 days.">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Website visits" value={data.visits} helper="Last 30 days" />
        <StatCard label="Submitted inquiries" value={data.formConversions} helper="Last 30 days" tone="green" />
        <StatCard label="Conversion rate" value={`${conversionRate}%`} helper="Inquiries compared with visits" />
        <StatCard label="SMS messages sent" value={data.smsCount} helper="All messages" />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_.85fr]">
        <Panel title="Last 30 days">
          <div className="grid gap-2">
            {details.days.slice(-10).map((day) => (
              <div key={day.key} className="grid grid-cols-[1fr_auto_auto_auto] items-center gap-3 rounded-[12px] border border-[#EEEAF5] px-4 py-3 text-sm">
                <div className="font-bold">{formatDate(day.date)}</div>
                <div className="font-semibold text-[#686473]">Inquiries: {day.leads}</div>
                <div className="font-semibold text-[#686473]">SMS: {day.sms}</div>
                <div className="font-semibold text-[#686473]">Reviews: {day.reviews}</div>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Recent activity">
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
