import fs from 'fs';
import path from 'path';
import type { Locale } from '@/i18n/routing';
import {
  photoCategorySchema,
  reportSchema,
  topicSchema,
  type LocalizedString,
  type PhotoCategory,
  type ReportData,
  type TopicConfig
} from './schema';
import type { ReportCardData, ReportDetailData, ReportPhotoCategory, TopicData, TopicItem, TopicVideoItem, TopicPhotoItem } from './types';
import { bunnyThumbnailUrl, isVideoStub } from './bunny';

export type {
  ReportCardData,
  ReportDetailSpec,
  ReportDetailVideo,
  ReportPhotoCategory,
  ReportDetailData,
  TopicData,
  TopicItem,
  TopicVideoItem,
  TopicPhotoItem
} from './types';
export { formatPriceEur, formatDuration } from './types';

const CONTENT_DIR = path.join(process.cwd(), 'content', 'reports');
const CATEGORIES_FILE = path.join(process.cwd(), 'content', 'photo-categories.json');
const PUBLIC_REPORTS_DIR = path.join(process.cwd(), 'public', 'reports');
const TOPICS_FILE = path.join(process.cwd(), 'content', 'topics.json');
const PUBLIC_TOPICS_DIR = path.join(process.cwd(), 'public', 'topics');

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
    .filter((e) => e.isFile() && IMAGE_EXTENSIONS.has(path.extname(e.name).toLowerCase()))
    .map((e) => e.name)
    .sort(naturalCompare);
}

let categoriesCache: PhotoCategory[] | null = null;

function loadPhotoCategories(): PhotoCategory[] {
  if (categoriesCache) return categoriesCache;
  const raw = fs.readFileSync(CATEGORIES_FILE, 'utf-8');
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch (e) {
    throw new Error(`content/photo-categories.json: невалидный JSON — ${(e as Error).message}`);
  }
  const result = photoCategorySchema.array().safeParse(parsed);
  if (!result.success) {
    throw new Error(`content/photo-categories.json: невалидная схема — ${result.error.message}`);
  }
  categoriesCache = result.data;
  return categoriesCache;
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

  const categoryIds = new Set(loadPhotoCategories().map((c) => c.id));
  for (const topic of result.data) {
    for (const catId of topic.photoCategories) {
      if (!categoryIds.has(catId)) {
        throw new Error(
          `content/topics.json: тема "${topic.id}" ссылается на неизвестную категорию фото "${catId}". Доступные категории: ${[...categoryIds].join(', ')}`
        );
      }
    }
  }

  topicsCache = result.data;
  return topicsCache;
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
  main: string[];
  byCategory: Map<string, string[]>;
};

function scanPhotos(slug: string): ScannedPhotos {
  const dir = path.join(PUBLIC_REPORTS_DIR, slug);
  const byCategory = new Map<string, string[]>();

  if (!fs.existsSync(dir)) {
    return { main: [], byCategory };
  }

  const categoryIds = new Set(loadPhotoCategories().map((c) => c.id));
  const main = listImageFiles(path.join(dir, 'main')).map((f) => `/reports/${slug}/main/${f}`);

  const subdirs = fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((e) => e.isDirectory() && e.name !== 'main')
    .map((e) => e.name);

  for (const sub of subdirs) {
    if (!categoryIds.has(sub)) {
      throw new Error(
        `public/reports/${slug}/${sub}: неизвестная категория фото. Доступные категории: ${[...categoryIds].join(', ')}`
      );
    }
    const files = listImageFiles(path.join(dir, sub)).map((f) => `/reports/${slug}/${sub}/${f}`);
    if (files.length) byCategory.set(sub, files);
  }

  return { main, byCategory };
}

function toCardData(slug: string, data: ReportData, locale: Locale): ReportCardData {
  const { main, byCategory } = scanPhotos(slug);
  const photoCount = [...byCategory.values()].reduce((sum, arr) => sum + arr.length, 0);
  const firstCategoryPhoto = byCategory.size ? [...byCategory.values()][0][0] : null;

  return {
    slug,
    draft: data.draft,
    title: data.title,
    subtitle: data.subtitle ? pickLocalized(locale, data.subtitle) : undefined,
    priceEur: data.priceEur,
    cover: main[0] ?? firstCategoryPhoto,
    videoCount: data.videos.length,
    photoCount
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
  const { main, byCategory } = scanPhotos(slug);
  const photoCategories = loadPhotoCategories();

  const categories: ReportPhotoCategory[] = photoCategories
    .filter((c) => byCategory.has(c.id))
    .map((c) => ({ id: c.id, label: pickLocalized(locale, c.label), photos: byCategory.get(c.id)! }));

  const photoCount = categories.reduce((sum, c) => sum + c.photos.length, 0);
  const firstCategoryPhoto = categories[0]?.photos[0] ?? null;

  return {
    slug,
    draft: data.draft,
    service: data.service,
    inspectedAt: data.inspectedAt,
    title: data.title,
    subtitle: data.subtitle ? pickLocalized(locale, data.subtitle) : undefined,
    priceEur: data.priceEur,
    cover: main[0] ?? firstCategoryPhoto,
    videoCount: data.videos.length,
    photoCount,
    specs: data.specs.map((s) => ({ label: pickLocalized(locale, s.label), value: pickLocalized(locale, s.value) })),
    videos: data.videos.map((v) => ({
      provider: v.provider,
      id: v.id,
      title: pickLocalized(locale, v.title),
      durationSec: v.durationSec,
      poster: v.poster
    })),
    mainPhotos: main,
    categories
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
      poster: v.poster
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

  // 3. видео отчётов с подходящим topic — отчёты уже отсортированы по дате (новые первыми)
  for (const report of sortedReports) {
    const carTitle = report.data.title;
    const carYear = extractYear(report.data.subtitle ? pickLocalized(locale, report.data.subtitle) : undefined);
    report.data.videos.forEach((v, i) => {
      if (v.topic !== topic.id) return;
      items.push({
        type: 'video',
        key: `${topic.id}:${report.slug}:video:${i}`,
        reportSlug: report.slug,
        carTitle,
        carYear,
        title: pickLocalized(locale, v.title),
        durationSec: v.durationSec,
        provider: v.provider,
        videoId: v.id,
        poster: v.poster
      });
    });
  }

  // 4. фото отчётов из подпапок, перечисленных в photoCategories темы
  if (topic.photoCategories.length) {
    for (const report of sortedReports) {
      const { byCategory } = scanPhotos(report.slug);
      const carTitle = report.data.title;
      const carYear = extractYear(report.data.subtitle ? pickLocalized(locale, report.data.subtitle) : undefined);
      for (const catId of topic.photoCategories) {
        const photos = byCategory.get(catId);
        if (!photos) continue;
        photos.forEach((src, i) => {
          items.push({
            type: 'photo',
            key: `${topic.id}:${report.slug}:${catId}:${i}`,
            reportSlug: report.slug,
            carTitle,
            carYear,
            src,
            alt: carTitle
          });
        });
      }
    }
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
