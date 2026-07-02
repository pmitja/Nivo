import { updateLeadStatusAction } from "@/app/actions";
import { DashboardShell, Panel, StatusPill } from "@/components/dashboard/dashboard-shell";
import { PaginationFooter } from "@/components/dashboard/pagination-footer";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { requireSuperAdmin } from "@/lib/auth";
import { getAdminLeadsPage } from "@/lib/dashboard-data";
import { formatDate, leadStatusLabels } from "@/lib/labels";

export default async function AdminLeadsPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const user = await requireSuperAdmin();
  const params = await searchParams;
  const page = Number(params.page ?? "1");
  const data = await getAdminLeadsPage(Number.isFinite(page) ? page : 1);

  return (
    <DashboardShell user={user} mode="admin" title="Povpraševanja" subtitle="Vsa povpraševanja vseh strank.">
      <Panel title="Povpraševanja">
        <div className="grid gap-3">
          {data.leads.map((lead) => (
            <div key={lead.id} className="rounded-[14px] border border-[#EEEAF5] p-4">
              <div className="flex flex-wrap justify-between gap-3">
                <div>
                  <div className="font-extrabold">{lead.name} · {lead.service}</div>
                  <div className="mt-1 text-sm font-semibold text-[#777382]">{lead.companyName} · {lead.phone} · {lead.location || "Brez lokacije"}</div>
                  <div className="mt-1 text-sm text-[#8A8694]">{formatDate(lead.createdAt)}</div>
                </div>
                <StatusPill>{leadStatusLabels[lead.status]}</StatusPill>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <form action={updateLeadStatusAction} className="flex flex-wrap gap-2">
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
              <p className="mt-3 text-sm leading-6 text-[#55515F]">{lead.message}</p>
              {lead.attachmentUrl ? (
                <a
                  href={lead.attachmentUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 inline-flex items-center gap-2 rounded-[11px] border border-[#E2DFEA] px-3 py-2 text-sm font-extrabold text-[#16151D]"
                >
                  📎 {lead.attachmentName || "Priloga"}
                </a>
              ) : null}
              <div className="mt-4 rounded-[14px] border border-[#EEEAF5] bg-[#FBFAFF] p-4 text-sm font-semibold text-[#686473]">
                AI povzetki in osnutki ponudb: <span className="font-extrabold text-[#6A5AE0]">pride kmalu</span>
              </div>
            </div>
          ))}
        </div>
        <PaginationFooter
          page={data.page}
          pageCount={data.pageCount}
          pageSize={data.pageSize}
          total={data.total}
          basePath="/admin/povprasevanja"
        />
      </Panel>
    </DashboardShell>
  );
}
