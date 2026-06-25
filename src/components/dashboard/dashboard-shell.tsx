import Link from "next/link";
import { redirect } from "next/navigation";
import {
  BarChart3,
  Building2,
  CreditCard,
  FileText,
  Home,
  LifeBuoy,
  Megaphone,
  MessageSquareText,
  Settings,
  Star,
  Users,
  WalletCards,
} from "lucide-react";
import { logoutAction } from "@/app/prijava/actions";
import { Logo } from "@/components/logo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { AuthUser } from "@/lib/auth";

type NavItem = {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
};

const adminNav: NavItem[] = [
  { href: "/admin", label: "Pregled", icon: Home },
  { href: "/admin/stranke", label: "Stranke", icon: Building2 },
  { href: "/admin/povprasevanja", label: "Povpraševanja", icon: FileText },
  { href: "/admin/sms-log", label: "SMS log", icon: MessageSquareText },
  { href: "/admin/google-ocene", label: "Google ocene", icon: Star },
  { href: "/admin/kampanje", label: "Kampanje", icon: Megaphone },
  { href: "/admin/zahtevki", label: "Zahtevki", icon: LifeBuoy },
  { href: "/admin/storitve", label: "Storitve", icon: CreditCard },
  { href: "/admin/placila", label: "Plačila", icon: WalletCards },
  { href: "/admin/nastavitve", label: "Nastavitve", icon: Settings },
];

const clientNav: NavItem[] = [
  { href: "/dashboard", label: "Pregled", icon: Home },
  { href: "/dashboard/povprasevanja", label: "Povpraševanja", icon: FileText },
  { href: "/dashboard/stranke", label: "Stranke", icon: Users },
  { href: "/dashboard/sms", label: "SMS", icon: MessageSquareText },
  { href: "/dashboard/google-ocene", label: "Google ocene", icon: Star },
  { href: "/dashboard/kampanje", label: "Kampanje", icon: Megaphone },
  { href: "/dashboard/spletna-stran", label: "Spletna stran", icon: Building2 },
  { href: "/dashboard/analitika", label: "Analitika", icon: BarChart3 },
  { href: "/dashboard/podpora", label: "Podpora", icon: LifeBuoy },
  { href: "/dashboard/nastavitve", label: "Nastavitve", icon: Settings },
];

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
  const nav = mode === "admin" ? adminNav : clientNav;

  async function signOut() {
    "use server";
    await logoutAction();
    redirect("/prijava");
  }

  return (
    <div className="min-h-screen bg-[#F7F6FB] text-[#16151D]">
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-[264px] border-r border-[#E8E5EF] bg-white px-4 py-5 lg:block">
        <Link href={mode === "admin" ? "/admin" : "/dashboard"} className="flex items-center gap-3 px-2">
          <Logo markClassName="h-9 w-9 rounded-[10px]" textClassName="text-lg" />
        </Link>
        <nav className="mt-8 grid gap-1">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group flex items-center gap-3 rounded-[12px] px-3 py-2.5 text-[14px] font-bold text-[#615E6B] transition hover:bg-[#F1EFF8] hover:text-[#16151D]"
            >
              <item.icon className="h-4 w-4 text-[#8D8999] transition group-hover:text-[#6A5AE0]" />
              {item.label}
            </Link>
          ))}
        </nav>
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
          <nav className="mt-4 flex gap-2 overflow-x-auto pb-1 lg:hidden">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex shrink-0 items-center gap-2 rounded-[999px] border border-[#E2DFEA] bg-white px-3 py-2 text-sm font-bold text-[#5F5B68]"
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            ))}
          </nav>
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
    <div className="rounded-[18px] border border-[#E8E5EF] bg-white p-5 shadow-[0_10px_30px_rgba(20,19,29,.04)]">
      <div className="text-sm font-bold text-[#777382]">{label}</div>
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
