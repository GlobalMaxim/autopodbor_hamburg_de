'use client';

import { useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { lockScroll, unlockScroll } from '@/lib/scrollLock';
import BunnyPlayer from './BunnyPlayer';
import { CloseIcon } from './icons';

export default function VideoModal({ videoId, onClose }: { videoId: string | null; onClose: () => void }) {
  const t = useTranslations('videoReports');
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!videoId) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    lockScroll();
    dialogRef.current?.focus();
    return () => {
      document.removeEventListener('keydown', onKey);
      unlockScroll();
    };
  }, [videoId, onClose]);

  if (!videoId) return null;

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      tabIndex={-1}
      onClick={onClose}
      className="fixed inset-0 z-[90] flex items-center justify-center bg-ink/90 p-4 outline-none sm:p-10"
    >
      <button
        onClick={onClose}
        aria-label={t('close')}
        className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-surface text-paper shadow-lg transition-colors hover:bg-accent hover:text-white"
      >
        <CloseIcon />
      </button>

      <div onClick={(e) => e.stopPropagation()} className="aspect-video w-full max-w-4xl">
        <BunnyPlayer videoId={videoId} />
      </div>
    </div>
  );
}
