import { DashboardShell, Panel, StatusPill } from "@/components/dashboard/dashboard-shell";
import { createCompanyAction } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { requireSuperAdmin } from "@/lib/auth";
import { getAdminCompanies } from "@/lib/dashboard-data";
import { companyStatusLabels, formatDate } from "@/lib/labels";

export default async function AdminCompaniesPage() {
  const user = await requireSuperAdmin();
  const companies = await getAdminCompanies();

  return (
    <DashboardShell user={user} mode="admin" title="Stranke" subtitle="Dodajanje in pregled podjetij.">
      <div className="grid gap-6 xl:grid-cols-[.9fr_1.1fr]">
        <Panel title="Dodaj novo stranko">
          <form action={createCompanyAction} className="grid gap-4">
            <div className="grid gap-3 md:grid-cols-2">
              <Field id="company-name" label="Ime podjetja">
                <Input id="company-name" name="name" required placeholder="Krovstvo Novak" />
              </Field>
              <Field id="contact-name" label="Kontaktna oseba">
                <Input id="contact-name" name="contactName" required placeholder="Marko Novak" />
              </Field>
              <Field id="company-email" label="Email">
                <Input id="company-email" name="email" required type="email" placeholder="info@podjetje.si" />
              </Field>
              <Field id="company-password" label="Začasno geslo">
                <Input
                  id="company-password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  minLength={10}
                  placeholder="Vsaj 10 znakov"
                />
              </Field>
              <Field id="company-phone" label="Telefon">
                <Input id="company-phone" name="phone" required placeholder="+386 40 000 000" />
              </Field>
              <Field id="company-industry" label="Dejavnost">
                <Input id="company-industry" name="industry" placeholder="Krovstvo" />
              </Field>
              <Field id="company-city" label="Lokacija">
                <Input id="company-city" name="city" placeholder="Ljubljana" />
              </Field>
              <Field id="company-domain" label="Domena">
                <Input id="company-domain" name="domain" placeholder="podjetje.si" />
              </Field>
              <div className="grid gap-2">
                <Label>Status stranke</Label>
                <Select name="status" defaultValue="setup">
                  <SelectTrigger>
                    <SelectValue placeholder="Izberite status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="setup">V pripravi</SelectItem>
                    <SelectItem value="active">Aktivna</SelectItem>
                    <SelectItem value="waiting_for_content">Čaka na vsebino</SelectItem>
                    <SelectItem value="waiting_for_payment">Čaka na plačilo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Field id="review-url" label="Google review povezava">
                <Input id="review-url" name="googleReviewUrl" placeholder="https://..." />
              </Field>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox id="has-ai-addon" name="hasAiAddon" />
              <Label htmlFor="has-ai-addon" className="cursor-pointer">
              Vklopi AI dodatek
              </Label>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="internal-notes">Interni zapiski</Label>
              <Textarea id="internal-notes" name="internalNotes" placeholder="Kaj mora ekipa vedeti?" />
            </div>
            <Button>Dodaj stranko</Button>
          </form>
        </Panel>

        <Panel title="Vse stranke">
          <div className="grid gap-3">
            {companies.map((company) => (
              <div key={company.id} className="rounded-[14px] border border-[#EEEAF5] p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="font-extrabold">{company.name}</div>
                    <div className="mt-1 text-sm font-semibold text-[#777382]">
                      {company.contactName} · {company.email} · {company.phone}
                    </div>
                    <div className="mt-1 text-sm text-[#8A8694]">{company.city || "Lokacija ni vpisana"} · {company.domain || "Domena ni vpisana"}</div>
                  </div>
                  <StatusPill>{companyStatusLabels[company.status]}</StatusPill>
                </div>
                <div className="mt-3 text-xs font-bold uppercase tracking-[.06em] text-[#9A96A5]">
                  Dodano {formatDate(company.createdAt)} · {company.hasAiAddon ? "AI dodatek" : "Brez AI dodatka"}
                </div>
              </div>
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
