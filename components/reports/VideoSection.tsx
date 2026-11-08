'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import type { ReportDetailVideo, ReportVideoGroup } from '@/lib/reports/types';
import { isVideoStub } from '@/lib/reports/bunny';
import VideoCard, { VIDEO_GRID } from './VideoCard';
import VideoModal from './VideoModal';

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

            <div className={VIDEO_GRID}>
              {group.videos.map((v) => (
                <VideoCard
                  key={v.id || v.title}
                  video={{
                    id: v.id,
                    poster: v.poster,
                    durationSec: v.durationSec,
                    portrait: v.portrait,
                    number: v.group !== null ? v.number : null
                  }}
                  onClick={() => openVideo(v, group.videos)}
                  caption={
                    v.hasCustomTitle ? (
                      <div className="mt-2 line-clamp-2 text-sm font-medium">{v.title}</div>
                    ) : undefined
                  }
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      <VideoModal video={playing?.video ?? null} group={playing?.group ?? []} onClose={() => setPlaying(null)} />
    </section>
  );
}
