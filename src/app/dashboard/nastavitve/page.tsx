import { DashboardShell, Panel } from "@/components/dashboard/dashboard-shell";
import { ChangePasswordForm } from "@/components/dashboard/change-password-form";
import { requireClientUser } from "@/lib/auth";
import { getCompany } from "@/lib/dashboard-data";

export default async function ClientSettingsPage() {
  const user = await requireClientUser();
  const company = await getCompany(user.companyId!);

  return (
    <DashboardShell user={user} mode="client" title="Nastavitve" subtitle="Podatki podjetja in osnovne nastavitve.">
      <div className="grid gap-6 xl:grid-cols-[1.1fr_.9fr]">
        <Panel title="Podatki podjetja">
          <div className="grid gap-4 md:grid-cols-2">
            <Info label="Podjetje" value={company?.name} />
            <Info label="Kontaktna oseba" value={company?.contactName} />
            <Info label="Email" value={company?.email} />
            <Info label="Telefon" value={company?.phone} />
            <Info label="Naslov" value={company?.address} />
            <Info label="Kraj" value={company?.city} />
            <Info label="Google review povezava" value={company?.googleReviewUrl} />
            <Info label="Domena" value={company?.domain} />
          </div>
          <p className="mt-5 rounded-[14px] bg-[#FBFAFF] p-4 text-sm font-semibold leading-6 text-[#666271]">
            Cene paketa, aktivne storitve, plačila in sistemske nastavitve ureja ekipa Nivo.
          </p>
        </Panel>
        <Panel title="Varnost prijave">
          <ChangePasswordForm />
        </Panel>
      </div>
    </DashboardShell>
  );
}

function Info({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="rounded-[14px] border border-[#EEEAF5] p-4">
      <div className="text-xs font-extrabold uppercase tracking-[.08em] text-[#9A96A5]">{label}</div>
      <div className="mt-1 font-extrabold">{value || "Ni vpisano"}</div>
    </div>
  );
}
