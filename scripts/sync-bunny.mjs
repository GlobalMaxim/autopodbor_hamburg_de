#!/usr/bin/env node
// Синхронизация видео из Bunny Stream в data/videos.generated.json
//
// Запуск из корня проекта:
//   node --env-file=.env.local scripts/sync-bunny.mjs
//
// Нужен один секрет в .env.local:
//   BUNNY_API_KEY=...   (ключ БИБЛИОТЕКИ: Stream → твоя библиотека → API → API Key,
//                        а не общий ключ аккаунта)
//
// Library ID и CDN-хост не секретные, они зашиты ниже по умолчанию.
// При желании их можно переопределить через BUNNY_LIBRARY_ID и BUNNY_CDN_HOST.

import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const LIBRARY_ID = process.env.BUNNY_LIBRARY_ID ?? '797537';
const CDN_HOST = process.env.BUNNY_CDN_HOST ?? 'vz-6a7938ee-1f3.b-cdn.net';
const API_KEY = process.env.BUNNY_API_KEY;
const OUT_FILE = path.resolve(
  process.cwd(),
  process.env.BUNNY_OUT_FILE ?? 'data/videos.generated.json',
);

const API = 'https://video.bunnycdn.com';
const STATUS_FINISHED = 4; // видео полностью обработано

if (!API_KEY) {
  console.error(
    'Не найден BUNNY_API_KEY.\n' +
      'Добавь в .env.local строку BUNNY_API_KEY=... (ключ библиотеки из Stream → библиотека → API)\n' +
      'и запусти: node --env-file=.env.local scripts/sync-bunny.mjs',
  );
  process.exit(1);
}

async function api(pathname) {
  const res = await fetch(`${API}${pathname}`, {
    headers: { AccessKey: API_KEY, accept: 'application/json' },
  });
  if (res.status === 401) {
    throw new Error(
      '401: Bunny не принял ключ. Нужен API Key именно библиотеки ' +
        '(Stream → библиотека → API), а не ключ аккаунта.',
    );
  }
  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText} при запросе ${pathname}`);
  }
  return res.json();
}

// Забирает все страницы списка (Bunny отдаёт максимум 100 штук за раз)
async function fetchAll(pathname) {
  const items = [];
  for (let page = 1; ; page++) {
    const qs = new URLSearchParams({ page: String(page), itemsPerPage: '100' });
    const data = await api(`${pathname}?${qs}`);
    const batch = data.items ?? [];
    items.push(...batch);
    if (batch.length === 0 || items.length >= (data.totalItems ?? 0)) break;
  }
  return items;
}

const collator = new Intl.Collator('ru', { numeric: true, sensitivity: 'base' });

const TRANSLIT = {
  а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'e', ё: 'e', ж: 'zh', з: 'z',
  и: 'i', й: 'y', к: 'k', л: 'l', м: 'm', н: 'n', о: 'o', п: 'p', р: 'r',
  с: 's', т: 't', у: 'u', ф: 'f', х: 'h', ц: 'ts', ч: 'ch', ш: 'sh',
  щ: 'sch', ъ: '', ы: 'y', ь: '', э: 'e', ю: 'yu', я: 'ya',
};

function slugify(text) {
  return text
    .toLowerCase()
    .split('')
    .map((ch) => TRANSLIT[ch] ?? ch)
    .join('')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// "01 - Диагностика сканером.mp4" → "Диагностика сканером"
// Цифры в начале названия нужны только для порядка, на сайте их не показываем.
function cleanTitle(raw) {
  return (
    raw
      .replace(/\.(mp4|mov|mkv|avi|m4v)$/i, '')
      .replace(/^\s*\d{1,3}\s*[.)_\-–—]\s*/, '')
      .trim() || raw
  );
}

function formatDuration(seconds) {
  const s = Math.round(seconds);
  const m = Math.floor(s / 60);
  const h = Math.floor(m / 60);
  const pad = (n) => String(n).padStart(2, '0');
  return h > 0 ? `${h}:${pad(m % 60)}:${pad(s % 60)}` : `${m}:${pad(s % 60)}`;
}

function toVideo(v) {
  return {
    id: v.guid,
    title: cleanTitle(v.title ?? ''),
    duration: Math.round(v.length ?? 0),
    durationLabel: formatDuration(v.length ?? 0),
    width: v.width ?? null,
    height: v.height ?? null,
    uploadedAt: v.dateUploaded ?? null,
    embedUrl: `https://iframe.mediadelivery.net/embed/${LIBRARY_ID}/${v.guid}`,
    poster: `https://${CDN_HOST}/${v.guid}/${v.thumbnailFileName || 'thumbnail.jpg'}`,
    preview: `https://${CDN_HOST}/${v.guid}/preview.webp`,
  };
}

async function main() {
  console.log(`Библиотека ${LIBRARY_ID}: загружаю список…`);
  const [collections, videos] = await Promise.all([
    fetchAll(`/library/${LIBRARY_ID}/collections`),
    fetchAll(`/library/${LIBRARY_ID}/videos`),
  ]);

  const ready = videos.filter((v) => v.status === STATUS_FINISHED);
  const skipped = videos.length - ready.length;

  const byCollection = new Map();
  for (const v of ready) {
    const key = v.collectionId || '';
    if (!byCollection.has(key)) byCollection.set(key, []);
    byCollection.get(key).push(v);
  }

  const sortVideos = (list) =>
    [...list]
      .sort((a, b) => collator.compare(a.title ?? '', b.title ?? ''))
      .map(toVideo);

  const result = collections
    .map((c) => ({
      id: c.guid,
      name: c.name,
      slug: slugify(c.name) || c.guid,
      videos: sortVideos(byCollection.get(c.guid) ?? []),
    }))
    .sort((a, b) => collator.compare(a.name, b.name));

  // Видео, которые не лежат ни в одной коллекции
  const loose = byCollection.get('') ?? [];
  if (loose.length > 0) {
    result.push({
      id: null,
      name: 'Без коллекции',
      slug: 'uncategorized',
      videos: sortVideos(loose),
    });
  }

  const output = {
    libraryId: LIBRARY_ID,
    cdnHost: CDN_HOST,
    collections: result,
  };

  await mkdir(path.dirname(OUT_FILE), { recursive: true });
  await writeFile(OUT_FILE, JSON.stringify(output, null, 2) + '\n', 'utf8');

  console.log(`\nГотово: ${path.relative(process.cwd(), OUT_FILE)}`);
  for (const c of result) {
    console.log(`  ${c.name} (${c.slug}): ${c.videos.length} видео`);
  }
  if (skipped > 0) {
    console.log(
      `\nПропущено ${skipped} видео: они ещё обрабатываются или загрузились с ошибкой. ` +
        'Запусти скрипт ещё раз, когда обработка закончится.',
    );
  }
}

main().catch((err) => {
  console.error(`\nОшибка: ${err.message}`);
  process.exit(1);
});
