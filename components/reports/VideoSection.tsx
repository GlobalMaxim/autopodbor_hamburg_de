'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import type { ReportDetailVideo, ReportVideoGroup } from '@/lib/reports/types';
import { formatDuration } from '@/lib/reports/types';
import { bunnyThumbnailUrl, isVideoStub } from '@/lib/reports/bunny';
import VideoModal from './VideoModal';
import { PlayIcon } from './icons';

const GRID = 'grid grid-cols-2 gap-3 md:grid-cols-[repeat(auto-fill,minmax(170px,1fr))] md:gap-4';

function VideoCard({ video, onClick }: { video: ReportDetailVideo; onClick: () => void }) {
  const stub = isVideoStub(video.id);
  const src = video.poster ?? (!stub ? bunnyThumbnailUrl(video.id) : null);

  return (
    <button
      onClick={onClick}
      disabled={stub}
      className={`group w-full text-left ${stub ? 'opacity-60' : ''}`}
    >
      <div
        className={`relative overflow-hidden rounded-xl bg-surface-2 group-hover:ring-2 group-hover:ring-accent group-focus-visible:ring-2 group-focus-visible:ring-accent ${
          video.portrait ? 'aspect-[9/16]' : 'aspect-video'
        }`}
      >
        {src && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={src} alt="" loading="lazy" className="h-full w-full object-cover" />
        )}

        {video.group !== null && (
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

      {video.hasCustomTitle && <div className="mt-2 line-clamp-2 text-sm font-medium">{video.title}</div>}
    </button>
  );
}

export default function VideoSection({ videoGroups }: { videoGroups: ReportVideoGroup[] }) {
  const t = useTranslations('videoReports');
  const [filter, setFilter] = useState<'all' | string>('all');
  const [playing, setPlaying] = useState<{ video: ReportDetailVideo; group: ReportDetailVideo[] } | null>(null);

  const totalCount = videoGroups.reduce((sum, g) => sum + g.videos.length, 0);
  const namedGroups = videoGroups.filter((g) => g.id !== null);
  const showChips = namedGroups.length >= 2;

  const visibleGroups = filter === 'all' ? videoGroups : videoGroups.filter((g) => g.id === filter);

  const openVideo = (video: ReportDetailVideo, group: ReportDetailVideo[]) => {
    if (isVideoStub(video.id)) return;
    setPlaying({ video, group });
  };

  return (
    <section className="mt-12">
      <div className="flex flex-wrap items-baseline gap-2">
        <h2 className="text-2xl font-semibold tracking-tight">{t('videosTitle')}</h2>
        <span className="text-sm text-muted">{t('videosCount', { count: totalCount })}</span>
      </div>

      {showChips && (
        <div className="-mx-5 mt-5 flex gap-2 overflow-x-auto px-5 no-scrollbar md:mx-0 md:px-0">
          <button
            onClick={() => setFilter('all')}
            aria-pressed={filter === 'all'}
            className={`min-h-[44px] shrink-0 rounded-full px-4 text-sm font-medium transition-colors ${
              filter === 'all' ? 'bg-paper text-white' : 'border border-line text-muted hover:border-accent/50'
            }`}
          >
            {t('tabAll')} {totalCount}
          </button>
          {namedGroups.map((g) => (
            <button
              key={g.id}
              onClick={() => setFilter(g.id as string)}
              aria-pressed={filter === g.id}
              className={`min-h-[44px] shrink-0 rounded-full px-4 text-sm font-medium transition-colors ${
                filter === g.id ? 'bg-paper text-white' : 'border border-line text-muted hover:border-accent/50'
              }`}
            >
              {g.title} {g.videos.length}
            </button>
          ))}
        </div>
      )}

      <div className="mt-5 flex flex-col gap-8">
        {visibleGroups.map((group, gi) => (
          <div key={group.id ?? `ungrouped-${gi}`}>
            {filter === 'all' && group.title && (
              <div className="mb-3 flex flex-wrap items-baseline gap-2">
                <h3 className="text-lg font-medium">{group.title}</h3>
                <span className="text-sm text-muted">{t('videosCount', { count: group.videos.length })}</span>
              </div>
            )}

            <div className={GRID}>
              {group.videos.map((v) => (
                <VideoCard key={v.id || v.title} video={v} onClick={() => openVideo(v, group.videos)} />
              ))}
            </div>
          </div>
        ))}
      </div>

      <VideoModal video={playing?.video ?? null} group={playing?.group ?? []} onClose={() => setPlaying(null)} />
    </section>
  );
}
