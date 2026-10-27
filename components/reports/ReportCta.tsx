import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

export default function ReportCta({ service }: { service: 'check' | 'pick' }) {
  const t = useTranslations('videoReports');

  return (
    <div className="mt-14 flex flex-col gap-4 rounded-[20px] border border-accent/30 bg-accent/[0.06] p-5 sm:flex-row sm:items-center sm:justify-between sm:gap-8 sm:px-8 sm:py-6">
      <div className="min-w-0">
        <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
          {service === 'pick' ? t('ctaPickTitle') : t('ctaCheckTitle')}
        </h2>
        <p className="mt-1 text-sm text-muted sm:text-base">{t('ctaText')}</p>
      </div>
      <Link
        href="/contacts"
        className="inline-flex min-h-[48px] shrink-0 items-center justify-center whitespace-nowrap rounded-full bg-accent px-7 text-base font-semibold text-white transition-all duration-300 hover:scale-[1.03] active:scale-95"
      >
        {t('ctaButton')}
      </Link>
    </div>
  );
}
