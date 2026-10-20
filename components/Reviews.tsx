'use client';

import { useTranslations } from 'next-intl';
import { reviews } from '@/lib/content';

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5 text-accent" aria-label={`${rating}/5`}>
      {Array.from({ length: 5 }, (_, i) => (
        <svg
          key={i}
          viewBox="0 0 20 20"
          fill={i < rating ? 'currentColor' : 'none'}
          stroke="currentColor"
          strokeWidth="1.2"
          className="h-4 w-4"
        >
          <path d="M10 1.5l2.6 5.3 5.8.8-4.2 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8L1.6 7.6l5.8-.8z" />
        </svg>
      ))}
    </div>
  );
}

export default function Reviews() {
  const t = useTranslations('reviews');

  if (reviews.length === 0) return null;

  return (
    <section className="relative border-t border-line bg-ink">
      <div className="mx-auto max-w-6xl px-5 py-20">
        <div className="inline-block">
          <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
            {t('title')}
          </h2>
          <div className="mt-3 h-[3px] w-full bg-gradient-to-r from-accent to-transparent" />
        </div>
        <p className="mt-3 max-w-xl text-muted">{t('subtitle')}</p>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {reviews.map((r) => (
            <div
              key={r.name}
              className="rounded-2xl border border-line bg-surface p-6"
            >
              <div className="flex items-center justify-between">
                <Stars rating={r.rating} />
                <span className="text-xs text-muted">{r.source}</span>
              </div>
              <p className="mt-4 text-paper">{r.text}</p>
              <div className="mt-4 text-sm font-medium text-muted">
                {r.name}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
