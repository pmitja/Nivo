"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import {
  Bot,
  CircleDot,
  Globe2,
  Mail,
  Megaphone,
  Pencil,
  RefreshCw,
  Star,
  UsersRound,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Feature = { icon: string; title: string; desc: string };
type FeatureMedia = {
  alt: string;
  icon: LucideIcon;
  image: string;
};

const featureMedia: Record<string, FeatureMedia> = {
  "Spletna stran": {
    alt: "Generičen predogled profesionalne spletne strani za lokalno storitveno podjetje.",
    icon: Globe2,
    image: "/features/website.webp",
  },
  "SMS obvestila": {
    alt: "Telefon s slogom sporočil in modro-sivimi pogovornimi oblački za SMS obvestila.",
    icon: Mail,
    image: "/features/sms.webp",
  },
  "Samodejni odgovori": {
    alt: "Generičen prikaz avtomatiziranega odgovora s pogovornimi oblački.",
    icon: RefreshCw,
    image: "/features/auto-replies.webp",
  },
  "Google ocene": {
    alt: "Generičen prikaz kartic z ocenami in zvezdicami.",
    icon: Star,
    image: "/features/reviews.webp",
  },
  "Kampanje za stranke": {
    alt: "Generičen prikaz kampanj, opomnikov in urnika pošiljanja.",
    icon: Megaphone,
    image: "/features/campaigns.webp",
  },
  "Pregled strank": {
    alt: "Generičen prikaz pregleda strank s kontaktnimi karticami.",
    icon: UsersRound,
    image: "/features/customer-overview.webp",
  },
  "AI pomočnik": {
    alt: "Generičen prikaz AI pomočnika z vprašanji in pogovornim vmesnikom.",
    icon: Bot,
    image: "/features/ai-assistant.webp",
  },
  "Enostavno urejanje": {
    alt: "Generičen prikaz urejanja vsebine spletne strani.",
    icon: Pencil,
    image: "/features/editor.webp",
  },
  "SEO osnova": {
    alt: "Generičen prikaz SEO iskanja in osnovne analitike.",
    icon: CircleDot,
    image: "/features/seo.webp",
  },
};

export function FeatureCarousel({ features }: { features: Feature[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const items = Array.from(track.children) as HTMLElement[];
    const observer = new IntersectionObserver(
      (entries) => {
        let best = -1;
        let bestRatio = 0;
        for (const entry of entries) {
          if (entry.intersectionRatio > bestRatio) {
            bestRatio = entry.intersectionRatio;
            best = items.indexOf(entry.target as HTMLElement);
          }
        }
        if (best !== -1) setActive(best);
      },
      { root: track, threshold: [0.5, 1.0] },
    );
    items.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="relative mt-16">
      <div
        ref={trackRef}
        className="no-scrollbar -mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-1 sm:mx-0 sm:grid sm:grid-cols-2 sm:px-0 sm:pb-0 lg:grid-cols-4"
      >
        {features.map((f, i) => {
          const wide = [0, 4, 6].includes(i);
          const media = featureMedia[f.title] ?? featureMedia["Spletna stran"];
          const Icon = media.icon;
          return (
            <div
              key={f.title}
              className={cn(
                "w-[82vw] shrink-0 snap-center overflow-hidden rounded-[22px] border border-[#ECEAF3] bg-[#F7F6FC] sm:w-auto sm:shrink",
                wide && "lg:col-span-2 lg:flex lg:flex-row",
              )}
            >
              <div
                className={cn(
                  "relative shrink-0 overflow-hidden bg-[#EDE8F8]",
                  wide ? "h-[170px] lg:h-auto lg:w-[44%]" : "h-[170px]",
                )}
              >
                <Image
                  src={media.image}
                  alt={media.alt}
                  fill
                  sizes={
                    wide
                      ? "(min-width: 1024px) 250px, (min-width: 640px) calc((100vw - 56px) / 2), 82vw"
                      : "(min-width: 1024px) 270px, (min-width: 640px) calc((100vw - 56px) / 2), 82vw"
                  }
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex flex-col justify-center p-5">
                <div className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-[#EFEBFF] text-lg text-[#6A5AE0]">
                  <Icon size={17} strokeWidth={2.3} />
                </div>
                <h3
                  className={cn(
                    "mt-3.5 font-bold tracking-[-.01em]",
                    wide ? "text-[16px] lg:text-[18px]" : "text-[16px]",
                  )}
                >
                  {f.title}
                </h3>
                <p className="mt-1.5 text-[13px] leading-[1.55] text-[#6A6775]">{f.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-5 flex justify-center gap-1.5 sm:hidden" aria-hidden>
        {features.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => {
              const track = trackRef.current;
              if (!track) return;
              const card = track.children[i] as HTMLElement;
              card.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
            }}
            className={cn(
              "h-1.5 rounded-full transition-all duration-200",
              i === active ? "w-5 bg-[#6A5AE0]" : "w-1.5 bg-[#D4D0E8]",
            )}
          />
        ))}
      </div>
    </div>
  );
}
