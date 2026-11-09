import fs from 'fs';
import path from 'path';
import type { Locale } from '@/i18n/routing';
import {
  photosManifestSchema,
  reportSchema,
  reviewsConfigSchema,
  topicSchema,
  videosGeneratedSchema,
  type LocalizedString,
  type ReportData,
  type ReviewsConfig,
  type TopicConfig,
  type VideosGenerated
} from './schema';
import type {
  ReportCardData,
  ReportDetailData,
  ReportDetailVideo,
  ReportVideoGroup,
  ReviewVideo,
  TopicData,
  TopicItem,
  TopicVideoItem,
  TopicPhotoItem
} from './types';
import { bunnyThumbnailUrl, isVideoStub } from './bunny';

export type {
  ReportCardData,
  ReportDetailSpec,
  ReportDetailVideo,
  ReportDetailData,
  ReviewVideo,
  TopicData,
  TopicItem,
  TopicVideoItem,
  TopicPhotoItem
} from './types';
export { formatPriceEur, formatDuration } from './types';

const CONTENT_DIR = path.join(process.cwd(), 'content', 'reports');
const PUBLIC_REPORTS_DIR = path.join(process.cwd(), 'public', 'reports');
const PHOTOS_MANIFEST_DIR = path.join(process.cwd(), 'content', 'photos');
// адрес хранилища фото (Cloudflare R2). Без него фото берутся из public/reports/ на этом же сайте
const MEDIA_BASE = (process.env.NEXT_PUBLIC_MEDIA_BASE ?? '').replace(/\/+$/, '');
const TOPICS_FILE = path.join(process.cwd(), 'content', 'topics.json');
const PUBLIC_TOPICS_DIR = path.join(process.cwd(), 'public', 'topics');
const VIDEOS_GENERATED_FILE = path.join(process.cwd(), 'data', 'videos.generated.json');
const REVIEWS_FILE = path.join(process.cwd(), 'content', 'reviews.json');

const IMAGE_EXTENSIONS = new Set(['.webp', '.jpg', '.jpeg', '.png', '.avif']);

// в dev показываем черновики, в продакшен-сборке — нет (ни страница, ни карточка, ни sitemap)
const SHOW_DRAFTS = process.env.NODE_ENV !== 'production';

function pickLocalized(locale: Locale, value: LocalizedString): string {
  if (typeof value === 'string') return value;
  return value[locale] ?? value.ru;
}

// subtitle отчёта по конвенции начинается с года ("2021 · 3.0 дизель · ...") во всех локалях —
// год нигде не хранится отдельным полем, вытаскиваем первым 4-значным числом
function extractYear(subtitle: string | undefined): string | null {
  if (!subtitle) return null;
  const match = subtitle.match(/\d{4}/);
  return match ? match[0] : null;
}

function naturalCompare(a: string, b: string): number {
  return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });
}

function listImageFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir, { withFileTypes: true })
    // *-thumb.* — маленькие превью, создаёт scripts/photos.py; в списки фото не попадают
    .filter((e) => e.isFile() && IMAGE_EXTENSIONS.has(path.extname(e.name).toLowerCase()) && !path.parse(e.name).name.endsWith('-thumb'))
    .map((e) => e.name)
    .sort(naturalCompare);
}

let topicsCache: TopicConfig[] | null = null;

function loadTopicsRaw(): TopicConfig[] {
  if (topicsCache) return topicsCache;
  if (!fs.existsSync(TOPICS_FILE)) {
    topicsCache = [];
    return topicsCache;
  }

  const raw = fs.readFileSync(TOPICS_FILE, 'utf-8');
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch (e) {
    throw new Error(`content/topics.json: невалидный JSON — ${(e as Error).message}`);
  }

  const result = topicSchema.array().safeParse(parsed);
  if (!result.success) {
    const issues = result.error.issues
      .map((issue) => `поле "${issue.path.join('.')}" — ${issue.message}`)
      .join('; ');
    throw new Error(`content/topics.json: невалидная схема — ${issues}`);
  }

  topicsCache = result.data;
  return topicsCache;
}

// undefined — ещё не загружали, null — файла нет (значит видео только из JSON отчёта, как раньше)
let videosGeneratedCache: VideosGenerated | null | undefined;

