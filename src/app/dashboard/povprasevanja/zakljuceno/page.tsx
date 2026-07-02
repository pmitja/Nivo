import { DashboardShell, Panel } from "@/components/dashboard/dashboard-shell";
import { LeadsList } from "@/components/dashboard/leads-list";
import { PaginationFooter } from "@/components/dashboard/pagination-footer";
import { requireClientUser } from "@/lib/auth";
import { getClientLeadsPage, getSentReviewRequestLeadIds } from "@/lib/dashboard-data";

export default async function CompletedLeadsPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const user = await requireClientUser();
  const params = await searchParams;
  const page = Number(params.page ?? "1");
  const [data, sentReviewLeadIds] = await Promise.all([
    getClientLeadsPage(user.companyId!, "completed", Number.isFinite(page) ? page : 1),
    getSentReviewRequestLeadIds(user.companyId!),
  ]);

  return (
    <DashboardShell user={user} mode="client" title="Zaključeno" subtitle="Zaključena povpraševanja in opravljena dela.">
      <Panel title="Zaključeno">
        <LeadsList leads={data.leads} sentReviewLeadIds={sentReviewLeadIds} emptyText="Ni zaključenih povpraševanj." />
        <PaginationFooter
          page={data.page}
          pageCount={data.pageCount}
          pageSize={data.pageSize}
          total={data.total}
          basePath="/dashboard/povprasevanja/zakljuceno"
        />
      </Panel>
    </DashboardShell>
  );
}
