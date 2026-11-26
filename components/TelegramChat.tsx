'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { useTranslations } from 'next-intl';
import { telegramChatUrl } from '@/lib/content';
import BrandIcon from './BrandIcon';
import CopyTemplateButton from './CopyTemplateButton';

// Блок «чат Telegram» на страницах услуг: шапка-ссылка на профиль, сообщение, кнопка отправки и копирование.
// Общий для /services/check (готовый текст) и /services/pick (текст собирается из заявки).
// На lg+ липкий и держится по центру высоты окна; при открытии показывает «печатает…» (стили chat-* в globals.css).
export default function TelegramChat({
  avatarSrc,
  message,
  children,
  progress,
  id,
  className = ''
}: {
  avatarSrc: string | null;
  // текст, который уйдёт в Telegram и копируется
  message: string;
  // содержимое пузыря сообщения
  children: ReactNode;
  // необязательный блок над кнопкой (шкала заполнения заявки)
  progress?: ReactNode;
  // якорь для перехода с мобильной карточки
  id?: string;
  // положение в сетке страницы
  className?: string;
}) {
  const t = useTranslations('services');

  // высота блока меняется вместе с сообщением, поэтому отступ считаем по фактической высоте
  // (не выше 88px, чтобы не уйти под шапку); на мобильном блок не липкий и top не действует
  const ref = useRef<HTMLElement>(null);
  const [top, setTop] = useState(88);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => setTop(Math.max(88, Math.round((window.innerHeight - el.offsetHeight) / 2)));
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    window.addEventListener('resize', update);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', update);
    };
  }, []);

  return (
    <aside
      id={id}
      ref={ref}
      style={{ top }}
      className={`scroll-mt-24 overflow-hidden rounded-2xl border border-[#d5e0e8] bg-[#e7eef4] shadow-[0_2px_8px_rgba(233,32,49,0.08),0_10px_28px_-10px_rgba(233,32,49,0.28)] lg:sticky ${className}`}
    >
      {/* шапка чата — ссылка на профиль в Telegram (без готового текста) */}
      <a
        href={telegramChatUrl()}
        target="_blank"
        rel="noopener noreferrer"
        className="group/profile flex items-center gap-3 border-b border-[#d5e0e8] bg-white px-4 py-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent/50"
      >
        <span
          aria-hidden
          className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-accent text-xs font-semibold text-white"
        >
          {avatarSrc ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={avatarSrc} alt="" className="h-full w-full object-cover" />
          ) : (
            'AH'
          )}
        </span>
        <span className="min-w-0 text-[13px] leading-snug">
          <span className="block font-semibold text-paper transition-colors group-hover/profile:text-accent">
            AutoPodbor Hamburg
          </span>
          <span className="block text-xs text-good">{t('pick.form.online')}</span>
        </span>
      </a>

      <div className="relative max-h-[22rem] overflow-y-auto p-4 lg:max-h-[38vh]">
        {/* при открытии страницы на lg+: сначала «печатает…», затем сообщение */}
        <div
          aria-hidden
          className="chat-typing absolute bottom-4 right-4 w-14 items-center justify-center gap-[5px] rounded-2xl rounded-br-[4px] bg-white py-3"
        >
          <i className="h-[7px] w-[7px] rounded-full bg-[#9aa0a5]" />
          <i className="h-[7px] w-[7px] rounded-full bg-[#9aa0a5]" />
          <i className="h-[7px] w-[7px] rounded-full bg-[#9aa0a5]" />
        </div>
        <div
          aria-live="polite"
          className="chat-msg ml-5 break-words rounded-2xl rounded-br-[4px] bg-white px-4 py-3 text-sm leading-relaxed text-paper"
        >
          {children}
          <p className="mt-1 text-right text-[11px] text-muted">{t('pick.form.now')}</p>
        </div>
      </div>

      <div className="border-t border-[#d5e0e8] bg-white px-4 pb-4 pt-3">
        {progress}
        <a
          href={telegramChatUrl(message)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-accent px-6 text-sm font-semibold text-white transition-all duration-300 hover:scale-[1.02] hover:bg-accent-strong hover:shadow-[0_8px_30px_-8px_rgba(233,32,49,0.6)] active:scale-95 motion-reduce:transition-none"
        >
          {/* фирменный значок: синий кружок с белым самолётиком (белая подложка заполняет вырез в логотипе) */}
          <span aria-hidden className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white">
            <BrandIcon platform="telegram" className="h-6 w-6 text-[#229ED9]" />
          </span>
          {t('pick.form.send')}
        </a>
        <div className="mt-1 flex justify-center">
          <CopyTemplateButton
            text={message}
            label={t('pick.form.copy')}
            copiedLabel={t('pick.copied')}
            icon={
              <svg
                aria-hidden
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-3.5 w-3.5 shrink-0"
              >
                <rect x="9" y="9" width="12" height="12" rx="2" />
                <path d="M5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1" />
              </svg>
            }
            className="inline-flex min-h-11 items-center gap-1.5 text-xs text-muted transition-colors hover:text-accent"
          />
        </div>
      </div>
    </aside>
  );
}
