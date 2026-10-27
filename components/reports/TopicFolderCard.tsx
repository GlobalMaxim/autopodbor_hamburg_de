import { useTranslations } from 'next-intl';
import { PlayIcon } from './icons';

export default function TopicFolderCard({
  title,
  counts,
  cover,
  coverIsVideo,
  ariaLabel,
  onClick,
  buttonRef
}: {
  title: string;
  counts: { videos: number; photos: number };
  cover: string | null;
  coverIsVideo: boolean;
  ariaLabel: string;
  onClick: () => void;
  buttonRef?: (el: HTMLButtonElement | null) => void;
}) {
  const t = useTranslations('videoReports');
  const countsLabel = [
    counts.videos > 0 ? t('videosCount', { count: counts.videos }) : null,
    counts.photos > 0 ? t('photosCount', { count: counts.photos }) : null
  ]
    .filter(Boolean)
    .join(' · ');

  return (
    <div className="group relative">
      {/* вкладки стопки позади карточки — на hover едут вверх на 3px */}
      <div className="absolute inset-x-6 top-0 h-7 rounded-t-2xl bg-[#ECECEF] transition-transform duration-150 group-hover:-translate-y-[3px]" />
      <div className="absolute inset-x-3 top-1.5 h-7 rounded-t-2xl bg-[#F4F4F6] transition-transform duration-150 group-hover:-translate-y-[3px]" />

      <button
        ref={buttonRef}
        type="button"
        onClick={onClick}
        aria-haspopup="dialog"
        aria-label={ariaLabel}
        className="relative mt-2.5 w-full overflow-hidden rounded-2xl border border-line bg-white text-left"
      >
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-surface-2">
          {cover ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={cover} alt="" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-muted">
              <PlayIcon className="h-7 w-7" />
            </div>
          )}
          {coverIsVideo && cover && (
            <div className="absolute inset-0 flex items-center justify-center bg-ink/10">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-paper shadow">
                <PlayIcon className="h-4 w-4" />
              </span>
            </div>
          )}
        </div>
        <div className="p-4">
          <div className="font-semibold">{title}</div>
          {countsLabel && <div className="mt-1 text-sm text-muted">{countsLabel}</div>}
        </div>
      </button>
    </div>
  );
}
