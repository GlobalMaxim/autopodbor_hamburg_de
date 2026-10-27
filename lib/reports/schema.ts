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

export const photoCategorySchema = z.object({
  id: z.string(),
  label: localizedStringSchema
});

export type PhotoCategory = z.infer<typeof photoCategorySchema>;

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
  videos: z.array(reportVideoSchema).default([])
});

export type ReportData = z.infer<typeof reportSchema>;

// собственные материалы темы (папки "Как мы проверяем") — без привязки к конкретной машине
export const topicSchema = z.object({
  id: z.string(),
  title: localizedStringSchema,
  description: localizedStringSchema,
  photoCategories: z.array(z.string()).default([]),
  videos: z.array(reportVideoSchema).default([])
});

export type TopicConfig = z.infer<typeof topicSchema>;
