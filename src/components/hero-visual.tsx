export function HeroVisual({
  label,
  roofers,
  locale = "sl",
}: {
  label: string;
  roofers?: boolean;
  locale?: "sl" | "en";
}) {
  return (
    <div className="relative mt-10 lg:mt-0">
      <div className="relative flex aspect-[4/4.3] items-end justify-center overflow-hidden rounded-[22px] border border-[#ECEAF3] bg-[repeating-linear-gradient(135deg,#ECEAF5,#ECEAF5_11px,#F4F3FA_11px,#F4F3FA_22px)] shadow-[0_30px_70px_rgba(20,19,29,.14)]">
        <div className="absolute inset-0 bg-gradient-to-b from-[#14131D00] to-[#14131D73]" />
        <span className="relative mb-6 rounded-lg bg-white px-3 py-1.5 font-mono text-xs text-[#8C8898] shadow-[0_4px_14px_rgba(0,0,0,.08)]">
          {label}
        </span>
      </div>
      <FloatingLead roofers={roofers} locale={locale} />
      <div className="nv-float absolute bottom-6 right-0 w-[184px] rounded-[14px] border border-[#F0EEF6] bg-white px-4 py-3.5 shadow-[0_16px_40px_rgba(20,19,29,.16)] sm:-right-[30px]">
        <div className="text-xs font-semibold text-[#8C8898]">{locale === "en" ? "Google review" : "Google ocena"}</div>
        <div className="mt-1 flex items-baseline gap-2">
          <span className="text-[28px] font-extrabold tracking-[-.02em]">{locale === "en" ? "4.9" : "4,9"}</span>
          <span className="text-sm text-[#F5A623]">★★★★★</span>
        </div>
        <div className="mt-px text-xs text-[#7A7785]">
          {roofers ? "krovstvo · 84 ocen" : locale === "en" ? "More trust. More calls." : "Več zaupanja. Več klicev."}
        </div>
      </div>
      {!roofers ? (
        <div className="nv-float absolute bottom-4 left-0 w-[228px] rounded-[14px] bg-[#6A5AE0] px-4 py-3 text-white shadow-[0_16px_40px_rgba(106,90,224,.30)] sm:-left-[22px]">
          <div className="text-[11px] font-bold uppercase tracking-[.04em] opacity-80">{locale === "en" ? "Email confirmation" : "E-poštno potrdilo"}</div>
          <div className="mt-1.5 text-[12.5px] leading-[1.45]">
            {locale === "en" ? "Thanks for your inquiry. We will get back to you as soon as possible." : "Hvala za povpraševanje. Odgovorimo vam takoj, ko bo mogoče."}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function FloatingLead({ roofers, locale }: { roofers?: boolean; locale: "sl" | "en" }) {
  return (
    <div className="nv-float absolute left-0 top-7 w-[230px] rounded-[14px] border border-[#F0EEF6] bg-white px-4 py-3 shadow-[0_16px_40px_rgba(20,19,29,.16)] sm:-left-[34px]">
      <div className="flex items-center gap-2.5">
        <div className="flex h-8 w-8 items-center justify-center rounded-[9px] bg-[#EFEBFF] text-[15px] font-extrabold text-[#6A5AE0]">
          ✉
        </div>
        <div>
          <div className="text-[13px] font-bold">{locale === "en" ? "New inquiry" : "Novo povpraševanje"}</div>
          <div className="text-[11.5px] text-[#8C8898]">{locale === "en" ? "8 seconds ago" : "pred 8 sekundami"}</div>
        </div>
      </div>
      <div className="mt-2.5 rounded-[9px] bg-[#F8F7FB] px-2.5 py-2 text-[12.5px] leading-[1.4] text-[#54515E]">
        {roofers ? "Streha 120 m² · Domžale" : locale === "en" ? "Mark needs a new exterior finish. SMS sent instantly." : "Marko išče izvajalca za fasado. SMS poslan takoj."}
      </div>
    </div>
  );
}
