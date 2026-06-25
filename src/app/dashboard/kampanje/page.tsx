import { confirmPreparedCampaignAction, createCampaignRequestAction } from "@/app/actions";
import { DashboardShell, EmptyState, Panel, StatusPill } from "@/components/dashboard/dashboard-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { requireClientUser } from "@/lib/auth";
import { getClientCampaignRequests, getClientCampaigns } from "@/lib/dashboard-data";
import { campaignStatusLabels, formatDate, supportTicketStatusLabels } from "@/lib/labels";

export default async function ClientCampaignsPage() {
  const user = await requireClientUser();
  const [campaigns, requests] = await Promise.all([
    getClientCampaigns(user.companyId!),
    getClientCampaignRequests(user.companyId!),
  ]);

  return (
    <DashboardShell user={user} mode="client" title="Kampanje" subtitle="Aktivne in pripravljene akcije za vaše stranke.">
      <div className="grid gap-6 xl:grid-cols-[.9fr_1.1fr]">
        <Panel title="Zahteva za novo kampanjo">
          <form action={createCampaignRequestAction} className="grid gap-3">
            <div className="grid gap-2">
              <Label htmlFor="campaign-request-title">Naslov</Label>
              <Input id="campaign-request-title" name="title" required placeholder="Npr. pomladna akcija za strehe" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="campaign-request-message">Kaj želite doseči?</Label>
              <Textarea
                id="campaign-request-message"
                name="message"
                required
                className="min-h-32"
                placeholder="Opišite akcijo, sezonsko ponudbo ali skupino strank, ki jih želite doseči."
              />
            </div>
            <Button>Oddaj zahtevo</Button>
          </form>
        </Panel>

        <Panel title="Kampanje">
          <div className="grid gap-3">
            {campaigns.length ? campaigns.map((campaign) => (
              <div key={campaign.id} className="rounded-[14px] border border-[#EEEAF5] p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="font-extrabold">{campaign.name}</div>
                    <div className="mt-1 text-sm font-semibold text-[#777382]">{campaign.channel} · {formatDate(campaign.createdAt)}</div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <StatusPill>{campaignStatusLabels[campaign.status]}</StatusPill>
                    {campaign.status === "prepared" ? (
                      <form action={confirmPreparedCampaignAction}>
                        <input type="hidden" name="campaignId" value={campaign.id} />
                        <Button size="sm">Potrdi</Button>
                      </form>
                    ) : null}
                  </div>
                </div>
                {campaign.message ? <p className="mt-3 text-sm leading-6 text-[#55515F]">{campaign.message}</p> : null}
              </div>
            )) : <EmptyState text="Kampanje bo pripravila ekipa Nivo. Tukaj boste videli pripravljene akcije in rezultate." />}
          </div>
        </Panel>
      </div>

      <div className="mt-6">
        <Panel title="Zadnji zahtevki za kampanje">
          <div className="grid gap-2">
            {requests.length ? requests.map((request) => (
              <div key={request.id} className="flex flex-wrap items-center justify-between gap-3 rounded-[14px] border border-[#EEEAF5] px-4 py-3">
                <div>
                  <div className="text-sm font-extrabold">{request.title}</div>
                  <div className="mt-1 text-xs font-semibold text-[#777382]">{formatDate(request.createdAt)}</div>
                </div>
                <StatusPill>{supportTicketStatusLabels[request.status]}</StatusPill>
              </div>
            )) : <EmptyState text="Zahtevkov za kampanje še ni." />}
          </div>
        </Panel>
      </div>
    </DashboardShell>
  );
}
