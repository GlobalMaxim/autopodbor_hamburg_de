'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { cases } from '@/lib/content';
import CaseCard from './CaseCard';

export default function CasesPreview() {
  const t = useTranslations('common');
  const c = useTranslations('cases');

  return (
    <section className="relative bg-surface">
      <div className="mx-auto max-w-6xl px-5 py-20">
      <div className="flex items-end justify-between">
        <div>
          <div className="inline-block">
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
              {t('nav.cases')}
            </h2>
            <div className="mt-3 h-[3px] w-full bg-gradient-to-r from-accent to-transparent" />
          </div>
          <p className="mt-3 max-w-xl text-muted">{c('intro')}</p>
        </div>
        <Link
          href="/cases"
          className="whitespace-nowrap text-sm text-accent hover:underline"
        >
          {t('ctaCases')} →
        </Link>
      </div>
      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {cases.slice(0, 3).map((c) => (
          <CaseCard key={c.slug} car={c} />
        ))}
      </div>
      </div>
    </section>
  );
}
