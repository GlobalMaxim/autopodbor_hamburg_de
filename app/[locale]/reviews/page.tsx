import { getTranslations, setRequestLocale } from 'next-intl/server';
import Breadcrumbs from '@/components/Breadcrumbs';
import PageContainer from '@/components/PageContainer';

export default async function ReviewsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('common');

  return (
    <PageContainer>
      <div className="max-w-3xl">
        <Breadcrumbs items={[{ label: t('nav.reviews') }]} />
        <h1 className="text-4xl font-semibold tracking-tight">{t('nav.reviews')}</h1>
        <p className="mt-4 text-muted">
          Отзывы клиентов появятся здесь в ближайшее время.
        </p>
      </div>
    </PageContainer>
  );
}