function loadVideosGenerated(): VideosGenerated | null {
  if (videosGeneratedCache !== undefined) return videosGeneratedCache;
  if (!fs.existsSync(VIDEOS_GENERATED_FILE)) {
    videosGeneratedCache = null;
    return videosGeneratedCache;
  }

  const raw = fs.readFileSync(VIDEOS_GENERATED_FILE, 'utf-8');
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch (e) {
    throw new Error(`data/videos.generated.json: невалидный JSON — ${(e as Error).message}`);
  }

  const result = videosGeneratedSchema.safeParse(parsed);
  if (!result.success) {
    const issues = result.error.issues
      .map((issue) => `поле "${issue.path.join('.')}" — ${issue.message}`)
      .join('; ');
    throw new Error(`data/videos.generated.json: невалидная схема — ${issues}`);
  }

  videosGeneratedCache = result.data;
  return videosGeneratedCache;
}

// имя видео в Bunny — "<группа>-<номер>" ("lkp-1"); без номера — вся строка = группа, номер 1
function parseVideoName(name: string): { group: string; number: number } {
  const match = name.match(/^(.+)-(\d+)$/);
  if (!match) return { group: name, number: 1 };
  return { group: match[1], number: parseInt(match[2], 10) };
}

const GENERIC_VIDEO_TITLE: Record<Locale, string> = { ru: 'Видео', de: 'Video', uk: 'Відео' };
const GENERIC_REVIEW_TITLE: Record<Locale, string> = { ru: 'Отзыв', de: 'Bewertung', uk: 'Відгук' };

let reviewsConfigCache: ReviewsConfig | null = null;

function loadReviewsConfig(): ReviewsConfig {
  if (reviewsConfigCache) return reviewsConfigCache;
  if (!fs.existsSync(REVIEWS_FILE)) {
    reviewsConfigCache = { titles: {}, tiktok: {} };
    return reviewsConfigCache;
  }

  const raw = fs.readFileSync(REVIEWS_FILE, 'utf-8');
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch (e) {
    throw new Error(`content/reviews.json: невалидный JSON — ${(e as Error).message}`);
  }

  const result = reviewsConfigSchema.safeParse(parsed);
  if (!result.success) {
    const issues = result.error.issues
      .map((issue) => `поле "${issue.path.join('.')}" — ${issue.message}`)
      .join('; ');
    throw new Error(`content/reviews.json: невалидная схема — ${issues}`);
  }

  reviewsConfigCache = result.data;
  return reviewsConfigCache;
}

const REVIEW_COVER_EXTENSIONS = ['webp', 'jpg', 'png'];

// ручная обложка отзыва — public/reviews/<имя видео в Bunny>.(webp|jpg|png); приоритет выше poster из Bunny
function findReviewCover(name: string): string | null {
  for (const ext of REVIEW_COVER_EXTENSIONS) {
    const file = `${name}.${ext}`;
    if (fs.existsSync(path.join(process.cwd(), 'public', 'reviews', file))) {
      return `/reviews/${file}`;
    }
  }
  return null;
}

// видео коллекции "reviews" из Bunny (data/videos.generated.json), отсортированные по номеру
// из имени ("review-1", "review-2", ...); заголовок — из content/reviews.json либо заглушка "Отзыв N"
export function getReviewVideos(locale: Locale): ReviewVideo[] {
  const generated = loadVideosGenerated();
  const collection = generated?.collections.find((c) => c.slug === 'reviews') ?? null;
  if (!collection) return [];

  const config = loadReviewsConfig();

  return collection.videos
    .map((v) => {
      const { number } = parseVideoName(v.title);
      const titleOverride = config.titles[v.title];
      return {
        number,
        video: {
          id: v.id,
          title: titleOverride ? pickLocalized(locale, titleOverride) : `${GENERIC_REVIEW_TITLE[locale]} ${number}`,
          durationSec: v.duration,
          poster: findReviewCover(v.title) ?? v.poster,
          portrait: (v.height ?? 0) > (v.width ?? 0),
          tiktokUrl: config.tiktok[v.title]
        } satisfies ReviewVideo
      };
    })
    .sort((a, b) => a.number - b.number)
    .map((entry) => entry.video);
}

type RawReport = { slug: string; data: ReportData };

let reportsCache: RawReport[] | null = null;

