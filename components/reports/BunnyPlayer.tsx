'use client';

import { useEffect, useRef, useState } from 'react';
import { bunnyEmbedUrl, bunnyHlsUrl, bunnyThumbnailUrl } from '@/lib/reports/bunny';

// до монтирования всегда false — рендерим тот же iframe, что и на сервере, без hydration mismatch
function useIsMobilePlayer(): boolean {
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

function MobileVideoPlayer({ videoId, poster }: { videoId: string; poster?: string }) {
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

export default function BunnyPlayer({ videoId, poster }: { videoId: string; poster?: string }) {
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
