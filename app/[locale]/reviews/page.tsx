import { getTranslations, setRequestLocale } from 'next-intl/server';
import { getReviewVideos } from '@/lib/reports';
import { socials } from '@/lib/content';
import Breadcrumbs from '@/components/Breadcrumbs';
import PageContainer from '@/components/PageContainer';
import ReviewsHeader from '@/components/reviews/ReviewsHeader';
import ReviewsVideos from '@/components/ReviewsVideos';

export default async function ReviewsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const loc = locale as 'ru' | 'de' | 'uk';

  const t = await getTranslations('common');
  const tr = await getTranslations('reviewsPage');
  const videos = getReviewVideos(loc);
  const instagramUrl =
    socials.find((s) => s.platform === 'instagram' && s.enabled)?.url ?? 'https://instagram.com/autopodbor_hamburg_de';

  return (
    <PageContainer>
      <Breadcrumbs items={[{ label: t('nav.reviews') }]} />
      <ReviewsHeader instagramUrl={instagramUrl} />

      {videos.length === 0 ? (
        <p className="mt-10 text-muted">{tr('empty')}</p>
      ) : (
        <div className="mt-10">
          <ReviewsVideos videos={videos} />
        </div>
      )}
    </PageContainer>
  );
}
