import { DashboardShell, EmptyState, Panel } from "@/components/dashboard/dashboard-shell";
import { ChangePasswordForm } from "@/components/dashboard/change-password-form";
import { CompanySettingsForm } from "@/components/dashboard/company-settings-form";
import { Button } from "@/components/ui/button";
import { requireClientUser } from "@/lib/auth";
import { getClientCompanyDocuments, getCompany } from "@/lib/dashboard-data";
import { formatDate } from "@/lib/labels-en";

export default async function ClientSettingsPage() {
  const user = await requireClientUser();
  const [company, documents] = await Promise.all([
    getCompany(user.companyId!),
    getClientCompanyDocuments(user.companyId!),
  ]);

  return (
    <DashboardShell user={user} mode="client" title="Settings" subtitle="Company details and account settings.">
      <div className="grid gap-6 xl:grid-cols-[1.1fr_.9fr]">
        <Panel title="Company details">
          {company ? <CompanySettingsForm company={company} /> : null}
          <p className="mt-5 rounded-[14px] bg-[#FBFAFF] p-4 text-sm font-semibold leading-6 text-[#666271]">
            The Obrtio team manages plan pricing, active services, billing and system settings.
          </p>
        </Panel>
        <Panel title="System details">
          <div className="grid gap-4">
            <div className="rounded-[14px] border border-[#EEEAF5] p-4">
              <div className="text-xs font-extrabold uppercase tracking-[.08em] text-[#9A96A5]">Company logo</div>
              {company?.logoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={company.logoUrl}
                  alt={`Company logo ${company.name}`}
                  className="mt-3 max-h-20 max-w-48 rounded-[10px] object-contain"
                />
              ) : (
                <div className="mt-1 font-extrabold">Not added</div>
              )}
            </div>
            <Info label="Company" value={company?.name} />
            <Info label="Domena" value={company?.domain} />
            <Info label="Website status" value={company?.websiteStatus} />
            <Info label="Google Business Profil" value={company?.googleBusinessProfileStatus} />
            <Info label="SEO" value={company?.seoStatus} />
            <Info label="Advertising" value={company?.advertisingStatus} />
          </div>
        </Panel>
        <Panel title="Login security">
          <ChangePasswordForm />
        </Panel>
        <Panel title="Company documents">
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
              <EmptyState text="No documents have been added yet." />
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
      <div className="mt-1 font-extrabold">{value || "Not provided"}</div>
    </div>
  );
}

function formatFileSize(size: number) {
  if (size < 1024 * 1024) {
    return `${Math.max(1, Math.round(size / 1024))} KB`;
  }

  return `${(size / 1024 / 1024).toFixed(1)} MB`;
}
