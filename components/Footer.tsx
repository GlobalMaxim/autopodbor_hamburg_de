'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { socials, contactPhones } from '@/lib/content';
import BrandIcon from './BrandIcon';

const MSG_BTN =
  'inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white transition-all duration-300 hover:scale-[1.03] active:scale-95 sm:w-auto';

export default function Footer() {
  const s = useTranslations('socials');
  const cta = useTranslations('footer.cta');

  // тот же источник данных, что страница "Контакты" — немецкий номер
  const germany = contactPhones.find((p) => p.countryKey === 'germany')!;
  const whatsappHref = `https://wa.me/${germany.digits}`;
  const telegramHref = `https://t.me/${germany.telegramUsername}`;

  const instagramUrl = socials.find((c) => c.platform === 'instagram')?.url;
  const tiktokUrl = socials.find((c) => c.platform === 'tiktok')?.url;

  return (
    <footer className="relative border-t border-line bg-surface">
      <div className="mx-auto max-w-6xl px-5 pb-[calc(24px+env(safe-area-inset-bottom))] pt-16 md:pb-16">
        <div className="text-center">
          <p className="text-xl font-semibold tracking-tight text-paper">{s('title')}</p>
          <p className="mx-auto mt-2 max-w-xl text-muted">{s('subtitle')}</p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href={telegramHref}
              target="_blank"
              rel="noopener noreferrer"
              className={`${MSG_BTN} bg-[#229ED9] hover:bg-[#1C8AC0] hover:shadow-[0_8px_30px_-8px_rgba(34,158,217,0.6)]`}
            >
              <BrandIcon platform="telegram" className="h-5 w-5 text-white" />
              {cta('telegram')}
            </a>
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className={`${MSG_BTN} bg-[#168A45] hover:bg-[#12733A] hover:shadow-[0_8px_30px_-8px_rgba(22,138,69,0.6)]`}
            >
              <BrandIcon platform="whatsapp" className="h-5 w-5 text-white" />
              {cta('whatsapp')}
            </a>
          </div>
        </div>

        <div className="mt-12 border-t border-line pt-6">
          {/* мобильные (<768px): три центрированные строки сверху вниз */}
          <div className="flex flex-col items-center md:hidden">
            <div className="flex items-center justify-center gap-3">
              {instagramUrl && (
                <a
                  href={instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="flex h-10 w-10 items-center justify-center transition-opacity hover:opacity-80"
                >
                  <BrandIcon platform="instagram" className="h-[22px] w-[22px]" />
                </a>
              )}
              {tiktokUrl && (
                <a
                  href={tiktokUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="TikTok"
                  className="flex h-10 w-10 items-center justify-center text-[#000000] transition-opacity hover:opacity-80"
                >
                  <BrandIcon platform="tiktok" className="h-[22px] w-[22px]" />
                </a>
              )}
            </div>

            <div className="mt-3 flex items-center justify-center text-sm text-[#5b6166]">
              <Link href="/impressum" className="hover:text-paper">
                Impressum
              </Link>
              <span className="px-2">·</span>
              <Link href="/datenschutz" className="hover:text-paper">
                Datenschutz
              </Link>
            </div>

            <div className="mt-3 text-[13px] text-muted">© {new Date().getFullYear()} AutoPodbor Hamburg</div>
          </div>

          {/* десктоп (≥768px): прежняя раскладка в одну строку */}
          <div className="hidden items-center justify-between gap-4 text-sm text-muted md:flex">
            <div>© {new Date().getFullYear()} AutoPodbor Hamburg</div>
            <div className="flex flex-wrap items-center justify-center">
              <div className="flex items-center gap-1">
                {instagramUrl && (
                  <a
                    href={instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram"
                    className="p-2 transition-opacity hover:opacity-80"
                  >
                    <BrandIcon platform="instagram" className="h-[18px] w-[18px]" />
                  </a>
                )}
                {tiktokUrl && (
                  <a
                    href={tiktokUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="TikTok"
                    className="p-2 text-[#000000] transition-opacity hover:opacity-80"
                  >
                    <BrandIcon platform="tiktok" className="h-[18px] w-[18px]" />
                  </a>
                )}
              </div>
              <span className="mx-3 h-4 w-px bg-line" />
              <div className="flex items-center gap-5">
                <Link href="/impressum" className="hover:text-paper">
                  Impressum
                </Link>
                <Link href="/datenschutz" className="hover:text-paper">
                  Datenschutz
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
