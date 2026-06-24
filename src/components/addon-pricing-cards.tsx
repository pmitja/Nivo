import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";

type AddonPricingCard = {
  title: string;
  badge?: string;
  price: string;
  unit: string;
  gradient?: string;
  features: string[];
  note?: string;
};

const addonMeta: Record<string, { badge: string; gradient: string }> = {
  "AI Pomočnik": {
    badge: "AI",
    gradient: "bg-[linear-gradient(135deg,#F6F4FC,#EFEBFF_46%,#E6E0FF)]",
  },
  "Google Business Profil": {
    badge: "Google",
    gradient: "bg-[linear-gradient(135deg,#F7F5FD,#EDE9FF_48%,#DDE9FF)]",
  },
  "SEO Optimizacija": {
    badge: "SEO",
    gradient: "bg-[linear-gradient(135deg,#FBFAFF,#EEE9FF_48%,#E7E1FF)]",
  },
  Oglasi: {
    badge: "Ads",
    gradient: "bg-[linear-gradient(135deg,#F7F5FD,#EFEAFF_44%,#E2E9FF)]",
  },
};

export function AddonPricingCards({
  items,
  columns = "four",
}: {
  items: AddonPricingCard[];
  columns?: "three" | "four";
}) {
  return (
    <div className={cn("grid gap-5 sm:grid-cols-2", columns === "three" ? "lg:grid-cols-3" : "lg:grid-cols-4")}>
      {items.map((addon) => {
        const meta = addonMeta[addon.title];
        const badge = addon.badge ?? meta?.badge ?? addon.title;
        const gradient = addon.gradient ?? meta?.gradient ?? "bg-[linear-gradient(135deg,#F7F5FD,#EFEAFF_48%,#E2E9FF)]";

        return (
          <div
            key={addon.title}
            className="rounded-[26px] bg-white p-2 shadow-[0_22px_52px_rgba(20,19,29,.10)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_28px_64px_rgba(106,90,224,.18)]"
          >
            <div className="flex h-full flex-col rounded-[20px] bg-white">
              <div className={`${gradient} flex min-h-[150px] flex-col justify-between rounded-[18px] p-5`}>
                <span className="w-fit rounded-full bg-[#76737F] px-2.5 py-1 text-[11px] font-bold text-white">{badge}</span>
                <div>
                  <div className="text-[17px] font-extrabold tracking-[-.02em] text-[#16151D]">{addon.title}</div>
                  <div className="mt-3 flex flex-wrap items-baseline gap-1.5">
                    <span className="text-[34px] font-extrabold leading-none tracking-[-.04em] text-[#16151D]">{addon.price}</span>
                    <span className="text-[13px] font-semibold text-[#6A6775]">{addon.unit}</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-1 flex-col p-5 pt-4">
                <ul className="space-y-2.5">
                  {addon.features.map((feature) => (
                    <li key={feature} className="flex gap-2 text-[13.5px] font-medium leading-[1.4] text-[#3B3944]">
                      <span className="mt-[8px] h-1 w-1 shrink-0 rounded-full bg-[#6A5AE0]" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                {addon.note ? <div className="mt-3 text-[12.5px] italic leading-[1.45] text-[#9A97A5]">{addon.note}</div> : null}
                <Link
                  href="/kontakt"
                  className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#16151D] px-5 py-3 text-[14px] font-bold text-white no-underline transition-colors duration-200 hover:bg-[#4B3BC9] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#6A5AE0]/20"
                >
                  Izberi <ArrowRight size={15} />
                </Link>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
