import { DashboardShell, Panel, StatusPill } from "@/components/dashboard/dashboard-shell";
import { requireSuperAdmin } from "@/lib/auth";
import { getAdminWebsiteRequests } from "@/lib/dashboard-data";
import { formatDate, priorityLabels, websiteRequestStatusLabels } from "@/lib/labels";

export default async function AdminRequestsPage() {
  const user = await requireSuperAdmin();
  const requests = await getAdminWebsiteRequests();

  return (
    <DashboardShell user={user} mode="admin" title="Zahtevki" subtitle="Spremembe spletnih strani, ki jih ekipa uredi ročno.">
      <Panel title="Zahtevki za spremembe spletne strani">
        <div className="grid gap-3">
          {requests.map((request) => (
            <div key={request.id} className="rounded-[14px] border border-[#EEEAF5] p-4">
              <div className="flex flex-wrap justify-between gap-3">
                <div>
                  <div className="font-extrabold">{request.title}</div>
                  <div className="mt-1 text-sm font-semibold text-[#777382]">{request.companyName} · {formatDate(request.createdAt)}</div>
                </div>
                <div className="flex gap-2">
                  <StatusPill>{priorityLabels[request.priority]}</StatusPill>
                  <StatusPill>{websiteRequestStatusLabels[request.status]}</StatusPill>
                </div>
              </div>
              <p className="mt-3 text-sm leading-6 text-[#55515F]">{request.message}</p>
            </div>
          ))}
        </div>
      </Panel>
    </DashboardShell>
  );
}
