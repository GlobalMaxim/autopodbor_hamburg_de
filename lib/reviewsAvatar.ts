import fs from 'node:fs';
import path from 'node:path';

// аватар аккаунта TikTok: файл public/reviews/avatar.(webp|jpg|png) кладётся вручную.
// Серверная функция (читает файловую систему); возвращает URL для <img> или null, если файла нет.
const AVATAR_EXTENSIONS = ['webp', 'jpg', 'png'];

export function findReviewsAvatar(): string | null {
  for (const ext of AVATAR_EXTENSIONS) {
    const file = `avatar.${ext}`;
    if (fs.existsSync(path.join(process.cwd(), 'public', 'reviews', file))) {
      return `/reviews/${file}`;
    }
  }
  return null;
}
