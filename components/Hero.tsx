'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'motion/react';
import { telegramUrl } from '@/lib/content';
import { Link } from '@/i18n/navigation';
import Parallax from './Parallax';

// список услуг вместо текстового подзаголовка
const chips = [
  'Проверка и диагностика',
  'Полное сопровождение сделки',
  'Временные и экспортные номера',
  'Организация покупки и доставки не только для жителей ЕС'
];

export default function Hero() {
  const t = useTranslations('hero');

  return (
    <section className="relative border-b border-line">
      {/* фон зафиксирован на экране — плавно, без скачков. Контент ниже скроллится как обычно и уходит, следующий блок (с непрозрачным фоном) накрывает картинку */}
      <div className="fixed inset-0">
        <img
          src="/images/hero/main2.jpg"
          alt=""
          className="h-full w-full object-cover object-right"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/85 to-ink/10" />

        <Parallax speed={0.3} className="pointer-events-none absolute inset-0">
          <div className="animate-scan absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-transparent via-accent/10 to-transparent" />
        </Parallax>
      </div>

      <div
        className="relative flex min-h-[calc(100svh-3.5rem)] max-w-5xl items-start pb-10 pl-5 pr-5 pt-8 sm:pl-[10%] md:h-[calc(100vh-4rem)] md:min-h-0 md:items-center md:py-10"
        style={{ fontFamily: 'var(--font-manrope)' }}
      >
        <div className="w-full max-w-2xl text-left">
          <h1>
            <motion.span
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="block text-4xl font-bold leading-tight tracking-tight sm:whitespace-nowrap sm:text-5xl md:text-6xl lg:text-7xl"
            >
              <span className="text-accent">{t('titleAccent')}</span> {t('titleRest')}
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="mt-4 block text-[clamp(22px,2.4vw,30px)] font-[650] leading-[1.3] text-paper"
            >
              {t('eyebrowPre')}
              <span className="text-accent">{t('eyebrowAccent')}</span>
            </motion.span>
            <motion.div
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="mt-3 h-[3px] w-full max-w-lg origin-left bg-gradient-to-r from-accent to-transparent"
            />
          </h1>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="glass mt-6 max-w-2xl rounded-2xl border border-white/60 px-8 py-6 text-left"
          >
            <ul className="space-y-2.5">
              {chips.map((c) => (
                <li key={c} className="flex items-start gap-3 text-lg font-[650] tracking-tight text-paper sm:text-xl">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mt-1 h-5 w-5 shrink-0 text-accent"
                  >
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65, duration: 0.5 }}
            className="mt-8 flex flex-wrap justify-start gap-3"
          >
            <a
              href={telegramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full rounded-2xl border border-white/20 bg-accent px-6 py-3 text-center text-sm font-semibold uppercase tracking-wide text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.35),0_6px_16px_-4px_rgba(0,0,0,0.35)] transition-all duration-300 hover:scale-[1.03] hover:bg-accent-strong hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.35),0_8px_30px_-8px_rgba(233,32,49,0.6)] md:w-auto"
              style={{ fontFamily: 'var(--font-manrope)' }}
            >
              {t('cta')}
            </a>
            <Link
              href="/video-reports"
              className="glass btn-video-reports inline-flex w-full items-center justify-center gap-2 whitespace-nowrap rounded-2xl border border-black/10 px-6 py-3 font-sans text-sm font-semibold text-paper shadow-[inset_0_1px_0_rgba(255,255,255,0.8),0_4px_14px_-4px_rgba(0,0,0,0.15)] transition-colors duration-200 hover:border-black/15 md:w-auto"
            >
              <svg viewBox="0 0 16 16" className="h-5 w-5 shrink-0 fill-accent">
                <path d="M4 2.5v11l9-5.5-9-5.5z" />
              </svg>
              {t('videoReportsLink')}
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
