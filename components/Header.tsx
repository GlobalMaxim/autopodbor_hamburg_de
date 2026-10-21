'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import LanguageSwitcher from './LanguageSwitcher';
import MobileMenu from './MobileMenu';

export default function Header({ locale }: { locale: string }) {
  const t = useTranslations('common');
  const s = useTranslations('services');

  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const burgerRef = useRef<HTMLButtonElement>(null);

  const closeMenu = () => {
    setOpen(false);
    burgerRef.current?.focus();
  };

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
    { href: '/services/pick', label: s('pick.title') },
    { href: '/prices', label: t('nav.prices') }
  ];

  const navAfterServices = [
    { href: '/how-it-works', label: t('nav.how') },
    { href: '/cases', label: t('nav.cases') },
    { href: '/video-reports', label: t('nav.videoReports') },
    { href: '/contacts', label: t('nav.contacts') }
  ];

  return (
    <header className={headerClass}>
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-5 md:h-16 xl:max-w-none xl:gap-12 xl:px-8 2xl:px-12">
        <div className="flex flex-1 items-center justify-between md:flex-none md:justify-start md:gap-3">
          <Link href="/" className="whitespace-nowrap text-base font-semibold tracking-tight md:text-lg">
            <span className="text-accent">AutoPodbor</span> Hamburg
          </Link>

          <button
            ref={burgerRef}
            onClick={() => setOpen(true)}
            aria-label={t('menuOpen')}
            aria-expanded={open}
            className="flex h-11 w-11 items-center justify-center rounded-full transition-colors hover:bg-surface-2 md:h-9 md:w-9 xl:hidden"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              className="h-5 w-5"
            >
              <path d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          </button>
        </div>

        <nav className="hidden items-center gap-6 text-base font-medium text-paper xl:flex">
          <Link href="/about" className="whitespace-nowrap transition-colors hover:text-accent">
            {t('nav.about')}
          </Link>

          <div className="group relative flex items-center">
            <button className="flex items-center gap-1 whitespace-nowrap transition-colors hover:text-accent">
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
              <Link
                href="/#services"
                className="block rounded-lg px-4 py-3 text-sm font-medium transition-colors hover:bg-surface-2 hover:text-accent"
              >
                {t('nav.allServices')}
              </Link>
              <div className="my-1 h-px bg-line" />
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

          {navAfterServices.map((i) => (
            <Link key={i.href} href={i.href} className="whitespace-nowrap transition-colors hover:text-accent">
              {i.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <LanguageSwitcher locale={locale} />
          <Link
            href="/socials"
            className="rounded-full bg-accent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-strong"
          >
            {t('ctaDiscuss')}
          </Link>
        </div>
      </div>

      <MobileMenu open={open} onClose={closeMenu} locale={locale} />
    </header>
  );
}
