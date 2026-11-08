'use client';

import type { ReactNode } from 'react';
import { formatDuration } from '@/lib/reports/types';
import { bunnyThumbnailUrl, isVideoStub } from '@/lib/reports/bunny';
import { PlayIcon } from './icons';

export const VIDEO_GRID = 'grid grid-cols-2 gap-3 md:grid-cols-[repeat(auto-fill,minmax(170px,1fr))] md:gap-4';

export type VideoCardVideo = {
  id: string;
  poster?: string;
  durationSec: number;
  portrait: boolean;
  // номер-бейдж в левом верхнем углу; null — не показывать
  number: number | null;
};

export default function VideoCard({
  video,
  onClick,
  caption
}: {
  video: VideoCardVideo;
  onClick: () => void;
  caption?: ReactNode;
}) {
  const stub = isVideoStub(video.id);
  const src = video.poster ?? (!stub ? bunnyThumbnailUrl(video.id) : null);

  return (
    <button onClick={onClick} disabled={stub} className={`group w-full text-left ${stub ? 'opacity-60' : ''}`}>
      <div
        className={`relative overflow-hidden rounded-xl bg-surface-2 group-hover:ring-2 group-hover:ring-accent group-focus-visible:ring-2 group-focus-visible:ring-accent ${
          video.portrait ? 'aspect-[9/16]' : 'aspect-video'
        }`}
      >
        {src && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={src} alt="" loading="lazy" className="h-full w-full object-cover" />
        )}

        {video.number !== null && (
          <span className="absolute left-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-paper/70 text-xs font-medium text-white">
            {video.number}
          </span>
        )}

        <div className="absolute inset-0 flex items-center justify-center">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-paper/60 text-white">
            <PlayIcon className="h-4 w-4" />
          </span>
        </div>

        {!stub && video.durationSec > 0 && (
          <span className="absolute bottom-1.5 left-1.5 flex items-center gap-1 rounded bg-paper/70 px-1.5 py-0.5 text-xs text-white">
            <PlayIcon className="h-2.5 w-2.5" />
            {formatDuration(video.durationSec)}
          </span>
        )}
      </div>

      {caption}
    </button>
  );
}
