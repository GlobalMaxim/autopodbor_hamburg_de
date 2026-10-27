'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import type { ReportPhotoCategory } from '@/lib/reports/types';
import { usePhotoViewer } from './PhotoViewerProvider';
import { CameraIcon } from './icons';

const MOBILE_LIMIT = 9;
const DESKTOP_LIMIT = 12;
const PLACEHOLDER_COUNT = 12;

function Tile({
  src,
  alt,
  onClick,
  className
}: {
  src?: string;
  alt?: string;
  onClick?: () => void;
  className: string;
}) {
  if (!src) {
    return (
      <div className={`flex items-center justify-center bg-surface-2 text-muted ${className}`}>
        <CameraIcon className="h-6 w-6" />
      </div>
    );
  }
  return (
    <button onClick={onClick} className={`relative overflow-hidden ${className}`}>
      <Image
        src={src}
        alt={alt ?? ''}
        fill
        loading="lazy"
        sizes="(max-width: 768px) 33vw, 200px"
        className="object-cover"
      />
    </button>
  );
}

export default function PhotoSection({
  categories,
  title
}: {
  categories: ReportPhotoCategory[];
  title: string;
}) {
  const t = useTranslations('videoReports');
  const { open } = usePhotoViewer();
  const [activeTab, setActiveTab] = useState<string>('all');
  const [showAll, setShowAll] = useState(false);

  const isPlaceholder = categories.length === 0;

  const currentPhotos = useMemo(() => {
    if (isPlaceholder) return [];
    if (activeTab === 'all') return categories.flatMap((c) => c.photos);
    return categories.find((c) => c.id === activeTab)?.photos ?? [];
  }, [activeTab, categories, isPlaceholder]);

  const activeCategoryLabel =
    activeTab === 'all' ? t('tabAll') : categories.find((c) => c.id === activeTab)?.label ?? '';

  const totalCount = isPlaceholder ? 0 : categories.reduce((sum, c) => sum + c.photos.length, 0);

  const selectTab = (id: string) => {
    setActiveTab(id);
    setShowAll(false);
  };

  const altFor = (index: number) => t('photoAlt', { title, category: activeCategoryLabel, index: index + 1 });

  const TILE_BASE = 'aspect-square rounded-[6px] md:aspect-[4/3] md:rounded-xl';
  // без "grid" — его добавляют сами вызовы (конфликт bare grid + hidden на одном узле иначе непредсказуем)
  const GRID_BASE = 'grid-cols-3 gap-1 md:grid-cols-[repeat(auto-fill,minmax(170px,1fr))] md:gap-[10px]';

  return (
    <section className="mt-12">
      <div className="flex flex-wrap items-baseline gap-2">
        <h2 className="text-2xl font-semibold tracking-tight">{t('photosTitle')}</h2>
        <span className="text-sm text-muted">{t('photosCount', { count: totalCount })}</span>
      </div>

      {!isPlaceholder && (
        <div className="no-scrollbar mt-5 flex gap-2 overflow-x-auto">
          <button
            onClick={() => selectTab('all')}
            className={`flex min-h-[44px] shrink-0 items-center rounded-full px-4 text-sm font-medium transition-colors ${
              activeTab === 'all' ? 'bg-paper text-white' : 'border border-line text-muted hover:border-accent/50'
            }`}
          >
            {t('tabAll')} · {totalCount}
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => selectTab(c.id)}
              className={`flex min-h-[44px] shrink-0 items-center rounded-full px-4 text-sm font-medium transition-colors ${
                activeTab === c.id ? 'bg-paper text-white' : 'border border-line text-muted hover:border-accent/50'
              }`}
            >
              {c.label} · {c.photos.length}
            </button>
          ))}
        </div>
      )}
      {isPlaceholder && (
        <div className="mt-5 flex gap-2">
          <span className="flex min-h-[44px] shrink-0 items-center rounded-full bg-paper px-4 text-sm font-medium text-white">
            {t('tabAll')}
          </span>
        </div>
      )}

      {/* мобильные: 3 колонки, лимит 9 */}
      <div className={`mt-4 grid md:hidden ${GRID_BASE}`}>
        {isPlaceholder
          ? Array.from({ length: PLACEHOLDER_COUNT }).map((_, i) => <Tile key={i} className={TILE_BASE} />)
          : currentPhotos.slice(0, MOBILE_LIMIT).map((src, i) => (
              <Tile key={src} src={src} alt={altFor(i)} className={TILE_BASE} onClick={() => open(currentPhotos, i, title)} />
            ))}
      </div>

      {/* десктоп: авто-колонки минимум 170px, лимит 12 */}
      <div className={`mt-4 hidden md:grid ${GRID_BASE}`}>
        {isPlaceholder
          ? Array.from({ length: PLACEHOLDER_COUNT }).map((_, i) => <Tile key={i} className={TILE_BASE} />)
          : currentPhotos.slice(0, DESKTOP_LIMIT).map((src, i) => (
              <Tile key={src} src={src} alt={altFor(i)} className={TILE_BASE} onClick={() => open(currentPhotos, i, title)} />
            ))}
      </div>

      {!showAll && !isPlaceholder && currentPhotos.length > MOBILE_LIMIT && (
        <button
          onClick={() => setShowAll(true)}
          className="mt-5 inline-flex min-h-[44px] items-center rounded-full border border-line px-5 text-sm font-medium text-muted transition-colors hover:border-accent/50 md:hidden"
        >
          {t('showAllPhotos', { count: currentPhotos.length })}
        </button>
      )}
      {!showAll && !isPlaceholder && currentPhotos.length > DESKTOP_LIMIT && (
        <button
          onClick={() => setShowAll(true)}
          className="mt-5 hidden min-h-[44px] items-center rounded-full border border-line px-5 text-sm font-medium text-muted transition-colors hover:border-accent/50 md:inline-flex"
        >
          {t('showAllPhotos', { count: currentPhotos.length })}
        </button>
      )}

      {showAll && !isPlaceholder && (
        <>
          <div className={`mt-1 grid md:hidden ${GRID_BASE}`}>
            {currentPhotos.slice(MOBILE_LIMIT).map((src, i) => (
              <Tile
                key={src}
                src={src}
                alt={altFor(i + MOBILE_LIMIT)}
                className={TILE_BASE}
                onClick={() => open(currentPhotos, i + MOBILE_LIMIT, title)}
              />
            ))}
          </div>
          <div className={`mt-1 hidden md:grid ${GRID_BASE}`}>
            {currentPhotos.slice(DESKTOP_LIMIT).map((src, i) => (
              <Tile
                key={src}
                src={src}
                alt={altFor(i + DESKTOP_LIMIT)}
                className={TILE_BASE}
                onClick={() => open(currentPhotos, i + DESKTOP_LIMIT, title)}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
