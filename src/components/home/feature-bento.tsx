import { Bot, CircleDot, Globe2, Mail, Megaphone, ShieldCheck, Star, UsersRound, Zap } from "lucide-react";

import { SectionHeading } from "@/components/site-primitives";

export function FeatureBento() {
  return (
    <section id="storitve" className="bg-white px-5 py-24 md:px-8">
      <div className="mx-auto max-w-[1100px]">
        <SectionHeading
          eyebrow="Rešitev"
          title="Vse, kar potrebujete za več povpraševanj — brez kompliciranja"
          text="Obrtio združuje spletno stran, obvestila, Google ocene in kampanje v en enostaven sistem. Za spletno stran ves čas skrbimo mi."
        />

        <div className="mt-14 grid gap-4 lg:grid-cols-3">
          <BentoCard
            className="lg:col-span-2"
            icon={<Mail size={17} strokeWidth={2.3} />}
            title="SMS obvestilo in e-poštno potrdilo"
            desc="Ko nekdo odda povpraševanje, takoj prejmete SMS z imenom in podatki stranke. Stranka prejme potrdilo po e-pošti."
          >
            <SmsVisual />
          </BentoCard>

          <BentoCard
            icon={<Star size={17} strokeWidth={2.3} />}
            title="Google ocene"
            desc="Sistem vam pomaga zbirati več mnenj in graditi zaupanje na Google profilu."
          >
            <RatingVisual />
          </BentoCard>

          <BentoCard
            icon={<Globe2 size={17} strokeWidth={2.3} />}
            title="Spletna stran"
            desc="Profesionalna stran, prilagojena vašim storitvam, lokaciji in strankam."
          >
            <SiteVisual />
          </BentoCard>

          <BentoCard
            icon={<Megaphone size={17} strokeWidth={2.3} />}
            title="Kampanje za stranke"
            desc="Pošljite akcijo, opomnik ali ponudbo prejšnjim strankam z enim klikom."
          >
            <CampaignsVisual />
          </BentoCard>

          <BentoCard
            icon={<UsersRound size={17} strokeWidth={2.3} />}
            title="Pregled strank"
            desc="Vsa povpraševanja in kontakti so zbrani na enem mestu, da nič ne ostane pozabljeno."
          >
            <CustomersVisual />
          </BentoCard>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <MiniCard
            icon={<Bot size={16} strokeWidth={2.3} />}
            title="AI pomočnik"
            desc="Povzetki povpraševanj in osnutki ponudb."
            badge="Pride kmalu"
          />
          <MiniCard
            icon={<ShieldCheck size={16} strokeWidth={2.3} />}
            title="Mi skrbimo za spletno stran"
            desc="Vsebina, posodobitve in vzdrževanje so naša skrb."
          />
          <MiniCard
            icon={<CircleDot size={16} strokeWidth={2.3} />}
            title="SEO osnova"
            desc="Stran je pripravljena, da vas stranke najdejo na Googlu."
          />
        </div>
      </div>
    </section>
  );
}

function BentoCard({
  icon,
  title,
  desc,
  children,
  className = "",
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <article
      className={`flex flex-col overflow-hidden rounded-[22px] border border-[#ECEAF3] bg-[#FBFAFF] p-6 transition-all duration-200 hover:-translate-y-0.5 hover:border-[#CFC9F8] hover:shadow-[0_24px_56px_rgba(106,90,224,.12)] ${className}`}
    >
      <div className="flex items-center gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-[#EFEBFF] text-[#6A5AE0]">
          {icon}
        </span>
        <h3 className="text-[17px] font-bold tracking-[-.01em]">{title}</h3>
      </div>
      <p className="mt-3 text-[14px] leading-[1.55] text-[#6A6775]">{desc}</p>
      <div className="mt-5 flex flex-1 items-end">{children}</div>
    </article>
  );
}

