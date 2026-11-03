'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { lockScroll, unlockScroll } from '@/lib/scrollLock';
import type { ReportDetailVideo } from '@/lib/reports/types';
import BunnyPlayer from './BunnyPlayer';
import { ChevronLeftIcon, ChevronRightIcon, CloseIcon } from './icons';

export default function VideoModal({
  video,
  group,
  onClose
}: {
  video: ReportDetailVideo | null;
  group: ReportDetailVideo[];
  onClose: () => void;
}) {
  const t = useTranslations('videoReports');
  const dialogRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (video) setIndex(Math.max(0, group.findIndex((v) => v.id === video.id)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [video]);

  const go = (delta: number) => {
    setIndex((i) => Math.max(0, Math.min(group.length - 1, i + delta)));
  };

  useEffect(() => {
    if (!video) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowLeft') go(-1);
      else if (e.key === 'ArrowRight') go(1);
    };
    document.addEventListener('keydown', onKey);
    lockScroll();
    dialogRef.current?.focus();
    return () => {
      document.removeEventListener('keydown', onKey);
      unlockScroll();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [video, onClose]);

  if (!video) return null;
  const current = group[index] ?? video;

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      tabIndex={-1}
      onClick={onClose}
      // inset-0 завязан на нижнюю границу, которая под Safari на iPhone скачет из-за
      // панели адреса — задаём верх и высоту 100dvh явно
      className="fixed inset-x-0 top-0 z-[90] flex h-[100dvh] items-center justify-center bg-ink p-0 outline-none sm:p-10"
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        aria-label={t('close')}
        className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-surface text-paper shadow-lg transition-colors hover:bg-accent hover:text-white"
      >
        <CloseIcon />
      </button>

      {group.length > 1 && (
        <div className="absolute left-1/2 top-4 -translate-x-1/2 rounded-full bg-paper/70 px-3 py-1 text-sm font-medium text-white">
          {index + 1} / {group.length}
        </div>
      )}

      {index > 0 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            go(-1);
          }}
          aria-label={t('prevVideo')}
          className="absolute left-4 top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-surface/90 text-paper shadow-lg transition-colors hover:bg-accent hover:text-white md:flex"
        >
          <ChevronLeftIcon />
        </button>
      )}

      {index < group.length - 1 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            go(1);
          }}
          aria-label={t('nextVideo')}
          className="absolute right-4 top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-surface/90 text-paper shadow-lg transition-colors hover:bg-accent hover:text-white md:flex"
        >
          <ChevronRightIcon />
        </button>
      )}

      <div
        onClick={(e) => e.stopPropagation()}
        className={
          current.portrait
            ? 'relative h-[100dvh] w-full sm:mx-auto sm:aspect-[9/16] sm:h-[min(86dvh,820px)] sm:w-auto'
            : 'relative aspect-video w-full max-w-4xl'
        }
      >
        <BunnyPlayer key={current.id} videoId={current.id} />
      </div>
    </div>
  );
}
