'use client';

import { useLocale, useTranslations } from 'next-intl';
import { checkPricing, pickPricing, formatTierLabel, type PriceTier } from '@/lib/content';
import LeadCTA from './LeadCTA';

function PricingCard({
  title,
  unit,
  tiers,
  note,
  cta
}: {
  title: string;
  unit: string;
  tiers: PriceTier[];
  note: string;
  cta: string;
}) {
  const locale = useLocale();
  const t = useTranslations('pricing');

  return (
    <div className="flex flex-col rounded-2xl border border-line bg-surface p-8">
      <h3 className="text-2xl font-semibold tracking-tight">{title}</h3>
      <p className="mt-2 text-sm text-muted">{unit}</p>

      <div className="mt-6 divide-y divide-line rounded-xl border border-line">
        {tiers.map((tier) => (
          <div
            key={`${tier.min}-${tier.max}`}
            className="flex items-center justify-between px-5 py-3"
          >
            <span className="text-sm text-muted">
              {formatTierLabel(tier, locale, t('under'), t('over'))}
            </span>
            <span className="font-semibold">€ {tier.price}</span>
          </div>
        ))}
      </div>

      <p className="mt-5 text-sm text-muted">{note}</p>

      <div className="mt-auto pt-6">
        <LeadCTA label={cta} />
      </div>
    </div>
  );
}

export default function Pricing() {
  const t = useTranslations('pricing');

  return (
    <section className="relative border-t border-line bg-surface">
      <div className="mx-auto max-w-6xl px-5 py-20">
        <div className="inline-block">
          <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
            {t('title')}
          </h2>
          <div className="mt-3 h-[3px] w-full bg-gradient-to-r from-accent to-transparent" />
        </div>
        <p className="mt-3 max-w-xl text-muted">{t('subtitle')}</p>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <PricingCard
            title={t('check.title')}
            unit={t('check.unit')}
            tiers={checkPricing}
            note={t('check.note')}
            cta={t('check.cta')}
          />
          <PricingCard
            title={t('pick.title')}
            unit={t('pick.unit')}
            tiers={pickPricing}
            note={t('pick.note')}
            cta={t('pick.cta')}
          />
        </div>
      </div>
    </section>
  );
}