function loadRawReports(): RawReport[] {
  if (reportsCache) return reportsCache;

  const files = fs.existsSync(CONTENT_DIR)
    ? fs.readdirSync(CONTENT_DIR).filter((f) => f.endsWith('.json'))
    : [];

  const reports = files.map((file) => {
    const slug = file.replace(/\.json$/, '');
    const filePath = path.join(CONTENT_DIR, file);
    const raw = fs.readFileSync(filePath, 'utf-8');

    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch (e) {
      throw new Error(`content/reports/${file}: невалидный JSON — ${(e as Error).message}`);
    }

    const result = reportSchema.safeParse(parsed);
    if (!result.success) {
      const issues = result.error.issues
        .map((issue) => `поле "${issue.path.join('.')}" — ${issue.message}`)
        .join('; ');
      throw new Error(`content/reports/${file}: невалидная схема — ${issues}`);
    }

    return { slug, data: result.data };
  });

  // отчёты-заглушки без фотопапки — штатный случай (см. плейсхолдеры), не предупреждаем.
  // предупреждаем только о "сироте" — папке с фото без соответствующего JSON-отчёта
  if (fs.existsSync(PUBLIC_REPORTS_DIR)) {
    const knownSlugs = new Set(reports.map((r) => r.slug));
    const folders = fs
      .readdirSync(PUBLIC_REPORTS_DIR, { withFileTypes: true })
      .filter((e) => e.isDirectory())
      .map((e) => e.name);
    for (const folder of folders) {
      if (!knownSlugs.has(folder)) {
        console.warn(
          `[reports] public/reports/${folder}: папка с фото без отчёта content/reports/${folder}.json — проигнорирована`
        );
      }
    }
  }

  const topicIds = new Set(loadTopicsRaw().map((t) => t.id));
  for (const report of reports) {
    for (const video of report.data.videos) {
      if (video.topic && !topicIds.has(video.topic)) {
        const title = typeof video.title === 'string' ? video.title : video.title.ru;
        throw new Error(
          `content/reports/${report.slug}.json: видео "${title}" ссылается на неизвестную тему "${video.topic}". Доступные темы: ${[...topicIds].join(', ')}`
        );
      }
    }
  }

  reportsCache = reports;
  return reportsCache;
}

function scanTopicPhotos(id: string): string[] {
  return listImageFiles(path.join(PUBLIC_TOPICS_DIR, id)).map((f) => `/topics/${id}/${f}`);
}

type ScannedPhotos = {
  cover: string | null;
  main: string[];
  photos: string[];
};

function mediaUrl(slug: string, rel: string): string {
  return `${MEDIA_BASE}/reports/${slug}/${rel}`;
}

function numbered(slug: string, folder: string, count: number): string[] {
  return Array.from({ length: count }, (_, i) => mediaUrl(slug, `${folder}/${String(i + 1).padStart(2, '0')}.webp`));
}

function loadPhotosManifest(slug: string) {
  const file = path.join(PHOTOS_MANIFEST_DIR, `${slug}.json`);
  if (!fs.existsSync(file)) return null;
  let parsed: unknown;
  try {
    parsed = JSON.parse(fs.readFileSync(file, 'utf-8'));
  } catch (e) {
    throw new Error(`content/photos/${slug}.json: невалидный JSON — ${(e as Error).message}`);
  }
  const result = photosManifestSchema.safeParse(parsed);
  if (!result.success) {
    throw new Error(`content/photos/${slug}.json: невалидная схема — ${result.error.message}`);
  }
  return result.data;
}

// Фото отчёта: cover.webp — обложка списка, main/ — плитки в шапке, common/ — остальные (видны в просмотрщике).
// Список файлов берём из content/photos/<slug>.json (его пишет scripts/photos.py): хранилище на R2 при сборке
// не прочитать. Если файла нет — сканируем public/reports/<slug>/ (локальная работа без R2).
function scanPhotos(slug: string): ScannedPhotos {
  const manifest = loadPhotosManifest(slug);
  if (manifest) {
    return {
      cover: manifest.cover ? mediaUrl(slug, 'cover.webp') : null,
      main: numbered(slug, 'main', manifest.main),
      photos: numbered(slug, 'common', manifest.common)
    };
  }

  const dir = path.join(PUBLIC_REPORTS_DIR, slug);
  if (!fs.existsSync(dir)) {
    return { cover: null, main: [], photos: [] };
  }

  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.isDirectory() && e.name !== 'main' && e.name !== 'common') {
      throw new Error(`public/reports/${slug}/${e.name}: лишняя папка. Допустимы только main/ и common/`);
    }
  }

  const toUrls = (sub: string) => listImageFiles(path.join(dir, sub)).map((f) => mediaUrl(slug, `${sub}/${f}`));
  const coverFile = listImageFiles(dir).find((f) => path.parse(f).name === 'cover');
  return { cover: coverFile ? mediaUrl(slug, coverFile) : null, main: toUrls('main'), photos: toUrls('common') };
}

