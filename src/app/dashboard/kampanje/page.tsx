import { Megaphone } from "lucide-react";
import { DashboardShell, Panel } from "@/components/dashboard/dashboard-shell";
import { Badge } from "@/components/ui/badge";
import { requireClientUser } from "@/lib/auth";

export default async function ClientCampaignsPage() {
  const user = await requireClientUser();
  return (
    <DashboardShell user={user} mode="client" title="Campaigns" subtitle="Campaign tools are coming in the next phase.">
      <Panel title="Coming soon">
        <div className="flex max-w-2xl items-start gap-4 rounded-[18px] bg-[#F7F5FF] p-5">
          <Megaphone className="mt-1 h-6 w-6 text-[#6A5AE0]" />
          <div>
            <Badge>Coming soon</Badge>
            <h2 className="mt-3 text-lg font-extrabold">Campaigns are on the way</h2>
            <p className="mt-2 leading-7 text-[#65616F]">When this feature is ready, you will see campaigns, approvals and results here.</p>
          </div>
        </div>
      </Panel>
    </DashboardShell>
  );
}
