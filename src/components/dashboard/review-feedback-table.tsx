import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/dashboard/dashboard-shell";
import { formatDate } from "@/lib/labels";
import type { getClientReviewFeedbacksPage } from "@/lib/dashboard-data";

type FeedbackPage = Awaited<ReturnType<typeof getClientReviewFeedbacksPage>>;

const ratingFilters = [
  { label: "Vse", value: undefined },
  { label: "1/5", value: 1 },
  { label: "2/5", value: 2 },
  { label: "3/5", value: 3 },
];

export function ReviewFeedbackTable({ data }: { data: FeedbackPage }) {
  const queryBase = data.rating ? `feedbackRating=${data.rating}&` : "";

  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {ratingFilters.map((filter) => {
            const active = data.rating === filter.value || (!data.rating && !filter.value);
            const href = filter.value
              ? `/dashboard/google-ocene?feedbackRating=${filter.value}`
              : "/dashboard/google-ocene";

            return (
              <Button key={filter.label} asChild variant={active ? "default" : "secondary"} size="sm">
                <Link href={href}>{filter.label}</Link>
              </Button>
            );
          })}
        </div>
        <div className="text-xs font-bold text-[#827E8D]">{data.total} zapisov</div>
      </div>

      {data.feedbacks.length ? (
        <div className="overflow-hidden rounded-[16px] border border-[#EEEAF5]">
          <div className="hidden grid-cols-[.75fr_1fr_1.45fr_auto] gap-3 border-b border-[#EEEAF5] bg-[#FBFAFF] px-4 py-3 text-xs font-extrabold uppercase tracking-[.06em] text-[#8D8999] md:grid">
            <div>Ocena</div>
            <div>Stranka</div>
            <div>Povratna informacija</div>
            <div className="text-right">Datum</div>
          </div>
          <div className="divide-y divide-[#EEEAF5] bg-white">
            {data.feedbacks.map((feedback) => (
              <div key={feedback.id} className="grid gap-2 px-4 py-3 md:grid-cols-[.75fr_1fr_1.45fr_auto] md:items-center">
                <div>
                  <Badge variant="warning">{feedback.rating}/5</Badge>
                </div>
                <div>
                  <div className="text-sm font-extrabold">{feedback.name || "Stranka brez imena"}</div>
                  <div className="mt-0.5 text-xs font-semibold text-[#8A8694]">
                    {feedback.leadService || "Brez storitve"}
                  </div>
                </div>
                <p className="line-clamp-2 text-sm leading-5 text-[#55515F]">{feedback.feedback}</p>
                <div className="text-xs font-semibold text-[#8A8694] md:justify-self-end">
                  {formatDate(feedback.createdAt)}
                </div>
              </div>
            ))}
          </div>
          <PaginationFooter data={data} queryBase={queryBase} />
        </div>
      ) : (
        <EmptyState text="Za izbrani filter še ni internih povratnih informacij." />
      )}
    </div>
  );
}

function PaginationFooter({ data, queryBase }: { data: FeedbackPage; queryBase: string }) {
  const start = data.total === 0 ? 0 : (data.page - 1) * data.pageSize + 1;
  const end = Math.min(data.page * data.pageSize, data.total);

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#EEEAF5] bg-[#FBFAFF] px-4 py-3">
      <div className="text-xs font-bold text-[#827E8D]">
        Prikaz {start}-{end} od {data.total}
      </div>
      <div className="flex items-center gap-2">
        <Button asChild variant="secondary" size="sm" disabled={data.page <= 1}>
          <Link href={`/dashboard/google-ocene?${queryBase}feedbackPage=${Math.max(1, data.page - 1)}`}>Nazaj</Link>
        </Button>
        <span className="text-xs font-extrabold text-[#827E8D]">
          {data.page}/{data.pageCount}
        </span>
        <Button asChild variant="secondary" size="sm" disabled={data.page >= data.pageCount}>
          <Link href={`/dashboard/google-ocene?${queryBase}feedbackPage=${Math.min(data.pageCount, data.page + 1)}`}>Naprej</Link>
        </Button>
      </div>
    </div>
  );
}
