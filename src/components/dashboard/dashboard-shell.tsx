import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowUpRight, ChevronRight, LogOut } from "lucide-react";
import { logoutAction } from "@/app/prijava/actions";
import { Logo } from "@/components/logo";
import { Badge } from "@/components/ui/badge";
import { MobileTabs, SidebarNav } from "@/components/dashboard/dashboard-nav";
import { DashboardUtilities } from "@/components/dashboard/dashboard-utilities";
import { cn } from "@/lib/utils";
import type { AuthUser } from "@/lib/auth";

export function DashboardShell({ user, mode, title, subtitle, children }: { user: AuthUser; mode: "admin" | "client"; title: string; subtitle?: string; children: React.ReactNode }) {
  async function signOut() {
    "use server";
    await logoutAction();
    redirect("/prijava");
  }

  const initials = user.name.split(" ").map((part) => part[0]).slice(0, 2).join("").toUpperCase();
  const today = new Intl.DateTimeFormat("sl-SI", { weekday: "long", day: "numeric", month: "long" }).format(new Date());

  return (
    <div className="min-h-screen bg-[#F6F7F9] text-[#17181C]">
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-[252px] flex-col border-r border-[#E4E6EA] bg-[#FBFBFC] px-3 py-4 lg:flex">
        <Link href={mode === "admin" ? "/admin" : "/dashboard"} className="flex min-h-12 items-center rounded-xl px-3 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#6A5AE0]/15">
          <Logo className="h-7 w-[112px]" />
        </Link>
        <div className="mt-4 flex-1 overflow-y-auto"><SidebarNav mode={mode} /></div>
        <div className="border-t border-[#E6E7EA] pt-3">
          {mode === "client" ? (
            <Link href="/dashboard/podpora" className="group mb-2 flex min-h-11 items-center justify-between rounded-xl px-3 text-[13px] font-semibold text-[#60636B] transition hover:bg-white hover:text-[#17181C] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#6A5AE0]/15">
              Potrebujete pomoč?<ChevronRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
            </Link>
          ) : null}
          <div className="flex items-center gap-3 rounded-xl bg-white p-2.5 shadow-[0_1px_2px_rgba(16,24,40,.04)] ring-1 ring-[#E6E7EA]">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-[#EEEAFE] text-xs font-extrabold text-[#5848CC]">{initials}</div>
            <div className="min-w-0 flex-1"><div className="truncate text-[13px] font-bold">{user.name}</div><div className="truncate text-[11px] text-[#858891]">{user.email}</div></div>
            <form action={signOut}><button type="submit" aria-label="Odjava" className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg text-[#777A83] transition hover:bg-[#F3F3F5] hover:text-[#17181C] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#6A5AE0]/15"><LogOut className="h-4 w-4" /></button></form>
          </div>
        </div>
      </aside>

      <div className="lg:pl-[252px]">
        <header className="sticky top-0 z-30 border-b border-[#E4E6EA] bg-white/90 backdrop-blur-xl">
          <div className="flex h-16 items-center justify-between gap-3 px-4 md:px-7 lg:px-10">
            <Link
              href={mode === "admin" ? "/admin" : "/dashboard"}
              aria-label="Obrtio – pregled"
              className="flex min-h-11 min-w-0 items-center rounded-xl pr-2 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#6A5AE0]/15 lg:hidden"
            >
              <Logo className="h-7 w-[108px]" />
            </Link>
            <div className="ml-auto flex items-center gap-2">
              <DashboardUtilities mode={mode} today={today} />
              <form action={signOut} className="lg:hidden">
                <button
                  type="submit"
                  aria-label="Odjava"
                  title="Odjava"
                  className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-xl border border-[#E2E4E8] bg-white text-[#555861] transition active:bg-[#F3F1FC] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#6A5AE0]/15"
                >
                  <LogOut className="h-[18px] w-[18px]" />
                </button>
              </form>
            </div>
          </div>
        </header>
        <div className="px-4 md:px-7 lg:hidden"><MobileTabs mode={mode} /></div>
        <main className="mx-auto max-w-[1500px] px-4 pb-24 pt-7 md:px-7 md:pb-28 md:pt-9 lg:px-10 lg:pb-9">
          <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
            <div><p className="mb-1.5 text-[12px] font-bold uppercase tracking-[.12em] text-[#777A83]">{mode === "admin" ? "Upravljanje platforme" : "Vaše poslovanje"}</p><h1 className="text-[28px] font-bold leading-tight tracking-[-.035em] md:text-[34px]">{title}</h1>{subtitle ? <p className="mt-1.5 text-[15px] text-[#6D7078]">{subtitle}</p> : null}</div>
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}

export function StatCard({ label, value, helper, tone = "default", icon: Icon }: { label: string; value: string | number; helper?: string; tone?: "default" | "green" | "amber" | "red"; icon?: React.ComponentType<{ className?: string }> }) {
  return <div className="group rounded-2xl border border-[#E2E4E8] bg-white p-5 shadow-[0_1px_2px_rgba(16,24,40,.03)] transition duration-200 hover:border-[#D4D0EC] hover:shadow-[0_8px_24px_rgba(16,24,40,.06)]">
    <div className="flex items-start justify-between gap-3"><div className="text-[13px] font-semibold text-[#6D7078]">{label}</div>{Icon ? <div className={cn("flex h-8 w-8 items-center justify-center rounded-lg", {"bg-[#F0EDFF] text-[#6553D8]":tone==="default","bg-[#EAF8F1] text-[#16805A]":tone==="green","bg-[#FFF4DF] text-[#A96100]":tone==="amber","bg-[#FFF0EF] text-[#B42318]":tone==="red"})}><Icon className="h-4 w-4" /></div> : null}</div>
    <div className="mt-3 text-[30px] font-bold tracking-[-.04em] text-[#17181C]">{value}</div>
    {helper ? <div className="mt-1.5 text-[12px] font-medium text-[#8A8D95]">{helper}</div> : null}
  </div>;
}

export function Panel({ title, eyebrow, action, children, className }: { title: string; eyebrow?: string; action?: React.ReactNode; children: React.ReactNode; className?: string }) {
  return <section className={cn("overflow-hidden rounded-2xl border border-[#E2E4E8] bg-white shadow-[0_1px_2px_rgba(16,24,40,.03)]", className)}><div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#ECEDEF] px-5 py-4 md:px-6"><div>{eyebrow ? <p className="mb-1 text-[11px] font-bold uppercase tracking-[.1em] text-[#90939A]">{eyebrow}</p> : null}<h2 className="text-[16px] font-bold tracking-[-.01em]">{title}</h2></div>{action}</div><div className="p-5 md:p-6">{children}</div></section>;
}

export function DashboardLink({ href, children }: { href: string; children: React.ReactNode }) { return <Link href={href} className="inline-flex min-h-10 items-center gap-1.5 rounded-lg px-2 text-[13px] font-bold text-[#5B4CC4] transition hover:bg-[#F2F0FC] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#6A5AE0]/15">{children}<ArrowUpRight className="h-3.5 w-3.5" /></Link>; }
export function StatusPill({ children }: { children: React.ReactNode }) { return <Badge>{children}</Badge>; }
export function EmptyState({ text }: { text: string }) { return <div className="rounded-xl border border-dashed border-[#D8DADE] bg-[#FAFAFB] px-5 py-8 text-center text-sm font-medium text-[#777A83]">{text}</div>; }
