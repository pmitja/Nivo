import { DashboardShell, Panel } from "@/components/dashboard/dashboard-shell";
import { requireSuperAdmin } from "@/lib/auth";

export default async function AdminSettingsPage() {
  const user = await requireSuperAdmin();

  return (
    <DashboardShell user={user} mode="admin" title="Nastavitve" subtitle="Sistemski pregled za MVP.">
      <div className="grid gap-6 xl:grid-cols-2">
        <Panel title="Sistemske nastavitve">
          <div className="grid gap-3">
            <Info label="Baza" value="Neon PostgreSQL" />
            <Info label="Hosting" value="Railway" />
            <Info label="Aplikacija" value="Next.js + Drizzle ORM + Tailwind" />
            <Info label="SMS provider" value={process.env.SMS_PROVIDER || "mvp_stub"} />
          </div>
        </Panel>
        <Panel title="MVP pravila">
          <div className="grid gap-3 text-sm font-semibold leading-6 text-[#686473]">
            <p>Client uporabnik vidi samo zapise svojega podjetja.</p>
            <p>Super Admin lahko vidi vse stranke, povpraševanja, obrazce, SMS-e, zahtevke in storitve.</p>
            <p>AI pomočnik je označen kot »Pride kmalu« in trenutno ni aktivna funkcija.</p>
          </div>
        </Panel>
      </div>
    </DashboardShell>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[14px] border border-[#EEEAF5] p-4">
      <div className="text-xs font-extrabold uppercase tracking-[.08em] text-[#9A96A5]">{label}</div>
      <div className="mt-1 font-extrabold">{value}</div>
    </div>
  );
}
