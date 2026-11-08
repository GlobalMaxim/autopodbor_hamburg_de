import fs from 'node:fs';
import path from 'node:path';
import { getTranslations } from 'next-intl/server';
import BrandIcon from '@/components/BrandIcon';

const AVATAR_EXTENSIONS = ['webp', 'jpg', 'png'];

function findAvatar(): string | null {
  for (const ext of AVATAR_EXTENSIONS) {
    const file = `avatar.${ext}`;
    if (fs.existsSync(path.join(process.cwd(), 'public', 'reviews', file))) {
      return `/reviews/${file}`;
    }
  }
  return null;
}

export default async function ReviewsHeader({ instagramUrl }: { instagramUrl: string }) {
  const t = await getTranslations('reviewsPage');
  const avatarSrc = findAvatar();
  const handle = new URL(instagramUrl).pathname.replace(/^\/+|\/+$/g, '');

  const nickname = (className: string) => (
    <a
      href={instagramUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`items-center gap-1.5 text-sm font-medium text-paper outline-none focus-visible:rounded focus-visible:ring-2 focus-visible:ring-accent [overflow-wrap:anywhere] ${className}`}
    >
      <BrandIcon platform="instagram" className="h-4 w-4 flex-none" />@{handle}
    </a>
  );

  const subscribeButton = (className: string) => (
    <a
      href={instagramUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`rounded-full bg-accent px-[22px] py-[10px] text-[13px] font-medium text-white transition-colors hover:bg-accent-strong ${className}`}
    >
      {t('subscribeLabel')}
    </a>
  );

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-4">
        <div className="h-[76px] w-[76px] shrink-0 rounded-full border-2 border-[#d62976] p-0.5">
          {avatarSrc ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={avatarSrc} alt={t('avatarAlt', { handle })} className="h-full w-full rounded-full object-cover" />
          ) : (
            <div
              role="img"
              aria-label={t('avatarAlt', { handle })}
              className="flex h-full w-full items-center justify-center rounded-full bg-accent text-sm font-semibold text-white"
            >
              AP
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{t('title')}</h1>
          {nickname('hidden min-[560px]:inline-flex mt-1')}
          <div className="mt-1 text-sm text-muted">{t('subtitle')}</div>
        </div>

        {subscribeButton('ml-2 hidden shrink-0 min-[560px]:inline-flex')}
      </div>

      {nickname('flex w-full min-[560px]:hidden')}
      {subscribeButton('block w-full text-center min-[560px]:hidden')}
    </div>
  );
}
