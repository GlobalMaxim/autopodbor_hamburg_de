'use client';

import { useTranslations } from 'next-intl';
import ServiceCard from './ServiceCard';
import LeadCTA from './LeadCTA';
import { contactPhones } from '@/lib/content';

export default function Services() {
  const t = useTranslations('services');

  return (
    <section id="services" className="relative bg-surface">
      <div className="mx-auto max-w-6xl px-5 py-20">
      <div className="inline-block">
        <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
          {t('title')}
        </h2>
        <div className="mt-3 h-[3px] w-full bg-gradient-to-r from-accent to-transparent" />
      </div>
      <div className="mt-10 grid gap-6 md:grid-cols-2">
        <ServiceCard
          title={t('check.title')}
          description={t('check.desc')}
          steps={t.raw('check.steps') as string[]}
          image="/images/services/check.jpg?v=2"
          ctaLabel={t('check.cta')}
        />
        <ServiceCard
          title={t('pick.title')}
          description={t('pick.desc')}
          steps={t.raw('pick.steps') as string[]}
          image="/images/services/pick.jpg?v=2"
          ctaLabel={t('pick.cta')}
        />
      </div>

      <div
        className="mt-[34px] flex flex-col items-start gap-6 rounded-2xl border border-line bg-surface p-8 shadow-[inset_0_2px_24px_rgba(218,22,38,0.1)] sm:flex-row sm:items-center sm:justify-between"
        style={{ fontFamily: 'var(--font-manrope)' }}
      >
        <div>
          <p className="text-3xl font-extrabold tracking-tight">{t('whatsapp.title')}</p>
          <p className="mt-2 whitespace-nowrap text-sm font-[650] text-[#45687c]">{t('whatsapp.desc')}</p>
        </div>
        <LeadCTA
          variant="light"
          label={t('whatsapp.cta')}
          href={`https://wa.me/${contactPhones[0].digits}`}
        />
      </div>
      </div>
    </section>
  );
}
