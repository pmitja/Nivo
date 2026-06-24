import { updateLeadStatusAction } from "@/app/actions";
import { DashboardShell, EmptyState, Panel, StatusPill } from "@/components/dashboard/dashboard-shell";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { requireClientUser } from "@/lib/auth";
import { getClientLeads } from "@/lib/dashboard-data";
import { formatDate, leadStatusLabels } from "@/lib/labels";

export default async function ClientLeadsPage() {
  const user = await requireClientUser();
  const leads = await getClientLeads(user.companyId!);

  return (
    <DashboardShell user={user} mode="client" title="Povpraševanja" subtitle="Vsako novo povpraševanje in nadaljnji status.">
      <Panel title="Povpraševanja">
        <div className="grid gap-3">
          {leads.length ? leads.map((lead) => (
            <div key={lead.id} className="rounded-[14px] border border-[#EEEAF5] p-4">
              <div className="flex flex-wrap justify-between gap-3">
                <div>
                  <div className="font-extrabold">{lead.name} · {lead.service}</div>
                  <div className="mt-1 text-sm font-semibold text-[#777382]">{lead.phone} · {lead.email || "Brez emaila"} · {lead.location || "Brez lokacije"}</div>
                  <p className="mt-3 max-w-[760px] text-sm leading-6 text-[#55515F]">{lead.message}</p>
                </div>
                <StatusPill>{leadStatusLabels[lead.status]}</StatusPill>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <a href={`tel:${lead.phone}`} className="rounded-[11px] bg-[#16151D] px-4 py-2 text-sm font-extrabold text-white">Pokliči stranko</a>
                <a href={`sms:${lead.phone}`} className="rounded-[11px] border border-[#E2DFEA] px-4 py-2 text-sm font-extrabold">Pošlji SMS</a>
                <form action={updateLeadStatusAction} className="flex gap-2">
                  <input type="hidden" name="leadId" value={lead.id} />
                  <Select name="status" defaultValue={lead.status}>
                    <SelectTrigger className="h-10 min-w-[190px] py-0">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(leadStatusLabels).map(([value, label]) => <SelectItem key={value} value={value}>{label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <Button size="sm">Shrani</Button>
                </form>
              </div>
              <div className="mt-3 text-xs font-bold uppercase tracking-[.06em] text-[#9A96A5]">{formatDate(lead.createdAt)}</div>
            </div>
          )) : <EmptyState text="Povpraševanj še ni." />}
        </div>
      </Panel>
    </DashboardShell>
  );
}
