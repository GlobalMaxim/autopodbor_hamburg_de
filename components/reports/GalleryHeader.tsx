'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { thumbSrc } from '@/lib/reports/types';
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

// полупрозрачная лента миниатюр поверх нижнего края главного фото
function ThumbStrip({
  photos,
  altBase,
  activeIndex,
  onSelect
}: {
  photos: string[];
  altBase: string;
  activeIndex?: number;
  onSelect: (i: number) => void;
}) {
  const stripRef = useRef<HTMLDivElement>(null);

  // держим активную миниатюру в поле зрения, не трогая вертикальный скролл страницы
  useEffect(() => {
    const strip = stripRef.current;
    if (!strip || activeIndex === undefined) return;
    const el = strip.children[activeIndex] as HTMLElement | undefined;
    if (!el) return;
    strip.scrollTo({
      left: el.offsetLeft - (strip.clientWidth - el.clientWidth) / 2,
      behavior: 'smooth'
    });
  }, [activeIndex]);

  if (photos.length < 2) return null;

  return (
    <div className="absolute inset-x-0 bottom-0 z-[5] bg-gradient-to-t from-black/50 to-transparent pt-3">
      <div ref={stripRef} className="no-scrollbar flex items-center gap-1 overflow-x-auto px-2 pb-1">
        {photos.map((src, i) => (
          <button
            key={src}
            onClick={() => onSelect(i)}
            aria-label={`${altBase} ${i + 1} / ${photos.length}`}
            aria-current={i === activeIndex ? 'true' : undefined}
            className={`relative aspect-[4/5] h-10 shrink-0 overflow-hidden rounded-[5px] border transition-all md:h-12 ${
              i === activeIndex ? 'border-white opacity-100' : 'border-white/30 opacity-70 hover:opacity-100'
            }`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={thumbSrc(src)} alt="" loading="lazy" className="h-full w-full object-cover" />
          </button>
        ))}
      </div>
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
              <div className="relative h-[440px] flex-[2] overflow-hidden rounded-2xl">
                <button onClick={() => open(photos, 0, altBase)} className="absolute inset-0">
                  <Image
                    unoptimized
                    src={photos[0]}
                    alt={altBase}
                    fill
                    priority
                    sizes="60vw"
                    className="object-cover"
                  />
                </button>
                <ThumbStrip photos={photos} altBase={altBase} onSelect={(i) => open(photos, i, altBase)} />
              </div>
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
                          unoptimized
                          src={thumbSrc(src)}
                          alt={isLastCell ? '' : altBase}
                          fill
                          loading={i === 0 ? 'eager' : 'lazy'}
                          sizes="25vw"
                          className={`object-cover ${isLastCell ? 'scale-110 blur-md' : ''}`}
                        />
                        {isLastCell && (
                          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/30 text-white">
                            <span className="text-2xl font-semibold">+{overflowCount}</span>
                            <span className="text-xs">{t('galleryMoreLabel')}</span>
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
            className="no-scrollbar flex h-[300px] md:h-[540px] w-full snap-x snap-mandatory overflow-x-auto"
          >
            {isPlaceholder
              ? Array.from({ length: PLACEHOLDER_COUNT }).map((_, i) => (
                  <PlaceholderTile key={i} className="h-[300px] md:h-[540px] w-full shrink-0 snap-start" />
                ))
              : photos.map((src, i) => (
                  <button
                    key={src}
                    onClick={() => open(photos, i, altBase)}
                    className="relative h-[300px] md:h-[540px] w-full shrink-0 snap-start bg-surface-2"
                  >
                    {/* полный размер только у текущего и соседних слайдов, у остальных лёгкое превью:
                        при 50+ фото иначе грузятся все файлы по 200-400 КБ, а быстрая прокрутка показывает пустые слайды */}
                    <Image
                      unoptimized
                      src={Math.abs(i - activeIndex) <= 1 ? src : thumbSrc(src)}
                      alt={altBase}
                      fill
                      priority={i === 0}
                      loading={i === 0 ? undefined : Math.abs(i - activeIndex) <= 2 ? 'eager' : 'lazy'}
                      sizes="100vw"
                      className="object-cover"
                    />
                  </button>
                ))}
          </div>

          {!isPlaceholder && (
            <ThumbStrip
              photos={photos}
              altBase={altBase}
              activeIndex={activeIndex}
              onSelect={(i) => {
                const el = carouselRef.current;
                if (el) el.scrollTo({ left: i * el.clientWidth, behavior: 'smooth' });
              }}
            />
          )}

          <div className="pointer-events-none absolute inset-x-4 bottom-3 z-10 flex items-center justify-end">
            {!isPlaceholder && (
              <div className="rounded-full bg-paper/70 px-2.5 py-1 text-xs font-medium text-white">
                {activeIndex + 1} / {photos.length}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
