import { DashboardShell, EmptyState, Panel } from "@/components/dashboard/dashboard-shell";
import { ChangePasswordForm } from "@/components/dashboard/change-password-form";
import { CompanySettingsForm } from "@/components/dashboard/company-settings-form";
import { Button } from "@/components/ui/button";
import { requireClientUser } from "@/lib/auth";
import { getClientCompanyDocuments, getCompany } from "@/lib/dashboard-data";
import { formatDate } from "@/lib/labels";

export default async function ClientSettingsPage() {
  const user = await requireClientUser();
  const [company, documents] = await Promise.all([
    getCompany(user.companyId!),
    getClientCompanyDocuments(user.companyId!),
  ]);

  return (
    <DashboardShell user={user} mode="client" title="Nastavitve" subtitle="Podatki podjetja in osnovne nastavitve.">
      <div className="grid gap-6 xl:grid-cols-[1.1fr_.9fr]">
        <Panel title="Podatki podjetja">
          {company ? <CompanySettingsForm company={company} /> : null}
          <p className="mt-5 rounded-[14px] bg-[#FBFAFF] p-4 text-sm font-semibold leading-6 text-[#666271]">
            Cene paketa, aktivne storitve, plačila in sistemske nastavitve ureja ekipa Nivo.
          </p>
        </Panel>
        <Panel title="Sistemski podatki">
          <div className="grid gap-4">
            <div className="rounded-[14px] border border-[#EEEAF5] p-4">
              <div className="text-xs font-extrabold uppercase tracking-[.08em] text-[#9A96A5]">Logo podjetja</div>
              {company?.logoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={company.logoUrl}
                  alt={`Logo podjetja ${company.name}`}
                  className="mt-3 max-h-20 max-w-48 rounded-[10px] object-contain"
                />
              ) : (
                <div className="mt-1 font-extrabold">Ni dodan</div>
              )}
            </div>
            <Info label="Podjetje" value={company?.name} />
            <Info label="Domena" value={company?.domain} />
            <Info label="Status spletne strani" value={company?.websiteStatus} />
            <Info label="Google Business Profil" value={company?.googleBusinessProfileStatus} />
            <Info label="SEO" value={company?.seoStatus} />
            <Info label="Oglaševanje" value={company?.advertisingStatus} />
          </div>
        </Panel>
        <Panel title="Varnost prijave">
          <ChangePasswordForm />
        </Panel>
        <Panel title="Dokumenti podjetja">
          <div className="grid gap-2">
            {documents.length ? (
              documents.map((document) => (
                <div key={document.id} className="grid gap-3 rounded-[14px] border border-[#EEEAF5] px-4 py-3 md:grid-cols-[1fr_auto] md:items-center">
                  <div>
                    <div className="text-sm font-extrabold">{document.title}</div>
                    <div className="mt-1 text-xs font-semibold text-[#777382]">
                      {document.fileName} · {formatFileSize(document.fileSize)} · {formatDate(document.createdAt)}
                    </div>
                    {document.notes ? <p className="mt-2 text-sm leading-5 text-[#5F5B68]">{document.notes}</p> : null}
                  </div>
                  <Button asChild size="sm" variant="secondary">
                    <a href={document.fileUrl} target="_blank" rel="noreferrer">
                      Odpri
                    </a>
                  </Button>
                </div>
              ))
            ) : (
              <EmptyState text="Dokumenti še niso dodani." />
            )}
          </div>
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

function formatFileSize(size: number) {
  if (size < 1024 * 1024) {
    return `${Math.max(1, Math.round(size / 1024))} KB`;
  }

  return `${(size / 1024 / 1024).toFixed(1)} MB`;
}
