import { addWebsiteRequestCommentAction, updateSupportTicketStatusAction, updateWebsiteRequestStatusAction } from "@/app/actions";
import { DashboardShell, EmptyState, Panel, StatusPill } from "@/components/dashboard/dashboard-shell";
import { PaginationFooter } from "@/components/dashboard/pagination-footer";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { requireSuperAdmin } from "@/lib/auth";
import { getAdminSupportTicketsPage, getAdminWebsiteRequestsPage } from "@/lib/dashboard-data";
import { formatDate, priorityLabels, supportTicketStatusLabels, websiteRequestStatusLabels } from "@/lib/labels";

export default async function AdminRequestsPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string; websitePage?: string; supportPage?: string }>;
}) {
  const user = await requireSuperAdmin();
  const params = await searchParams;
  const websitePage = Number(params.websitePage ?? "1");
  const supportPage = Number(params.supportPage ?? "1");
  const [websiteData, supportData] = await Promise.all([
    getAdminWebsiteRequestsPage(Number.isFinite(websitePage) ? websitePage : 1),
    getAdminSupportTicketsPage(Number.isFinite(supportPage) ? supportPage : 1),
  ]);
  const requests = websiteData.requests;
  const tickets = supportData.tickets;

  return (
    <DashboardShell user={user} mode="admin" title="Zahtevki" subtitle="Spremembe spletnih strani in podporna vprašanja strank.">
      <Tabs defaultValue={params.tab === "support" ? "support" : "website"}>
        <TabsList>
          <TabsTrigger value="website">Spletna stran ({websiteData.total})</TabsTrigger>
          <TabsTrigger value="support">Podpora ({supportData.total})</TabsTrigger>
        </TabsList>

        <TabsContent value="website">
          <Panel title="Zahtevki za spremembe spletne strani">
            <div className="grid gap-4">
              {requests.length ? requests.map((request) => (
            <article key={request.id} className="overflow-hidden rounded-2xl border border-[#E2E4E8] bg-white">
              <div className="flex flex-wrap items-start justify-between gap-4 px-5 py-5 md:px-6">
                <div>
                  <h3 className="text-[16px] font-bold tracking-[-.01em]">{request.title}</h3>
                  <div className="mt-1.5 text-[13px] font-medium text-[#777A83]">{request.companyName} · {formatDate(request.createdAt)}</div>
                </div>
                <div className="flex gap-2">
                  <StatusPill>{priorityLabels[request.priority]}</StatusPill>
                  <StatusPill>{websiteRequestStatusLabels[request.status]}</StatusPill>
                </div>
              </div>
              <div className="border-y border-[#ECEDEF] bg-[#FAFAFB] px-5 py-4 md:px-6">
                <p className="max-w-4xl text-sm leading-6 text-[#555861]">{request.message}</p>
              </div>

              <div className="grid items-start gap-6 px-5 py-5 md:px-6 lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-8">
                <form action={updateWebsiteRequestStatusAction} className="grid content-start gap-2.5">
                  <input type="hidden" name="requestId" value={request.id} />
                  <Label className="text-[13px]">Status zahtevka</Label>
                  <div className="flex items-center gap-2">
                    <Select name="status" defaultValue={request.status}>
                      <SelectTrigger className="h-11 min-w-0 flex-1 py-0 text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(websiteRequestStatusLabels).map(([value, label]) => (
                          <SelectItem key={value} value={value}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button size="sm" variant="secondary" className="h-11 shrink-0 px-4 py-0">
                      Shrani
                    </Button>
                  </div>
                  {request.resolvedAt ? (
                    <div className="text-xs font-medium text-[#777A83]">Zaključeno {formatDate(request.resolvedAt)}</div>
                  ) : null}
                </form>

                <div className="grid min-w-0 gap-3">
                  <div className="flex items-center justify-between gap-3">
                    <Label className="text-[13px]">Komentarji</Label>
                    <span className="text-xs text-[#90939A]">{request.comments.length}</span>
                  </div>
                  <div className="grid gap-2">
                    {request.comments.length ? (
                      request.comments.map((comment) => (
                        <div key={comment.id} className="rounded-xl border border-[#ECEDEF] bg-[#FAFAFB] px-4 py-3">
                          <div className="text-xs font-bold text-[#777A83]">
                            {comment.senderName || "Obrtio"} · {formatDate(comment.createdAt)}
                          </div>
                          <p className="mt-1 text-sm leading-5 text-[#555861]">{comment.message}</p>
                        </div>
                      ))
                    ) : (
                      <div className="rounded-xl border border-dashed border-[#D8DADE] bg-[#FAFAFB] px-4 py-3 text-[13px] text-[#858891]">
                        Brez komentarjev. Dodajte prvi odgovor spodaj.
                      </div>
                    )}
                  </div>
                  <form action={addWebsiteRequestCommentAction} className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
                    <input type="hidden" name="requestId" value={request.id} />
                    <Textarea className="min-h-20 resize-y font-medium" name="message" required placeholder="Napišite komentar ali pojasnilo ..." />
                    <Button size="sm" className="h-11 px-5 py-0">Dodaj komentar</Button>
                  </form>
                </div>
              </div>
            </article>
              )) : <EmptyState text="Zahtevkov za spletno stran še ni." />}
            </div>
            <div className="-mx-5 -mb-5 mt-5 overflow-hidden rounded-b-2xl md:-mx-6 md:-mb-6">
              <PaginationFooter
                page={websiteData.page}
                pageCount={websiteData.pageCount}
                pageSize={websiteData.pageSize}
                total={websiteData.total}
                basePath="/admin/zahtevki"
                pageParam="websitePage"
                extraParams={{ tab: "website", supportPage }}
              />
            </div>
          </Panel>
        </TabsContent>

        <TabsContent value="support">
          <Panel title="Podporna vprašanja">
            <div className="grid gap-3">
              {tickets.length ? tickets.map((ticket) => (
                <div key={ticket.id} className="rounded-[14px] border border-[#EEEAF5] p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="font-extrabold">{ticket.title}</div>
                      <div className="mt-1 text-sm font-semibold text-[#777382]">
                        {ticket.companyName} · {ticket.category} · {formatDate(ticket.createdAt)}
                      </div>
                      <div className="mt-1 text-xs font-semibold text-[#8A8694]">
                        Oddal {ticket.userName || "uporabnik"}
                      </div>
                    </div>
                    <StatusPill>{supportTicketStatusLabels[ticket.status]}</StatusPill>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-[#55515F]">{ticket.message}</p>

                  <form action={updateSupportTicketStatusAction} className="mt-4 flex flex-wrap items-end gap-2 border-t border-[#EFECF5] pt-4">
                    <input type="hidden" name="ticketId" value={ticket.id} />
                    <div className="grid gap-2">
                      <Label>Status</Label>
                      <Select name="status" defaultValue={ticket.status}>
                        <SelectTrigger className="min-w-52">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(supportTicketStatusLabels).map(([value, label]) => (
                            <SelectItem key={value} value={value}>
                              {label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <Button size="sm" variant="secondary">
                      Shrani status
                    </Button>
                    {ticket.resolvedAt ? (
                      <div className="text-xs font-semibold text-[#777382]">Zaključeno {formatDate(ticket.resolvedAt)}</div>
                    ) : null}
                  </form>
                </div>
              )) : <EmptyState text="Podpornih vprašanj še ni." />}
            </div>
            <PaginationFooter
              page={supportData.page}
              pageCount={supportData.pageCount}
              pageSize={supportData.pageSize}
              total={supportData.total}
              basePath="/admin/zahtevki"
              pageParam="supportPage"
              extraParams={{ tab: "support", websitePage }}
            />
          </Panel>
        </TabsContent>
      </Tabs>
    </DashboardShell>
  );
}
