'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { navLinks } from '@/lib/site-data';

export function MobileNav({ active }: { active?: string }) {
  const [open, setOpen] = useState(false);

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
        aria-label={open ? 'Zapri meni' : 'Odpri meni'}
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
          {navLinks.map((link, i) => (
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
            href="/kontakt"
            onClick={() => setOpen(false)}
            className={cn(
              'pt-4 text-[16px] font-semibold text-[#16151D] no-underline transition-all duration-300 hover:text-[#6A5AE0]',
              open ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0',
            )}
            style={{ transitionDelay: open ? `${50 + navLinks.length * 40}ms` : '0ms' }}
          >
            Prijava
          </Link>
        </div>
      </div>
    </>
  );
}
