import { addWebsiteRequestCommentAction, createWebsiteRequestAction } from "@/app/actions";
import { DashboardShell, EmptyState, Panel, StatusPill } from "@/components/dashboard/dashboard-shell";
import { PaginationFooter } from "@/components/dashboard/pagination-footer";
import { SubmitButton } from "@/components/ui/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { requireClientUser } from "@/lib/auth";
import { getClientWebsiteRequestsPage } from "@/lib/dashboard-data";
import { formatDate, priorityLabels, websiteRequestStatusLabels } from "@/lib/labels-en";

export default async function ClientWebsitePage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const user = await requireClientUser();
  const params = await searchParams;
  const page = Number(params.page ?? "1");
  const data = await getClientWebsiteRequestsPage(user.companyId!, Number.isFinite(page) ? page : 1);

  return (
    <DashboardShell user={user} mode="client" title="Website" subtitle="The Obrtio team takes care of your entire website.">
      <div className="grid gap-6 xl:grid-cols-[.9fr_1.1fr]">
        <Panel title="Request a change">
          <p className="mb-4 text-sm leading-6 text-[#666271]">
            Tell us what you need. Our team handles the copy, images and implementation, then lets you know when the change is live.
          </p>
          <form action={createWebsiteRequestAction} className="grid gap-3">
            <div className="grid gap-2">
              <Label htmlFor="request-title">Request title</Label>
              <Input id="request-title" name="title" required placeholder="E.g. replace the homepage image" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="request-message">Change details</Label>
              <Textarea id="request-message" name="message" required className="min-h-32" placeholder="What would you like to change?" />
            </div>
            <div className="grid gap-2">
              <Label>Priority</Label>
              <Select name="priority" defaultValue="normal">
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <SubmitButton pendingText="Submitting...">Submit request</SubmitButton>
          </form>
        </Panel>

        <Panel title="My requests">
          <div className="grid gap-3">
            {data.requests.length ? data.requests.map((request) => (
              <div key={request.id} className="rounded-[14px] border border-[#EEEAF5] p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="font-extrabold">{request.title}</div>
                    <div className="mt-1 text-sm font-semibold text-[#777382]">{formatDate(request.createdAt)}</div>
                  </div>
                  <div className="flex gap-2">
                    <StatusPill>{priorityLabels[request.priority]}</StatusPill>
                    <StatusPill>{websiteRequestStatusLabels[request.status]}</StatusPill>
                  </div>
                </div>
                <p className="mt-3 text-sm leading-6 text-[#55515F]">{request.message}</p>
                <div className="mt-4 grid gap-3 border-t border-[#EFECF5] pt-4">
                  {request.comments.length ? (
                    <div className="grid gap-2">
                      {request.comments.map((comment) => (
                        <div key={comment.id} className="rounded-[12px] bg-[#FBFAFF] px-4 py-3">
                          <div className="text-xs font-extrabold text-[#8A8694]">
                            {comment.senderName || "Obrtio"} · {formatDate(comment.createdAt)}
                          </div>
                          <p className="mt-1 text-sm leading-5 text-[#55515F]">{comment.message}</p>
                        </div>
                      ))}
                    </div>
                  ) : null}
                  <form action={addWebsiteRequestCommentAction} className="grid gap-2">
                    <input type="hidden" name="requestId" value={request.id} />
                    <Textarea name="message" required placeholder="Add more information or reply to the Obrtio team." />
                    <SubmitButton size="sm" variant="secondary" pendingText="Adding...">
                      Add reply
                    </SubmitButton>
                  </form>
                </div>
              </div>
            )) : <EmptyState text="Send us a request here whenever you need a change." />}
          </div>
          <PaginationFooter
            page={data.page}
            pageCount={data.pageCount}
            pageSize={data.pageSize}
            total={data.total}
            basePath="/dashboard/spletna-stran"
          />
        </Panel>
      </div>
    </DashboardShell>
  );
}
