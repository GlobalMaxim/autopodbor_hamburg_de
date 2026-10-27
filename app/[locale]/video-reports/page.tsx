import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import AccentUnderline from '@/components/AccentUnderline';
import ReportCard from '@/components/reports/ReportCard';
import TopicsSection from '@/components/reports/TopicsSection';
import { getAllReports, getTopics, hasPublishedReports } from '@/lib/reports';

export async function generateMetadata(): Promise<Metadata> {
  return { robots: { index: hasPublishedReports() } };
}

export default async function VideoReportsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const loc = locale as 'ru' | 'de' | 'uk';

  const t = await getTranslations('videoReports');
  const reports = getAllReports(loc);
  const topics = getTopics(loc);

  return (
    <div className="mx-auto max-w-6xl px-5 py-16">
      <h1 className="text-4xl font-semibold tracking-tight">{t('title')}</h1>
      <AccentUnderline className="mt-3" />
      {/* text-muted не проходит WCAG AA (≈4:1) на светлом фоне */}
      <p className="mt-4 max-w-2xl text-[#5b6166]">{t('subtitle')}</p>

      <TopicsSection topics={topics} />

      <h2 className="mt-16 text-2xl font-semibold tracking-tight">{t('reportsTitle')}</h2>

      {reports.length > 0 ? (
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {reports.map((report) => (
            <ReportCard key={report.slug} report={report} />
          ))}
        </div>
      ) : (
        <div className="mt-6">
          <p className="max-w-2xl text-[#5b6166]">{t('emptyTitle')}</p>
          <div className="mt-6">
            <Link
              href="/contacts"
              className="inline-flex items-center gap-2 whitespace-nowrap rounded-2xl bg-accent px-6 py-3 text-sm font-semibold text-white transition-all duration-300 hover:scale-[1.03] hover:bg-accent-strong hover:shadow-[0_8px_30px_-8px_rgba(233,32,49,0.6)] active:scale-95"
            >
              {t('cta')}
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