function buildReportVideos(
  data: ReportData,
  slug: string,
  locale: Locale
): { videos: ReportDetailVideo[]; groups: ReportVideoGroup[] } {
  const generated = loadVideosGenerated();
  const collection = generated?.collections.find((c) => c.slug === slug) ?? null;

  let built: ReportDetailVideo[];

  if (collection) {
    const synced: ReportDetailVideo[] = collection.videos.map((v) => {
      const { group, number } = parseVideoName(v.title);
      const titleOverride = data.titles[v.title];
      return {
        provider: 'bunny',
        id: v.id,
        title: titleOverride ? pickLocalized(locale, titleOverride) : `${GENERIC_VIDEO_TITLE[locale]} ${number}`,
        durationSec: v.duration,
        poster: v.poster,
        group,
        number,
        portrait: (v.height ?? 0) > (v.width ?? 0),
        hasCustomTitle: !!titleOverride
      };
    });

    // заглушки с пустым id заменены коллекцией; видео с реальным id остаются и идут после
    const manual: ReportDetailVideo[] = data.videos
      .filter((v) => v.id)
      .map((v) => ({
        provider: v.provider,
        id: v.id,
        title: pickLocalized(locale, v.title),
        durationSec: v.durationSec,
        poster: v.poster,
        group: v.topic ?? null,
        number: 0,
        portrait: false,
        hasCustomTitle: true
      }));

    built = [...synced, ...manual];
  } else {
    built = data.videos.map((v) => ({
      provider: v.provider,
      id: v.id,
      title: pickLocalized(locale, v.title),
      durationSec: v.durationSec,
      poster: v.poster,
      group: v.topic ?? null,
      number: 0,
      portrait: false,
      hasCustomTitle: true
    }));
  }

  const topics = loadTopicsRaw();
  const byGroup = new Map<string, ReportDetailVideo[]>();
  const ungrouped: ReportDetailVideo[] = [];

  for (const v of built) {
    const known = v.group && topics.some((t) => t.id === v.group);
    if (known) {
      const list = byGroup.get(v.group as string) ?? [];
      list.push(v);
      byGroup.set(v.group as string, list);
    } else {
      ungrouped.push(v);
    }
  }

  const groups: ReportVideoGroup[] = [];
  for (const topic of topics) {
    const list = byGroup.get(topic.id);
    if (!list?.length) continue;
    list.sort((a, b) => a.number - b.number);
    groups.push({ id: topic.id, title: pickLocalized(locale, topic.groupTitle ?? topic.title), videos: list });
  }
  if (ungrouped.length) {
    groups.push({ id: null, title: null, videos: ungrouped });
  }

  return { videos: built, groups };
}

function toCardData(slug: string, data: ReportData, locale: Locale): ReportCardData {
  const { cover, main, photos } = scanPhotos(slug);
  const { videos } = buildReportVideos(data, slug, locale);

  return {
    slug,
    draft: data.draft,
    title: data.title,
    subtitle: data.subtitle ? pickLocalized(locale, data.subtitle) : undefined,
    priceEur: data.priceEur,
    cover: cover ?? main[0] ?? photos[0] ?? null,
    videoCount: videos.length,
    photoCount: main.length + photos.length
  };
}

export function getAllReports(locale: Locale): ReportCardData[] {
  return loadRawReports()
    .filter((r) => SHOW_DRAFTS || !r.data.draft)
    .sort((a, b) => b.data.inspectedAt.localeCompare(a.data.inspectedAt))
    .map((r) => toCardData(r.slug, r.data, locale));
}

export function getAllReportSlugs(): string[] {
  return loadRawReports()
    .filter((r) => SHOW_DRAFTS || !r.data.draft)
    .map((r) => r.slug);
}

// для решения про noindex/sitemap — реальное наличие опубликованных отчётов,
// независимо от NODE_ENV текущей сборки
export function hasPublishedReports(): boolean {
  return loadRawReports().some((r) => !r.data.draft);
}

