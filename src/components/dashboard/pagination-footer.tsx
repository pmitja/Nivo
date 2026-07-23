import Link from "next/link";
import { Button } from "@/components/ui/button";

export function PaginationFooter({
  page,
  pageCount,
  pageSize,
  total,
  basePath,
  pageParam = "page",
  extraParams = {},
}: {
  page: number;
  pageCount: number;
  pageSize: number;
  total: number;
  basePath: string;
  pageParam?: string;
  extraParams?: Record<string, string | number | undefined>;
}) {
  const start = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);

  const buildHref = (targetPage: number) => {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(extraParams)) {
      if (value !== undefined && value !== "") {
        params.set(key, String(value));
      }
    }
    params.set(pageParam, String(targetPage));
    return `${basePath}?${params.toString()}`;
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#EEEAF5] bg-[#FBFAFF] px-4 py-3">
      <div className="text-xs font-bold text-[#827E8D]">
        Showing {start}-{end} of {total}
      </div>
      <div className="flex items-center gap-2">
        <Button asChild variant="secondary" size="sm" disabled={page <= 1}>
          <Link href={buildHref(Math.max(1, page - 1))}>Previous</Link>
        </Button>
        <span className="text-xs font-extrabold text-[#827E8D]">
          {page}/{pageCount}
        </span>
        <Button asChild variant="secondary" size="sm" disabled={page >= pageCount}>
          <Link href={buildHref(Math.min(pageCount, page + 1))}>Next</Link>
        </Button>
      </div>
    </div>
  );
}
