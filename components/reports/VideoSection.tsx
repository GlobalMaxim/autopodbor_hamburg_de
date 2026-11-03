'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import type { ReportDetailVideo, ReportVideoGroup } from '@/lib/reports/types';
import { formatDuration } from '@/lib/reports/types';
import { bunnyThumbnailUrl, isVideoStub } from '@/lib/reports/bunny';
import VideoModal from './VideoModal';
import { PlayIcon } from './icons';

function VideoCard({ video, onClick }: { video: ReportDetailVideo; onClick: () => void }) {
  const stub = isVideoStub(video.id);
  const src = video.poster ?? (!stub ? bunnyThumbnailUrl(video.id) : null);

  return (
    <button onClick={onClick} disabled={stub} className={`w-full text-left ${stub ? 'cursor-default' : ''}`}>
      <div className="relative aspect-[9/16] w-full overflow-hidden rounded-xl bg-surface-2">
        {src && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={src} alt="" loading="lazy" className="h-full w-full object-cover" />
        )}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-accent text-white shadow-lg">
            <PlayIcon className="h-5 w-5" />
          </span>
        </div>
        {!stub && video.durationSec > 0 && (
          <span className="absolute bottom-2 right-2 rounded bg-paper/70 px-1.5 py-0.5 text-xs font-medium text-white">
            {formatDuration(video.durationSec)}
          </span>
        )}
      </div>
      <div className="mt-2 line-clamp-2 text-sm font-medium">{video.title}</div>
    </button>
  );
}

export default function VideoSection({ videoGroups }: { videoGroups: ReportVideoGroup[] }) {
  const t = useTranslations('videoReports');
  const [playing, setPlaying] = useState<{ video: ReportDetailVideo; group: ReportDetailVideo[] } | null>(null);

  const totalCount = videoGroups.reduce((sum, g) => sum + g.videos.length, 0);

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

      <div className="mt-5 flex flex-col gap-8">
        {videoGroups.map((group, gi) => (
          <div key={group.id ?? `ungrouped-${gi}`}>
            {group.title && (
              <div className="mb-3 flex flex-wrap items-baseline gap-2">
                <h3 className="text-base font-semibold">{group.title}</h3>
                <span className="text-sm text-muted">{t('videosCount', { count: group.videos.length })}</span>
              </div>
            )}

            {/* телефон: горизонтальная прокрутка на всю ширину экрана */}
            <div className="-mx-5 flex gap-3 overflow-x-auto px-5 no-scrollbar md:hidden">
              {group.videos.map((v) => (
                <div key={v.id || v.title} className="w-[132px] shrink-0">
                  <VideoCard video={v} onClick={() => openVideo(v, group.videos)} />
                </div>
              ))}
            </div>

            {/* десктоп: сетка */}
            <div className="hidden grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-4 md:grid">
              {group.videos.map((v) => (
                <div key={v.id || v.title} className="max-w-[190px]">
                  <VideoCard video={v} onClick={() => openVideo(v, group.videos)} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <VideoModal video={playing?.video ?? null} group={playing?.group ?? []} onClose={() => setPlaying(null)} />
    </section>
  );
}
