import { ContactForm } from "@/components/contact-form";
import { Eyebrow, PageShell } from "@/components/site-shell";

const nextSteps = [
  { num: "1", title: "Brezplačen posvet", desc: "20-minutni pogovor o vašem podjetju in ciljih." },
  { num: "2", title: "Predlog rešitve", desc: "Pokažemo, kako sistem deluje za vašo panogo." },
  { num: "3", title: "Postavitev v 7–10 dneh", desc: "Vse nastavimo, vi začnete prejemati povpraševanja." },
];

export default function ContactPage() {
  return (
    <PageShell active="kontakt">
      <section className="relative bg-[linear-gradient(180deg,#FBFAFF,#fff_90%)] px-5 py-16 pb-9 text-center md:px-8">
        <div className="pointer-events-none absolute right-[-60px] top-[-120px] h-[460px] w-[460px] rounded-full bg-[radial-gradient(circle,#EFEBFF_0%,rgba(255,255,255,0)_70%)]" />
        <div className="relative mx-auto max-w-[760px]">
          <Eyebrow>Kontakt</Eyebrow>
          <h1 className="mt-4 text-balance text-[40px] font-extrabold leading-[1.07] tracking-[-.035em] md:text-[50px]">Rezerviraj brezplačen posvet</h1>
          <p className="mx-auto mt-[18px] max-w-[520px] text-lg leading-[1.55] text-[#54515E]">20 minut, brez obveznosti. Povejte nam, kje izgubljate stranke — predlagamo rešitev.</p>
        </div>
      </section>

      <section className="bg-white px-5 pb-[88px] pt-8 md:px-8">
        <div className="mx-auto grid max-w-[1040px] items-start gap-8 lg:grid-cols-[1.15fr_.85fr]">
          <ContactForm />
          <div className="flex flex-col gap-4">
            <div className="rounded-[20px] bg-[#16151D] p-7 text-white">
              <div className="text-xs font-bold uppercase tracking-[.06em] text-[#8C7BF0]">Kaj sledi</div>
              <div className="mt-[18px] flex flex-col gap-[18px]">
                {nextSteps.map((step) => (
                  <div key={step.num} className="flex items-start gap-[13px]">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[9px] bg-[#8C7BF0]/20 text-sm font-extrabold text-[#A99BF5]">{step.num}</span>
                    <div>
                      <div className="text-[15px] font-bold">{step.title}</div>
                      <div className="mt-0.5 text-[13.5px] leading-[1.45] text-[#B6B3C2]">{step.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-[20px] border border-[#ECEAF3] bg-[#FBFAFF] p-7">
              <div className="text-xs font-bold uppercase tracking-[.06em] text-[#9A97A5]">Ali nas pokličite</div>
              <div className="mt-4 flex flex-col gap-3.5">
                <ContactLine icon="✆" label="Telefon" value="030 000 000" />
                <ContactLine icon="✉" label="E-pošta" value="pozdravljeni@nivo.si" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}

function ContactLine({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="flex h-[38px] w-[38px] items-center justify-center rounded-[11px] bg-[#EFEBFF] text-base text-[#6A5AE0]">{icon}</span>
      <div>
        <div className="text-xs text-[#9A97A5]">{label}</div>
        <div className="text-[15.5px] font-bold">{value}</div>
      </div>
    </div>
  );
}
