import { Megaphone } from "lucide-react";
import { DashboardShell, Panel } from "@/components/dashboard/dashboard-shell";
import { Badge } from "@/components/ui/badge";
import { requireSuperAdmin } from "@/lib/auth";

export default async function AdminCampaignsPage() {
  const user = await requireSuperAdmin();
  return (
    <DashboardShell user={user} mode="admin" title="Kampanje" subtitle="Kampanje bodo na voljo v drugi fazi produkta.">
      <Panel title="Pride kmalu">
        <div className="flex max-w-2xl items-start gap-4 rounded-[18px] bg-[#F7F5FF] p-5">
          <Megaphone className="mt-1 h-6 w-6 text-[#6A5AE0]" />
          <div>
            <Badge>Pride kmalu</Badge>
            <h2 className="mt-3 text-lg font-extrabold">Kampanje so del druge faze</h2>
            <p className="mt-2 leading-7 text-[#65616F]">Najprej gradimo spletne strani, obrazce za povpraševanja in zanesljiv pregled novih strank.</p>
          </div>
        </div>
      </Panel>
    </DashboardShell>
  );
}
