'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { ArrowRight, Menu, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { navLinks } from '@/lib/site-data';

const ContactForm = dynamic(
  () => import('@/components/contact-form').then((module) => module.ContactForm),
  {
    loading: () => <div className="min-h-[520px] animate-pulse rounded-[22px] bg-white" aria-hidden="true" />,
  },
);

const englishNavLinks = [
  { label: "Services", href: "/services", key: "storitve" },
  { label: "How it works", href: "/how-it-works", key: "kako" },
  { label: "Pricing", href: "/pricing", key: "cenik" },
  { label: "Contractors", href: "/contractors", key: "izvajalci" },
  { label: "Contact", href: "/contact", key: "kontakt" },
];

export function MobileNav({ active, dashboardHref, locale = "sl" }: { active?: string; dashboardHref?: string | null; locale?: "sl" | "en" }) {
  const links = locale === "en" ? englishNavLinks : navLinks;
  const [open, setOpen] = useState(false);
  const [consultationOpen, setConsultationOpen] = useState(false);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, []);

  return (
    <>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? (locale === "en" ? "Close menu" : "Zapri meni") : (locale === "en" ? "Open menu" : "Odpri meni")}
        aria-expanded={open}
        className="relative flex h-9 w-9 items-center justify-center rounded-lg text-[#56535F] transition-colors hover:bg-[#F4F3FA] hover:text-[#16151D] md:hidden"
      >
        <Menu
          size={20}
          className={cn(
            'absolute transition-all duration-200',
            open ? 'rotate-90 scale-75 opacity-0' : 'rotate-0 scale-100 opacity-100',
          )}
        />
        <X
          size={20}
          className={cn(
            'absolute transition-all duration-200',
            open ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-75 opacity-0',
          )}
        />
      </button>

      <div
        aria-hidden={!open}
        className={cn(
          'absolute inset-x-0 top-full z-50 border-b border-[#ECEAF3] bg-white/95 shadow-[0_8px_24px_rgba(20,19,29,.08)] backdrop-blur-[12px] transition-all duration-300 ease-in-out md:hidden',
          open ? 'translate-y-0 opacity-100' : 'pointer-events-none -translate-y-2 opacity-0',
        )}
      >
        <div className="mx-auto flex max-w-[1200px] flex-col px-5 pb-5 pt-1">
          {links.map((link, i) => (
            <Link
              key={link.key}
              href={link.href}
              onClick={() => setOpen(false)}
              className={cn(
                'border-b border-[#F0EEF6] py-4 text-[16px] font-semibold no-underline transition-all duration-300',
                active === link.key ? 'text-[#6A5AE0]' : 'text-[#56535F] hover:text-[#16151D]',
                open ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0',
              )}
              style={{ transitionDelay: open ? `${50 + i * 40}ms` : '0ms' }}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href={dashboardHref ?? '/prijava'}
            onClick={() => setOpen(false)}
            className={cn(
              'pt-4 text-[16px] font-semibold text-[#16151D] no-underline transition-all duration-300 hover:text-[#6A5AE0]',
              open ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0',
            )}
            style={{ transitionDelay: open ? `${50 + links.length * 40}ms` : '0ms' }}
          >
            {dashboardHref ? (locale === "en" ? "Dashboard" : "Sistem") : (locale === "en" ? "Log in" : "Prijava")}
          </Link>
          {!dashboardHref ? (
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                setConsultationOpen(true);
              }}
              className={cn(
                'mt-5 flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-full bg-[#6654DB] px-5 py-3 text-[15px] font-extrabold text-white shadow-[0_14px_30px_rgba(102,84,219,.24)] transition-all duration-300 hover:bg-[#5443C4] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#6A5AE0]/20',
                open ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0',
              )}
              style={{ transitionDelay: open ? `${90 + links.length * 40}ms` : '0ms' }}
            >
              {locale === "en" ? "Book a free call" : "Brezplačen posvet"} <ArrowRight size={16} />
            </button>
          ) : null}
        </div>
      </div>

      {!dashboardHref ? (
        <Dialog open={consultationOpen} onOpenChange={setConsultationOpen}>
          <DialogContent className="max-h-[calc(100dvh-24px)] w-[calc(100vw-24px)] max-w-[600px] overflow-y-auto overscroll-contain rounded-[24px] border-0 bg-[#F7F5FC] p-2 sm:max-h-[88vh] sm:p-3">
            <DialogTitle className="sr-only">{locale === "en" ? "Book a free call" : "Rezervirajte brezplačen posvet"}</DialogTitle>
            <DialogDescription className="sr-only">
              {locale === "en" ? "Complete the form and we will reply within 24 hours." : "Izpolnite obrazec in odgovorili vam bomo v 24 urah."}
            </DialogDescription>
            <ContactForm locale={locale} />
          </DialogContent>
        </Dialog>
      ) : null}
    </>
  );
}
