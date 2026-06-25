import { AutoReplyForm } from "@/components/dashboard/auto-reply-form";
import { DashboardShell, Panel } from "@/components/dashboard/dashboard-shell";
import { SmsLogTable } from "@/components/dashboard/sms-log-table";
import { requireClientUser } from "@/lib/auth";
import { getClientSmsPage, getClientSmsSettings } from "@/lib/dashboard-data";

export default async function ClientSmsPage({
  searchParams,
}: {
  searchParams: Promise<{ smsPage?: string }>;
}) {
  const user = await requireClientUser();
  const params = await searchParams;
  const page = Number(params.smsPage ?? "1");
  const [smsPage, settings] = await Promise.all([
    getClientSmsPage(user.companyId!, Number.isFinite(page) ? page : 1, 10),
    getClientSmsSettings(user.companyId!),
  ]);

  return (
    <DashboardShell user={user} mode="client" title="SMS" subtitle="Zgodovina obvestil in avtomatskih odgovorov.">
      <div className="grid gap-6 xl:grid-cols-[.9fr_1.1fr]">
        <Panel title="Avtomatski odgovor">
          <AutoReplyForm initialMessage={settings?.autoReplyMessage} />
        </Panel>
        <Panel title="SMS zgodovina">
          <SmsLogTable data={smsPage} />
        </Panel>
      </div>
    </DashboardShell>
  );
}
