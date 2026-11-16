'use client';

import { useEffect, useRef, useState } from 'react';
import {
  bunnyEmbedUrl,
  bunnyHlsUrl,
  bunnyThumbnailUrl,
} from '@/lib/reports/bunny';

// до монтирования всегда false — рендерим тот же iframe, что и на сервере, без hydration mismatch
export function useIsMobilePlayer(): boolean {
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setMounted(true);
    const mq = window.matchMedia('(max-width: 767px), (pointer: coarse)');
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  return mounted && isMobile;
}

function isAndroid(): boolean {
  return /Android/i.test(navigator.userAgent);
}

// Телефон: без нашей модалки. Видео стартует сразу и по тапу уходит в нативный полноэкранный плеер
// (iOS — сам, т.к. нет playsInline; Android — requestFullscreen). Выход из полного экрана -> onExit.
export function MobileVideoPlayer({
  videoId,
  poster,
  onExit,
  onNeedsTap,
}: {
  videoId: string;
  poster?: string;
  onExit?: () => void;
  onNeedsTap?: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const videoEl = videoRef.current;
    if (!videoEl) return;
    const src = bunnyHlsUrl(videoId);

    // iOS/Safari умеют HLS нативно — hls.js там не нужен и местами конфликтует
    if (videoEl.canPlayType('application/vnd.apple.mpegurl')) {
      videoEl.src = src;
      return;
    }

    let hls: import('hls.js').default | undefined;
    let cancelled = false;

    import('hls.js').then(({ default: Hls }) => {
      if (cancelled || !Hls.isSupported()) return;
      hls = new Hls();
      hls.loadSource(src);
      hls.attachMedia(videoEl);
    });

    return () => {
      cancelled = true;
      hls?.destroy();
    };
  }, [videoId]);

  useEffect(() => {
    const videoEl = videoRef.current;
    if (!videoEl || !onExit) return;
    const onFs = () => {
      if (!document.fullscreenElement) onExit();
    };
    videoEl.addEventListener('webkitendfullscreen', onExit);
    document.addEventListener('fullscreenchange', onFs);
    // автозапуск не удался (Safari требует жест) — просим показать плеер, чтобы нажали play
    const timer = window.setTimeout(() => {
      if (videoEl.paused) onNeedsTap?.();
    }, 1200);
    return () => {
      videoEl.removeEventListener('webkitendfullscreen', onExit);
      document.removeEventListener('fullscreenchange', onFs);
      window.clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onPlay = () => {
    const videoEl = videoRef.current;
    if (videoEl && isAndroid() && !document.fullscreenElement) {
      videoEl.requestFullscreen().catch(() => {});
    }
  };

  return (
    <video
      ref={videoRef}
      controls
      autoPlay
      preload="metadata"
      poster={poster ?? bunnyThumbnailUrl(videoId)}
      onPlay={onPlay}
      className="h-full w-full rounded-2xl bg-black"
    />
  );
}

export default function BunnyPlayer({
  videoId,
  poster,
}: {
  videoId: string;
  poster?: string;
}) {
  const isMobile = useIsMobilePlayer();

  if (isMobile) return <MobileVideoPlayer videoId={videoId} poster={poster} />;

  return (
    <iframe
      src={`${bunnyEmbedUrl(videoId)}?autoplay=true`}
      loading="lazy"
      allow="autoplay; fullscreen; picture-in-picture"
      allowFullScreen
      className="h-full w-full rounded-2xl bg-black"
    />
  );
}
