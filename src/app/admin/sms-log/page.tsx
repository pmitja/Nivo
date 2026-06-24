import { DashboardShell, Panel, StatusPill } from "@/components/dashboard/dashboard-shell";
import { requireSuperAdmin } from "@/lib/auth";
import { getAdminSms } from "@/lib/dashboard-data";
import { formatDate, smsStatusLabels, smsTypeLabels } from "@/lib/labels";

export default async function AdminSmsPage() {
  const user = await requireSuperAdmin();
  const messages = await getAdminSms();

  return (
    <DashboardShell user={user} mode="admin" title="SMS log" subtitle="Vsa poslana in pripravljena SMS sporočila.">
      <Panel title="SMS sporočila">
        <div className="grid gap-3">
          {messages.map((sms) => (
            <div key={sms.id} className="rounded-[14px] border border-[#EEEAF5] p-4">
              <div className="flex flex-wrap justify-between gap-3">
                <div>
                  <div className="font-extrabold">{sms.companyName} · {sms.phone}</div>
                  <div className="mt-1 text-sm font-semibold text-[#777382]">{smsTypeLabels[sms.type]} · {sms.provider} · {formatDate(sms.createdAt)}</div>
                </div>
                <StatusPill>{smsStatusLabels[sms.status]}</StatusPill>
              </div>
              <p className="mt-3 text-sm leading-6 text-[#55515F]">{sms.message}</p>
            </div>
          ))}
        </div>
      </Panel>
    </DashboardShell>
  );
}
