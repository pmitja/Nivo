import Link from "next/link";
import { DashboardShell, EmptyState, Panel, StatCard, StatusPill } from "@/components/dashboard/dashboard-shell";
import { getAdminOverview } from "@/lib/dashboard-data";
import { formatCurrency, formatDate, leadStatusLabels } from "@/lib/labels";
import { requireSuperAdmin } from "@/lib/auth";

export default async function AdminOverviewPage() {
  const user = await requireSuperAdmin();
  const data = await getAdminOverview();

  return (
    <DashboardShell user={user} mode="admin" title="Pregled" subtitle="Operativni pregled platforme Obrtio.">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Aktivne stranke" value={data.activeCompanies} helper={`${data.newCompanies} novih ta mesec`} tone="green" />
        <StatCard label="MRR" value={formatCurrency(data.mrr)} helper="Osnovni paket 99 €/mesec" />
        <StatCard label="Nova povpraševanja" value={data.newLeads} helper="Čakajo na odziv" tone="amber" />
        <StatCard label="Odprti zahtevki" value={data.openRequests} helper="Spremembe spletnih strani" />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.1fr_.9fr]">
        <Panel
          title="Zadnja povpraševanja"
          action={<Link href="/admin/povprasevanja" className="text-sm font-extrabold text-[#6A5AE0]">Vsa povpraševanja</Link>}
        >
          <div className="grid gap-3">
            {data.recentLeads.length ? (
              data.recentLeads.map((lead) => (
                <div key={lead.id} className="grid gap-3 rounded-[14px] border border-[#EEEAF5] p-4 md:grid-cols-[1fr_auto]">
                  <div>
                    <div className="font-extrabold">{lead.name} · {lead.service}</div>
                    <div className="mt-1 text-sm font-semibold text-[#777382]">{lead.companyName} · {formatDate(lead.createdAt)}</div>
                  </div>
                  <StatusPill>{leadStatusLabels[lead.status]}</StatusPill>
                </div>
              ))
            ) : (
              <EmptyState text="Ni še povpraševanj." />
            )}
          </div>
        </Panel>

        <Panel
          title="Zadnje stranke"
          action={<Link href="/admin/stranke" className="text-sm font-extrabold text-[#6A5AE0]">Uredi stranke</Link>}
        >
          <div className="grid gap-3">
            {data.recentCompanies.length ? (
              data.recentCompanies.map((company) => (
                <div key={company.id} className="rounded-[14px] border border-[#EEEAF5] p-4">
                  <div className="font-extrabold">{company.name}</div>
                  <div className="mt-1 text-sm font-semibold text-[#777382]">{company.contactName} · {company.city || "Lokacija ni vpisana"}</div>
                </div>
              ))
            ) : (
              <EmptyState text="Dodajte prvo stranko." />
            )}
          </div>
        </Panel>
      </div>
    </DashboardShell>
  );
}
