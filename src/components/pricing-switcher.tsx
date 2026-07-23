"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, ShieldCheck, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type BillingPeriod = "monthly" | "yearly";

const plans = {
  monthly: {
    label: "Mesečno",
    price: "99 €",
    unit: "/ mesec",
    summary: "99 € na mesec",
    note: "Največ fleksibilnosti. Prekinitev kadarkoli.",
    badge: "Brez vezave",
    cta: "Začni mesečno",
    inactiveItems: ["Postavitev vključena", "Brez začetnih stroškov", "Podpora in vzdrževanje"],
  },
  yearly: {
    label: "Letno",
    price: "950 €",
    unit: "/ 12 mesecev",
    summary: "950 € za 12 mesecev",
    note: "79,17 € / mesec ob letnem plačilu.",
    badge: "Prihranite 238 €",
    cta: "Začni letno",
    inactiveItems: ["79,17 € / mesec", "Prihranek 238 €", "Vse funkcije vključene"],
  },
} satisfies Record<
  BillingPeriod,
  {
    label: string;
    price: string;
    unit: string;
    summary: string;
    note: string;
    badge: string;
    cta: string;
    inactiveItems: string[];
  }
>;

const englishPlans = {
  monthly: { label: "Monthly", price: "$199", unit: "/ month", summary: "$199 per month", note: "Maximum flexibility. Cancel anytime.", badge: "No contract", cta: "Start monthly", inactiveItems: ["Setup included", "No setup fee", "Support and maintenance"] },
  yearly: { label: "Annual", price: "$1,900", unit: "/ year", summary: "$1,900 per year", note: "$158.33 / month when billed annually.", badge: "Save $488", cta: "Start annual", inactiveItems: ["$158.33 / month", "Save $488", "Every feature included"] },
} satisfies typeof plans;

const planFeatures = [
  "Spletna stran (do 5 podstrani)",
  "Gostovanje",
  "Popolna skrb za spletno stran",
  "Kontaktni obrazci",
  "SMS sistem",
  "E-poštna potrdila strankam",
  "Sistem za ocene",
  "Marketinške kampanje",
  "Kampanje za priporočila",
  "Analitika",
  "Podpora",
  "Vzdrževanje",
];

export function PricingSwitcher({ locale = "sl" }: { locale?: "sl" | "en" }) {
  const [selected, setSelected] = useState<BillingPeriod>("yearly");
  const english = locale === "en";
  const localizedPlans = english ? englishPlans : plans;

  return (
    <section className="bg-white px-5 pb-14 pt-0 text-center md:px-8">
      <div className="mx-auto inline-grid grid-cols-2 rounded-full border border-[#E4E2EC] bg-white p-1 shadow-[0_8px_26px_rgba(20,19,29,.06)]" role="radiogroup" aria-label={english ? "Billing period" : "Izbira obračuna"}>
        {(Object.keys(localizedPlans) as BillingPeriod[]).map((period) => {
          const isSelected = selected === period;

          return (
            <button
              key={period}
              type="button"
              role="radio"
              aria-checked={isSelected}
              onClick={() => setSelected(period)}
              className={cn(
                "min-h-9 cursor-pointer rounded-full px-5 py-2 text-[13px] font-bold transition-all duration-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#6A5AE0]/20",
                isSelected ? "bg-[#16151D] text-white shadow-[0_8px_18px_rgba(20,19,29,.20)]" : "text-[#6A6775] hover:text-[#16151D]",
              )}
            >
              {localizedPlans[period].label}
            </button>
          );
        })}
      </div>
      <div className="mt-2 text-[12px] font-bold uppercase tracking-[.08em] text-[#8C8898]">{localizedPlans[selected].summary}</div>

      <div className="mx-auto mt-10 grid max-w-[1080px] items-stretch gap-5 text-left lg:grid-cols-2">
        {(Object.keys(localizedPlans) as BillingPeriod[]).map((period) => (
          <PlanCard key={period} period={period} active={selected === period} planSet={localizedPlans} locale={locale} />
        ))}
      </div>
      <div className="mx-auto mt-5 max-w-[1080px] rounded-[18px] border border-dashed border-[#D8D3EA] bg-[#FBFAFF] p-5 text-center">
        <div className="text-xs font-bold uppercase tracking-[.08em] text-[#8C8898]">{english ? "When you cancel" : "Ob preklicu naročnine"}</div>
        <div className="mx-auto mt-2 max-w-[640px] text-[14px] leading-[1.55] text-[#54515E]">
          {english ? "The system is deactivated and the website is taken down. No hidden fees or penalties." : "Sistem se deaktivira in spletna stran se odstrani. Brez skritih stroškov, brez kazni."}
        </div>
      </div>
    </section>
  );
}

