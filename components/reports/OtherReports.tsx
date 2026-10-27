import { useTranslations } from 'next-intl';
import type { ReportCardData } from '@/lib/reports';
import ReportCard from './ReportCard';

export default function OtherReports({ reports }: { reports: ReportCardData[] }) {
  const t = useTranslations('videoReports');

  if (!reports.length) return null;

  return (
    <section className="mt-16">
      <h2 className="text-2xl font-semibold tracking-tight">{t('otherReportsTitle')}</h2>
      <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {reports.map((r) => (
          <ReportCard key={r.slug} report={r} />
        ))}
      </div>
    </section>
  );
}
