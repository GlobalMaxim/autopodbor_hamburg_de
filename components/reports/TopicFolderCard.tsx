import { useTranslations } from 'next-intl';
import { ArrowRightIcon, ClockIcon, PlayIcon } from './icons';

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
  const isEmpty = !cover;
  const countsLabel = [
    counts.videos > 0 ? t('videosCount', { count: counts.videos }) : null,
    counts.photos > 0 ? t('photosCount', { count: counts.photos }) : null
  ]
    .filter(Boolean)
    .join(' · ');

  return (
    <div className="topic-card-stack h-full">
      <button
        ref={buttonRef}
        type="button"
        onClick={isEmpty ? undefined : onClick}
        disabled={isEmpty}
        aria-haspopup={isEmpty ? undefined : 'dialog'}
        aria-label={ariaLabel}
        className="topic-card-button relative flex h-full w-full flex-col overflow-hidden rounded-2xl border border-line bg-white text-left outline-none"
      >
        <div className="relative aspect-[16/9] w-full shrink-0 overflow-hidden bg-surface-2">
          {isEmpty ? (
            <div className="flex h-full w-full items-center justify-center">
              <ClockIcon className="h-7 w-7 text-muted/70" />
            </div>
          ) : (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={cover} alt="" className="h-full w-full object-cover" />
              {coverIsVideo && (
                <div className="absolute inset-0 flex items-center justify-center bg-ink/10">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-paper shadow">
                    <PlayIcon className="h-4 w-4" />
                  </span>
                </div>
              )}
            </>
          )}
        </div>

        <div className="flex flex-1 items-start gap-2 p-4">
          <div className="min-w-0 flex-1">
            <div className="line-clamp-2 min-h-[2.75rem] font-semibold leading-snug">{title}</div>
            <div className="mt-1 text-sm text-muted">{isEmpty ? t('topicComingSoon') : countsLabel}</div>
          </div>
          {!isEmpty && <ArrowRightIcon className="topic-card-arrow mt-1 h-5 w-5 shrink-0 text-accent" />}
        </div>
      </button>
    </div>
  );
}
