import { createSupportTicketAction } from "@/app/actions";
import { DashboardShell, EmptyState, Panel, StatusPill } from "@/components/dashboard/dashboard-shell";
import { PaginationFooter } from "@/components/dashboard/pagination-footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { requireClientUser } from "@/lib/auth";
import { getClientSupportTicketsPage } from "@/lib/dashboard-data";
import { formatDate, supportTicketStatusLabels } from "@/lib/labels";

export default async function ClientSupportPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const user = await requireClientUser();
  const params = await searchParams;
  const page = Number(params.page ?? "1");
  const data = await getClientSupportTicketsPage(user.companyId!, Number.isFinite(page) ? page : 1);

  return (
    <DashboardShell user={user} mode="client" title="Podpora" subtitle="Vprašanja, težave in pomoč pri uporabi platforme.">
      <div className="grid gap-6 xl:grid-cols-[.9fr_1.1fr]">
        <Panel title="Novo vprašanje">
          <form action={createSupportTicketAction} className="grid gap-3">
            <div className="grid gap-2">
              <Label>Kategorija</Label>
              <Select name="category" defaultValue="splošno vprašanje">
                <SelectTrigger>
                  <SelectValue placeholder="Izberite kategorijo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="splošno vprašanje">splošno vprašanje</SelectItem>
                  <SelectItem value="tehnična težava">tehnična težava</SelectItem>
                  <SelectItem value="sprememba spletne strani">sprememba spletne strani</SelectItem>
                  <SelectItem value="pomoč pri Google ocenah">pomoč pri Google ocenah</SelectItem>
                  <SelectItem value="pomoč pri oglaševanju">pomoč pri oglaševanju</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="support-title">Naslov</Label>
              <Input id="support-title" name="title" required placeholder="Na kratko opišite temo" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="support-message">Sporočilo</Label>
              <Textarea id="support-message" name="message" required className="min-h-32" placeholder="Kako vam lahko pomagamo?" />
            </div>
            <Button>Pošlji vprašanje</Button>
          </form>
        </Panel>
        <Panel title="Moja vprašanja">
          <div className="grid gap-3">
            {data.tickets.length ? data.tickets.map((ticket) => (
              <div key={ticket.id} className="rounded-[14px] border border-[#EEEAF5] p-4">
                <div className="flex flex-wrap justify-between gap-3">
                  <div>
                    <div className="font-extrabold">{ticket.title}</div>
                    <div className="mt-1 text-sm font-semibold text-[#777382]">{ticket.category} · {formatDate(ticket.createdAt)}</div>
                  </div>
                  <StatusPill>{supportTicketStatusLabels[ticket.status]}</StatusPill>
                </div>
                <p className="mt-3 text-sm leading-6 text-[#55515F]">{ticket.message}</p>
              </div>
            )) : <EmptyState text="Vprašanj še ni." />}
          </div>
          <PaginationFooter
            page={data.page}
            pageCount={data.pageCount}
            pageSize={data.pageSize}
            total={data.total}
            basePath="/dashboard/podpora"
          />
        </Panel>
      </div>
    </DashboardShell>
  );
}
