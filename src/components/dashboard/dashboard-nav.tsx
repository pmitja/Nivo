"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Building2,
  CreditCard,
  FileText,
  Home,
  LifeBuoy,
  Megaphone,
  MessageSquareText,
  MoreHorizontal,
  Settings,
  Star,
  Users,
  WalletCards,
  type LucideIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { NavIcon, NavSpinner } from "@/components/dashboard/nav-progress";
import { cn } from "@/lib/utils";

type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  comingSoon?: boolean;
  children?: { href: string; label: string }[];
};

const adminNav: NavItem[] = [
  { href: "/admin", label: "Pregled", icon: Home },
  { href: "/admin/stranke", label: "Stranke", icon: Building2 },
  { href: "/admin/povprasevanja", label: "Povpraševanja", icon: FileText },
  { href: "/admin/sms-log", label: "SMS log", icon: MessageSquareText },
  { href: "/admin/google-ocene", label: "Google ocene", icon: Star },
  { href: "/admin/kampanje", label: "Kampanje", icon: Megaphone, comingSoon: true },
  { href: "/admin/zahtevki", label: "Zahtevki", icon: LifeBuoy },
  { href: "/admin/storitve", label: "Storitve", icon: CreditCard },
  { href: "/admin/placila", label: "Plačila", icon: WalletCards },
  { href: "/admin/nastavitve", label: "Nastavitve", icon: Settings },
];

const clientNav: NavItem[] = [
  { href: "/dashboard", label: "Pregled", icon: Home },
  {
    href: "/dashboard/povprasevanja",
    label: "Povpraševanja",
    icon: FileText,
    children: [
      { href: "/dashboard/povprasevanja", label: "Nova" },
      { href: "/dashboard/povprasevanja/kontaktirano", label: "Kontaktirano" },
      { href: "/dashboard/povprasevanja/ponudbe-poslane", label: "Ponudbe poslane" },
      { href: "/dashboard/povprasevanja/dogovorjeno", label: "Dogovorjeno" },
      { href: "/dashboard/povprasevanja/zakljuceno", label: "Zaključeno" },
      { href: "/dashboard/povprasevanja/izgubljeno", label: "Izgubljeno" },
    ],
  },
  { href: "/dashboard/stranke", label: "Stranke", icon: Users },
  { href: "/dashboard/sms", label: "SMS", icon: MessageSquareText },
  { href: "/dashboard/google-ocene", label: "Google ocene", icon: Star },
  { href: "/dashboard/kampanje", label: "Kampanje", icon: Megaphone, comingSoon: true },
  { href: "/dashboard/spletna-stran", label: "Spletna stran", icon: Building2 },
  { href: "/dashboard/analitika", label: "Analitika", icon: BarChart3 },
  { href: "/dashboard/podpora", label: "Podpora", icon: LifeBuoy },
  { href: "/dashboard/nastavitve", label: "Nastavitve", icon: Settings },
];

function useNav(mode: "admin" | "client") {
  const pathname = usePathname();
  const nav = mode === "admin" ? adminNav : clientNav;
  const rootHref = mode === "admin" ? "/admin" : "/dashboard";

  const isItemActive = (item: NavItem) => {
    if (item.href === rootHref) return pathname === rootHref;
    return pathname === item.href || pathname.startsWith(`${item.href}/`);
  };

  const isChildActive = (item: NavItem, child: { href: string }) => {
    if (child.href === item.href) return pathname === child.href;
    return pathname === child.href || pathname.startsWith(`${child.href}/`);
  };

  return { nav, isItemActive, isChildActive };
}

export function SidebarNav({ mode }: { mode: "admin" | "client" }) {
  const { nav, isItemActive, isChildActive } = useNav(mode);

  return (
    <nav className="grid gap-1">
      {nav.map((item) =>
        item.comingSoon ? (
          <div
            key={item.href}
            className="flex min-h-10 cursor-not-allowed items-center gap-3 rounded-xl px-3 py-2 text-[13px] font-semibold text-[#A0A3AA]"
          >
            <item.icon className="h-4 w-4" />
            {item.label}
            <Badge className="ml-auto text-[10px]">Pride kmalu</Badge>
          </div>
        ) : (
          <div key={item.href}>
            <Link
              href={item.href}
              aria-current={isItemActive(item) ? "page" : undefined}
              className={cn(
                "group flex min-h-10 items-center gap-3 rounded-xl px-3 py-2 text-[13px] font-semibold transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#6A5AE0]/15",
                isItemActive(item)
                  ? "bg-[#EEEAFE] text-[#4E40B5]"
                  : "text-[#60636B] hover:bg-white hover:text-[#17181C]",
              )}
            >
              <NavIcon
                icon={item.icon}
                className={cn(
                  "h-4 w-4 transition",
                  isItemActive(item) ? "text-[#6553D8]" : "text-[#858891] group-hover:text-[#6553D8]",
                )}
              />
              {item.label}
            </Link>
            {item.children && isItemActive(item) ? (
              <div className="ml-[15px] mt-1 grid gap-0.5 border-l border-[#EEEAF5] pl-[13px]">
                {item.children.map((child) => (
                  <Link
                    key={child.href}
                    href={child.href}
                    aria-current={isChildActive(item, child) ? "page" : undefined}
                    className={cn(
                      "flex items-center justify-between gap-2 rounded-lg px-3 py-2 text-[12px] font-semibold transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#6A5AE0]/15",
                      isChildActive(item, child)
                        ? "bg-[#F1EFF8] font-bold text-[#6A5AE0]"
                        : "text-[#8A8694] hover:bg-[#F7F6FB] hover:text-[#16151D]",
                    )}
                  >
                    {child.label}
                    <NavSpinner />
                  </Link>
                ))}
              </div>
            ) : null}
          </div>
        ),
      )}
    </nav>
  );
}

