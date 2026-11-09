'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import type { ReviewVideo } from '@/lib/reports/types';
import { isVideoStub } from '@/lib/reports/bunny';
import ReviewCard from './ReviewCard';
import VideoModal from '../reports/VideoModal';
import { ChevronLeftIcon, ChevronRightIcon } from '../reports/icons';

const ARROW_BTN =
  'absolute top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white text-paper shadow-lg transition-colors hover:bg-accent hover:text-white sm:flex';

export default function ReviewsCarousel({ videos }: { videos: ReviewVideo[] }) {
  const t = useTranslations('reviews');
  const trackRef = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState<ReviewVideo | null>(null);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const updateScrollState = () => {
    const el = trackRef.current;
    if (!el) return;
    setCanScrollPrev(el.scrollLeft > 4);
    setCanScrollNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  };

  useEffect(() => {
    updateScrollState();
    const el = trackRef.current;
    if (!el) return;
    el.addEventListener('scroll', updateScrollState, { passive: true });
    window.addEventListener('resize', updateScrollState);
    return () => {
      el.removeEventListener('scroll', updateScrollState);
      window.removeEventListener('resize', updateScrollState);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videos]);

  const open = (video: ReviewVideo) => {
    if (isVideoStub(video.id)) return;
    setPlaying(video);
  };

  const scrollByCards = (direction: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    const cardWidth = el.querySelector<HTMLElement>('[data-review-card]')?.clientWidth ?? 200;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    el.scrollBy({ left: direction * cardWidth * 2, behavior: reduceMotion ? 'auto' : 'smooth' });
  };

  return (
    <div className="relative mt-10">
      <div
        ref={trackRef}
        aria-label={t('carouselAria')}
        className="-mx-1 flex gap-2 overflow-x-auto px-1 py-1 scroll-pl-1 snap-x snap-mandatory no-scrollbar sm:gap-4"
      >
        {videos.map((v) => (
          <div key={v.id} data-review-card className="w-[40%] shrink-0 snap-start sm:w-[200px]">
            <ReviewCard video={v} onClick={() => open(v)} showLink={false} />
          </div>
        ))}
      </div>

      {canScrollPrev && (
        <button onClick={() => scrollByCards(-1)} aria-label={t('prevAria')} className={`${ARROW_BTN} left-2`}>
          <ChevronLeftIcon className="h-5 w-5" />
        </button>
      )}

      {canScrollNext && (
        <button onClick={() => scrollByCards(1)} aria-label={t('nextAria')} className={`${ARROW_BTN} right-2`}>
          <ChevronRightIcon className="h-5 w-5" />
        </button>
      )}

      <VideoModal video={playing} group={videos} onClose={() => setPlaying(null)} />
    </div>
  );
}
