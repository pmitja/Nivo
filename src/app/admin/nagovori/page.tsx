import { CheckCircle2, Mail, MapPin, Send, XCircle } from "lucide-react";
import { DashboardShell, EmptyState, Panel, StatCard, StatusPill } from "@/components/dashboard/dashboard-shell";
import { PaginationFooter } from "@/components/dashboard/pagination-footer";
import { requireSuperAdmin } from "@/lib/auth";
import { getAdminOutreachPage } from "@/lib/dashboard-data";
import { formatDate, outreachStatusLabels } from "@/lib/labels";

export default async function AdminOutreachPage({
  searchParams,
}: {
  searchParams: Promise<{ nagovorPage?: string }>;
}) {
  const user = await requireSuperAdmin();
  const params = await searchParams;
  const nagovorPage = Number(params.nagovorPage ?? "1");
  const data = await getAdminOutreachPage(Number.isFinite(nagovorPage) ? nagovorPage : 1);

  return (
    <DashboardShell
      user={user}
      mode="admin"
      title="Nagovori"
      subtitle="Hladni prodajni e-maili, ki jih Obrtio pošlje potencialnim strankam. Poslano prek Resend z domene obrtio.si."
    >
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Skupno poslano" value={data.total} icon={Send} />
        <StatCard label="Dostavljeno" value={data.delivered} tone="green" icon={CheckCircle2} />
        <StatCard label="Poslano (v teku)" value={data.sent} tone="amber" icon={Mail} />
        <StatCard label="Napake / zavrnjeno" value={data.failed} tone="red" icon={XCircle} />
      </div>

      <Panel title="Poslani nagovori" eyebrow="kampanja: Maribor z okolico">
        <div className="grid gap-3">
          {data.messages.length ? data.messages.map((message) => (
            <article key={message.id} className="rounded-[14px] border border-[#DED9F5] bg-[#FCFBFF] p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="font-extrabold text-[#28262F]">{message.companyName}</div>
                  <div className="mt-1 text-sm font-semibold text-[#6F6A7A]">
                    {[message.activity, message.town].filter(Boolean).join(" · ") || "Panoga ni navedena"}
                    {" · "}
                    {formatDate(message.sentAt ?? message.createdAt)}
                  </div>
                </div>
                <StatusPill>{outreachStatusLabels[message.status]}</StatusPill>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <a
                  href={`mailto:${message.email}`}
                  className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-[11px] border border-[#DDD9E8] bg-white px-4 text-sm font-extrabold text-[#34313C] transition hover:bg-[#F7F5FC] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#6A5AE0]/15"
                >
                  <Mail className="h-4 w-4" aria-hidden="true" />
                  {message.email}
                </a>
                {message.town ? (
                  <span className="inline-flex min-h-11 items-center gap-2 rounded-[11px] border border-[#EAE6F4] bg-white px-4 text-sm font-semibold text-[#6F6A7A]">
                    <MapPin className="h-4 w-4" aria-hidden="true" />
                    {message.town}
                  </span>
                ) : null}
              </div>

              <div className="mt-4 border-t border-[#EAE6F4] pt-4">
                <p className="text-xs font-bold uppercase tracking-wide text-[#8A8694]">Zadeva</p>
                <p className="mt-1 text-sm font-semibold text-[#34313C]">{message.subject}</p>
                {message.error ? (
                  <p className="mt-2 inline-flex items-center gap-2 text-xs font-bold text-[#B42318]">
                    <XCircle className="h-4 w-4" aria-hidden="true" /> {message.error}
                  </p>
                ) : null}
              </div>
            </article>
          )) : <EmptyState text="Poslanih nagovorov še ni." />}
        </div>
        <PaginationFooter
          page={data.page}
          pageCount={data.pageCount}
          pageSize={data.pageSize}
          total={data.total}
          basePath="/admin/nagovori"
          pageParam="nagovorPage"
        />
      </Panel>
    </DashboardShell>
  );
}
