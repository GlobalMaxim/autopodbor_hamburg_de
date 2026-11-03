import { z } from 'zod';

// строка ИЛИ объект переводов { ru, de?, uk? } — ru обязателен, остальные локали
// опциональны (при отсутствии перевода в компоненте подставляется ru)
export const localizedStringSchema = z.union([
  z.string(),
  z.object({
    ru: z.string(),
    de: z.string().optional(),
    uk: z.string().optional()
  })
]);

export type LocalizedString = z.infer<typeof localizedStringSchema>;

export const reportSpecSchema = z.object({
  label: localizedStringSchema,
  value: localizedStringSchema
});

export type ReportSpec = z.infer<typeof reportSpecSchema>;

// provider — union с одним значением сейчас, чтобы потом добавить 'youtube'
// простым расширением списка без смены формы схемы
export const videoProviderSchema = z.enum(['bunny']);

export const reportVideoSchema = z.object({
  provider: videoProviderSchema,
  id: z.string(),
  title: localizedStringSchema,
  durationSec: z.number().nonnegative().default(0),
  poster: z.string().optional(),
  // id темы из content/topics.json — попадает в папку "Как мы проверяем"; без привязки видео
  // остаётся только на странице своей машины
  topic: z.string().optional()
});

export type ReportVideo = z.infer<typeof reportVideoSchema>;

export const reportServiceSchema = z.enum(['check', 'pick']);

export const reportSchema = z.object({
  draft: z.boolean().default(false),
  service: reportServiceSchema.default('check'),
  inspectedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'inspectedAt должен быть в формате YYYY-MM-DD'),
  title: z.string(),
  subtitle: localizedStringSchema.optional(),
  priceEur: z.number().int().positive().optional(),
  specs: z.array(reportSpecSchema).default([]),
  videos: z.array(reportVideoSchema).default([]),
  // переопределение названия синхронизированного видео Bunny: ключ — точное имя
  // видео в Bunny ("lkp-1"), значение — заголовок карточки на странице
  titles: z.record(z.string(), localizedStringSchema).default({})
});

export type ReportData = z.infer<typeof reportSchema>;

// собственные материалы темы (папки "Как мы проверяем") — без привязки к конкретной машине
export const topicSchema = z.object({
  id: z.string(),
  title: localizedStringSchema,
  description: localizedStringSchema,
  // заголовок группы видео на странице машины; если нет — берём title
  groupTitle: localizedStringSchema.optional(),
  videos: z.array(reportVideoSchema).default([])
});

export type TopicConfig = z.infer<typeof topicSchema>;

// content/photos/<slug>.json — пишет scripts/photos.py: сколько файлов лежит в хранилище (R2 или public/reports)
export const photosManifestSchema = z.object({
  cover: z.boolean().default(false),
  main: z.number().int().min(0).default(0),
  common: z.number().int().min(0).default(0)
});

export type PhotosManifest = z.infer<typeof photosManifestSchema>;

// data/videos.generated.json — пишет scripts/sync-bunny.mjs, список видео по коллекциям Bunny Stream.
// Остальные поля Bunny (durationLabel, uploadedAt, embedUrl, preview) нам не нужны — zod их молча отбросит.
export const bunnyVideoSchema = z.object({
  id: z.string(),
  title: z.string(),
  duration: z.number().nonnegative(),
  width: z.number().optional(),
  height: z.number().optional(),
  poster: z.string().optional()
});

export const bunnyCollectionSchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  videos: z.array(bunnyVideoSchema).default([])
});

export const videosGeneratedSchema = z.object({
  libraryId: z.string(),
  cdnHost: z.string(),
  collections: z.array(bunnyCollectionSchema).default([])
});

export type VideosGenerated = z.infer<typeof videosGeneratedSchema>;
