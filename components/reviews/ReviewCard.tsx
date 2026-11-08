'use client';

import { useTranslations } from 'next-intl';
import type { ReviewVideo } from '@/lib/reports/types';
import { formatDuration } from '@/lib/reports/types';
import { bunnyThumbnailUrl, isVideoStub } from '@/lib/reports/bunny';
import { PlayIcon } from '../reports/icons';
import { ReelIcon, ExternalLinkIcon } from './icons';

export default function ReviewCard({ video, onClick }: { video: ReviewVideo; onClick: () => void }) {
  const t = useTranslations('reviewsPage');
  const stub = isVideoStub(video.id);
  const src = video.poster ?? (!stub ? bunnyThumbnailUrl(video.id) : null);

  return (
    <div className="w-full">
      <button onClick={onClick} disabled={stub} aria-label={t('openVideoAria')} className="group w-full text-left">
        <div className="relative aspect-[9/16] w-full overflow-hidden rounded-[14px] bg-[#2a2a2a] group-hover:ring-2 group-hover:ring-accent group-focus-visible:ring-2 group-focus-visible:ring-accent">
          {src && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={src} alt="" loading="lazy" className="h-full w-full object-cover" />
          )}

          <span className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-black/45 px-2 py-1 text-[11px] font-medium text-white">
            <ReelIcon className="h-3 w-3" />
            {t('reelLabel')}
          </span>

          {!stub && video.durationSec > 0 && (
            <span className="absolute right-2 top-2 rounded-full bg-black/45 px-2 py-1 text-[11px] font-medium text-white">
              {formatDuration(video.durationSec)}
            </span>
          )}

          <div className="absolute inset-0 flex items-center justify-center">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-paper">
              <PlayIcon className="h-4 w-4" />
            </span>
          </div>
        </div>
      </button>

      {video.instagramUrl && (
        <a
          href={video.instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-flex items-center gap-1 text-[12px] font-medium text-accent hover:underline"
        >
          {t('originalLinkLabel')}
          <ExternalLinkIcon className="h-3 w-3" />
        </a>
      )}
    </div>
  );
}
