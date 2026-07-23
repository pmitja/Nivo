import Link from "next/link";

import { cn } from "@/lib/utils";

export function LanguageSwitcher({
  locale,
  englishHref = "/",
  slovenianHref = "/sl",
  className,
}: {
  locale: "en" | "sl";
  englishHref?: string;
  slovenianHref?: string;
  className?: string;
}) {
  return (
    <div
      className={cn("inline-flex items-center rounded-full border border-[#E3E0EC] bg-white p-1 shadow-sm", className)}
      aria-label="Language"
    >
      <Link
        href={englishHref}
        lang="en"
        aria-current={locale === "en" ? "page" : undefined}
        className={cn(
          "flex min-h-8 min-w-10 items-center justify-center rounded-full px-2 text-xs font-extrabold transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#6A5AE0]/20",
          locale === "en" ? "bg-[#16151D] text-white" : "text-[#696572] hover:text-[#16151D]",
        )}
      >
        EN
      </Link>
      <Link
        href={slovenianHref}
        lang="sl"
        aria-current={locale === "sl" ? "page" : undefined}
        className={cn(
          "flex min-h-8 min-w-10 items-center justify-center rounded-full px-2 text-xs font-extrabold transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#6A5AE0]/20",
          locale === "sl" ? "bg-[#16151D] text-white" : "text-[#696572] hover:text-[#16151D]",
        )}
      >
        SL
      </Link>
    </div>
  );
}
