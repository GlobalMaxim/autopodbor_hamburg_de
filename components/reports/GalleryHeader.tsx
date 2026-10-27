'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { usePhotoViewer } from './PhotoViewerProvider';
import { ArrowLeftIcon, CameraIcon } from './icons';

const PLACEHOLDER_COUNT = 5;

function PlaceholderTile({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center bg-surface-2 text-muted ${className}`}>
      <CameraIcon className="h-7 w-7" />
    </div>
  );
}

export default function GalleryHeader({ photos, altBase }: { photos: string[]; altBase: string }) {
  const t = useTranslations('videoReports');
  const { open } = usePhotoViewer();
  const [activeIndex, setActiveIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  const isPlaceholder = photos.length === 0;
  const rightPhotos = photos.slice(1, 5);
  const overflowCount = photos.length - 5;
  const showMoreTile = photos.length > 5;

  const onCarouselScroll = () => {
    const el = carouselRef.current;
    if (!el) return;
    const index = Math.round(el.scrollLeft / el.clientWidth);
    setActiveIndex(Math.max(0, Math.min(index, photos.length - 1)));
  };

  return (
    <div className="-mx-5 lg:mx-0">
      {/* десктоп: текстовая ссылка "назад" над галереей */}
      <div className="mx-5 mb-4 hidden lg:mx-0 lg:block">
        <Link href="/video-reports" className="inline-flex items-center gap-1.5 text-sm font-medium text-muted transition-colors hover:text-accent">
          <ArrowLeftIcon className="h-4 w-4" />
          {t('back')}
        </Link>
      </div>

      <div className="relative">
        {/* мобильные: круглая кнопка "назад" поверх галереи */}
        <Link
          href="/video-reports"
          aria-label={t('backAria')}
          className="absolute left-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-surface/90 text-paper shadow-lg transition-colors hover:bg-accent hover:text-white lg:hidden"
        >
          <ArrowLeftIcon />
        </Link>

        {/* десктоп (≥1024px): большое фото + сетка 2×2 */}
        <div className="hidden gap-3 lg:flex">
          {isPlaceholder ? (
            <>
              <PlaceholderTile className="h-[440px] flex-[2] rounded-2xl" />
              <div className="grid flex-1 grid-cols-2 grid-rows-2 gap-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <PlaceholderTile key={i} className="rounded-2xl" />
                ))}
              </div>
            </>
          ) : (
            <>
              <button
                onClick={() => open(photos, 0, altBase)}
                className="relative h-[440px] flex-[2] overflow-hidden rounded-2xl"
              >
                <Image src={photos[0]} alt={altBase} fill priority sizes="60vw" className="object-cover" />
              </button>
              {rightPhotos.length > 0 && (
                <div className="grid flex-1 grid-cols-2 grid-rows-2 gap-3">
                  {rightPhotos.map((src, i) => {
                    const isLastCell = i === 3 && showMoreTile;
                    return (
                      <button
                        key={src}
                        onClick={() => open(photos, isLastCell ? 0 : i + 1, altBase)}
                        className="relative overflow-hidden rounded-2xl"
                      >
                        <Image
                          src={src}
                          alt={altBase}
                          fill
                          loading={i === 0 ? 'eager' : 'lazy'}
                          sizes="25vw"
                          className="object-cover"
                        />
                        {isLastCell && (
                          <div className="absolute inset-0 flex items-center justify-center bg-ink/60 text-lg font-semibold text-white">
                            {t('galleryMore', { count: overflowCount })}
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>

        {/* мобильные (<1024px): горизонтальная карусель на всю ширину */}
        <div className="relative lg:hidden">
          <div
            ref={carouselRef}
            onScroll={onCarouselScroll}
            className="no-scrollbar flex h-[300px] w-full snap-x snap-mandatory overflow-x-auto"
          >
            {isPlaceholder
              ? Array.from({ length: PLACEHOLDER_COUNT }).map((_, i) => (
                  <PlaceholderTile key={i} className="h-[300px] w-full shrink-0 snap-start" />
                ))
              : photos.map((src, i) => (
                  <button
                    key={src}
                    onClick={() => open(photos, i, altBase)}
                    className="relative h-[300px] w-full shrink-0 snap-start"
                  >
                    <Image
                      src={src}
                      alt={altBase}
                      fill
                      priority={i === 0}
                      loading={i === 0 ? undefined : 'lazy'}
                      sizes="100vw"
                      className="object-cover"
                    />
                  </button>
                ))}
          </div>

          <div className="pointer-events-none absolute inset-x-4 bottom-3 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              {(isPlaceholder ? Array.from({ length: PLACEHOLDER_COUNT }) : photos).map((_, i) => (
                <span
                  key={i}
                  className={`h-1.5 rounded-full transition-all ${
                    i === activeIndex ? 'w-6 bg-accent' : 'w-1.5 bg-white/70'
                  }`}
                />
              ))}
            </div>
            {!isPlaceholder && (
              <div className="rounded-full bg-ink/70 px-2.5 py-1 text-xs font-medium text-white">
                {activeIndex + 1} / {photos.length}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
