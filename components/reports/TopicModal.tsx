'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import type { TopicData, TopicItem, TopicVideoItem, TopicPhotoItem } from '@/lib/reports/types';
import { formatDuration } from '@/lib/reports/types';
import { bunnyThumbnailUrl, isVideoStub } from '@/lib/reports/bunny';
import { lockScroll, unlockScroll } from '@/lib/scrollLock';
import { usePhotoViewer } from './PhotoViewerProvider';
import BunnyPlayer from './BunnyPlayer';
import { ArrowLeftIcon, CameraIcon, CloseIcon, PlayIcon } from './icons';

type Tab = 'all' | 'video' | 'photo';
const SHOW_LIMIT = 12;
const PLACEHOLDER_COUNT = 6;

function PlaceholderTile() {
  return (
    <div className="flex aspect-[4/3] w-full items-center justify-center rounded-xl bg-surface-2 text-muted">
      <CameraIcon className="h-6 w-6" />
    </div>
  );
}

function TopicTile({
  item,
  onPlay,
  onOpenPhoto
}: {
  item: TopicItem;
  onPlay: (item: TopicVideoItem) => void;
  onOpenPhoto?: () => void;
}) {
  const t = useTranslations('videoReports');
  const carLine = item.carTitle ? `${item.carTitle}${item.carYear ? ` · ${item.carYear}` : ''}` : null;
  const stub = item.type === 'video' && isVideoStub(item.videoId);
  const thumbSrc =
    item.type === 'video' ? item.poster ?? (!stub ? bunnyThumbnailUrl(item.videoId) : null) : null;

  return (
    <div>
      {item.type === 'photo' ? (
        <button
          onClick={onOpenPhoto}
          className="relative block aspect-[4/3] w-full overflow-hidden rounded-xl bg-surface-2"
        >
          <Image
            src={item.src}
            alt={item.alt}
            fill
            loading="lazy"
            sizes="(max-width: 768px) 50vw, 220px"
            className="object-cover"
          />
        </button>
      ) : (
        <button
          onClick={() => !stub && onPlay(item)}
          disabled={stub}
          className={`relative block aspect-[4/3] w-full overflow-hidden rounded-xl bg-surface-2 ${stub ? 'cursor-default' : ''}`}
        >
          {thumbSrc && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={thumbSrc} alt="" className="h-full w-full object-cover" />
          )}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-accent text-white shadow-lg">
              <PlayIcon className="h-5 w-5" />
            </span>
          </div>
          {!stub && item.durationSec > 0 && (
            <span className="absolute bottom-2 right-2 rounded bg-ink/70 px-1.5 py-0.5 text-xs font-medium text-white">
              {formatDuration(item.durationSec)}
            </span>
          )}
        </button>
      )}

      <div className="mt-2 text-sm font-semibold">{item.type === 'photo' ? t('photoLabel') : item.title}</div>
      {carLine && item.reportSlug && (
        <Link
          href={`/video-reports/${item.reportSlug}`}
          className="mt-0.5 block text-sm text-muted transition-colors hover:text-accent"
        >
          {carLine} →
        </Link>
      )}
    </div>
  );
}

