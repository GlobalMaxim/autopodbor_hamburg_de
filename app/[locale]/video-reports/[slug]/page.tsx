import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { getAllReports, getAllReportSlugs, getReport, formatPriceEur } from '@/lib/reports';
import PhotoViewerProvider from '@/components/reports/PhotoViewerProvider';
import GalleryHeader from '@/components/reports/GalleryHeader';
import SpecsGrid from '@/components/reports/SpecsGrid';
import VideoSection from '@/components/reports/VideoSection';
import PhotoSection from '@/components/reports/PhotoSection';
import ReportCta from '@/components/reports/ReportCta';
import OtherReports from '@/components/reports/OtherReports';

const DATE_LOCALE: Record<string, string> = { ru: 'ru-RU', de: 'de-DE', uk: 'uk-UA' };

function formatInspectedDate(iso: string, locale: string): string {
  return new Intl.DateTimeFormat(DATE_LOCALE[locale] ?? 'ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(new Date(iso));
}

export function generateStaticParams() {
  return getAllReportSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const report = getReport(slug, locale as 'ru' | 'de' | 'uk');
  if (!report) return {};

  const t = await getTranslations({ locale, namespace: 'videoReports' });
  const c = await getTranslations({ locale, namespace: 'common' });
  const title = `${report.title}${t('metaSuffix')} | ${c('siteName')}`;

  return {
    title,
    description: report.subtitle,
    openGraph: report.cover ? { images: [report.cover] } : undefined,
    robots: report.draft ? { index: false } : undefined
  };
}

export default async function VideoReportPage({
  params
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const loc = locale as 'ru' | 'de' | 'uk';

  const report = getReport(slug, loc);
  if (!report) notFound();

  const t = await getTranslations('videoReports');
  const other = getAllReports(loc)
    .filter((r) => r.slug !== slug)
    .slice(0, 3);

  return (
    <PhotoViewerProvider>
      <div className="mx-auto max-w-5xl px-5 py-8 md:py-12">
        <GalleryHeader photos={report.mainPhotos} altBase={report.title} />

        <div className="mt-8 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <span className="inline-flex items-center rounded-full bg-surface-2 px-3 py-1 text-xs font-medium text-muted">
              {t('inspectedOn', { date: formatInspectedDate(report.inspectedAt, locale) })}
            </span>
            <h1 className="mt-3 text-[30px] font-bold tracking-tight md:text-[44px]">{report.title}</h1>
            {report.subtitle && <p className="mt-2 text-muted">{report.subtitle}</p>}
          </div>

          {report.priceEur && (
            <div className="shrink-0 md:text-right">
              <div className="text-sm text-muted">{t('priceLabel')}</div>
              <div className="text-2xl font-bold text-accent">{formatPriceEur(report.priceEur)}</div>
            </div>
          )}
        </div>

        <SpecsGrid specs={report.specs} />

        <VideoSection videos={report.videos} />

        <PhotoSection categories={report.categories} title={report.title} />

        <ReportCta service={report.service} />

        <OtherReports reports={other} />
      </div>
    </PhotoViewerProvider>
  );
}
