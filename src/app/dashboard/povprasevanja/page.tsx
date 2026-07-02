import { AddLeadDialog } from "@/components/dashboard/add-lead-dialog";
import { DashboardShell, Panel } from "@/components/dashboard/dashboard-shell";
import { LeadsList } from "@/components/dashboard/leads-list";
import { PaginationFooter } from "@/components/dashboard/pagination-footer";
import { requireClientUser } from "@/lib/auth";
import { getClientLeadsPage, getSentReviewRequestLeadIds } from "@/lib/dashboard-data";

export default async function ClientLeadsPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const user = await requireClientUser();
  const params = await searchParams;
  const page = Number(params.page ?? "1");
  const [data, sentReviewLeadIds] = await Promise.all([
    getClientLeadsPage(user.companyId!, "new", Number.isFinite(page) ? page : 1),
    getSentReviewRequestLeadIds(user.companyId!),
  ]);

  return (
    <DashboardShell user={user} mode="client" title="Povpraševanja" subtitle="Nova povpraševanja, ki še čakajo na obravnavo.">
      <Panel title="Nova povpraševanja" action={<AddLeadDialog />}>
        <LeadsList leads={data.leads} sentReviewLeadIds={sentReviewLeadIds} emptyText="Novih povpraševanj ni." />
        <PaginationFooter
          page={data.page}
          pageCount={data.pageCount}
          pageSize={data.pageSize}
          total={data.total}
          basePath="/dashboard/povprasevanja"
        />
      </Panel>
    </DashboardShell>
  );
}
