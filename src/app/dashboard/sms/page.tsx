import { DashboardShell, Panel } from "@/components/dashboard/dashboard-shell";
import { SmsLogTable } from "@/components/dashboard/sms-log-table";
import { requireClientUser } from "@/lib/auth";
import { getClientSmsPage } from "@/lib/dashboard-data";

export default async function ClientSmsPage({
  searchParams,
}: {
  searchParams: Promise<{ smsPage?: string }>;
}) {
  const user = await requireClientUser();
  const params = await searchParams;
  const page = Number(params.smsPage ?? "1");
  const smsPage = await getClientSmsPage(user.companyId!, Number.isFinite(page) ? page : 1, 10);

  return (
    <DashboardShell user={user} mode="client" title="SMS" subtitle="History of inquiry alerts and Google review messages.">
      <Panel title="SMS history">
        <SmsLogTable data={smsPage} />
      </Panel>
    </DashboardShell>
  );
}
