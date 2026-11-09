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
  // группа видео (тема lkp/scanner/... или null) — определяет и заголовок на странице машины,
  // и попадание в папку "Как мы проверяем"
  group: string | null;
  // порядковый номер внутри группы (из имени в Bunny "group-N"); у ручных видео — 0
  number: number;
  portrait: boolean;
  // false только у синхронизированных без переопределения в titles — тогда title = "Видео N"
  hasCustomTitle: boolean;
};

export type ReportVideoGroup = { id: string | null; title: string | null; videos: ReportDetailVideo[] };

// общий минимум для плеера (VideoModal) — и ReportDetailVideo, и TopicVideoItem ему удовлетворяют
export type PlayableVideo = Pick<ReportDetailVideo, 'id' | 'poster' | 'portrait'>;

// видеоотзыв со страницы /reviews — плоский список без групп/номеров
export type ReviewVideo = {
  id: string;
  title: string;
  durationSec: number;
  poster?: string;
  portrait: boolean;
  // ссылка на оригинальный пост в TikTok; без неё блок "Оригинал в TikTok" не показывается
  tiktokUrl?: string;
};

export type ReportDetailData = ReportCardData & {
  service: 'check' | 'pick';
  inspectedAt: string;
  specs: ReportDetailSpec[];
  videos: ReportDetailVideo[];
  videoGroups: ReportVideoGroup[];
  // шапка страницы — единственное место с фото: сначала main/, затем photos/
  galleryPhotos: string[];
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
  portrait: boolean;
  // позиция внутри машины (video.number из её отчёта); 0 — у собственных видео темы, без машины
  number: number;
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

// маленькое превью к фото: /reports/x/main/01.webp → /reports/x/main/01-thumb.webp
export function thumbSrc(src: string): string {
  return src.replace(/\.[^./]+$/, (ext) => `-thumb${ext}`);
}

export function toPlayableVideo(item: TopicVideoItem): PlayableVideo {
  return { id: item.videoId, poster: item.poster, portrait: item.portrait };
}
