"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bell, Search } from "lucide-react";
import { useMemo, useState } from "react";

const pages = {
  admin: [
    ["Pregled", "/admin"], ["Stranke", "/admin/stranke"], ["Povpraševanja", "/admin/povprasevanja"],
    ["SMS log", "/admin/sms-log"], ["Google ocene", "/admin/google-ocene"], ["Zahtevki", "/admin/zahtevki"],
    ["Storitve", "/admin/storitve"], ["Plačila", "/admin/placila"], ["Nastavitve", "/admin/nastavitve"],
  ],
  client: [
    ["Overview", "/dashboard"], ["Inquiries", "/dashboard/povprasevanja"], ["Customers", "/dashboard/stranke"],
    ["SMS", "/dashboard/sms"], ["Google reviews", "/dashboard/google-ocene"], ["Website", "/dashboard/spletna-stran"],
    ["Analytics", "/dashboard/analitika"], ["Support", "/dashboard/podpora"], ["Settings", "/dashboard/nastavitve"],
  ],
} satisfies Record<"admin" | "client", [string, string][]>;

const normalize = (value: string) => value.toLocaleLowerCase("sl-SI").normalize("NFD").replace(/[\u0300-\u036f]/g, "");

export function DashboardUtilities({ mode, today }: { mode: "admin" | "client"; today: string }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const results = useMemo(() => {
    const needle = normalize(query.trim());
    return needle ? pages[mode].filter(([label]) => normalize(label).includes(needle)).slice(0, 6) : pages[mode].slice(0, 5);
  }, [mode, query]);
  const notificationHref = mode === "admin" ? "/admin/zahtevki" : "/dashboard/povprasevanja";

  return <>
    <div className="relative hidden w-full max-w-[360px] lg:block">
      <form onSubmit={(event) => { event.preventDefault(); if (results[0]) { setFocused(false); router.push(results[0][1]); } }} className="flex items-center gap-2 rounded-xl border border-[#E2E4E8] bg-[#F8F8FA] px-3 text-[#858891] transition focus-within:border-[#BDB5F4] focus-within:bg-white focus-within:ring-4 focus-within:ring-[#6A5AE0]/10">
        <Search className="h-4 w-4" />
        <input value={query} onChange={(event) => setQuery(event.target.value)} onFocus={() => setFocused(true)} onBlur={() => window.setTimeout(() => setFocused(false), 120)} aria-label={mode === "admin" ? "Iskanje po dashboardu" : "Search dashboard"} placeholder={mode === "admin" ? "Poišči stran ..." : "Search pages..."} className="h-10 w-full bg-transparent text-sm outline-none placeholder:text-[#999CA4]" />
        <kbd className="rounded-md border border-[#DDDFE3] bg-white px-1.5 py-0.5 text-[10px] font-semibold">↵</kbd>
      </form>
      {focused ? <div className="absolute left-0 right-0 top-12 z-30 overflow-hidden rounded-xl border border-[#E2E4E8] bg-white p-1.5 shadow-[0_12px_32px_rgba(16,24,40,.12)]">
        {results.length ? results.map(([label, href]) => <Link key={href} href={href} className="flex min-h-10 items-center justify-between rounded-lg px-3 text-sm font-semibold text-[#45474E] transition hover:bg-[#F3F1FC] hover:text-[#5747C4] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#6A5AE0]/15"><span>{label}</span><span className="text-xs text-[#A0A3AA]">{mode === "admin" ? "Odpri" : "Open"}</span></Link>) : <div className="px-3 py-5 text-center text-sm text-[#858891]">{mode === "admin" ? "Ni najdenih strani." : "No pages found."}</div>}
      </div> : null}
    </div>
    <div className="flex items-center gap-2">
      <span className="hidden text-sm capitalize text-[#777A83] md:inline">{today}</span>
      <Link href={notificationHref} aria-label={mode === "admin" ? "Odpri zahtevke" : "Open new inquiries"} title={mode === "admin" ? "Zahtevki" : "New inquiries"} className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border border-[#E2E4E8] bg-white text-[#555861] transition hover:bg-[#F3F1FC] hover:text-[#5747C4] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#6A5AE0]/15"><Bell className="h-[18px] w-[18px]" /></Link>
    </div>
  </>;
}
