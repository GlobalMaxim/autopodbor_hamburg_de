'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import type { ReportDetailVideo } from '@/lib/reports/types';
import { formatDuration } from '@/lib/reports/types';
import { bunnyThumbnailUrl, isVideoStub } from '@/lib/reports/bunny';
import VideoModal from './VideoModal';
import { PlayIcon } from './icons';

const MOBILE_VISIBLE = 4;

function Thumbnail({ video, size }: { video: ReportDetailVideo; size: 'grid' | 'row' }) {
  const stub = isVideoStub(video.id);
  const src = video.poster ?? (!stub ? bunnyThumbnailUrl(video.id) : null);
  const playSize = size === 'grid' ? 'h-14 w-14' : 'h-9 w-9';

  return (
    <div className="relative h-full w-full overflow-hidden bg-surface-2">
      {src && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt="" loading="lazy" className="h-full w-full object-cover" />
      )}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className={`flex items-center justify-center rounded-full bg-accent text-white shadow-lg ${playSize}`}>
          <PlayIcon className={size === 'grid' ? 'h-6 w-6' : 'h-4 w-4'} />
        </span>
      </div>
      {!stub && video.durationSec > 0 && (
        <span className="absolute bottom-2 right-2 rounded bg-ink/70 px-1.5 py-0.5 text-xs font-medium text-white">
          {formatDuration(video.durationSec)}
        </span>
      )}
    </div>
  );
}

export default function VideoSection({ videos }: { videos: ReportDetailVideo[] }) {
  const t = useTranslations('videoReports');
  const [expanded, setExpanded] = useState(false);
  const [modalVideoId, setModalVideoId] = useState<string | null>(null);

  const openVideo = (video: ReportDetailVideo) => {
    if (isVideoStub(video.id)) return;
    setModalVideoId(video.id);
  };

  const mobileVisible = expanded ? videos : videos.slice(0, MOBILE_VISIBLE);
  const hiddenCount = videos.length - MOBILE_VISIBLE;

  return (
    <section className="mt-12">
      <div className="flex flex-wrap items-baseline gap-2">
        <h2 className="text-2xl font-semibold tracking-tight">{t('videosTitle')}</h2>
        <span className="text-sm text-muted">{t('videosCount', { count: videos.length })}</span>
      </div>

      {/* десктоп: сетка */}
      <div className="mt-5 hidden grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-4 md:grid">
        {videos.map((v) => {
          const stub = isVideoStub(v.id);
          return (
            <button
              key={`${v.id}-${v.title}`}
              onClick={() => openVideo(v)}
              disabled={stub}
              className={`text-left ${stub ? 'cursor-default' : ''}`}
            >
              <div className="aspect-video overflow-hidden rounded-xl">
                <Thumbnail video={v} size="grid" />
              </div>
              <div className="mt-2 text-sm font-semibold">{v.title}</div>
            </button>
          );
        })}
      </div>

      {/* мобильные: список строк */}
      <div className="mt-5 flex flex-col gap-3 md:hidden">
        {mobileVisible.map((v) => {
          const stub = isVideoStub(v.id);
          return (
            <button
              key={`${v.id}-${v.title}`}
              onClick={() => openVideo(v)}
              disabled={stub}
              className={`flex items-center gap-3 text-left ${stub ? 'cursor-default' : ''}`}
            >
              <div className="h-[74px] w-[132px] shrink-0 overflow-hidden rounded-lg">
                <Thumbnail video={v} size="row" />
              </div>
              <div className="text-sm font-semibold">{v.title}</div>
            </button>
          );
        })}
        {!expanded && hiddenCount > 0 && (
          <button
            onClick={() => setExpanded(true)}
            className="mt-1 inline-flex min-h-[44px] items-center self-start rounded-full border border-line px-5 text-sm font-medium text-muted transition-colors hover:border-accent/50"
          >
            {t('moreVideos', { count: hiddenCount })}
          </button>
        )}
      </div>

      <VideoModal videoId={modalVideoId} onClose={() => setModalVideoId(null)} />
    </section>
  );
}
