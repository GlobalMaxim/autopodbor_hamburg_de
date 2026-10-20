'use client';

import { useTranslations } from 'next-intl';
import { cases } from '@/lib/content';
import CaseCard from '@/components/CaseCard';

export default function CasesPage() {
  const t = useTranslations('common');
  const c = useTranslations('cases');

  return (
    <div className="mx-auto max-w-6xl px-5 py-16">
      <h1 className="text-4xl font-semibold tracking-tight">{t('nav.cases')}</h1>
      <p className="mt-3 text-muted">{c('intro')}</p>
      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {cases.map((c) => (
          <CaseCard key={c.slug} car={c} />
        ))}
      </div>
    </div>
  );
}
