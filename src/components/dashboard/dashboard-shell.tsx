import Link from "next/link";
import { redirect } from "next/navigation";
import { logoutAction } from "@/app/prijava/actions";
import { Logo } from "@/components/logo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MobileTabs, SidebarNav } from "@/components/dashboard/dashboard-nav";
import { cn } from "@/lib/utils";
import type { AuthUser } from "@/lib/auth";

export function DashboardShell({
  user,
  mode,
  title,
  subtitle,
  children,
}: {
  user: AuthUser;
  mode: "admin" | "client";
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  async function signOut() {
    "use server";
    await logoutAction();
    redirect("/prijava");
  }

  const initials = user.name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="min-h-screen bg-[#F7F6FB] text-[#16151D]">
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-[264px] flex-col border-r border-[#E8E5EF] bg-white px-4 py-5 lg:flex">
        <Link href={mode === "admin" ? "/admin" : "/dashboard"} className="flex items-center gap-3 px-2">
          <Logo className="h-8 w-[128px]" />
        </Link>
        <div className="flex-1 overflow-y-auto">
          <SidebarNav mode={mode} />
        </div>
        <div className="mt-4 rounded-[16px] bg-[linear-gradient(160deg,#6A5AE0,#4B3BC9)] p-4 text-white">
          <div className="text-[13px] font-extrabold">Potrebujete pomoč?</div>
          <p className="mt-1 text-[12px] leading-[1.45] text-white/80">
            {mode === "admin" ? "Interna dokumentacija in postopki." : "Pišite nam in uredimo namesto vas."}
          </p>
          {mode === "client" ? (
            <Link
              href="/dashboard/podpora"
              className="mt-3 inline-flex rounded-[9px] bg-white px-3 py-1.5 text-[12px] font-extrabold text-[#4B3BC9]"
            >
              Odpri podporo
            </Link>
          ) : null}
        </div>
      </aside>

      <div className="lg:pl-[264px]">
        <header className="sticky top-0 z-10 border-b border-[#E8E5EF] bg-white/88 px-5 py-4 backdrop-blur md:px-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[.08em] text-[#8B8796]">
                {mode === "admin" ? "Super Admin" : "Client Dashboard"}
              </p>
              <h1 className="mt-1 text-[26px] font-extrabold leading-tight tracking-[-.02em] md:text-[32px]">{title}</h1>
              {subtitle ? <p className="mt-1 text-[15px] text-[#65616F]">{subtitle}</p> : null}
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[linear-gradient(160deg,#6A5AE0,#4B3BC9)] text-[13px] font-extrabold text-white">
                {initials}
              </div>
              <div className="hidden text-right sm:block">
                <div className="text-sm font-extrabold">{user.name}</div>
                <div className="text-xs font-semibold text-[#827E8D]">{user.email}</div>
              </div>
              <form action={signOut}>
                <Button variant="secondary" size="sm">
                  Odjava
                </Button>
              </form>
            </div>
          </div>
          <MobileTabs mode={mode} />
        </header>
        <main className="px-5 py-6 md:px-8 md:py-8">{children}</main>
      </div>
    </div>
  );
}

export function StatCard({
  label,
  value,
  helper,
  tone = "default",
}: {
  label: string;
  value: string | number;
  helper?: string;
  tone?: "default" | "green" | "amber" | "red";
}) {
  return (
    <div className="rounded-[20px] border border-[#E8E5EF] bg-white p-5 shadow-[0_10px_30px_rgba(20,19,29,.04)] transition-all duration-200 hover:-translate-y-0.5 hover:border-[#CFC9F8] hover:shadow-[0_18px_40px_rgba(106,90,224,.10)]">
      <div className="flex items-center gap-2">
        <span
          className={cn("h-2 w-2 rounded-full", {
            "bg-[#6A5AE0]": tone === "default",
            "bg-[#22B07D]": tone === "green",
            "bg-[#F5A623]": tone === "amber",
            "bg-[#E5484D]": tone === "red",
          })}
        />
        <div className="text-sm font-bold text-[#777382]">{label}</div>
      </div>
      <div
        className={cn("mt-3 text-[30px] font-extrabold tracking-[-.03em]", {
          "text-[#167E53]": tone === "green",
          "text-[#A75B00]": tone === "amber",
          "text-[#B42318]": tone === "red",
        })}
      >
        {value}
      </div>
      {helper ? <div className="mt-2 text-sm font-semibold text-[#8A8694]">{helper}</div> : null}
    </div>
  );
}

export function Panel({
  title,
  action,
  children,
}: {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-[20px] border border-[#E8E5EF] bg-white shadow-[0_10px_30px_rgba(20,19,29,.04)]">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#EFECF5] px-5 py-4">
        <h2 className="text-[17px] font-extrabold">{title}</h2>
        {action}
      </div>
      <div className="p-5">{children}</div>
    </section>
  );
}

export function StatusPill({ children }: { children: React.ReactNode }) {
  return <Badge>{children}</Badge>;
}

export function EmptyState({ text }: { text: string }) {
  return (
    <div className="rounded-[16px] border border-dashed border-[#DCD8E6] bg-[#FBFAFF] px-5 py-8 text-center text-sm font-semibold text-[#777382]">
      {text}
    </div>
  );
}
