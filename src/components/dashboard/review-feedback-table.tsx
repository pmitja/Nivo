import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/dashboard/dashboard-shell";
import { PaginationFooter } from "@/components/dashboard/pagination-footer";
import { formatDate } from "@/lib/labels-en";
import type { getClientReviewFeedbacksPage } from "@/lib/dashboard-data";

type FeedbackPage = Awaited<ReturnType<typeof getClientReviewFeedbacksPage>>;

const ratingFilters = [
  { label: "Vse", value: undefined },
  { label: "1/5", value: 1 },
  { label: "2/5", value: 2 },
  { label: "3/5", value: 3 },
  { label: "4/5", value: 4 },
  { label: "5/5", value: 5 },
];

export function ReviewFeedbackTable({ data }: { data: FeedbackPage }) {
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
                  <Badge variant={feedback.rating >= 4 ? "success" : "warning"}>{feedback.rating}/5</Badge>
                </div>
                <div>
                  <div className="text-sm font-extrabold">{feedback.name || "Stranka brez imena"}</div>
                  <div className="mt-0.5 text-xs font-semibold text-[#8A8694]">
                    {feedback.leadService || "No service"}
                  </div>
                </div>
                <p className="line-clamp-2 text-sm leading-5 text-[#55515F]">
                  {feedback.feedback || "Stranka je bila preusmerjena na Google, brez dodatnega komentarja."}
                </p>
                <div className="text-xs font-semibold text-[#8A8694] md:justify-self-end">
                  {formatDate(feedback.createdAt)}
                </div>
              </div>
            ))}
          </div>
          <PaginationFooter
            page={data.page}
            pageCount={data.pageCount}
            pageSize={data.pageSize}
            total={data.total}
            basePath="/dashboard/google-ocene"
            pageParam="feedbackPage"
            extraParams={{ feedbackRating: data.rating }}
          />
        </div>
      ) : (
        <EmptyState text="There is no private feedback for this filter yet." />
      )}
    </div>
  );
}
