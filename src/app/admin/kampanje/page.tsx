import { createCampaignAction } from "@/app/actions";
import { DashboardShell, EmptyState, Panel, StatusPill } from "@/components/dashboard/dashboard-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { requireSuperAdmin } from "@/lib/auth";
import { getAdminCampaigns, getAdminCompanies } from "@/lib/dashboard-data";
import { campaignStatusLabels, formatDate } from "@/lib/labels";

export default async function AdminCampaignsPage() {
  const user = await requireSuperAdmin();
  const [campaigns, companies] = await Promise.all([getAdminCampaigns(), getAdminCompanies()]);

  return (
    <DashboardShell user={user} mode="admin" title="Kampanje" subtitle="Priprava in pregled kampanj za stranke.">
      <div className="grid gap-6 xl:grid-cols-[.9fr_1.1fr]">
        <Panel title="Nova kampanja">
          <form action={createCampaignAction} className="grid gap-3">
            <div className="grid gap-2">
              <Label>Stranka</Label>
              <Select name="companyId" required>
                <SelectTrigger><SelectValue placeholder="Izberite stranko" /></SelectTrigger>
                <SelectContent>
                  {companies.map((company) => <SelectItem key={company.id} value={company.id}>{company.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="campaign-name">Ime kampanje</Label>
              <Input id="campaign-name" name="name" required placeholder="Pomladna akcija" />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label>Tip</Label>
                <Select name="type" defaultValue="sms">
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sms">SMS</SelectItem>
                    <SelectItem value="referral">Referral</SelectItem>
                    <SelectItem value="google_ads">Google Ads</SelectItem>
                    <SelectItem value="facebook_ads">Facebook Ads</SelectItem>
                    <SelectItem value="instagram_ads">Instagram Ads</SelectItem>
                    <SelectItem value="tiktok_ads">TikTok Ads</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Status</Label>
                <Select name="status" defaultValue="draft">
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Osnutek</SelectItem>
                    <SelectItem value="prepared">Pripravljeno</SelectItem>
                    <SelectItem value="active">Aktivno</SelectItem>
                    <SelectItem value="paused">Pavzirano</SelectItem>
                    <SelectItem value="completed">Zaključeno</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Input name="channel" defaultValue="SMS" />
            <Textarea name="message" placeholder="Besedilo kampanje ali interni opis." />
            <Button>Ustvari kampanjo</Button>
          </form>
        </Panel>

        <Panel title="Kampanje">
          <div className="grid gap-2">
            {campaigns.length ? campaigns.map((campaign) => (
              <div key={campaign.id} className="rounded-[14px] border border-[#EEEAF5] px-4 py-3">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="text-sm font-extrabold">{campaign.name}</div>
                    <div className="mt-1 text-xs font-semibold text-[#777382]">{campaign.companyName} · {campaign.channel} · {formatDate(campaign.createdAt)}</div>
                  </div>
                  <StatusPill>{campaignStatusLabels[campaign.status]}</StatusPill>
                </div>
                {campaign.message ? <p className="mt-2 line-clamp-2 text-sm leading-5 text-[#55515F]">{campaign.message}</p> : null}
              </div>
            )) : <EmptyState text="Kampanj še ni." />}
          </div>
        </Panel>
      </div>
    </DashboardShell>
  );
}
