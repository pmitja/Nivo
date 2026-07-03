/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { ArrowUpRight, MapPin, Phone } from "lucide-react";

import { Button } from "@/components/ui/button";
import { companyContactUrl, companyWebsiteUrl, type DirectoryCompany } from "@/lib/directory";

export function CompanyCard({ company }: { company: DirectoryCompany }) {
  const website = companyWebsiteUrl(company);

  return (
    <article className="group flex flex-col rounded-[20px] border border-[#ECEAF3] bg-white p-6 shadow-[0_2px_10px_rgba(20,19,29,.04)] transition-all duration-200 hover:-translate-y-1 hover:border-[#D8D2F0] hover:shadow-[0_18px_44px_rgba(20,19,29,.10)]">
      <div className="flex items-start gap-4">
        {company.logoUrl ? (
          <img
            src={company.logoUrl}
            alt={`Logotip podjetja ${company.name}`}
            width={52}
            height={52}
            className="h-[52px] w-[52px] shrink-0 rounded-[14px] border border-[#ECEAF3] bg-white object-contain p-1.5"
          />
        ) : (
          <span className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-[14px] bg-[#EFEBFF] text-xl font-extrabold text-[#6A5AE0]">
            {company.name.charAt(0).toUpperCase()}
          </span>
        )}
        <div className="min-w-0">
          <h3 className="text-[17px] font-extrabold leading-snug tracking-[-.01em]">{company.name}</h3>
          <div className="mt-1 text-[13.5px] font-semibold text-[#6A5AE0]">{company.industry}</div>
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-2 text-[14px] text-[#54515E]">
        <div className="flex items-center gap-2">
          <MapPin size={15} className="shrink-0 text-[#9A97A5]" />
          {company.city} in okolica
        </div>
        <a href={`tel:${company.phone.replace(/\s+/g, "")}`} className="flex items-center gap-2 font-semibold text-[#16151D] no-underline hover:text-[#6A5AE0]">
          <Phone size={15} className="shrink-0 text-[#9A97A5]" />
          {company.phone}
        </a>
      </div>

      <div className="mt-5 flex flex-wrap gap-2.5 border-t border-[#F1EFF7] pt-5">
        <Button asChild size="sm" className="flex-1">
          <Link href={companyContactUrl(company)}>Pošlji povpraševanje</Link>
        </Button>
        {website ? (
          <Button asChild size="sm" variant="secondary" className="flex-1">
            <a href={website} target="_blank" rel="noopener noreferrer">
              Spletna stran <ArrowUpRight size={15} />
            </a>
          </Button>
        ) : null}
      </div>
    </article>
  );
}
