'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Link } from '@/i18n/navigation';

export const LANGS = [
  { code: 'ru', label: 'Русский', short: 'RU' },
  { code: 'de', label: 'Deutsch', short: 'DE' },
  { code: 'uk', label: 'Українська', short: 'UK' }
] as const;

export default function LanguageSwitcher({ locale }: { locale: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const path = pathname.replace(new RegExp(`^/${locale}(?=/|$)`), '') || '/';

  const current = LANGS.find((l) => l.code === locale) ?? LANGS[0];

  useEffect(() => {
    if (!open) return;

    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };

    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-full border border-black/10 px-3 py-3 text-sm font-medium transition-colors hover:border-black/20 md:py-1.5"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span>{current.short}</span>
        <span
          className={`text-xs text-muted transition-transform ${open ? 'rotate-180' : ''}`}
        >
          ▾
        </span>
      </button>

      {open && (
        <ul className="absolute right-0 top-full z-50 mt-2 w-40 overflow-hidden rounded-xl border border-line bg-surface-2 shadow-xl">
          {LANGS.map((l) => {
            const active = l.code === locale;
            return (
              <li key={l.code}>
                <Link
                  href={path as never}
                  locale={l.code}
                  onClick={() => setOpen(false)}
                  className={`flex items-center justify-between px-4 py-2.5 text-sm transition-colors ${
                    active
                      ? 'bg-accent/10 text-accent'
                      : 'text-muted hover:bg-surface hover:text-paper'
                  }`}
                >
                  <span>{l.label}</span>
                  {active && <span>✓</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
