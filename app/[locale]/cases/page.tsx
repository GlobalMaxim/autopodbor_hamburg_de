import { getTranslations, setRequestLocale } from 'next-intl/server';
import { cases } from '@/lib/content';
import CaseCard from '@/components/CaseCard';
import Breadcrumbs from '@/components/Breadcrumbs';

export default async function CasesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('common');
  const c = await getTranslations('cases');

  return (
    <div className="mx-auto max-w-6xl px-5 py-16">
      <Breadcrumbs items={[{ label: t('nav.cases') }]} />
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