export function MobileTabs({ mode }: { mode: "admin" | "client" }) {
  const { nav, isItemActive, isChildActive } = useNav(mode);
  const activeParent = nav.find((item) => item.children && isItemActive(item));
  const primaryHrefs = mode === "admin"
    ? ["/admin", "/admin/stranke", "/admin/povprasevanja", "/admin/zahtevki"]
    : ["/dashboard", "/dashboard/povprasevanja", "/dashboard/stranke", "/dashboard/sms"];
  const primaryItems = primaryHrefs.map((href) => nav.find((item) => item.href === href)).filter((item): item is NavItem => Boolean(item));
  const moreItems = nav.filter((item) => !primaryHrefs.includes(item.href));
  const isMoreActive = moreItems.some(isItemActive);

  return (
    <div className="lg:hidden">
      {activeParent?.children ? (
        <nav aria-label="Statusi povpraševanj" className="flex gap-2 overflow-x-auto pb-3 pt-1 no-scrollbar">
          {activeParent.children.map((child) => (
            <Link
              key={child.href}
              href={child.href}
              className={cn(
                "flex shrink-0 items-center gap-1.5 rounded-[999px] border px-3 py-1.5 text-[13px] font-bold transition",
                isChildActive(activeParent, child)
                  ? "border-[#DCD6FF] bg-[#F1EFF8] text-[#6A5AE0]"
                  : "border-[#E2DFEA] bg-white text-[#5F5B68]",
              )}
            >
              {child.label}
              <NavSpinner />
            </Link>
          ))}
        </nav>
      ) : null}

      <nav aria-label="Glavna navigacija" className="fixed inset-x-0 bottom-0 z-40 border-t border-[#E2E4E8] bg-white/95 px-2 pb-[max(.45rem,env(safe-area-inset-bottom))] pt-1.5 shadow-[0_-8px_28px_rgba(16,24,40,.08)] backdrop-blur-xl lg:hidden">
        <div className="mx-auto grid max-w-lg grid-cols-5">
          {primaryItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isItemActive(item) ? "page" : undefined}
              className={cn(
                "flex min-h-[52px] min-w-0 flex-col items-center justify-center gap-1 rounded-xl px-1 text-[10px] font-bold transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#6A5AE0]/15",
                isItemActive(item) ? "text-[#5747C4]" : "text-[#777A83] active:bg-[#F3F1FC]",
              )}
            >
              <span className={cn("flex h-7 w-10 items-center justify-center rounded-xl transition", isItemActive(item) && "bg-[#EEEAFE]")}>
                <NavIcon icon={item.icon} className="h-[19px] w-[19px]" strokeWidth={isItemActive(item) ? 2.4 : 2} />
              </span>
              <span className="w-full truncate text-center">{item.label}</span>
            </Link>
          ))}

          <Dialog>
            <DialogTrigger asChild>
              <button type="button" className={cn("flex min-h-[52px] min-w-0 cursor-pointer flex-col items-center justify-center gap-1 rounded-xl px-1 text-[10px] font-bold transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#6A5AE0]/15", isMoreActive ? "text-[#5747C4]" : "text-[#777A83] active:bg-[#F3F1FC]")}>
                <span className={cn("flex h-7 w-10 items-center justify-center rounded-xl", isMoreActive && "bg-[#EEEAFE]")}><MoreHorizontal className="h-5 w-5" /></span>
                Več
              </button>
            </DialogTrigger>
            <DialogContent className="bottom-0 left-0 top-auto w-full max-w-none translate-x-0 translate-y-0 rounded-b-none rounded-t-[24px] border-x-0 border-b-0 pb-[max(1rem,env(safe-area-inset-bottom))] sm:left-1/2 sm:bottom-auto sm:top-1/2 sm:w-[calc(100vw-32px)] sm:max-w-md sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-[20px] sm:border">
              <DialogHeader>
                <DialogTitle>Vse možnosti</DialogTitle>
                <DialogDescription>Odprite ostale dele nadzorne plošče.</DialogDescription>
              </DialogHeader>
              <div className="grid max-h-[60vh] grid-cols-2 gap-2 overflow-y-auto p-4">
                {moreItems.map((item) => item.comingSoon ? (
                  <div key={item.href} className="flex min-h-[72px] cursor-not-allowed flex-col justify-between rounded-2xl bg-[#F6F6F8] p-3.5 text-[#A0A3AA]">
                    <item.icon className="h-5 w-5" /><span className="text-xs font-bold">{item.label} · Pride kmalu</span>
                  </div>
                ) : (
                  <DialogClose asChild key={item.href}>
                    <Link href={item.href} aria-current={isItemActive(item) ? "page" : undefined} className={cn("flex min-h-[72px] flex-col justify-between rounded-2xl border p-3.5 text-xs font-bold transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#6A5AE0]/15", isItemActive(item) ? "border-[#DCD6FF] bg-[#F1EFF8] text-[#5747C4]" : "border-[#E5E6E9] bg-white text-[#4F525A] active:bg-[#F3F1FC]")}>
                      <item.icon className="h-5 w-5" /><span>{item.label}</span>
                    </Link>
                  </DialogClose>
                ))}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </nav>
    </div>
  );
}
