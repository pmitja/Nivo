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
  Settings,
  Star,
  Users,
  WalletCards,
  type LucideIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
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
    <nav className="mt-8 grid gap-1">
      {nav.map((item) =>
        item.comingSoon ? (
          <div
            key={item.href}
            className="flex cursor-not-allowed items-center gap-3 rounded-[12px] px-3 py-2.5 text-[14px] font-bold text-[#AAA6B3]"
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
                "group flex items-center gap-3 rounded-[12px] px-3 py-2.5 text-[14px] font-bold transition",
                isItemActive(item)
                  ? "bg-[#F1EFF8] text-[#16151D]"
                  : "text-[#615E6B] hover:bg-[#F7F6FB] hover:text-[#16151D]",
              )}
            >
              <item.icon
                className={cn(
                  "h-4 w-4 transition",
                  isItemActive(item) ? "text-[#6A5AE0]" : "text-[#8D8999] group-hover:text-[#6A5AE0]",
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
                      "rounded-[10px] px-3 py-1.5 text-[13px] font-semibold transition",
                      isChildActive(item, child)
                        ? "bg-[#F1EFF8] font-bold text-[#6A5AE0]"
                        : "text-[#8A8694] hover:bg-[#F7F6FB] hover:text-[#16151D]",
                    )}
                  >
                    {child.label}
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

  return (
    <div className="lg:hidden">
      <nav className="mt-4 flex gap-2 overflow-x-auto pb-1">
        {nav.map((item) =>
          item.comingSoon ? (
            <div
              key={item.href}
              className="flex shrink-0 cursor-not-allowed items-center gap-2 rounded-[999px] border border-[#E2DFEA] bg-[#F7F6FB] px-3 py-2 text-sm font-bold text-[#AAA6B3]"
            >
              <item.icon className="h-4 w-4" />
              {item.label} · Pride kmalu
            </div>
          ) : (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex shrink-0 items-center gap-2 rounded-[999px] border px-3 py-2 text-sm font-bold transition",
                isItemActive(item)
                  ? "border-[#6A5AE0] bg-[#6A5AE0] text-white"
                  : "border-[#E2DFEA] bg-white text-[#5F5B68]",
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ),
        )}
      </nav>
      {activeParent?.children ? (
        <nav className="mt-2 flex gap-2 overflow-x-auto pb-1">
          {activeParent.children.map((child) => (
            <Link
              key={child.href}
              href={child.href}
              className={cn(
                "shrink-0 rounded-[999px] border px-3 py-1.5 text-[13px] font-bold transition",
                isChildActive(activeParent, child)
                  ? "border-[#DCD6FF] bg-[#F1EFF8] text-[#6A5AE0]"
                  : "border-[#E2DFEA] bg-white text-[#5F5B68]",
              )}
            >
              {child.label}
            </Link>
          ))}
        </nav>
      ) : null}
    </div>
  );
}
