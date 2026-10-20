// Клиент к Django API. Сервер (SSR/ISR) стучится напрямую в docker-сеть,
// браузер — через тот же домен (Caddy проксирует /api/* на Django, без CORS).
const API_BASE =
  typeof window === 'undefined'
    ? (process.env.INTERNAL_API_URL ?? 'http://django:8000/api')
    : '/api';

export type ReportMedia = {
  media_type: 'photo' | 'video';
  file: string;
};

export type ReportTopic = {
  name: string;
  media: ReportMedia[];
};

// бэкенд может быть недоступен (локальная разработка без docker compose up,
// временный сбой) — сайт не должен падать из-за этого, просто не показываем блок
export async function fetchReportTopics(): Promise<ReportTopic[]> {
  try {
    const res = await fetch(`${API_BASE}/process/topics`, {
      next: { revalidate: 60 }
    });
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}
