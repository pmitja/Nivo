import { AdminSmsLogTable } from "@/components/dashboard/admin-sms-log-table";
import { DashboardShell, Panel } from "@/components/dashboard/dashboard-shell";
import { requireSuperAdmin } from "@/lib/auth";
import { getAdminSmsPage } from "@/lib/dashboard-data";

export default async function AdminSmsPage({ searchParams }: { searchParams: Promise<{ smsPage?: string }> }) {
  const user = await requireSuperAdmin();
  const params = await searchParams;
  const page = Number(params.smsPage ?? "1");
  const smsPage = await getAdminSmsPage(Number.isFinite(page) ? page : 1);

  return (
    <DashboardShell user={user} mode="admin" title="SMS log" subtitle="Vsa poslana in pripravljena SMS sporočila.">
      <Panel title="SMS sporočila">
        <AdminSmsLogTable data={smsPage} />
      </Panel>
    </DashboardShell>
  );
}
