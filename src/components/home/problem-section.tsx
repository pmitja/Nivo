import Image from "next/image";

import { Eyebrow } from "@/components/site-shell";
import { painsCards } from "@/lib/site-data";

const painImages = [
  {
    src: "/home/pain-missed-leads.webp",
    alt: "Izvajalec na objektu med delom prejme novo povpraševanje na telefon.",
  },
  {
    src: "/home/pain-forgotten-replies.webp",
    alt: "Delovna miza z računalnikom, zapiski in telefonom, kjer se povpraševanja hitro izgubijo.",
  },
  {
    src: "/home/pain-reviews.webp",
    alt: "Zadovoljna stranka se rokuje z izvajalcem po končanem delu.",
  },
  {
    src: "/home/pain-scattered-contacts.webp",
    alt: "Razpršeni kontakti, zapiski in orodja v delovnem vozilu izvajalca.",
  },
  {
    src: "/home/pain-outdated-website.webp",
    alt: "Izvajalec ob prenosniku pregleduje zastarelo spletno stran.",
  },
  {
    src: "/home/pain-no-time-marketing.webp",
    alt: "Zaseden izvajalec nalaga orodje v vozilo pred začetkom delovnega dne.",
  },
];

export function ProblemSection() {
  return (
    <section className="bg-[#16151D] px-5 py-[90px] text-white md:px-8">
      <div className="mx-auto max-w-[1100px]">
        <div className="mx-auto max-w-[900px] text-center">
          <Eyebrow className="text-[#8C7BF0]">Problem</Eyebrow>
          <h2 className="mt-4 text-balance text-[36px] font-extrabold leading-[1.1] tracking-[-.03em] md:text-[44px]">
            Koliko strank izgubite, ker se ne odzovete dovolj hitro?
          </h2>
          <p className="mx-auto mt-6 max-w-[680px] text-lg leading-[1.6] text-[#B6B3C2]">
            Stranka pošlje povpraševanje. Vi ste na objektu, vozite, delate ali imate sestanek. Čez nekaj ur odpišete
            nazaj, ampak stranka je medtem že kontaktirala tri druge izvajalce.
          </p>
          <p className="mx-auto mt-3.5 max-w-[680px] text-lg leading-[1.6] text-[#B6B3C2]">
            Ni nujno, da je bil drugi boljši. Samo hitrejši je bil.
          </p>
        </div>
        <div className="mt-[38px] grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {painsCards.map((pain, index) => (
            <div
              key={pain.title}
              className="relative min-h-[280px] overflow-hidden rounded-[18px] border border-white/10"
            >
              <Image
                src={painImages[index].src}
                alt={painImages[index].alt}
                fill
                sizes="(min-width: 1024px) 352px, (min-width: 640px) calc((100vw - 56px) / 2), calc(100vw - 40px)"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0E0D18]/90 via-[#0E0D18]/40 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5">
                <h3 className="text-[15.5px] font-bold text-white">{pain.title}</h3>
                <p className="mt-1.5 text-[13px] leading-[1.5] text-[#9A97AC]">{pain.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="mx-auto mt-10 max-w-[620px] text-center text-[21px] font-semibold leading-[1.5]">
          Pri obrtnikih pogosto ne zmaga najboljši izvajalec.
          <br />
          <span className="text-[#8C7BF0]">Zmaga tisti, ki prvi odgovori.</span>
        </p>
      </div>
    </section>
  );
}
