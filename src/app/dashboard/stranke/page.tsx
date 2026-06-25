import { CustomerStatusBoard } from "@/components/dashboard/customer-status-board";
import { DashboardShell, Panel } from "@/components/dashboard/dashboard-shell";
import { requireClientUser } from "@/lib/auth";
import { getClientCustomerBoard } from "@/lib/dashboard-data";

export default async function ClientCustomersPage() {
  const user = await requireClientUser();
  const customers = await getClientCustomerBoard(user.companyId!);

  return (
    <DashboardShell user={user} mode="client" title="Stranke" subtitle="Osnovni CRM za kontakte in zgodovino.">
      <Panel title="Stranke po statusu">
        <CustomerStatusBoard customers={customers} />
      </Panel>
    </DashboardShell>
  );
}
