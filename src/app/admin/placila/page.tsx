import { DashboardShell, EmptyState, Panel, StatCard, StatusPill } from "@/components/dashboard/dashboard-shell";
import { PaginationFooter } from "@/components/dashboard/pagination-footer";
import { requireSuperAdmin } from "@/lib/auth";
import { getAdminBillingOverview } from "@/lib/dashboard-data";
import { formatCurrency, formatDate } from "@/lib/labels";

const PAGE_SIZE = 5;

export default async function AdminBillingPage({
  searchParams,
}: {
  searchParams: Promise<{ payingPage?: string; servicesPage?: string }>;
}) {
  const user = await requireSuperAdmin();
  const params = await searchParams;
  const data = await getAdminBillingOverview();

  const payingPageRaw = Number(params.payingPage ?? "1");
  const payingPage = Math.max(1, Number.isFinite(payingPageRaw) ? payingPageRaw : 1);
  const payingPageCount = Math.max(1, Math.ceil(data.waitingForPayment.length / PAGE_SIZE));
  const waitingForPaymentPage = data.waitingForPayment.slice((payingPage - 1) * PAGE_SIZE, payingPage * PAGE_SIZE);

  const servicesPageRaw = Number(params.servicesPage ?? "1");
  const servicesPage = Math.max(1, Number.isFinite(servicesPageRaw) ? servicesPageRaw : 1);
  const servicesPageCount = Math.max(1, Math.ceil(data.services.length / PAGE_SIZE));
  const servicesPage_ = data.services.slice((servicesPage - 1) * PAGE_SIZE, servicesPage * PAGE_SIZE);

  return (
    <DashboardShell user={user} mode="admin" title="Plačila" subtitle="Osnovni pregled MRR, storitev in strank, ki čakajo na plačilo.">
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label="MRR" value={formatCurrency(data.mrr)} helper="Aktivne mesečne storitve" tone="green" />
        <StatCard label="Aktivne stranke" value={data.activeCompanies} helper="Status aktivna" />
        <StatCard label="Čaka na plačilo" value={data.waitingForPayment.length} helper="Stranke za preverjanje" tone="amber" />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[.85fr_1.15fr]">
        <Panel title="Čaka na plačilo">
          <div className="grid gap-2">
            {waitingForPaymentPage.length ? waitingForPaymentPage.map((company) => (
              <div key={company.id} className="rounded-[14px] border border-[#EEEAF5] px-4 py-3">
                <div className="font-extrabold">{company.name}</div>
                <div className="mt-1 text-sm font-semibold text-[#777382]">{company.email} · {company.phone}</div>
              </div>
            )) : <EmptyState text="Trenutno ni strank, ki čakajo na plačilo." />}
          </div>
          <PaginationFooter
            page={payingPage}
            pageCount={payingPageCount}
            pageSize={PAGE_SIZE}
            total={data.waitingForPayment.length}
            basePath="/admin/placila"
            pageParam="payingPage"
            extraParams={{ servicesPage }}
          />
        </Panel>

        <Panel title="Storitve in cene">
          <div className="grid gap-2">
            {servicesPage_.map((service) => (
              <div key={service.id} className="grid gap-3 rounded-[14px] border border-[#EEEAF5] px-4 py-3 md:grid-cols-[1fr_auto_auto] md:items-center">
                <div>
                  <div className="text-sm font-extrabold">{service.name}</div>
                  <div className="mt-1 text-xs font-semibold text-[#777382]">{service.companyName} · {service.startedAt ? formatDate(service.startedAt) : "Brez datuma"}</div>
                </div>
                <div className="text-sm font-extrabold">{service.price ? formatCurrency(Number(service.price)) : "Po ponudbi"}</div>
                <StatusPill>{service.status}</StatusPill>
              </div>
            ))}
          </div>
          <PaginationFooter
            page={servicesPage}
            pageCount={servicesPageCount}
            pageSize={PAGE_SIZE}
            total={data.services.length}
            basePath="/admin/placila"
            pageParam="servicesPage"
            extraParams={{ payingPage }}
          />
        </Panel>
      </div>
    </DashboardShell>
  );
}
