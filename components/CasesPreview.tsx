'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { cases } from '@/lib/content';
import CaseCard from './CaseCard';

const PREVIEW_COUNT = 3;

export default function CasesPreview() {
  const t = useTranslations('common');
  const c = useTranslations('cases');
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const items = cases.slice(0, PREVIEW_COUNT);

  // индекс активного кейса по положению скролла: ближайшая карточка к левому краю ленты
  const onScroll = () => {
    const el = trackRef.current;
    if (!el) return;
    const slides = (Array.from(el.children) as HTMLElement[]).slice(0, items.length);
    const origin = slides[0]?.offsetLeft ?? 0;
    let nearest = 0;
    let min = Infinity;
    slides.forEach((slide, i) => {
      const dist = Math.abs(slide.offsetLeft - origin - el.scrollLeft);
      if (dist < min) {
        min = dist;
        nearest = i;
      }
    });
    setActive(nearest);
  };

  // scrollend срабатывает после доводки до snap-позиции, когда обычный scroll уже не приходит
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    el.addEventListener('scrollend', onScroll);
    return () => el.removeEventListener('scrollend', onScroll);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section className="relative border-t border-line bg-surface">
      <div className="mx-auto max-w-6xl px-5 py-20">
        <div className="flex items-end justify-between gap-4">
          <div>
            <div className="inline-block">
              <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
                {t('nav.cases')}
              </h2>
              <div className="mt-3 h-[3px] w-full bg-gradient-to-r from-accent to-transparent" />
            </div>
            <p className="mt-3 max-w-xl text-muted">{c('intro')}</p>
          </div>
          <Link
            href="/cases"
            className="hidden whitespace-nowrap text-sm text-accent hover:underline md:block"
          >
            {t('ctaCases')} →
          </Link>
        </div>

        {/* мобильный: лента со свайпом, следующая карточка выглядывает справа; от md: сетка */}
        <div
          ref={trackRef}
          onScroll={onScroll}
          className="no-scrollbar -mx-5 mt-8 flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-pl-5 px-5 pb-6 pt-1 md:mx-0 md:mt-10 md:grid md:snap-none md:grid-cols-3 md:gap-6 md:overflow-visible md:px-0 md:pb-0 md:pt-0"
        >
          {items.map((car) => (
            <div key={car.slug} className="flex basis-[84%] shrink-0 snap-start md:basis-auto md:shrink">
              <CaseCard car={car} />
            </div>
          ))}
          {/* хвостовой отступ, чтобы последняя карточка не прилипала к правому краю экрана */}
          <div aria-hidden className="w-2 shrink-0 md:hidden" />
        </div>

        <div className="mt-1 flex items-center justify-between md:hidden">
          <div className="flex items-center gap-1.5" aria-hidden>
            {items.map((car, i) => (
              <span
                key={car.slug}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === active ? 'w-6 bg-accent' : 'w-1.5 bg-line'
                }`}
              />
            ))}
          </div>
          <Link href="/cases" className="-mr-2 inline-flex min-h-11 items-center px-2 text-sm font-medium text-accent">
            {t('ctaCases')} →
          </Link>
        </div>
      </div>
    </section>
  );
}
