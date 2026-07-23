import { updateLeadStatusAction } from "@/app/actions";
import { EmptyState, StatusPill } from "@/components/dashboard/dashboard-shell";
import { DeleteLeadButton } from "@/components/dashboard/delete-lead-button";
import { SendReviewRequestButton } from "@/components/dashboard/send-review-request-button";
import { SubmitButton } from "@/components/ui/submit-button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { getClientLeadsPage } from "@/lib/dashboard-data";
import { formatDate, leadPauseReasonLabels, leadStatusLabels } from "@/lib/labels-en";

export function LeadsList({
  leads,
  sentReviewLeadIds,
  emptyText,
}: {
  leads: Awaited<ReturnType<typeof getClientLeadsPage>>["leads"];
  sentReviewLeadIds: Set<string>;
  emptyText: string;
}) {
  if (!leads.length) return <EmptyState text={emptyText} />;

  return (
    <div className="grid gap-3">
      {leads.map((lead) => (
        <div key={lead.id} className="rounded-[14px] border border-[#EEEAF5] p-4">
          <div className="flex flex-wrap justify-between gap-3">
            <div>
              <div className="font-extrabold">{lead.name} · {lead.service}</div>
              <div className="mt-1 text-sm font-semibold text-[#777382]">{lead.phone} · {lead.email || "No email"} · {lead.location || "No location"}</div>
              <p className="mt-3 max-w-[760px] text-sm leading-6 text-[#55515F]">{lead.message}</p>
              {lead.attachmentUrl ? (
                <a
                  href={lead.attachmentUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 inline-flex items-center gap-2 rounded-[11px] border border-[#E2DFEA] px-3 py-2 text-sm font-extrabold text-[#16151D]"
                >
                  📎 {lead.attachmentName || "Attachment"}
                </a>
              ) : null}
            </div>
            <div className="flex flex-wrap justify-end gap-2">
              {lead.receivedWhilePaused && lead.pauseReason ? (
                <StatusPill>{leadPauseReasonLabels[lead.pauseReason]}</StatusPill>
              ) : null}
              <StatusPill>{leadStatusLabels[lead.status]}</StatusPill>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <a href={`tel:${lead.phone}`} className="rounded-[11px] bg-[#16151D] px-4 py-2 text-sm font-extrabold text-white">Call customer</a>
            <form action={updateLeadStatusAction} className="flex gap-2">
              <input type="hidden" name="leadId" value={lead.id} />
              <Select name="status" defaultValue={lead.status}>
                <SelectTrigger className="h-10 min-w-[190px] py-0">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(leadStatusLabels).map(([value, label]) => <SelectItem key={value} value={value}>{label}</SelectItem>)}
                </SelectContent>
              </Select>
              <SubmitButton size="sm">Save</SubmitButton>
            </form>
            {lead.status === "completed" ? (
              <SendReviewRequestButton
                leadId={lead.id}
                size="sm"
                variant="secondary"
                alreadySent={sentReviewLeadIds.has(lead.id)}
              />
            ) : null}
            <div className="ml-auto">
              <DeleteLeadButton leadId={lead.id} leadName={lead.name} />
            </div>
          </div>
          <div className="mt-4 rounded-[14px] border border-[#EEEAF5] bg-[#FBFAFF] p-4 text-sm font-semibold text-[#686473]">
            AI assistant for summaries and quote drafts: <span className="font-extrabold text-[#6A5AE0]">coming soon</span>
          </div>
          <div className="mt-3 text-xs font-bold uppercase tracking-[.06em] text-[#9A96A5]">{formatDate(lead.createdAt)}</div>
        </div>
      ))}
    </div>
  );
}
