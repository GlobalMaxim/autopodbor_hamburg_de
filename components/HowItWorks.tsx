'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { motion } from 'motion/react';

type Step = { title: string; desc: string };

export default function HowItWorks({
  showMoreLink = false,
  showTitle = true,
  showBorder = true,
  gradient = false
}: {
  showMoreLink?: boolean;
  showTitle?: boolean;
  showBorder?: boolean;
  gradient?: boolean;
}) {
  const t = useTranslations('how');
  const c = useTranslations('common');
  const steps = t.raw('steps') as Step[];

  return (
    <section
      id="how-it-works"
      className={`relative scroll-mt-24 ${
        gradient ? 'bg-gradient-to-b from-surface via-accent/[0.08] to-surface' : 'bg-surface'
      } ${showBorder ? 'border-t border-line' : ''}`}
    >
      <div className="mx-auto max-w-3xl px-5 py-20">
        {showTitle && (
          <div className="inline-block">
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
              {t('title')}
            </h2>
            <div className="mt-3 h-[3px] w-full bg-gradient-to-r from-accent to-transparent" />
          </div>
        )}

        <ol className={`relative ${showTitle ? 'mt-12' : ''}`}>
          <div className="absolute bottom-4 left-4 top-2 w-px -translate-x-1/2 bg-gradient-to-b from-accent via-line to-transparent" />

          {steps.map((s, i) => (
            <motion.li
              key={s.title}
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              whileHover={{ x: 8 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.4, delay: i * 0.08, ease: 'easeOut' }}
              className="group relative flex items-start gap-6 pb-8 last:pb-0"
            >
              <span className="relative z-10 mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-accent bg-surface text-xs font-semibold text-accent transition-colors duration-300 group-hover:border-accent group-hover:bg-accent group-hover:text-white">
                {i + 1}
              </span>
              <div className="flex-1 rounded-2xl border border-line bg-surface-2 px-6 py-4 transition-all duration-300 group-hover:border-accent/60 group-hover:shadow-[0_12px_30px_-16px_rgba(233,32,49,0.4)]">
                <div className="text-base font-medium">{s.title}</div>
                <div className="mt-1 text-sm text-muted">{s.desc}</div>
              </div>
            </motion.li>
          ))}
        </ol>

        {showMoreLink && (
          <div className="mt-10 flex flex-col items-center gap-4 text-center">
            <Link
              href="/how-it-works#example"
              className="inline-flex items-center gap-2 rounded-full bg-accent px-8 py-4 text-base font-semibold text-white transition-all duration-300 hover:scale-[1.03] hover:bg-accent-strong hover:shadow-[0_8px_30px_-8px_rgba(233,32,49,0.6)]"
            >
              {t('exampleCta')} →
            </Link>
            <Link
              href="/how-it-works"
              className="text-sm text-accent hover:underline"
            >
              {c('more')} →
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