export default function TopicModal({
  topic,
  playingItem,
  onPlay,
  onBack
}: {
  topic: TopicData;
  playingItem: TopicVideoItem | null;
  onPlay: (item: TopicVideoItem) => void;
  onBack: () => void;
}) {
  const t = useTranslations('videoReports');
  const { open: openPhotoViewer, isOpen: photoViewerOpen } = usePhotoViewer();
  const [tab, setTab] = useState<Tab>('all');
  const [showAll, setShowAll] = useState(false);
  const [visible, setVisible] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const titleId = `topic-modal-title-${topic.id}`;

  useEffect(() => {
    const raf = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (photoViewerOpen) return;
      if (e.key === 'Escape') {
        onBack();
        return;
      }
      if (e.key !== 'Tab') return;
      const el = dialogRef.current;
      if (!el) return;
      const focusable = el.querySelectorAll<HTMLElement>('button:not([disabled]), a[href]');
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    lockScroll();
    dialogRef.current?.focus();
    return () => {
      document.removeEventListener('keydown', onKey);
      unlockScroll();
    };
  }, [onBack, photoViewerOpen]);

  const items = useMemo(() => {
    if (tab === 'all') return topic.items;
    return topic.items.filter((i) => i.type === tab);
  }, [tab, topic.items]);

  const photoItems = useMemo(
    () => items.filter((i): i is TopicPhotoItem => i.type === 'photo'),
    [items]
  );

  const visibleItems = showAll ? items : items.slice(0, SHOW_LIMIT);
  const showTabs = topic.counts.videos > 0 && topic.counts.photos > 0;
  const isPlaceholder = topic.items.length === 0;

  const selectTab = (key: Tab) => {
    setTab(key);
    setShowAll(false);
  };

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onBack();
      }}
      className="fixed inset-0 z-[80] flex items-end justify-center bg-white sm:items-center sm:bg-black/60 sm:p-8"
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className={`flex h-[100dvh] w-full flex-col bg-white outline-none transition-[transform,opacity] duration-200 ease-out motion-reduce:transition-none sm:h-[min(86vh,860px)] sm:w-[min(1080px,calc(100vw-64px))] sm:rounded-[20px] ${
          visible ? 'translate-y-0 sm:opacity-100' : 'translate-y-full sm:translate-y-6 sm:opacity-0'
        }`}
      >
        <div className="shrink-0 border-b border-line px-5 pb-4 pt-[calc(16px+env(safe-area-inset-top))] sm:pt-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 id={titleId} className="text-xl font-semibold tracking-tight sm:text-2xl">
                {topic.title}
              </h2>
              <p className="mt-1 text-sm text-muted">{topic.description}</p>
            </div>
            <button
              onClick={onBack}
              aria-label={t('close')}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-muted transition-colors hover:bg-surface-2 hover:text-paper"
            >
              <CloseIcon />
            </button>
          </div>

          {showTabs && !playingItem && (
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => selectTab('all')}
                className={`flex min-h-[40px] items-center rounded-full px-4 text-sm font-medium transition-colors ${
                  tab === 'all' ? 'bg-paper text-white' : 'border border-line text-muted hover:border-accent/50'
                }`}
              >
                {t('tabAll')} · {topic.items.length}
              </button>
              <button
                onClick={() => selectTab('video')}
                className={`flex min-h-[40px] items-center rounded-full px-4 text-sm font-medium transition-colors ${
                  tab === 'video' ? 'bg-paper text-white' : 'border border-line text-muted hover:border-accent/50'
                }`}
              >
                {t('tabVideos')} · {topic.counts.videos}
              </button>
              <button
                onClick={() => selectTab('photo')}
                className={`flex min-h-[40px] items-center rounded-full px-4 text-sm font-medium transition-colors ${
                  tab === 'photo' ? 'bg-paper text-white' : 'border border-line text-muted hover:border-accent/50'
                }`}
              >
                {t('tabPhotos')} · {topic.counts.photos}
              </button>
            </div>
          )}
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 pb-[calc(20px+env(safe-area-inset-bottom))]">
          {playingItem ? (
            <div>
              <button
                onClick={onBack}
                className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-muted transition-colors hover:text-accent"
              >
                <ArrowLeftIcon className="h-4 w-4" />
                {t('backToFolder')}
              </button>
              <div className="aspect-video w-full">
                <BunnyPlayer videoId={playingItem.videoId} />
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-[repeat(auto-fill,minmax(220px,1fr))]">
                {isPlaceholder
                  ? Array.from({ length: PLACEHOLDER_COUNT }).map((_, i) => <PlaceholderTile key={i} />)
                  : visibleItems.map((item) => (
                      <TopicTile
                        key={item.key}
                        item={item}
                        onPlay={onPlay}
                        onOpenPhoto={
                          item.type === 'photo'
                            ? () =>
                                openPhotoViewer(
                                  photoItems.map((p) => p.src),
                                  photoItems.findIndex((p) => p.key === item.key),
                                  topic.title
                                )
                            : undefined
                        }
                      />
                    ))}
              </div>

              {!showAll && !isPlaceholder && items.length > SHOW_LIMIT && (
                <button
                  onClick={() => setShowAll(true)}
                  className="mt-5 inline-flex min-h-[44px] items-center rounded-full border border-line px-5 text-sm font-medium text-muted transition-colors hover:border-accent/50"
                >
                  {t('showMore')}
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