function PlanCard({ period, active, planSet, locale }: { period: BillingPeriod; active: boolean; planSet: typeof plans; locale: "sl" | "en" }) {
  const plan = planSet[period];

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[22px] p-6 transition-all duration-200 md:p-8",
        active
          ? "bg-[#16151D] text-white shadow-[0_30px_70px_rgba(20,19,29,.24)]"
          : "border border-[#ECEAF3] bg-white text-[#16151D] shadow-[0_14px_36px_rgba(20,19,29,.06)]",
      )}
    >
      {active ? <div className="pointer-events-none absolute right-[-90px] top-[-120px] h-[280px] w-[280px] rounded-full bg-[radial-gradient(circle,rgba(106,90,224,.42),rgba(106,90,224,0)_68%)]" /> : null}
      <div className="relative">
        <div className="flex min-h-[34px] items-center justify-between gap-3">
          <div
            className={cn(
              "rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[.08em]",
              active ? "border border-white/10 bg-white/10 text-[#DCD9EA]" : "border border-[#E6E3EF] bg-[#FBFAFF] text-[#7A7785]",
            )}
          >
            {plan.label}
          </div>
          <span className={cn("rounded-full px-3 py-1 text-[12px] font-extrabold", active ? "bg-[#EFEBFF] text-[#4B3BC9]" : "bg-[#EFEBFF] text-[#6A5AE0]")}>{plan.badge}</span>
        </div>

        <div className="mt-6 flex items-end gap-2">
          <span className={cn("text-[52px] font-extrabold leading-none tracking-[-.04em] md:text-[64px]", !active && "text-[#16151D]")}>{plan.price}</span>
          <span className={cn("pb-2 text-[16px] font-semibold", active ? "text-white/72" : "text-[#7A7785]")}>{plan.unit}</span>
        </div>
        <p className={cn("mt-3 text-[15px] leading-[1.55]", active ? "text-[#D6D3E1]" : "text-[#6A6775]")}>{plan.note}</p>

        {active ? <ActivePlanContent cta={plan.cta} locale={locale} /> : <InactivePlanContent items={plan.inactiveItems} locale={locale} />}
      </div>
    </div>
  );
}

function ActivePlanContent({ cta, locale }: { cta: string; locale: "sl" | "en" }) {
  const english = locale === "en";
  const features = english ? ["Website (up to 5 pages)", "Hosting", "Fully managed website", "Contact forms", "SMS system", "Customer email confirmations", "Review system", "Marketing campaigns", "Referral campaigns", "Analytics", "Support", "Maintenance"] : planFeatures;
  return (
    <>
      <div className="mt-7 grid gap-3 sm:grid-cols-2">
        {features.map((feature) => (
          <div key={feature} className="flex items-center gap-2.5 text-[14px] font-semibold text-[#F4F2FA]">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#8C7BF0] text-white">
              <Check size={12} strokeWidth={3} />
            </span>
            {feature}
          </div>
        ))}
      </div>
      <Button asChild className="mt-8 w-full bg-[#8C7BF0] text-white shadow-[0_18px_36px_rgba(106,90,224,.28)] hover:bg-[#6A5AE0]">
        <Link href={english ? "/contact" : "/kontakt"}>
          {cta} <ArrowRight size={17} />
        </Link>
      </Button>
    </>
  );
}

function InactivePlanContent({ items, locale }: { items: string[]; locale: "sl" | "en" }) {
  const english = locale === "en";
  return (
    <>
      <div className="mt-7 space-y-3">
        {items.map((item, index) => (
          <div key={item} className="flex items-start gap-3 rounded-[14px] border border-[#ECEAF3] bg-[#FBFAFF] p-4">
            <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] bg-[#EFEBFF] text-[#6A5AE0]">
              {index === 0 ? <ShieldCheck size={17} /> : <Sparkles size={17} />}
            </span>
            <div>
              <div className="text-[14.5px] font-bold text-[#16151D]">{item}</div>
              <div className="mt-1 text-[13px] leading-[1.45] text-[#6A6775]">{english ? "Also available with this billing choice." : "Na voljo tudi pri tej izbiri obračuna."}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-8 rounded-[12px] border border-[#E4E2EC] bg-white px-5 py-[15px] text-center text-[15px] font-bold text-[#6A6775]">
        {english ? "Select above for details" : "Izberite zgoraj za podrobnosti"}
      </div>
    </>
  );
}
