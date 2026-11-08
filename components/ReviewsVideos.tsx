'use client';

import { useState } from 'react';
import type { ReviewVideo } from '@/lib/reports/types';
import { isVideoStub } from '@/lib/reports/bunny';
import ReviewCard from './reviews/ReviewCard';
import VideoModal from './reports/VideoModal';

const REVIEWS_GRID = 'grid grid-cols-2 gap-3 min-[560px]:grid-cols-3 min-[900px]:grid-cols-4 min-[900px]:gap-4';

export default function ReviewsVideos({ videos }: { videos: ReviewVideo[] }) {
  const [playing, setPlaying] = useState<ReviewVideo | null>(null);

  const open = (video: ReviewVideo) => {
    if (isVideoStub(video.id)) return;
    setPlaying(video);
  };

  return (
    <>
      <div className={REVIEWS_GRID}>
        {videos.map((v) => (
          <ReviewCard key={v.id} video={v} onClick={() => open(v)} />
        ))}
      </div>

      <VideoModal video={playing} group={videos} onClose={() => setPlaying(null)} />
    </>
  );
}
