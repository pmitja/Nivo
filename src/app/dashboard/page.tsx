import Link from "next/link";
import { ArrowRight, BarChart3, FileText, MessageSquareText, Plus, Star, Users } from "lucide-react";
import { DashboardLink, DashboardShell, EmptyState, Panel, StatCard, StatusPill } from "@/components/dashboard/dashboard-shell";
import { requireClientUser } from "@/lib/auth";
import { getClientOverview, getCompany } from "@/lib/dashboard-data";
import { formatDate, leadStatusLabels, websiteRequestStatusLabels } from "@/lib/labels";

export default async function ClientDashboardPage() {
  const user = await requireClientUser();
  const [company, data] = await Promise.all([getCompany(user.companyId!), getClientOverview(user.companyId!)]);
  return <DashboardShell user={user} mode="client" title={`Pozdravljeni, ${user.name.split(" ")[0]}`} subtitle={`${company?.name ?? "Vaše podjetje"} · pregled rezultatov in naslednjih korakov`}>
    <div className="mb-6 flex flex-wrap gap-2">
      <Link href="/dashboard/povprasevanja" className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#6252D6] px-4 text-sm font-bold text-white shadow-[0_6px_16px_rgba(98,82,214,.2)] transition hover:bg-[#5142BE] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#6A5AE0]/20"><FileText className="h-4 w-4" />Odpri povpraševanja</Link>
      <Link href="/dashboard/google-ocene" className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-[#E0E2E6] bg-white px-4 text-sm font-bold text-[#34363C] transition hover:bg-[#F9F9FA] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#6A5AE0]/15"><Star className="h-4 w-4" />Prosi za oceno</Link>
    </div>
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard label="Nova povpraševanja" value={data.newLeads} helper="Čakajo na vaš prvi odziv" tone="amber" icon={FileText} />
      <StatCard label="Odprte priložnosti" value={data.openLeads} helper="V obravnavi ali s ponudbo" icon={Users} />
      <StatCard label="Obiski spletne strani" value={data.visits} helper="V zadnjih 30 dneh" tone="green" icon={BarChart3} />
      <StatCard label="Zahteve za Google oceno" value={data.reviewCount} helper="Skupaj poslanih zahtev" icon={Star} />
    </div>
    <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_minmax(300px,.75fr)]">
      <Panel title="Zadnja povpraševanja" eyebrow="Zahteva vaš odziv" action={<DashboardLink href="/dashboard/povprasevanja">Poglej vsa</DashboardLink>}>
        <div className="divide-y divide-[#ECEDEF]">
          {data.recentLeads.length ? data.recentLeads.map((lead) => <Link href="/dashboard/povprasevanja" key={lead.id} className="group -mx-2 grid min-h-[76px] items-center gap-3 rounded-xl px-2 py-3 transition hover:bg-[#FAFAFB] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#6A5AE0]/15 sm:grid-cols-[minmax(0,1fr)_auto_auto]">
            <div className="min-w-0"><div className="truncate text-sm font-bold text-[#24262B]">{lead.name}</div><div className="mt-1 truncate text-[13px] text-[#777A83]">{lead.service} · {lead.location || "Brez lokacije"}</div></div>
            <div className="text-xs text-[#8A8D95]">{formatDate(lead.createdAt)}</div><div className="flex items-center gap-2"><StatusPill>{leadStatusLabels[lead.status]}</StatusPill><ArrowRight className="h-4 w-4 text-[#A0A3AA] transition group-hover:translate-x-0.5" /></div>
          </Link>) : <EmptyState text="Ko pride prvo povpraševanje, bo prikazano tukaj." />}
        </div>
      </Panel>
      <div className="grid content-start gap-6">
        <Panel title="Naslednji koraki" eyebrow="Priporočeno">
          <div className="grid gap-2">
            {!company?.googleReviewUrl ? <Link href="/dashboard/nastavitve" className="group flex items-start gap-3 rounded-xl bg-[#FFF8E9] p-3.5 transition hover:bg-[#FFF4DA]"><div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-[#A96100]"><Star className="h-4 w-4" /></div><div className="min-w-0"><div className="text-[13px] font-bold">Dodajte Google povezavo</div><p className="mt-0.5 text-xs leading-5 text-[#777A83]">Omogočite pošiljanje zahtev za ocene.</p></div><ArrowRight className="ml-auto mt-2 h-4 w-4 text-[#A0A3AA] transition group-hover:translate-x-0.5" /></Link> : null}
            {data.requests.map((request) => <Link href="/dashboard/spletna-stran" key={request.id} className="group flex items-center gap-3 rounded-xl border border-[#ECEDEF] p-3.5 transition hover:bg-[#FAFAFB]"><div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#F1EFFE] text-[#6252D6]"><MessageSquareText className="h-4 w-4" /></div><div className="min-w-0 flex-1"><div className="truncate text-[13px] font-bold">{request.title}</div><div className="mt-0.5 text-xs text-[#777A83]">{websiteRequestStatusLabels[request.status]}</div></div><ArrowRight className="h-4 w-4 text-[#A0A3AA]" /></Link>)}
            {company?.googleReviewUrl && data.requests.length === 0 ? <EmptyState text="Trenutno ni odprtih opravil." /> : null}
          </div>
        </Panel>
        <Link href="/dashboard/spletna-stran" className="group flex items-center justify-between rounded-2xl bg-[#1D1E23] p-5 text-white shadow-[0_8px_24px_rgba(20,20,25,.12)]"><div><div className="text-sm font-bold">Sprememba na spletni strani?</div><p className="mt-1 text-xs text-white/60">Pošljite zahtevek naši ekipi.</p></div><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 transition group-hover:bg-white/15"><Plus className="h-5 w-5" /></div></Link>
      </div>
    </div>
  </DashboardShell>;
}
