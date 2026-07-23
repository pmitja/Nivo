import { createSupportTicketAction } from "@/app/actions";
import { DashboardShell, EmptyState, Panel, StatusPill } from "@/components/dashboard/dashboard-shell";
import { PaginationFooter } from "@/components/dashboard/pagination-footer";
import { SubmitButton } from "@/components/ui/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { requireClientUser } from "@/lib/auth";
import { getClientSupportTicketsPage } from "@/lib/dashboard-data";
import { formatDate, supportTicketStatusLabels } from "@/lib/labels-en";

export default async function ClientSupportPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const user = await requireClientUser();
  const params = await searchParams;
  const page = Number(params.page ?? "1");
  const data = await getClientSupportTicketsPage(user.companyId!, Number.isFinite(page) ? page : 1);

  return (
    <DashboardShell user={user} mode="client" title="Support" subtitle="Questions, issues and help with the platform.">
      <div className="grid gap-6 xl:grid-cols-[.9fr_1.1fr]">
        <Panel title="New question">
          <form action={createSupportTicketAction} className="grid gap-3">
            <div className="grid gap-2">
              <Label>Category</Label>
              <Select name="category" defaultValue="general question">
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general question">general question</SelectItem>
                  <SelectItem value="technical issue">technical issue</SelectItem>
                  <SelectItem value="website change">website change</SelectItem>
                  <SelectItem value="help with Google reviews">help with Google reviews</SelectItem>
                  <SelectItem value="help with advertising">help with advertising</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="support-title">Title</Label>
              <Input id="support-title" name="title" required placeholder="Briefly describe the topic" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="support-message">Message</Label>
              <Textarea id="support-message" name="message" required className="min-h-32" placeholder="How can we help?" />
            </div>
            <SubmitButton pendingText="Sending...">Send question</SubmitButton>
          </form>
        </Panel>
        <Panel title="My questions">
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
            )) : <EmptyState text="No questions yet." />}
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
