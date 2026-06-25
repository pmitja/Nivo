import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate, smsStatusLabels, smsTypeLabels } from "@/lib/labels";
import type { getClientSmsPage } from "@/lib/dashboard-data";

type SmsPage = Awaited<ReturnType<typeof getClientSmsPage>>;

export function SmsLogTable({ data }: { data: SmsPage }) {
  if (data.messages.length === 0) {
    return (
      <div className="rounded-[16px] border border-dashed border-[#DCD8E6] bg-[#FBFAFF] px-5 py-8 text-center text-sm font-semibold text-[#777382]">
        SMS sporočil še ni.
      </div>
    );
  }

  const start = (data.page - 1) * data.pageSize + 1;
  const end = Math.min(data.page * data.pageSize, data.total);

  return (
    <div className="overflow-hidden rounded-[16px] border border-[#EEEAF5]">
      <div className="hidden grid-cols-[.9fr_.85fr_1.4fr_auto] gap-3 border-b border-[#EEEAF5] bg-[#FBFAFF] px-4 py-3 text-xs font-extrabold uppercase tracking-[.06em] text-[#8D8999] md:grid">
        <div>Tip</div>
        <div>Telefon</div>
        <div>Sporočilo</div>
        <div className="text-right">Status</div>
      </div>
      <div className="divide-y divide-[#EEEAF5] bg-white">
        {data.messages.map((sms) => (
          <div key={sms.id} className="grid gap-2 px-4 py-3 md:grid-cols-[.9fr_.85fr_1.4fr_auto] md:items-center">
            <div>
              <div className="text-sm font-extrabold">{smsTypeLabels[sms.type]}</div>
              <div className="mt-0.5 text-xs font-semibold text-[#8A8694]">{formatDate(sms.createdAt)}</div>
            </div>
            <div className="text-sm font-semibold text-[#686473]">{sms.phone}</div>
            <p className="line-clamp-2 text-sm leading-5 text-[#55515F]">{sms.message}</p>
            <div className="md:justify-self-end">
              <Badge>{smsStatusLabels[sms.status]}</Badge>
            </div>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#EEEAF5] bg-[#FBFAFF] px-4 py-3">
        <div className="text-xs font-bold text-[#827E8D]">
          Prikaz {start}-{end} od {data.total}
        </div>
        <div className="flex items-center gap-2">
          <Button asChild variant="secondary" size="sm" disabled={data.page <= 1}>
            <Link href={`/dashboard/sms?smsPage=${Math.max(1, data.page - 1)}`}>Nazaj</Link>
          </Button>
          <span className="text-xs font-extrabold text-[#827E8D]">
            {data.page}/{data.pageCount}
          </span>
          <Button asChild variant="secondary" size="sm" disabled={data.page >= data.pageCount}>
            <Link href={`/dashboard/sms?smsPage=${Math.min(data.pageCount, data.page + 1)}`}>Naprej</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