function MiniCard({
  icon,
  title,
  desc,
  badge,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  badge?: string;
}) {
  return (
    <div className="flex items-start gap-3.5 rounded-[18px] border border-[#ECEAF3] bg-white p-5">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-[#EFEBFF] text-[#6A5AE0]">
        {icon}
      </span>
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-[15px] font-bold tracking-[-.01em]">{title}</h3>
          {badge ? (
            <span className="rounded-full border border-[#DCD6FF] bg-[#F4F1FF] px-2.5 py-0.5 text-[10.5px] font-extrabold uppercase tracking-[.06em] text-[#6A5AE0]">
              {badge}
            </span>
          ) : null}
        </div>
        <p className="mt-1 text-[13px] leading-[1.5] text-[#6A6775]">{desc}</p>
      </div>
    </div>
  );
}

function SmsVisual() {
  return (
    <div className="grid w-full gap-3 sm:grid-cols-2">
      <div className="rounded-[16px] border border-[#ECEAF3] bg-white p-4">
        <div className="text-[10.5px] font-bold uppercase tracking-[.05em] text-[#9A97A5]">Vi prejmete</div>
        <div className="mt-2.5 max-w-[92%] rounded-[12px] rounded-bl-[4px] bg-[#F1EFF8] px-3 py-2.5 text-[12.5px] font-semibold leading-[1.4]">
          Novo povpraševanje: Janez Novak
        </div>
        <div className="mt-1.5 max-w-[92%] rounded-[12px] rounded-bl-[4px] bg-[#F1EFF8] px-3 py-2 text-[12px] leading-[1.4] text-[#54515E]">
          Obnova kopalnice · Maribor · 041 000 000
        </div>
      </div>
      <div className="rounded-[16px] border border-[#ECEAF3] bg-white p-4">
        <div className="text-[10.5px] font-bold uppercase tracking-[.05em] text-[#9A97A5]">Stranka prejme e-pošto</div>
        <div className="ml-auto mt-2.5 max-w-[92%] rounded-[12px] rounded-br-[4px] bg-[#6A5AE0] px-3 py-2.5 text-[12.5px] leading-[1.45] text-white">
          Hvala za povpraševanje. Oglasimo se takoj, ko bo mogoče.
        </div>
        <div className="mt-1.5 text-right text-[10.5px] text-[#A9A6B3]">E-poštno potrdilo · poslano ✓</div>
      </div>
    </div>
  );
}

function RatingVisual() {
  return (
    <div className="w-full rounded-[16px] border border-[#ECEAF3] bg-white p-4">
      <div className="flex items-baseline gap-2.5">
        <span className="text-[34px] font-extrabold tracking-[-.02em]">4,9</span>
        <span className="text-[15px] text-[#F5A623]">★★★★★</span>
      </div>
      <div className="mt-3 flex flex-col gap-1.5">
        {[92, 78, 46].map((width) => (
          <div key={width} className="h-1.5 w-full overflow-hidden rounded-full bg-[#F1EFF8]">
            <div className="h-full rounded-full bg-[#F5A623]" style={{ width: `${width}%` }} />
          </div>
        ))}
      </div>
    </div>
  );
}

function SiteVisual() {
  return (
    <div className="w-full overflow-hidden rounded-[16px] border border-[#ECEAF3] bg-white">
      <div className="flex items-center gap-1.5 border-b border-[#ECEAF3] bg-[#F6F5FA] px-3 py-2">
        <span className="h-2 w-2 rounded-full bg-[#E5867E]" />
        <span className="h-2 w-2 rounded-full bg-[#E8C16B]" />
        <span className="h-2 w-2 rounded-full bg-[#7FC08C]" />
      </div>
      <div className="p-3.5">
        <div className="h-2.5 w-3/4 rounded-full bg-[#E7E1FE]" />
        <div className="mt-2 h-2 w-full rounded-full bg-[#F1EFF8]" />
        <div className="mt-1.5 h-2 w-5/6 rounded-full bg-[#F1EFF8]" />
        <div className="mt-3 inline-flex rounded-[8px] bg-[#6A5AE0] px-3.5 py-1.5 text-[10.5px] font-bold text-white">
          Pošlji povpraševanje
        </div>
      </div>
    </div>
  );
}

function CampaignsVisual() {
  return (
    <div className="flex w-full flex-col gap-1.5">
      {["Servis klim pred poletjem", "Pregled strehe po neurju"].map((campaign) => (
        <div
          key={campaign}
          className="flex items-center gap-2.5 rounded-[12px] border border-[#ECEAF3] bg-white px-3 py-2.5"
        >
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-[7px] bg-[#EFEBFF] text-[#6A5AE0]">
            <Zap size={12} strokeWidth={2.5} />
          </span>
          <span className="text-[12.5px] font-semibold text-[#28262F]">{campaign}</span>
        </div>
      ))}
    </div>
  );
}

function CustomersVisual() {
  return (
    <div className="flex w-full flex-col gap-1.5">
      {[
        { name: "Janez N.", status: "Novo", tone: "bg-[#EFEBFF] text-[#6A5AE0]" },
        { name: "Marko P.", status: "Dogovorjeno", tone: "bg-[#E4F6EE] text-[#167E53]" },
      ].map((row) => (
        <div
          key={row.name}
          className="flex items-center justify-between rounded-[12px] border border-[#ECEAF3] bg-white px-3 py-2.5"
        >
          <div className="flex items-center gap-2.5">
            <span className="h-6 w-6 rounded-full bg-[#E7E1FE]" />
            <span className="text-[12.5px] font-semibold text-[#28262F]">{row.name}</span>
          </div>
          <span className={`rounded-full px-2.5 py-0.5 text-[10.5px] font-extrabold ${row.tone}`}>{row.status}</span>
        </div>
      ))}
    </div>
  );
}
