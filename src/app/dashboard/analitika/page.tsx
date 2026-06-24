import { DashboardShell, StatCard } from "@/components/dashboard/dashboard-shell";
import { requireClientUser } from "@/lib/auth";
import { getClientOverview } from "@/lib/dashboard-data";

export default async function ClientAnalyticsPage() {
  const user = await requireClientUser();
  const data = await getClientOverview(user.companyId!);
  const conversionRate = data.visits > 0 ? Math.round((data.formConversions / data.visits) * 100) : 0;

  return (
    <DashboardShell user={user} mode="client" title="Analitika" subtitle="Osnovni rezultati zadnjih 30 dni.">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Obiski spletne strani" value={data.visits} helper="Zadnjih 30 dni" />
        <StatCard label="Oddana povpraševanja" value={data.formConversions} helper="Zadnjih 30 dni" tone="green" />
        <StatCard label="Delež obrazcev" value={`${conversionRate}%`} helper="Povpraševanja glede na obiske" />
        <StatCard label="Poslani SMS-i" value={data.smsCount} helper="Vsa sporočila" />
      </div>
    </DashboardShell>
  );
}
