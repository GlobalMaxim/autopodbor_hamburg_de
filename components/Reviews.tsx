import { getLocale, getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { getReviewVideos } from '@/lib/reports';
import ReviewsCarousel from './reviews/ReviewsCarousel';

export default async function Reviews() {
  const locale = await getLocale();
  const t = await getTranslations('reviews');
  const tc = await getTranslations('common');
  const videos = getReviewVideos(locale as 'ru' | 'de' | 'uk');

  if (videos.length === 0) return null;

  return (
    <section className="relative border-t border-line bg-ink">
      <div className="mx-auto max-w-6xl px-5 py-20">
        <div className="flex items-end justify-between gap-4">
          <div>
            <div className="inline-block">
              <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
                {t('title')}
              </h2>
              <div className="mt-3 h-[3px] w-full bg-gradient-to-r from-accent to-transparent" />
            </div>
            <p className="mt-3 max-w-xl text-muted">{t('subtitle')}</p>
          </div>
          <Link
            href="/reviews"
            className="hidden whitespace-nowrap text-sm text-accent hover:underline md:block"
          >
            {tc('ctaReviews')} →
          </Link>
        </div>

        {/* на мобильном ссылка стоит под лентой рядом с индикатором, как в «Кейсах» */}
        <ReviewsCarousel
          videos={videos}
          mobileLink={
            <Link
              href="/reviews"
              className="-mr-2 inline-flex min-h-11 items-center px-2 text-sm font-medium text-accent"
            >
              {tc('ctaReviews')} →
            </Link>
          }
        />
      </div>
    </section>
  );
}
