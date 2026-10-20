import { getTranslations } from 'next-intl/server';
import HowItWorks from '@/components/HowItWorks';
import ReportShowcase from '@/components/ReportShowcase';
import { fetchReportTopics } from '@/lib/api';

export default async function HowItWorksPage() {
  const t = await getTranslations('how');
  const topics = await fetchReportTopics();

  return (
    <div className="bg-surface pt-10">
      <div className="mx-auto max-w-3xl px-5 pt-10 text-center">
        <h1 className="text-4xl font-semibold tracking-tight">{t('title')}</h1>
        <p className="mt-4 text-muted">{t('intro')}</p>
      </div>
      <HowItWorks showTitle={false} showBorder={false} gradient />
      {topics.length > 0 && <ReportShowcase topics={topics} />}
    </div>
  );
}
