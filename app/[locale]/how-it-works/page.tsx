import { getTranslations, setRequestLocale } from 'next-intl/server';
import HowItWorks from '@/components/HowItWorks';
import ReportShowcase from '@/components/ReportShowcase';
import Breadcrumbs from '@/components/Breadcrumbs';
import { fetchReportTopics } from '@/lib/api';

export default async function HowItWorksPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('how');
  const tCommon = await getTranslations('common');
  const topics = await fetchReportTopics();

  return (
    <div className="bg-surface pt-10">
      <div className="mx-auto max-w-3xl px-5 pt-10 text-center">
        <Breadcrumbs items={[{ label: tCommon('nav.how') }]} />
        <h1 className="text-4xl font-semibold tracking-tight">{t('title')}</h1>
        <p className="mt-4 text-muted">{t('intro')}</p>
      </div>
      <HowItWorks showTitle={false} showBorder={false} gradient />
      {topics.length > 0 && <ReportShowcase topics={topics} />}
    </div>
  );
}
