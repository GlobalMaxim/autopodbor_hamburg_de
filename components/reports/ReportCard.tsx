import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import type { ReportCardData } from '@/lib/reports';
import { formatPriceEur } from '@/lib/reports';
import { CameraIcon, PlayIcon } from './icons';

export default function ReportCard({ report }: { report: ReportCardData }) {
  const t = useTranslations('videoReports');

  return (
    <Link
      href={`/video-reports/${report.slug}`}
      className="group overflow-hidden rounded-2xl border border-line bg-surface transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_50px_-20px_rgba(0,0,0,0.25)]"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        {report.cover ? (
          <Image
            src={report.cover}
            alt={report.title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-surface-2 text-muted">
            <CameraIcon className="h-8 w-8" />
          </div>
        )}
        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full bg-ink/70 px-3 py-1.5 text-xs font-medium text-white">
          <PlayIcon className="h-3 w-3" />
          {t('cardBadge', { videos: report.videoCount, photos: report.photoCount })}
        </div>
      </div>

      <div className="p-5">
        <div className="text-lg font-semibold">{report.title}</div>
        {report.subtitle && <div className="mt-1 text-sm text-muted">{report.subtitle}</div>}
        {report.priceEur && <div className="mt-3 text-base font-semibold text-accent">{formatPriceEur(report.priceEur)}</div>}
      </div>
    </Link>
  );
}
