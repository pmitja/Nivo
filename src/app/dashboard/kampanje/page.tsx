import { Megaphone } from "lucide-react";
import { DashboardShell, Panel } from "@/components/dashboard/dashboard-shell";
import { Badge } from "@/components/ui/badge";
import { requireClientUser } from "@/lib/auth";

export default async function ClientCampaignsPage() {
  const user = await requireClientUser();
  return (
    <DashboardShell user={user} mode="client" title="Kampanje" subtitle="Orodja za akcije in kampanje prihajajo v drugi fazi.">
      <Panel title="Pride kmalu">
        <div className="flex max-w-2xl items-start gap-4 rounded-[18px] bg-[#F7F5FF] p-5">
          <Megaphone className="mt-1 h-6 w-6 text-[#6A5AE0]" />
          <div>
            <Badge>Pride kmalu</Badge>
            <h2 className="mt-3 text-lg font-extrabold">Kampanje pripravljamo</h2>
            <p className="mt-2 leading-7 text-[#65616F]">Ko bo funkcija pripravljena, boste tukaj videli akcije, potrditve in rezultate.</p>
          </div>
        </div>
      </Panel>
    </DashboardShell>
  );
}
