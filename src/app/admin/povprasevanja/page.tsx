import { AlertCircle, CheckCircle2, Clock3, Mail, Phone } from "lucide-react";
import { updateContactInquiryStatusAction } from "@/app/actions";
import { DashboardShell, EmptyState, Panel, StatusPill } from "@/components/dashboard/dashboard-shell";
import { PaginationFooter } from "@/components/dashboard/pagination-footer";
import { SubmitButton } from "@/components/ui/submit-button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { requireSuperAdmin } from "@/lib/auth";
import { getAdminContactInquiriesPage } from "@/lib/dashboard-data";
import { formatDate, leadStatusLabels } from "@/lib/labels";

export default async function AdminLeadsPage({
  searchParams,
}: {
  searchParams: Promise<{ posvetPage?: string }>;
}) {
  const user = await requireSuperAdmin();
  const params = await searchParams;
  const posvetPage = Number(params.posvetPage ?? "1");
  const contactData = await getAdminContactInquiriesPage(Number.isFinite(posvetPage) ? posvetPage : 1);

  return (
    <DashboardShell
      user={user}
      mode="admin"
      title="Povpraševanja"
      subtitle="Brezplačni posveti, oddani na obrtio.si. Povpraševanja naročnikov vidijo samo oni."
    >
      <Panel title="Brezplačni posveti" eyebrow="obrtio.si/kontakt">
        <div className="grid gap-3">
          {contactData.inquiries.length ? contactData.inquiries.map((inquiry) => (
            <article key={inquiry.id} className="rounded-[14px] border border-[#DED9F5] bg-[#FCFBFF] p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="font-extrabold text-[#28262F]">{inquiry.name}</div>
                  <div className="mt-1 text-sm font-semibold text-[#6F6A7A]">
                    {inquiry.industry || "Panoga ni navedena"} · {formatDate(inquiry.createdAt)}
                  </div>
                </div>
                <StatusPill>{leadStatusLabels[inquiry.status]}</StatusPill>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <a
                  href={`tel:${inquiry.phone}`}
                  className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-[11px] bg-[#16151D] px-4 text-sm font-extrabold text-white transition hover:bg-[#2B2933] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#16151D]/15"
                >
                  <Phone className="h-4 w-4" aria-hidden="true" />
                  {inquiry.phone}
                </a>
                <a
                  href={`mailto:${inquiry.email}`}
                  className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-[11px] border border-[#DDD9E8] bg-white px-4 text-sm font-extrabold text-[#34313C] transition hover:bg-[#F7F5FC] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#6A5AE0]/15"
                >
                  <Mail className="h-4 w-4" aria-hidden="true" />
                  {inquiry.email}
                </a>
              </div>

              {inquiry.message ? (
                <p className="mt-4 max-w-[840px] whitespace-pre-wrap text-sm leading-6 text-[#55515F]">{inquiry.message}</p>
              ) : (
                <p className="mt-4 text-sm font-medium text-[#8A8694]">Sporočilo ni bilo dodano.</p>
              )}

              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-[#EAE6F4] pt-4">
                <div className="inline-flex items-center gap-2 text-xs font-bold text-[#6F6A7A]">
                  {inquiry.confirmationEmailSentAt ? (
                    <><CheckCircle2 className="h-4 w-4 text-[#16805A]" aria-hidden="true" /> Potrditvena e-pošta poslana</>
                  ) : inquiry.confirmationEmailError ? (
                    <><AlertCircle className="h-4 w-4 text-[#B42318]" aria-hidden="true" /> Napaka pri potrditveni e-pošti</>
                  ) : (
                    <><Clock3 className="h-4 w-4 text-[#A96100]" aria-hidden="true" /> Potrditvena e-pošta v obdelavi</>
                  )}
                </div>
                <form action={updateContactInquiryStatusAction} className="flex flex-wrap gap-2">
                  <input type="hidden" name="inquiryId" value={inquiry.id} />
                  <Select name="status" defaultValue={inquiry.status}>
                    <SelectTrigger className="h-10 min-w-[190px] py-0" aria-label={`Status povpraševanja za ${inquiry.name}`}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(leadStatusLabels).map(([value, label]) => (
                        <SelectItem key={value} value={value}>{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <SubmitButton size="sm" pendingText="Shranjujem..." className="bg-[#6252D6] hover:bg-[#5142BE]">
                    Shrani status
                  </SubmitButton>
                </form>
              </div>
            </article>
          )) : <EmptyState text="Oddanih brezplačnih posvetov še ni." />}
        </div>
        <PaginationFooter
          page={contactData.page}
          pageCount={contactData.pageCount}
          pageSize={contactData.pageSize}
          total={contactData.total}
          basePath="/admin/povprasevanja"
          pageParam="posvetPage"
        />
      </Panel>

    </DashboardShell>
  );
}
