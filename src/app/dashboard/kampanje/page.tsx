import { DashboardShell, EmptyState, Panel, StatusPill } from "@/components/dashboard/dashboard-shell";
import { requireClientUser } from "@/lib/auth";
import { getClientCampaigns } from "@/lib/dashboard-data";
import { formatDate } from "@/lib/labels";

export default async function ClientCampaignsPage() {
  const user = await requireClientUser();
  const campaigns = await getClientCampaigns(user.companyId!);

  return (
    <DashboardShell user={user} mode="client" title="Kampanje" subtitle="Aktivne in pripravljene akcije za vaše stranke.">
      <Panel title="Kampanje">
        <div className="grid gap-3">
          {campaigns.length ? campaigns.map((campaign) => (
            <div key={campaign.id} className="rounded-[14px] border border-[#EEEAF5] p-4">
              <div className="flex flex-wrap justify-between gap-3">
                <div>
                  <div className="font-extrabold">{campaign.name}</div>
                  <div className="mt-1 text-sm font-semibold text-[#777382]">{campaign.channel} · {formatDate(campaign.createdAt)}</div>
                </div>
                <StatusPill>{campaign.status}</StatusPill>
              </div>
              {campaign.message ? <p className="mt-3 text-sm leading-6 text-[#55515F]">{campaign.message}</p> : null}
            </div>
          )) : <EmptyState text="Kampanje bo pripravila ekipa Nivo. Tukaj boste videli pripravljene akcije in rezultate." />}
        </div>
      </Panel>
    </DashboardShell>
  );
}
