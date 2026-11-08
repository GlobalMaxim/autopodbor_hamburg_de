import { getTranslations, setRequestLocale } from 'next-intl/server';
import { additionalServices, checkPricing, pickPricing, formatTierLabel, type PriceTier } from '@/lib/content';
import LeadCTA from '@/components/LeadCTA';
import Breadcrumbs from '@/components/Breadcrumbs';
import PageContainer from '@/components/PageContainer';

function PricingBlock({
  title,
  unit,
  tiers,
  note,
  cta,
  locale,
  under,
  over
}: {
  title: string;
  unit: string;
  tiers: PriceTier[];
  note: string;
  cta: string;
  locale: string;
  under: string;
  over: string;
}) {
  return (
    <div className="rounded-2xl border border-line bg-surface p-8">
      <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
      <p className="mt-2 text-sm text-muted">{unit}</p>

      <div className="mt-6 divide-y divide-line rounded-xl border border-line">
        {tiers.map((tier) => (
          <div
            key={`${tier.min}-${tier.max}`}
            className="flex items-center justify-between px-5 py-3"
          >
            <span className="text-sm text-muted">{formatTierLabel(tier, locale, under, over)}</span>
            <span className="font-semibold">€ {tier.price}</span>
          </div>
        ))}
      </div>

      <p className="mt-5 text-sm text-muted">{note}</p>

      <div className="mt-6">
        <LeadCTA label={cta} />
      </div>
    </div>
  );
}

export default async function PricesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('pricing');
  const tCommon = await getTranslations('common');

  return (
    <PageContainer className="py-16">
      <Breadcrumbs items={[{ label: tCommon('nav.prices') }]} />
      <h1 className="text-4xl font-semibold tracking-tight">{t('title')}</h1>
      <p className="mt-3 max-w-2xl text-muted">{t('subtitle')}</p>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        <PricingBlock
          title={t('check.title')}
          unit={t('check.unit')}
          tiers={checkPricing}
          note={t('check.note')}
          cta={t('check.cta')}
          locale={locale}
          under={t('under')}
          over={t('over')}
        />
        <PricingBlock
          title={t('pick.title')}
          unit={t('pick.unit')}
          tiers={pickPricing}
          note={t('pick.note')}
          cta={t('pick.cta')}
          locale={locale}
          under={t('under')}
          over={t('over')}
        />
      </div>

      <h2 className="mt-14 text-xl font-semibold">{t('additional')}</h2>
      <div className="mt-6 divide-y divide-line rounded-2xl border border-line bg-surface">
        {additionalServices.map((s) => (
          <div key={s.label} className="flex justify-between px-6 py-4">
            <span>{s.label}</span>
            <span className="font-medium">€ {s.price}</span>
          </div>
        ))}
      </div>

      <p className="mt-4 text-xs text-muted">{t('disclaimer')}</p>
    </PageContainer>
  );
}
