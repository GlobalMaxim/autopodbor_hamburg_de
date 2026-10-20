'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'motion/react';
import { telegramUrl } from '@/lib/content';
import Parallax from './Parallax';

// список услуг вместо текстового подзаголовка
const chips = [
  'Проверка и диагностика',
  'Полное сопровождение сделки',
  'Временные и экспортные номера',
  'Организация покупки и доставки не только для жителей ЕС'
];

const icon = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  className: 'h-4 w-4 shrink-0 text-accent'
} as const;

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
        className="relative flex h-[calc(100vh-4rem)] max-w-5xl items-center py-10 pl-5 pr-5 sm:pl-[10%]"
        style={{ fontFamily: 'var(--font-manrope)' }}
      >
        <div className="max-w-2xl text-left">
          <h1>
            <motion.span
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="block whitespace-nowrap text-4xl font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl lg:text-7xl"
            >
              <span className="text-accent">Автоподбор</span> Гамбург
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="mt-4 block text-xl font-[650] text-paper sm:text-2xl md:text-3xl"
            >
              {t('eyebrow')}
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
            className="mt-6 max-w-2xl rounded-2xl bg-accent/5 px-8 py-6 text-left"
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
              className="rounded-2xl border border-white/20 bg-accent px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.35),0_6px_16px_-4px_rgba(0,0,0,0.35)] transition-all duration-300 hover:scale-[1.03] hover:bg-accent-strong hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.35),0_8px_30px_-8px_rgba(233,32,49,0.6)]"
              style={{ fontFamily: 'var(--font-manrope)' }}
            >
              {t('cta')}
            </a>
            <button
              onClick={() =>
                document
                  .getElementById('how-it-works')
                  ?.scrollIntoView({ behavior: 'smooth' })
              }
              className="rounded-2xl border border-white/20 bg-gradient-to-r from-[#2fae66] to-[#167a3c] px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.35),0_6px_16px_-4px_rgba(0,0,0,0.35)] transition-all duration-300 hover:scale-[1.03] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.35),0_8px_30px_-8px_rgba(21,128,61,0.6)]"
              style={{ fontFamily: 'var(--font-manrope)' }}
            >
              {t('cta2')}
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="mt-14 flex flex-nowrap justify-start gap-x-8 gap-y-3 text-base text-paper"
          >
            <span className="inline-flex items-center gap-2 whitespace-nowrap">
              <svg {...icon}>
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              {t('loc')}
            </span>
            <span className="inline-flex items-center gap-2 whitespace-nowrap">
              <svg {...icon}>
                <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
                <circle cx="12" cy="13" r="3" />
              </svg>
              {t('media')}
            </span>
            <span className="inline-flex items-center gap-2 whitespace-nowrap">
              <svg {...icon}>
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <path d="M14 2v6h6" />
                <path d="M16 13H8" />
                <path d="M16 17H8" />
              </svg>
              {t('report')}
            </span>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
