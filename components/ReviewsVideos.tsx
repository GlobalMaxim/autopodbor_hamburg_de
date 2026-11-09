'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import type { ReviewVideo } from '@/lib/reports/types';
import { isVideoStub } from '@/lib/reports/bunny';
import ReviewCard from './reviews/ReviewCard';
import VideoModal from './reports/VideoModal';

const GRID =
  'hidden min-[640px]:grid min-[640px]:grid-cols-3 min-[640px]:gap-3 min-[900px]:grid-cols-4 min-[900px]:gap-4';
const CAROUSEL = 'mt-3 flex gap-2 overflow-x-auto snap-x snap-mandatory no-scrollbar';

export default function ReviewsVideos({ videos }: { videos: ReviewVideo[] }) {
  const t = useTranslations('reviewsPage');
  const [playing, setPlaying] = useState<ReviewVideo | null>(null);

  const open = (video: ReviewVideo) => {
    if (isVideoStub(video.id)) return;
    setPlaying(video);
  };

  return (
    <>
      <div className="min-[640px]:hidden">
        <div className="flex items-baseline justify-between text-xs text-muted">
          <span>{t('carouselTitle')}</span>
          <span>{t('carouselHint')}</span>
        </div>
        <div className={CAROUSEL}>
          {videos.map((v) => (
            <div key={v.id} className="w-[40%] shrink-0 snap-start">
              <ReviewCard video={v} onClick={() => open(v)} compact />
            </div>
          ))}
        </div>
      </div>

      <div className={GRID}>
        {videos.map((v) => (
          <ReviewCard key={v.id} video={v} onClick={() => open(v)} />
        ))}
      </div>

      <VideoModal video={playing} group={videos} onClose={() => setPlaying(null)} />
    </>
  );
}