export function getReport(slug: string, locale: Locale): ReportDetailData | null {
  const found = loadRawReports().find((r) => r.slug === slug);
  if (!found) return null;
  if (found.data.draft && !SHOW_DRAFTS) return null;

  const { data } = found;
  const { cover, main, photos } = scanPhotos(slug);
  const galleryPhotos = [...main, ...photos];
  const { videos, groups } = buildReportVideos(data, slug, locale);

  return {
    slug,
    draft: data.draft,
    service: data.service,
    inspectedAt: data.inspectedAt,
    title: data.title,
    subtitle: data.subtitle ? pickLocalized(locale, data.subtitle) : undefined,
    priceEur: data.priceEur,
    cover: cover ?? galleryPhotos[0] ?? null,
    videoCount: videos.length,
    photoCount: galleryPhotos.length,
    specs: data.specs.map((s) => ({ label: pickLocalized(locale, s.label), value: pickLocalized(locale, s.value) })),
    videos,
    videoGroups: groups,
    galleryPhotos
  };
}

function buildTopicItems(topic: TopicConfig, sortedReports: RawReport[], locale: Locale): TopicItem[] {
  const items: TopicItem[] = [];

  // 1. собственные видео темы
  topic.videos.forEach((v, i) => {
    items.push({
      type: 'video',
      key: `${topic.id}:own-video:${i}`,
      reportSlug: null,
      carTitle: null,
      carYear: null,
      title: pickLocalized(locale, v.title),
      durationSec: v.durationSec,
      provider: v.provider,
      videoId: v.id,
      poster: v.poster,
      portrait: false,
      number: 0
    });
  });

  // 2. собственные фото темы (public/topics/<id>/)
  scanTopicPhotos(topic.id).forEach((src, i) => {
    items.push({
      type: 'photo',
      key: `${topic.id}:own-photo:${i}`,
      reportSlug: null,
      carTitle: null,
      carYear: null,
      src,
      alt: pickLocalized(locale, topic.title)
    });
  });

  // 3. видео отчётов, чья группа совпадает с темой — и синхронизированные из Bunny (группа из имени),
  // и ручные с полем topic (группа = topic); отчёты уже отсортированы по дате (новые первыми)
  for (const report of sortedReports) {
    const carTitle = report.data.title;
    const carYear = extractYear(report.data.subtitle ? pickLocalized(locale, report.data.subtitle) : undefined);
    const { videos } = buildReportVideos(report.data, report.slug, locale);
    videos.forEach((v, i) => {
      if (v.group !== topic.id) return;
      items.push({
        type: 'video',
        key: `${topic.id}:${report.slug}:video:${i}`,
        reportSlug: report.slug,
        carTitle,
        carYear,
        title: v.title,
        durationSec: v.durationSec,
        provider: v.provider,
        videoId: v.id,
        poster: v.poster,
        portrait: v.portrait,
        number: v.number
      });
    });
  }

  return items;
}

export function getTopics(locale: Locale): TopicData[] {
  const topics = loadTopicsRaw();
  const sortedReports = loadRawReports()
    .filter((r) => SHOW_DRAFTS || !r.data.draft)
    .sort((a, b) => b.data.inspectedAt.localeCompare(a.data.inspectedAt));

  return topics
    .map((topic) => {
      const items = buildTopicItems(topic, sortedReports, locale);
      const counts = {
        videos: items.filter((i) => i.type === 'video').length,
        photos: items.filter((i) => i.type === 'photo').length
      };

      const firstVideo = items.find((i): i is TopicVideoItem => i.type === 'video');
      const firstPhoto = items.find((i): i is TopicPhotoItem => i.type === 'photo');

      let cover: string | null = null;
      let coverIsVideo = false;
      if (firstVideo) {
        coverIsVideo = true;
        cover = firstVideo.poster ?? (!isVideoStub(firstVideo.videoId) ? bunnyThumbnailUrl(firstVideo.videoId) : null);
      }
      if (!cover && firstPhoto) {
        coverIsVideo = false;
        cover = firstPhoto.src;
      }
      if (!cover) coverIsVideo = false;

      return {
        id: topic.id,
        title: pickLocalized(locale, topic.title),
        description: pickLocalized(locale, topic.description),
        items,
        counts,
        cover,
        coverIsVideo
      };
    })
    .filter((t) => SHOW_DRAFTS || t.items.length > 0);
}
