import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

export default function ReportCta({ service }: { service: 'check' | 'pick' }) {
  const t = useTranslations('videoReports');

  return (
    <div className="mt-14 rounded-[20px] bg-accent px-6 py-10 text-center text-white sm:px-10">
      <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
        {service === 'pick' ? t('ctaPickTitle') : t('ctaCheckTitle')}
      </h2>
      <p className="mx-auto mt-3 max-w-xl text-white/90">{t('ctaText')}</p>
      <div className="mt-6">
        <Link
          href="/contacts"
          className="inline-flex items-center gap-2 whitespace-nowrap rounded-full bg-white px-8 py-3.5 text-base font-semibold text-accent transition-all duration-300 hover:scale-[1.03] active:scale-95"
        >
          {t('ctaButton')}
        </Link>
      </div>
    </div>
  );
}
