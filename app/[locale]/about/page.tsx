import fs from 'node:fs';
import path from 'node:path';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import AccentUnderline from '@/components/AccentUnderline';
import Breadcrumbs from '@/components/Breadcrumbs';
import PageContainer from '@/components/PageContainer';
import CountUp from '@/components/CountUp';

const photoExists = fs.existsSync(path.join(process.cwd(), 'public/images/about/vyacheslav.webp'));

// <360px: горизонтально (как десктоп), 360–767px: вертикально 2 в ряд, md+: горизонтально 2 в ряд (не меняли)
// иконка слева на всю высоту карточки, справа цифра, под ней подпись
const statCard =
  'grid min-w-0 grid-cols-[auto_minmax(0,1fr)] items-center gap-x-3 rounded-2xl border border-line bg-surface p-3.5 text-left md:gap-x-4 md:p-5';
const statIcon =
  'flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent row-span-2 md:h-12 md:w-12';
const statIconSize = 'h-5 w-5 md:h-6 md:w-6';
const statValue =
  'text-[19px] font-semibold leading-none text-accent [font-variant-numeric:tabular-nums] min-[360px]:text-[24px] self-end md:text-[32px]';
const statLabel = 'mt-1 min-w-0 self-start text-sm leading-[1.3] text-muted xl:whitespace-nowrap';

function CarIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M3 13l1.5-4.5A2 2 0 0 1 6.4 7h11.2a2 2 0 0 1 1.9 1.5L21 13" />
      <path d="M3 13h18v4a1 1 0 0 1-1 1h-1a1 1 0 0 1-1-1v-1H6v1a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-4z" />
      <circle cx="7.5" cy="17.5" r="1.5" />
      <circle cx="16.5" cy="17.5" r="1.5" />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const tTitle = await getTranslations('about');
  const t = await getTranslations('about.page');
  const tCommon = await getTranslations('common');

  const textContent = (
    <div className="order-2 text-lg leading-[1.6] text-paper lg:order-none lg:col-start-1 lg:row-start-1 lg:max-w-[60ch] lg:self-center">
      <p>
        <strong className="font-medium">{t('greetingBold')}</strong>
        {t('greetingRest')}
      </p>
      <p className="mt-4">{t('body2Pre')}</p>
    </div>
  );

  const statsContent = (
    <div className="order-3 mt-10 grid grid-cols-1 gap-4 min-[360px]:grid-cols-2 min-[360px]:gap-3 md:grid-cols-2 md:gap-4 lg:col-span-1 lg:col-start-1 lg:row-start-2">
      <div className={statCard}>
        <div className={statIcon}>
          <CarIcon className={statIconSize} />
        </div>
        <div className={statValue}>
          <CountUp value={t('statCarsValue')} />
        </div>
        <div className={statLabel}>{t('statCarsLabel')}</div>
      </div>
      <div className={statCard}>
        <div className={statIcon}>
          <CheckIcon className={statIconSize} />
        </div>
        <div className={statValue}>
          <CountUp value={t('statOrdersValue')} />
        </div>
        <div className={statLabel}>{t('statOrdersLabel')}</div>
      </div>
    </div>
  );

  return (
    <PageContainer>
    <div className="mx-auto max-w-6xl">
      <Breadcrumbs items={[{ label: tCommon('nav.about') }]} />
      <h1 className="text-4xl font-semibold tracking-tight">{tTitle('title')}</h1>
      <AccentUnderline className="mt-3" />

      {photoExists ? (
        <div className="mt-10 flex flex-col lg:grid lg:grid-cols-[1fr_346px] lg:items-stretch lg:gap-x-20">
          {/* фото вынесено из потока через absolute — так его размер не задаёт высоту строки сетки;
              top-0 прижимает верх фото к верху текстового блока (col1), оно не поднимается выше описания */}
          <div className="order-1 mb-8 flex justify-center lg:order-none lg:col-start-2 lg:row-start-1 lg:mb-0 lg:relative lg:block">
            {/* кольцо: box-border + padding держат зазор к фото, общий диаметр = прежний размер фото */}
            <div
              className="box-border h-[202px] w-[202px] rounded-full border-[3px] bg-ink p-1 md:h-[259px] md:w-[259px] md:p-1.5 lg:absolute lg:-top-[50px] lg:h-[346px] lg:w-[346px]"
              style={{ borderColor: 'color-mix(in srgb, var(--color-accent) 60%, white)' }}
            >
              <picture>
                <source srcSet="/images/about/vyacheslav.webp" type="image/webp" />
                <img
                  src="/images/about/vyacheslav.jpg"
                  alt={t('photoAlt')}
                  width={400}
                  height={400}
                  loading="lazy"
                  className="h-full w-full rounded-full object-cover object-[55%_35%]"
                />
              </picture>
            </div>
          </div>

          {textContent}
          {statsContent}
        </div>
      ) : (
        <div className="mx-auto mt-10 max-w-[720px]">
          {textContent}
          {statsContent}
        </div>
      )}

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link
          href="/#services"
          className="teaser-shine inline-flex min-h-[48px] w-full items-center justify-center gap-2 whitespace-nowrap rounded-2xl bg-accent px-6 py-3 text-sm font-semibold text-white transition-all duration-300 hover:scale-[1.03] hover:bg-accent-strong hover:shadow-[0_8px_30px_-8px_rgba(233,32,49,0.6)] active:scale-95 sm:w-auto"
        >
          {t('ctaServices')} →
        </Link>
        <Link
          href="/contacts"
          className="inline-flex min-h-[48px] w-full items-center justify-center gap-2 whitespace-nowrap rounded-2xl border border-line px-6 py-3 text-sm font-semibold text-paper transition-colors hover:border-accent hover:text-accent sm:w-auto"
        >
          {t('ctaContact')}
        </Link>
      </div>
    </div>
    </PageContainer>
  );
}
