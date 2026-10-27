// NEXT_PUBLIC_* — доступны и на сервере, и в браузере (нужно в клиентском VideoModal)
const LIBRARY_ID = process.env.NEXT_PUBLIC_BUNNY_LIBRARY_ID;
const CDN_HOST = process.env.NEXT_PUBLIC_BUNNY_CDN_HOST;

export function bunnyEmbedUrl(videoId: string): string {
  return `https://iframe.mediadelivery.net/embed/${LIBRARY_ID}/${videoId}`;
}

export function bunnyThumbnailUrl(videoId: string): string {
  return `https://${CDN_HOST}/${videoId}/thumbnail.jpg`;
}

// без library/CDN хоста или id видео — ничего не отдать плееру, рисуем заглушку
export function isVideoStub(videoId: string): boolean {
  return !LIBRARY_ID || !CDN_HOST || !videoId;
}
