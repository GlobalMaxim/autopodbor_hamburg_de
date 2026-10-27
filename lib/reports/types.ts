// чистые типы и форматтеры без доступа к fs — безопасно импортировать из клиентских компонентов
export type ReportCardData = {
  slug: string;
  draft: boolean;
  title: string;
  subtitle?: string;
  priceEur?: number;
  cover: string | null;
  videoCount: number;
  photoCount: number;
};

export type ReportDetailSpec = { label: string; value: string };

export type ReportDetailVideo = {
  provider: 'bunny';
  id: string;
  title: string;
  durationSec: number;
  poster?: string;
};

export type ReportPhotoCategory = { id: string; label: string; photos: string[] };

export type ReportDetailData = ReportCardData & {
  service: 'check' | 'pick';
  inspectedAt: string;
  specs: ReportDetailSpec[];
  videos: ReportDetailVideo[];
  mainPhotos: string[];
  categories: ReportPhotoCategory[];
};

// материалы папки "Как мы проверяем" — видео и фото вперемешку из собственных материалов
// темы и из отчётов по машинам (reportSlug === null → собственный материал темы, без машины)
export type TopicVideoItem = {
  type: 'video';
  key: string;
  reportSlug: string | null;
  carTitle: string | null;
  carYear: string | null;
  title: string;
  durationSec: number;
  provider: 'bunny';
  videoId: string;
  poster?: string;
};

export type TopicPhotoItem = {
  type: 'photo';
  key: string;
  reportSlug: string | null;
  carTitle: string | null;
  carYear: string | null;
  src: string;
  alt: string;
};

export type TopicItem = TopicVideoItem | TopicPhotoItem;

export type TopicData = {
  id: string;
  title: string;
  description: string;
  items: TopicItem[];
  counts: { videos: number; photos: number };
  cover: string | null;
  coverIsVideo: boolean;
};

// формат "49 900 €" — неразрывный пробел между группами цифр, одинаково во всех локалях
export function formatPriceEur(amount: number): string {
  return `${amount.toLocaleString('de-DE').replace(/\./g, ' ')} €`;
}

export function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${String(s).padStart(2, '0')}`;
}
