import { updateLeadStatusAction } from "@/app/actions";
import { DashboardShell, Panel, StatusPill } from "@/components/dashboard/dashboard-shell";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { requireSuperAdmin } from "@/lib/auth";
import { getAdminLeads } from "@/lib/dashboard-data";
import { formatDate, leadStatusLabels } from "@/lib/labels";

export default async function AdminLeadsPage() {
  const user = await requireSuperAdmin();
  const leads = await getAdminLeads();

  return (
    <DashboardShell user={user} mode="admin" title="Povpraševanja" subtitle="Vsa povpraševanja vseh strank.">
      <Panel title="Povpraševanja">
        <div className="grid gap-3">
          {leads.map((lead) => (
            <div key={lead.id} className="rounded-[14px] border border-[#EEEAF5] p-4">
              <div className="flex flex-wrap justify-between gap-3">
                <div>
                  <div className="font-extrabold">{lead.name} · {lead.service}</div>
                  <div className="mt-1 text-sm font-semibold text-[#777382]">{lead.companyName} · {lead.phone} · {lead.location || "Brez lokacije"}</div>
                  <div className="mt-1 text-sm text-[#8A8694]">{formatDate(lead.createdAt)}</div>
                </div>
                <StatusPill>{leadStatusLabels[lead.status]}</StatusPill>
              </div>
              <form action={updateLeadStatusAction} className="mt-3 flex flex-wrap gap-2">
                <input type="hidden" name="leadId" value={lead.id} />
                <Select name="status" defaultValue={lead.status}>
                  <SelectTrigger className="h-10 min-w-[190px] py-0">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(leadStatusLabels).map(([value, label]) => (
                      <SelectItem key={value} value={value}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button size="sm" className="bg-[#16151D] hover:bg-[#2B2933]">Shrani status</Button>
              </form>
            </div>
          ))}
        </div>
      </Panel>
    </DashboardShell>
  );
}
