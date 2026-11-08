import { setRequestLocale } from 'next-intl/server';
import Breadcrumbs from '@/components/Breadcrumbs';

export default async function DatenschutzPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="mx-auto max-w-3xl px-5 py-16">
      <Breadcrumbs items={[{ label: 'Datenschutz' }]} />
      <h1 className="text-4xl font-semibold tracking-tight">Datenschutz</h1>
      <p className="mt-6 text-muted">
        Политика конфиденциальности. Текст готовится с учётом GDPR и реальных
        сервисов аналитики (PostHog, Sentry).
      </p>
    </div>
  );
}
