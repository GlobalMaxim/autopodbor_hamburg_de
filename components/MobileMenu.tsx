'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';
import { contactPhones, socials } from '@/lib/content';
import BrandIcon from './BrandIcon';
import { LANGS } from './LanguageSwitcher';

const ITEM =
  'flex min-h-[48px] items-center justify-center border-b border-line text-center text-base font-medium transition-colors hover:text-accent [@media(max-height:700px)]:min-h-[40px]';
const SOCIAL_BTN = 'flex h-10 w-10 items-center justify-center rounded-full transition-all hover:opacity-90 active:scale-95';

export default function MobileMenu({
  open,
  onClose,
  locale
}: {
  open: boolean;
  onClose: () => void;
  locale: string;
}) {
  const t = useTranslations('common');
  const s = useTranslations('services');
  const pathname = usePathname();
  const isActive = (href: string) => pathname === href;
  const isServicePage = pathname === '/services/check' || pathname === '/services/pick';

  const [servicesOpen, setServicesOpen] = useState(isServicePage);
  const [visible, setVisible] = useState(false);
  const [pendingHref, setPendingHref] = useState<string | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  // что делать со скроллом фона, когда блокировка снимется (см. эффект блокировки ниже):
  // 'restore' — вернуть позицию, с которой открыли меню (закрытие без перехода);
  // 'top' — переход на новую страницу без якоря, скроллим в начало;
  // {hash} — переход (или якорь на текущей странице) — скроллим к элементу с этим id
  const closeIntentRef = useRef<'restore' | 'top' | { hash: string }>('restore');

  const isHighlighted = (href: string) => isActive(href) || pendingHref === href;

  // обычная ссылка: если это уже текущая страница — закрываем сразу, иначе подсвечиваем
  // и ждём смены pathname (эффект ниже), чтобы меню не закрывалось раньше, чем прогрузится новая страница
  const handleNavClick = (href: string) => {
    if (isActive(href)) {
      closeIntentRef.current = 'restore';
      onClose();
    } else {
      setPendingHref(href);
    }
  };

  // "Все услуги" ведёт на /#services — если мы уже на главной, pathname не поменяется
  // (меняется только якорь), поэтому закрываем сразу и сами скроллим к секции
  const handleAllServicesClick = () => {
    if (pathname === '/') {
      closeIntentRef.current = { hash: 'services' };
      onClose();
    } else {
      setPendingHref('/#services');
    }
  };

  useEffect(() => {
    if (open) {
      setServicesOpen(isServicePage);
      closeIntentRef.current = 'restore';
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    if (pendingHref !== null) {
      const hashIndex = pendingHref.indexOf('#');
      closeIntentRef.current = hashIndex === -1 ? 'top' : { hash: pendingHref.slice(hashIndex + 1) };
      setPendingHref(null);
      onClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  useEffect(() => {
    if (!open) {
      setVisible(false);
      return;
    }

    const raf = requestAnimationFrame(() => setVisible(true));

    // блокировка скролла фона, безопасная для iOS Safari (overflow:hidden один не держит touch-скролл) —
    // фиксируем body на месте и восстанавливаем позицию прокрутки при закрытии
    const scrollY = window.scrollY;
    const html = document.documentElement.style;
    const body = document.body.style;
    html.overflow = 'hidden';
    body.overflow = 'hidden';
    body.position = 'fixed';
    body.top = `-${scrollY}px`;
    body.left = '0';
    body.right = '0';

    const focusables = () =>
      Array.from(dialogRef.current?.querySelectorAll<HTMLElement>('a[href], button:not([disabled])') ?? []);

    focusables()[0]?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== 'Tab') return;
      const els = focusables();
      if (els.length === 0) return;
      const first = els[0];
      const last = els[els.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);

    return () => {
      cancelAnimationFrame(raf);
      html.overflow = '';
      body.overflow = '';
      body.position = '';
      body.top = '';
      body.left = '';
      body.right = '';

      const intent = closeIntentRef.current;
      if (intent === 'restore') {
        window.scrollTo(0, scrollY);
      } else if (intent === 'top') {
        window.scrollTo(0, 0);
      } else {
        const el = document.getElementById(intent.hash);
        if (el) {
          el.scrollIntoView({ block: 'start' });
        } else {
          // новая страница могла ещё не домонтироваться к этому моменту — пробуем через кадр
          requestAnimationFrame(() => document.getElementById(intent.hash)?.scrollIntoView({ block: 'start' }));
        }
      }
      closeIntentRef.current = 'restore';

      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  const germany = contactPhones.find((p) => p.countryKey === 'germany')!;
  const whatsappHref = `https://wa.me/${germany.digits}`;
  const telegramHref = `https://t.me/${germany.telegramUsername}`;
  const instagramUrl = socials.find((c) => c.platform === 'instagram')?.url;
  const tiktokUrl = socials.find((c) => c.platform === 'tiktok')?.url;

  const navAfterServices = [
    { href: '/how-it-works', label: t('nav.how') },
    { href: '/cases', label: t('nav.cases') },
    { href: '/video-reports', label: t('nav.videoReports') },
    { href: '/contacts', label: t('nav.contacts') },
    { href: '/prices', label: t('nav.prices') }
  ];

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label={t('menuOpen')}
      className={`fixed inset-0 z-[60] flex h-dvh flex-col bg-ink pt-[env(safe-area-inset-top)] transition-[opacity,transform] duration-200 ease-out motion-reduce:transition-none ${
        visible ? 'translate-y-0 opacity-100' : '-translate-y-2 opacity-0'
      }`}
    >
      <div className="flex h-14 shrink-0 items-center justify-between px-5">
        <Link href="/" onClick={onClose} className="whitespace-nowrap text-base font-semibold tracking-tight">
          <span className="text-accent">AutoPodbor</span> Hamburg
        </Link>
        <button
          onClick={onClose}
          aria-label={t('menuClose')}
          className="flex h-11 w-11 items-center justify-center rounded-full transition-colors hover:bg-surface-2"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="h-5 w-5">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>
      </div>

      <nav className="flex flex-1 flex-col justify-center px-5">
        <Link href="/" onClick={() => handleNavClick('/')} className={`${ITEM} ${isHighlighted('/') ? 'text-accent' : 'text-paper'}`}>
          {t('nav.home')}
        </Link>
        <Link
          href="/about"
          onClick={() => handleNavClick('/about')}
          className={`${ITEM} ${isHighlighted('/about') ? 'text-accent' : 'text-paper'}`}
        >
          {t('nav.about')}
        </Link>

        <button onClick={() => setServicesOpen((v) => !v)} className={`${ITEM} w-full gap-1.5 text-paper`}>
          {t('nav.services')}
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`h-4 w-4 shrink-0 transition-transform duration-200 ${servicesOpen ? 'rotate-180' : ''}`}
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </button>
        {servicesOpen && (
          <div className="flex flex-col items-center border-b border-line py-1">
            <Link
              href="/#services"
              onClick={handleAllServicesClick}
              className="py-2 text-center text-[15px] text-muted transition-colors hover:text-accent"
            >
              {t('nav.allServices')}
            </Link>
            <Link
              href="/services/check"
              onClick={() => handleNavClick('/services/check')}
              className={`py-2 text-center text-[15px] transition-colors hover:text-accent ${
                isHighlighted('/services/check') ? 'text-accent' : 'text-muted'
              }`}
            >
              {s('check.title')}
            </Link>
            <Link
              href="/services/pick"
              onClick={() => handleNavClick('/services/pick')}
              className={`py-2 text-center text-[15px] transition-colors hover:text-accent ${
                isHighlighted('/services/pick') ? 'text-accent' : 'text-muted'
              }`}
            >
              {s('pick.title')}
            </Link>
          </div>
        )}

        {navAfterServices.map((i) => (
          <Link
            key={i.href}
            href={i.href}
            onClick={() => handleNavClick(i.href)}
            className={`${ITEM} ${isHighlighted(i.href) ? 'text-accent' : 'text-paper'}`}
          >
            {i.label}
          </Link>
        ))}
      </nav>

      <div className="mobile-menu-bottom shrink-0 px-5">
        <div className="flex items-center justify-center gap-4">
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="WhatsApp"
            className={SOCIAL_BTN}
            style={{ backgroundColor: '#25D366' }}
          >
            <BrandIcon platform="whatsapp" className="h-[18px] w-[18px] text-white" />
          </a>
          <a
            href={telegramHref}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Telegram"
            className={SOCIAL_BTN}
            style={{ backgroundColor: '#229ED9' }}
          >
            <BrandIcon platform="telegram" className="h-[18px] w-[18px] text-white" />
          </a>
          {instagramUrl && (
            <a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className={SOCIAL_BTN}
              style={{ backgroundColor: '#E1306C' }}
            >
              <BrandIcon platform="instagram" className="h-[18px] w-[18px] text-white" />
            </a>
          )}
          {tiktokUrl && (
            <a
              href={tiktokUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="TikTok"
              className={SOCIAL_BTN}
              style={{ backgroundColor: '#000000' }}
            >
              <BrandIcon platform="tiktok" className="h-[18px] w-[18px] text-white" />
            </a>
          )}
        </div>

        <div className="mt-4 flex items-center justify-center gap-2">
          {LANGS.map((l) => {
            const active = l.code === locale;
            return (
              <Link
                key={l.code}
                href={pathname as never}
                locale={l.code}
                className={`rounded-full px-4 py-1.5 text-[15px] transition-colors ${
                  active ? 'border border-black/15 bg-white font-semibold text-paper' : 'text-muted'
                }`}
              >
                {l.short}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
