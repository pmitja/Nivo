import { Check, Sparkles } from "lucide-react";

const aiChecks = [
  "Povzetek povpraševanja",
  "Izluščenje ključnih podatkov",
  "Priprava osnutka ponudbe",
  "Potrditev pred pošiljanjem — nič ne gre ven brez vas",
];

export function AiAddonSection() {
  return (
    <section className="bg-[linear-gradient(180deg,#fff,#F6F4FC)] px-5 pb-[88px] pt-10 md:px-8">
      <div className="relative mx-auto max-w-[1100px] overflow-hidden rounded-[26px] bg-[#16151D] p-6 text-white md:p-[52px]">
        <div className="pointer-events-none absolute right-[-40px] top-[-80px] h-80 w-80 rounded-full bg-[radial-gradient(circle,rgba(140,123,240,.30),rgba(22,21,29,0)_70%)]" />
        <div className="pointer-events-none absolute bottom-[-120px] left-[-60px] h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(140,123,240,.14),rgba(22,21,29,0)_70%)]" />
        <div className="relative grid items-center gap-12 lg:grid-cols-[1fr_.95fr]">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <div className="text-xs font-bold uppercase tracking-[.08em] text-[#8C7BF0]">AI pomočnik</div>
              <span className="rounded-full border border-[#8C7BF0]/25 bg-[#8C7BF0]/10 px-3 py-1.5 text-xs font-extrabold uppercase tracking-[.06em] text-[#A99BF5]">
                Pride kmalu
              </span>
            </div>
            <h2 className="mt-[18px] text-[34px] font-extrabold leading-[1.12] tracking-[-.03em] md:text-[38px]">
              Povzetki povpraševanj.
              <br />
              Osnutki ponudb.
            </h2>
            <p className="mt-4 text-[16.5px] leading-[1.6] text-[#B6B3C2]">
              AI pomočnik bo prebral sporočila strank, izluščil ključne podatke in pripravil osnutek ponudbe — vi ga
              samo pregledate in potrdite.
            </p>
            <div className="mt-7 flex flex-col gap-3.5">
              {aiChecks.map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-[7px] bg-[#8C7BF0]/20 text-[#A99BF5]">
                    <Check size={13} strokeWidth={3} />
                  </span>
                  <span className="text-[15px] font-semibold text-[#E7E6EC]">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <AiPreview />
        </div>
      </div>
    </section>
  );
}

function AiPreview() {
  return (
    <div className="flex flex-col gap-3">
      <div className="rounded-[16px] border border-white/10 bg-white/[.05] p-4 backdrop-blur">
        <div className="text-[10.5px] font-bold uppercase tracking-[.05em] text-[#8B889A]">Novo povpraševanje</div>
        <p className="mt-2 text-[13.5px] leading-[1.5] text-[#CFCDD9]">
          »Pozdravljeni, zanima me obnova kopalnice, cca 8 m². Stanovanje je v Mariboru, delo bi bilo maja. Lahko
          pošljete okvirno ponudbo?«
        </p>
      </div>

      <div className="ml-6 flex items-center gap-2 text-[12px] font-bold text-[#A99BF5]">
        <Sparkles size={13} /> AI pomočnik pripravi povzetek
      </div>

      <div className="rounded-[16px] bg-white p-4 text-[#16151D] shadow-[0_24px_56px_rgba(0,0,0,.35)]">
        <div className="flex items-center justify-between">
          <div className="text-[10.5px] font-bold uppercase tracking-[.05em] text-[#9A97A5]">AI povzetek</div>
          <span className="rounded-full bg-[#EFEBFF] px-2.5 py-0.5 text-[10.5px] font-extrabold text-[#6A5AE0]">
            osnutek
          </span>
        </div>
        <div className="mt-3 grid gap-1.5">
          {[
            ["Storitev", "Obnova kopalnice · 8 m²"],
            ["Lokacija", "Maribor"],
            ["Termin", "maj"],
          ].map(([label, value]) => (
            <div key={label} className="flex items-center justify-between rounded-[10px] bg-[#F8F7FB] px-3 py-2">
              <span className="text-[11.5px] font-bold text-[#9A97A5]">{label}</span>
              <span className="text-[12.5px] font-semibold">{value}</span>
            </div>
          ))}
        </div>
        <div className="mt-3 flex items-center justify-center gap-2 rounded-[10px] bg-[#6A5AE0] px-3 py-2.5 text-[12.5px] font-extrabold text-white">
          <Sparkles size={13} /> Pripravi osnutek ponudbe
        </div>
        <div className="mt-2 text-center text-[10.5px] font-semibold text-[#9A97A5]">
          Pošlje se šele po vaši potrditvi
        </div>
      </div>
    </div>
  );
}
