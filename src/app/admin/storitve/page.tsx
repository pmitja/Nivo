import { DashboardShell, Panel, StatusPill } from "@/components/dashboard/dashboard-shell";
import { requireSuperAdmin } from "@/lib/auth";
import { getAdminServices } from "@/lib/dashboard-data";
import { formatCurrency } from "@/lib/labels";

export default async function AdminServicesPage() {
  const user = await requireSuperAdmin();
  const services = await getAdminServices();

  return (
    <DashboardShell user={user} mode="admin" title="Storitve" subtitle="Paket, dodatki in enkratne storitve po strankah.">
      <Panel title="Aktivne in naročene storitve">
        <div className="grid gap-3">
          {services.map((service) => (
            <div key={service.id} className="flex flex-wrap items-center justify-between gap-3 rounded-[14px] border border-[#EEEAF5] p-4">
              <div>
                <div className="font-extrabold">{service.name}</div>
                <div className="mt-1 text-sm font-semibold text-[#777382]">{service.companyName} · {service.billingType === "monthly" ? "mesečno" : "enkratno"}</div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-sm font-extrabold">{service.price ? formatCurrency(Number(service.price)) : "Po ponudbi"}</div>
                <StatusPill>{service.status}</StatusPill>
              </div>
            </div>
          ))}
        </div>
      </Panel>
    </DashboardShell>
  );
}
