import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import AccentUnderline from '@/components/AccentUnderline';

// TODO: убрать noindex после наполнения страницы реальными видеоотчётами
export const metadata: Metadata = {
  robots: { index: false }
};

export default async function VideoReportsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('videoReports');

  return (
    <div className="mx-auto max-w-4xl px-5 py-16">
      <h1 className="text-4xl font-semibold tracking-tight">{t('title')}</h1>
      <AccentUnderline className="mt-3" />
      {/* text-muted не проходит WCAG AA (≈4:1) на светлом фоне */}
      <p className="mt-4 max-w-2xl text-[#5b6166]">{t('subtitle')}</p>

      <div className="mt-8">
        <Link
          href="/contacts"
          className="inline-flex items-center gap-2 whitespace-nowrap rounded-2xl bg-accent px-6 py-3 text-sm font-semibold text-white transition-all duration-300 hover:scale-[1.03] hover:bg-accent-strong hover:shadow-[0_8px_30px_-8px_rgba(233,32,49,0.6)] active:scale-95"
        >
          {t('cta')}
        </Link>
      </div>
    </div>
  );
}
