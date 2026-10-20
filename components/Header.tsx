'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';
import LanguageSwitcher from './LanguageSwitcher';

export default function Header({ locale }: { locale: string }) {
  const t = useTranslations('common');
  const s = useTranslations('services');
  const pathname = usePathname();
  const isActive = (href: string) => pathname === href;

  const [open, setOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    let lastY = window.scrollY;
    let ticking = false;

    const update = () => {
      const y = window.scrollY;
      const delta = y - lastY;

      if (y < 16) {
        lastY = y;
      } else if (Math.abs(delta) > 8) {
        setHidden(delta > 0);
        lastY = y;
      }

      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const effectiveHidden = hidden && !open;

  const headerClass = `fixed inset-x-0 top-0 z-50 border-b border-line bg-ink/80 backdrop-blur transition-transform duration-200 ease-out motion-reduce:transition-none ${
    effectiveHidden ? '-translate-y-full' : 'translate-y-0'
  } md:sticky md:translate-y-0`;

  const serviceLinks = [
    { href: '/services/check', label: s('check.title') },
    { href: '/services/pick', label: s('pick.title') }
  ];

  const navAfterServices = [
    { href: '/how-it-works', label: t('nav.how') },
    { href: '/cases', label: t('nav.cases') },
    { href: '/contacts', label: t('nav.contacts') },
    { href: '/prices', label: t('nav.prices') }
  ];

  return (
    <header className={headerClass}>
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-5 md:h-16">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setOpen((v) => !v)}
            aria-label="Меню"
            className="flex h-11 w-11 items-center justify-center rounded-full transition-colors hover:bg-surface-2 md:h-9 md:w-9 lg:hidden"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              className="h-5 w-5"
            >
              {open ? <path d="M18 6 6 18M6 6l12 12" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>

          <Link href="/" className="sr-only md:not-sr-only md:text-lg md:font-semibold md:tracking-tight">
            <span className="text-accent">AutoPodbor</span> Hamburg
          </Link>
        </div>

        <nav className="hidden items-center text-base font-medium text-paper lg:flex">
          <Link href="/about" className="px-4 transition-colors hover:text-accent">
            {t('nav.about')}
          </Link>
          <span className="h-4 w-px bg-line" />

          <div className="group relative flex items-center">
            <button className="flex items-center gap-1 px-4 py-2 transition-colors hover:text-accent">
              {t('nav.services')}
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-3.5 w-3.5 transition-transform duration-200 group-hover:rotate-180"
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </button>
            <div className="invisible absolute left-0 top-full w-72 translate-y-1 rounded-xl border border-line bg-ink p-2 opacity-0 shadow-xl transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
              {serviceLinks.map((sl) => (
                <Link
                  key={sl.href}
                  href={sl.href}
                  className="block rounded-lg px-4 py-3 text-sm font-medium transition-colors hover:bg-surface-2 hover:text-accent"
                >
                  {sl.label}
                </Link>
              ))}
            </div>
          </div>
          <span className="h-4 w-px bg-line" />

          {navAfterServices.map((i, idx) => (
            <div key={i.href} className="flex items-center">
              <Link href={i.href} className="px-4 transition-colors hover:text-accent">
                {i.label}
              </Link>
              {idx < navAfterServices.length - 1 && <span className="h-4 w-px bg-line" />}
            </div>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <LanguageSwitcher locale={locale} />
          <Link
            href="/socials"
            className="hidden rounded-full bg-accent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-strong md:block"
          >
            {t('ctaDiscuss')}
          </Link>
        </div>
      </div>

      {open && (
        <nav className="flex flex-col border-t border-line px-5 py-2 text-base font-medium text-paper lg:hidden">
          <Link
            href="/"
            onClick={() => setOpen(false)}
            className={`border-b border-line py-3 transition-colors hover:text-accent ${
              isActive('/') ? 'text-accent' : ''
            }`}
          >
            {t('nav.home')}
          </Link>

          <Link
            href="/about"
            onClick={() => setOpen(false)}
            className={`border-b border-line py-3 transition-colors hover:text-accent ${
              isActive('/about') ? 'text-accent' : ''
            }`}
          >
            {t('nav.about')}
          </Link>

          <button
            onClick={() => setMobileServicesOpen((v) => !v)}
            className="flex items-center justify-between border-b border-line py-3 transition-colors hover:text-accent"
          >
            {t('nav.services')}
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={`h-4 w-4 transition-transform duration-200 ${mobileServicesOpen ? 'rotate-180' : ''}`}
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </button>
          {mobileServicesOpen && (
            <div className="flex flex-col border-b border-line bg-surface-2/50">
              {serviceLinks.map((sl) => (
                <Link
                  key={sl.href}
                  href={sl.href}
                  onClick={() => {
                    setOpen(false);
                    setMobileServicesOpen(false);
                  }}
                  className={`py-3 pl-4 text-sm transition-colors hover:text-accent ${
                    isActive(sl.href) ? 'text-accent' : ''
                  }`}
                >
                  {sl.label}
                </Link>
              ))}
            </div>
          )}

          {navAfterServices.map((i) => (
            <Link
              key={i.href}
              href={i.href}
              onClick={() => setOpen(false)}
              className={`border-b border-line py-3 transition-colors last:border-b-0 hover:text-accent ${
                isActive(i.href) ? 'text-accent' : ''
              }`}
            >
              {i.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
