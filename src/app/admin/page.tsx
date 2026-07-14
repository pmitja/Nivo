import Link from "next/link";
import { ArrowRight, Building2, CircleAlert, FileText, Plus, ReceiptText, WalletCards } from "lucide-react";
import { DashboardLink, DashboardShell, EmptyState, Panel, StatCard, StatusPill } from "@/components/dashboard/dashboard-shell";
import { getAdminOverview } from "@/lib/dashboard-data";
import { formatCurrency, formatDate, leadStatusLabels } from "@/lib/labels";
import { requireSuperAdmin } from "@/lib/auth";

export default async function AdminOverviewPage() {
  const user = await requireSuperAdmin(); const data = await getAdminOverview();
  return <DashboardShell user={user} mode="admin" title="Operativni pregled" subtitle="Najpomembnejše številke in opravila platforme Obrtio">
    <div className="mb-6 flex flex-wrap gap-2"><Link href="/admin/stranke" className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#6252D6] px-4 text-sm font-bold text-white shadow-[0_6px_16px_rgba(98,82,214,.2)] transition hover:bg-[#5142BE] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#6A5AE0]/20"><Plus className="h-4 w-4" />Dodaj stranko</Link><Link href="/admin/zahtevki" className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-[#E0E2E6] bg-white px-4 text-sm font-bold text-[#34363C] transition hover:bg-[#F9F9FA] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#6A5AE0]/15"><CircleAlert className="h-4 w-4" />Odprti zahtevki</Link></div>
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard label="Aktivne stranke" value={data.activeCompanies} helper={`${data.newCompanies} novih ta mesec`} tone="green" icon={Building2} />
      <StatCard label="Mesečni prihodek" value={formatCurrency(data.mrr)} helper="Aktivne mesečne naročnine" icon={WalletCards} />
      <StatCard label="Nova povpraševanja" value={data.newClientLeads + data.newInquiries} helper={`${data.newInquiries} posvetov · ${data.newClientLeads} pri naročnikih`} tone="amber" icon={FileText} />
      <StatCard label="Odprti zahtevki" value={data.openRequests} helper="Spremembe spletnih strani" tone={data.openRequests ? "red" : "default"} icon={ReceiptText} />
    </div>
    <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_minmax(320px,.75fr)]">
      <Panel title="Zadnji posveti" eyebrow="Oddaje z obrtio.si" action={<DashboardLink href="/admin/povprasevanja">Poglej vse</DashboardLink>}>
        <div className="divide-y divide-[#ECEDEF]">{data.recentInquiries.length ? data.recentInquiries.map((inquiry) => <Link href="/admin/povprasevanja" key={inquiry.id} className="group -mx-2 grid min-h-[76px] items-center gap-3 rounded-xl px-2 py-3 transition hover:bg-[#FAFAFB] sm:grid-cols-[minmax(0,1fr)_auto_auto]"><div className="min-w-0"><div className="truncate text-sm font-bold">{inquiry.name}</div><div className="mt-1 truncate text-[13px] text-[#777A83]">{inquiry.service || "Brezplačni posvet"}</div></div><div className="text-xs text-[#8A8D95]">{formatDate(inquiry.createdAt)}</div><div className="flex items-center gap-2"><StatusPill>{leadStatusLabels[inquiry.status]}</StatusPill><ArrowRight className="h-4 w-4 text-[#A0A3AA] transition group-hover:translate-x-0.5" /></div></Link>) : <EmptyState text="Ni še posvetov." />}</div>
      </Panel>
      <Panel title="Nove stranke" eyebrow="Zadnje dodane" action={<DashboardLink href="/admin/stranke">Upravljaj</DashboardLink>}>
        <div className="divide-y divide-[#ECEDEF]">{data.recentCompanies.length ? data.recentCompanies.map((company) => <Link href={`/admin/stranke/${company.id}`} key={company.id} className="group -mx-2 flex min-h-[68px] items-center gap-3 rounded-xl px-2 py-3 transition hover:bg-[#FAFAFB]"><div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#F1EFFE] text-xs font-bold text-[#6252D6]">{company.name.slice(0,2).toUpperCase()}</div><div className="min-w-0 flex-1"><div className="truncate text-[13px] font-bold">{company.name}</div><div className="mt-0.5 truncate text-xs text-[#777A83]">{company.contactName} · {company.city || "Brez lokacije"}</div></div><ArrowRight className="h-4 w-4 text-[#A0A3AA] transition group-hover:translate-x-0.5" /></Link>) : <EmptyState text="Dodajte prvo stranko." />}</div>
      </Panel>
    </div>
  </DashboardShell>;
}
