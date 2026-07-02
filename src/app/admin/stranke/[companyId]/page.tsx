import Link from "next/link";
import { notFound } from "next/navigation";
import {
  createCompanyServiceAction,
  updateContactFormAction,
  updateCompanyAction,
  updateCompanyServiceStatusAction,
  uploadCompanyDocumentAction,
  uploadCompanyLogoAction,
} from "@/app/actions";
import { DashboardShell, EmptyState, Panel, StatCard, StatusPill } from "@/components/dashboard/dashboard-shell";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { ContactFormField } from "@/db/schema";
import { requireSuperAdmin } from "@/lib/auth";
import { getAdminCompanyProfile } from "@/lib/dashboard-data";
import {
  billingTypeLabels,
  companyStatusLabels,
  formatCurrency,
  formatDate,
  leadStatusLabels,
  serviceStatusLabels,
  serviceTypeLabels,
  smsStatusLabels,
  smsTypeLabels,
  websiteRequestStatusLabels,
} from "@/lib/labels";

export default async function AdminCompanyProfilePage({ params }: { params: Promise<{ companyId: string }> }) {
  const user = await requireSuperAdmin();
  const { companyId } = await params;
  const data = await getAdminCompanyProfile(companyId);

  if (!data) {
    notFound();
  }

  const { company } = data;
  const formFields = data.contactForm?.fields ?? defaultContactFormFields;
  const appUrl = (process.env.NEXT_PUBLIC_APP_URL || process.env.APP_URL || "https://app.nivo.si").replace(/\/$/, "");

  return (
    <DashboardShell
      user={user}
      mode="admin"
      title={company.name}
      subtitle="Profil stranke, storitve, povpraševanja, SMS zgodovina in interne nastavitve."
    >
      <div className="mb-5">
        <Button asChild variant="secondary" size="sm">
          <Link href="/admin/stranke">Nazaj na stranke</Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <StatCard label="Povpraševanja" value={data.stats.leads} helper="Zadnjih 5" />
        <StatCard label="CRM kontakti" value={data.stats.customers} helper="Zadnjih 5" />
        <StatCard label="SMS" value={data.stats.sms} helper="Zadnjih 5" />
        <StatCard label="Kontaktni obrazec" value={data.contactForm?.active === false ? "Izklopljen" : "Aktiven"} helper="Spletna stran" tone={data.contactForm?.active === false ? "amber" : "green"} />
        <StatCard label="Odprti zahtevki" value={data.stats.openRequests} helper="Spletna stran" tone="amber" />
      </div>

      <div className="mt-6">
        <Panel title="Kontaktni obrazec za spletno stran">
          <form action={updateContactFormAction} className="grid gap-5">
            <input type="hidden" name="companyId" value={company.id} />
            <div className="grid gap-3 md:grid-cols-2">
              <Field id="form-title" label="Naslov obrazca">
                <Input id="form-title" name="title" defaultValue={data.contactForm?.title ?? "Pošljite povpraševanje"} />
              </Field>
              <Field id="form-submit-label" label="Besedilo gumba">
                <Input id="form-submit-label" name="submitLabel" defaultValue={data.contactForm?.submitLabel ?? "Pošlji povpraševanje"} />
              </Field>
              <Field id="form-intro" label="Uvodno besedilo">
                <Textarea id="form-intro" name="intro" defaultValue={data.contactForm?.intro ?? "Opišite, kaj potrebujete, in kontaktirali vas bomo v najkrajšem možnem času."} />
              </Field>
              <Field id="form-success" label="Potrditev po oddaji">
                <Textarea id="form-success" name="successMessage" defaultValue={data.contactForm?.successMessage ?? "Hvala za povpraševanje. Prejeli smo vaše sporočilo."} />
              </Field>
            </div>
            <div>
              <h3 className="text-sm font-extrabold">Polja obrazca</h3>
              <p className="mt-1 text-sm text-[#777382]">Ime, telefon, e-pošta in sporočilo so vedno vključeni.</p>
              <div className="mt-3 grid gap-3 md:grid-cols-2">
                {formFields.map((field) => {
                  const locked = ["name", "phone", "email", "message"].includes(field.name);
                  return (
                    <div key={field.name} className="rounded-[14px] border border-[#EEEAF5] p-4">
                      <Label htmlFor={`${field.name}-label`}>Naziv polja</Label>
                      <Input id={`${field.name}-label`} name={`${field.name}Label`} className="mt-2" defaultValue={field.label} />
                      <div className="mt-3 flex flex-wrap gap-5">
                        <label className="flex items-center gap-2 text-sm font-bold text-[#55515F]">
                          <Checkbox name={`${field.name}Enabled`} defaultChecked={locked || field.enabled} disabled={locked} />
                          Prikaži
                        </label>
                        <label className="flex items-center gap-2 text-sm font-bold text-[#55515F]">
                          <Checkbox name={`${field.name}Required`} defaultChecked={locked || field.required} disabled={locked} />
                          Obvezno
                        </label>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <label className="flex items-center gap-3 text-sm font-extrabold">
              <Checkbox name="active" defaultChecked={data.contactForm?.active ?? true} />
              Obrazec je aktiven
            </label>
            <div className="grid gap-3 rounded-[16px] bg-[#F7F5FF] p-4">
              <div>
                <div className="text-xs font-extrabold uppercase tracking-[.08em] text-[#6A5AE0]">Vdelava na spletno stran</div>
                <code className="mt-2 block overflow-x-auto rounded-[10px] bg-[#201D2A] p-3 text-xs text-white">{`<script src="${appUrl}/api/forms/${company.id}/embed.js" async></script>`}</code>
              </div>
              <div>
                <div className="text-xs font-extrabold uppercase tracking-[.08em] text-[#6A5AE0]">Endpoint za lasten obrazec</div>
                <code className="mt-2 block overflow-x-auto rounded-[10px] bg-[#201D2A] p-3 text-xs text-white">{`POST ${appUrl}/api/forms/${company.id}/submissions`}</code>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button>Shrani obrazec</Button>
              <Button asChild variant="secondary"><Link href={`/obrazec/${company.id}`} target="_blank">Predogled</Link></Button>
            </div>
          </form>
        </Panel>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.15fr_.85fr]">
        <Panel title="Uredi podatke stranke">
          <form action={updateCompanyAction} className="grid gap-4">
            <input type="hidden" name="companyId" value={company.id} />
            <div className="grid gap-3 md:grid-cols-2">
              <Field id="company-name" label="Ime podjetja">
                <Input id="company-name" name="name" required defaultValue={company.name} />
              </Field>
              <Field id="contact-name" label="Kontaktna oseba">
                <Input id="contact-name" name="contactName" required defaultValue={company.contactName} />
              </Field>
              <Field id="company-email" label="Email">
                <Input id="company-email" name="email" required type="email" defaultValue={company.email} />
              </Field>
              <Field id="company-phone" label="Telefon">
                <Input id="company-phone" name="phone" required defaultValue={company.phone} />
              </Field>
              <Field id="company-industry" label="Dejavnost">
                <Input id="company-industry" name="industry" defaultValue={company.industry ?? ""} />
              </Field>
              <Field id="company-city" label="Kraj">
                <Input id="company-city" name="city" defaultValue={company.city ?? ""} />
              </Field>
              <Field id="company-address" label="Naslov">
                <Input id="company-address" name="address" defaultValue={company.address ?? ""} />
              </Field>
              <Field id="company-domain" label="Domena">
                <Input id="company-domain" name="domain" defaultValue={company.domain ?? ""} />
              </Field>
              <div className="grid gap-2">
                <Label>Status stranke</Label>
                <Select name="status" defaultValue={company.status}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(companyStatusLabels).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Field id="review-url" label="Google review povezava">
                <Input id="review-url" name="googleReviewUrl" defaultValue={company.googleReviewUrl ?? ""} placeholder="https://..." />
              </Field>
              <Field id="website-status" label="Status spletne strani">
                <Input id="website-status" name="websiteStatus" defaultValue={company.websiteStatus} />
              </Field>
              <Field id="gbp-status" label="Google Business Profil">
                <Input id="gbp-status" name="googleBusinessProfileStatus" defaultValue={company.googleBusinessProfileStatus} />
              </Field>
              <Field id="seo-status" label="SEO status">
                <Input id="seo-status" name="seoStatus" defaultValue={company.seoStatus} />
              </Field>
              <Field id="ads-status" label="Oglaševanje status">
                <Input id="ads-status" name="advertisingStatus" defaultValue={company.advertisingStatus} />
              </Field>
            </div>
            <div className="rounded-[14px] border border-[#EEEAF5] bg-[#FBFAFF] p-4 text-sm font-semibold text-[#686473]">
              AI pomočnik: <span className="font-extrabold text-[#6A5AE0]">pride kmalu</span>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="internal-notes">Interni zapiski</Label>
              <Textarea id="internal-notes" name="internalNotes" className="min-h-32" defaultValue={company.internalNotes ?? ""} />
            </div>
            <Button>Shrani spremembe</Button>
          </form>
        </Panel>

        <div className="grid gap-6">
          <Panel title="Hiter pregled">
            <div className="grid gap-3">
              <div className="rounded-[14px] border border-[#EEEAF5] p-4">
                <div className="text-xs font-extrabold uppercase tracking-[.08em] text-[#9A96A5]">Logo podjetja</div>
                {company.logoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={company.logoUrl}
                    alt={`Logo podjetja ${company.name}`}
                    className="mt-3 max-h-20 max-w-48 rounded-[10px] object-contain"
                  />
                ) : (
                  <div className="mt-2 text-sm font-bold text-[#777382]">Logo še ni dodan.</div>
                )}
                {company.logoName ? <div className="mt-2 text-xs font-semibold text-[#8A8694]">{company.logoName}</div> : null}
              </div>
              <Info label="Status" value={companyStatusLabels[company.status]} />
              <Info label="Paket" value="Osnovni paket: 99 €/mesec ali 950 € za 12 mesecev" />
              <Info label="AI pomočnik" value="Pride kmalu" />
              <Info label="Domena" value={company.domain || "Ni vpisano"} />
              <Info label="Google review link" value={company.googleReviewUrl || "Ni nastavljen"} />
            </div>
          </Panel>

          <Panel title="Uporabniki">
            <div className="grid gap-2">
              {data.users.map((profileUser) => (
                <div key={profileUser.id} className="rounded-[14px] border border-[#EEEAF5] px-4 py-3">
                  <div className="text-sm font-extrabold">{profileUser.name}</div>
                  <div className="mt-1 text-xs font-semibold text-[#777382]">{profileUser.email} · {profileUser.role}</div>
                </div>
              ))}
            </div>
          </Panel>

          <Panel title="Naloži logo">
            <form action={uploadCompanyLogoAction} className="grid gap-3">
              <input type="hidden" name="companyId" value={company.id} />
              <Field id="company-logo" label="Logo datoteka">
                <Input id="company-logo" name="logo" type="file" required accept="image/svg+xml,image/png,image/jpeg,image/webp" />
              </Field>
              <p className="text-sm font-semibold leading-6 text-[#777382]">
                SVG ostane SVG. PNG, JPG in WebP se pred uploadom pretvorijo v kompresiran WebP.
              </p>
              <Button variant="secondary">Naloži logo</Button>
            </form>
          </Panel>
        </div>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[.9fr_1.1fr]">
        <Panel title="Dodaj storitev">
          <form action={createCompanyServiceAction} className="grid gap-3">
            <input type="hidden" name="companyId" value={company.id} />
            <Field id="service-name" label="Ime storitve">
              <Input id="service-name" name="name" required placeholder="SEO ureditev" />
            </Field>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label>Tip storitve</Label>
                <Select name="type" defaultValue="website_changes">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(serviceTypeLabels).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Field id="service-price" label="Cena">
                <Input id="service-price" name="price" inputMode="decimal" placeholder="500" />
              </Field>
              <div className="grid gap-2">
                <Label>Tip plačila</Label>
                <Select name="billingType" defaultValue="one_time">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(billingTypeLabels).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Status</Label>
                <Select name="status" defaultValue="ordered">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(serviceStatusLabels).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Textarea name="notes" placeholder="Interna opomba za storitev." />
            <Button>Dodaj storitev</Button>
          </form>
        </Panel>

        <Panel title="Aktivne storitve">
          <div className="grid gap-2">
            {data.services.length ? (
              data.services.map((service) => (
                <div key={service.id} className="grid gap-3 rounded-[14px] border border-[#EEEAF5] px-4 py-3 lg:grid-cols-[1fr_auto] lg:items-center">
                  <div>
                    <div className="text-sm font-extrabold">{service.name}</div>
                    <div className="mt-1 text-xs font-semibold text-[#777382]">
                      {serviceTypeLabels[service.type]} · {billingTypeLabels[service.billingType]} ·{" "}
                      {service.price ? formatCurrency(Number(service.price)) : "Po ponudbi"}
                    </div>
                    {service.notes ? <p className="mt-2 text-sm leading-5 text-[#5F5B68]">{service.notes}</p> : null}
                  </div>
                  <form action={updateCompanyServiceStatusAction} className="flex items-center gap-2">
                    <input type="hidden" name="companyId" value={company.id} />
                    <input type="hidden" name="serviceId" value={service.id} />
                    <Select name="status" defaultValue={service.status}>
                      <SelectTrigger className="min-w-44">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(serviceStatusLabels).map(([value, label]) => (
                          <SelectItem key={value} value={value}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button size="sm" variant="secondary">
                      Shrani
                    </Button>
                  </form>
                </div>
              ))
            ) : (
              <EmptyState text="Storitve še niso dodane." />
            )}
          </div>
        </Panel>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[.9fr_1.1fr]">
        <Panel title="Dodaj dokument">
          <form action={uploadCompanyDocumentAction} className="grid gap-3">
            <input type="hidden" name="companyId" value={company.id} />
            <Field id="document-title" label="Naziv dokumenta">
              <Input id="document-title" name="title" placeholder="Npr. pogodba, brief, logo paket" />
            </Field>
            <Field id="company-document" label="Dokument">
              <Input
                id="company-document"
                name="document"
                type="file"
                required
                accept=".pdf,.doc,.docx,.xls,.xlsx,image/svg+xml,image/png,image/jpeg,image/webp"
              />
            </Field>
            <Textarea name="notes" placeholder="Interna opomba za dokument." />
            <p className="text-sm font-semibold leading-6 text-[#777382]">
              Dokumenti so shranjeni na UploadThing z ločenim ključem podjetja in zapisom v bazi.
            </p>
            <Button>Naloži dokument</Button>
          </form>
        </Panel>

        <Panel title="Dokumenti podjetja">
          <div className="grid gap-2">
            {data.documents.length ? (
              data.documents.map((document) => (
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

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <Panel title="Zadnja povpraševanja">
          <div className="grid gap-2">
            {data.leads.length ? (
              data.leads.map((lead) => (
                <CompactRow
                  key={lead.id}
                  title={`${lead.name} · ${lead.service}`}
                  meta={`${lead.phone} · ${formatDate(lead.createdAt)}`}
                  status={leadStatusLabels[lead.status]}
                />
              ))
            ) : (
              <EmptyState text="Povpraševanj še ni." />
            )}
          </div>
        </Panel>

        <Panel title="CRM kontakti">
          <div className="grid gap-2">
            {data.customers.length ? (
              data.customers.map((customer) => (
                <CompactRow
                  key={customer.id}
                  title={customer.name}
                  meta={`${customer.phone} · ${customer.email || "Brez emaila"} · ${customer.city || "Brez kraja"}`}
                  status={customer.marketingConsent ? "Soglasje za akcije" : "Brez soglasja"}
                />
              ))
            ) : (
              <EmptyState text="CRM kontaktov še ni." />
            )}
          </div>
        </Panel>

        <Panel title="SMS zgodovina">
          <div className="grid gap-2">
            {data.sms.length ? (
              data.sms.map((sms) => (
                <CompactRow
                  key={sms.id}
                  title={`${smsTypeLabels[sms.type]} · ${sms.phone}`}
                  meta={sms.message}
                  status={smsStatusLabels[sms.status]}
                />
              ))
            ) : (
              <EmptyState text="SMS zapisov še ni." />
            )}
          </div>
        </Panel>

        <Panel title="Zahtevki in podpora">
          <div className="grid gap-2">
            {[...data.websiteRequests, ...data.supportTickets].length ? (
              <>
                {data.websiteRequests.map((request) => (
                  <CompactRow
                    key={request.id}
                    title={request.title}
                    meta={`Spletna stran · ${formatDate(request.createdAt)}`}
                    status={websiteRequestStatusLabels[request.status]}
                  />
                ))}
                {data.supportTickets.map((ticket) => (
                  <CompactRow
                    key={ticket.id}
                    title={ticket.title}
                    meta={`${ticket.category} · ${formatDate(ticket.createdAt)}`}
                    status={ticket.status}
                  />
                ))}
              </>
            ) : (
              <EmptyState text="Zahtevkov še ni." />
            )}
          </div>
        </Panel>

        <Panel title="Kampanje">
          <EmptyState text="Kampanje so del druge faze in pridejo kmalu." />
        </Panel>

        <Panel title="Ocene in feedback">
          <div className="grid gap-2">
            <Info label="Poslane zahteve" value={String(data.reviewRequests.length)} />
            <Info label="Interne povratne informacije" value={String(data.reviewFeedbacks.length)} />
            {data.reviewFeedbacks.slice(0, 3).map((feedback) => (
              <CompactRow
                key={feedback.id}
                title={`${feedback.rating}/5 · ${feedback.name || "Brez imena"}`}
                meta={feedback.feedback || "Preusmerjeno na Google"}
                status={formatDate(feedback.createdAt)}
              />
            ))}
          </div>
        </Panel>
      </div>
    </DashboardShell>
  );
}

function Field({ id, label, children }: { id: string; label: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-2">
      <Label htmlFor={id}>{label}</Label>
      {children}
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[14px] border border-[#EEEAF5] p-4">
      <div className="text-xs font-extrabold uppercase tracking-[.08em] text-[#9A96A5]">{label}</div>
      <div className="mt-1 break-words text-sm font-extrabold leading-5">{value}</div>
    </div>
  );
}

function formatFileSize(size: number) {
  if (size < 1024 * 1024) {
    return `${Math.max(1, Math.round(size / 1024))} KB`;
  }

  return `${(size / 1024 / 1024).toFixed(1)} MB`;
}

function CompactRow({ title, meta, status }: { title: string; meta: string; status: string }) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-3 rounded-[14px] border border-[#EEEAF5] px-4 py-3">
      <div className="min-w-0">
        <div className="text-sm font-extrabold">{title}</div>
        <div className="mt-1 line-clamp-2 text-xs font-semibold leading-5 text-[#777382]">{meta}</div>
      </div>
      <StatusPill>{status}</StatusPill>
    </div>
  );
}

const defaultContactFormFields: ContactFormField[] = [
  { name: "name", label: "Ime in priimek", type: "text", required: true, enabled: true },
  { name: "phone", label: "Telefon", type: "tel", required: true, enabled: true },
  { name: "email", label: "E-pošta", type: "email", required: false, enabled: true },
  { name: "location", label: "Lokacija", type: "text", required: false, enabled: true },
  { name: "service", label: "Kaj potrebujete?", type: "text", required: true, enabled: true },
  { name: "message", label: "Sporočilo", type: "textarea", required: true, enabled: true },
];
