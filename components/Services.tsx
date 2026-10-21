'use client';

import { useTranslations } from 'next-intl';
import ServiceCard from './ServiceCard';

export default function Services() {
  const t = useTranslations('services');
  const c = useTranslations('common');

  return (
    <section id="services" className="relative scroll-mt-14 bg-surface md:scroll-mt-16">
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
          ctaLabel={c('more')}
          ctaHref="/services/check"
        />
        <ServiceCard
          title={t('pick.title')}
          description={t('pick.desc')}
          steps={t.raw('pick.steps') as string[]}
          image="/images/services/pick.jpg?v=2"
          ctaLabel={c('more')}
          ctaHref="/services/pick"
        />
      </div>
      </div>
    </section>
  );
}
