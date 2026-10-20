'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { motion } from 'motion/react';
import Parallax from './Parallax';

type Stat = { value: string; label: string };

export default function AboutSection() {
  const t = useTranslations('about');
  const c = useTranslations('common');
  const stats = t.raw('stats') as Stat[];

  return (
    <section className="relative border-t border-line bg-ink">
      <div className="mx-auto max-w-6xl px-5 py-16">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <div className="mb-3 h-[3px] w-16 bg-gradient-to-r from-accent to-transparent" />
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
              {t('title')}
            </h2>
            <p className="mt-3 max-w-xl text-muted">{t('intro')}</p>
          </div>
          <Link
            href="/about"
            className="whitespace-nowrap text-sm text-accent hover:underline"
          >
            {c('more')} →
          </Link>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {stats.map((s, i) => (
            <Parallax key={s.label} speed={0.08 + (i % 2) * 0.08}>
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.4, delay: i * 0.08, ease: 'easeOut' }}
                className="rounded-2xl border border-line bg-surface p-6 transition-colors duration-300 hover:border-accent/50"
              >
                <div className="text-3xl font-semibold text-accent">
                  {s.value}
                </div>
                <div className="mt-2 text-sm text-muted">{s.label}</div>
              </motion.div>
            </Parallax>
          ))}
        </div>
      </div>
    </section>
  );
}
