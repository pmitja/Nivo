import { DashboardShell, EmptyState, Panel, StatCard, StatusPill } from "@/components/dashboard/dashboard-shell";
import { requireClientUser } from "@/lib/auth";
import { getClientOverview, getCompany } from "@/lib/dashboard-data";
import { formatDate, leadStatusLabels, websiteRequestStatusLabels } from "@/lib/labels";

export default async function ClientDashboardPage() {
  const user = await requireClientUser();
  const [company, data] = await Promise.all([getCompany(user.companyId!), getClientOverview(user.companyId!)]);

  return (
    <DashboardShell user={user} mode="client" title="Pregled" subtitle={company?.name ?? "Vaše podjetje"}>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Nova povpraševanja" value={data.newLeads} helper="Za hiter odziv" tone="amber" />
        <StatCard label="Neodgovorjena povpraševanja" value={data.openLeads} helper="Novo, kontaktirano ali ponudba" />
        <StatCard label="Poslani SMS-i" value={data.smsCount} helper="Skupaj v sistemu" />
        <StatCard label="Google ocene" value={data.reviewCount} helper="Poslane zahteve" tone="green" />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.05fr_.95fr]">
        <Panel title="Zadnja povpraševanja">
          <div className="grid gap-3">
            {data.recentLeads.length ? (
              data.recentLeads.map((lead) => (
                <div key={lead.id} className="rounded-[14px] border border-[#EEEAF5] p-4">
                  <div className="flex flex-wrap justify-between gap-3">
                    <div>
                      <div className="font-extrabold">{lead.name} · {lead.service}</div>
                      <div className="mt-1 text-sm font-semibold text-[#777382]">{lead.phone} · {lead.location || "Brez lokacije"} · {formatDate(lead.createdAt)}</div>
                    </div>
                    <StatusPill>{leadStatusLabels[lead.status]}</StatusPill>
                  </div>
                </div>
              ))
            ) : (
              <EmptyState text="Ko pride prvo povpraševanje, bo prikazano tukaj." />
            )}
          </div>
        </Panel>

        <Panel title="Priporočena opravila">
          <div className="grid gap-3">
            {!company?.googleReviewUrl ? (
              <div className="rounded-[14px] border border-[#EEEAF5] p-4">
                <div className="font-extrabold">Dodajte Google review povezavo</div>
                <p className="mt-1 text-sm text-[#777382]">Tako boste lahko pošiljali zahteve za ocene.</p>
              </div>
            ) : null}
            {data.requests.map((request) => (
              <div key={request.id} className="rounded-[14px] border border-[#EEEAF5] p-4">
                <div className="font-extrabold">{request.title}</div>
                <div className="mt-1 text-sm font-semibold text-[#777382]">{websiteRequestStatusLabels[request.status]}</div>
              </div>
            ))}
            {company?.googleReviewUrl && data.requests.length === 0 ? <EmptyState text="Ni odprtih priporočil." /> : null}
          </div>
        </Panel>
      </div>
    </DashboardShell>
  );
}
