'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import type { ReportMedia, ReportTopic } from '@/lib/api';
import MediaLightbox from './MediaLightbox';

const playIcon = (
  <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6 translate-x-0.5">
    <path d="M8 5v14l11-7z" />
  </svg>
);

const expandIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
    <path d="M9 3H3v6M15 3h6v6M15 21h6v-6M9 21H3v-6" />
  </svg>
);

export default function ReportShowcase({ topics }: { topics: ReportTopic[] }) {
  const [active, setActive] = useState(0);
  const [lightboxMedia, setLightboxMedia] = useState<ReportMedia | null>(null);
  const t = useTranslations('how');
  const topic = topics[active];

  return (
    <section id="example" className="scroll-mt-24 border-t border-line bg-gradient-to-b from-surface via-accent/[0.12] to-surface">
      <div className="mx-auto max-w-6xl px-5 py-20 text-center">
        <div className="mx-auto mb-3 h-[3px] w-16 bg-gradient-to-r from-accent to-transparent" />
        <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
          {t('exampleTitle')}
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-muted">{t('exampleIntro')}</p>

        <div className="mt-10 flex flex-wrap justify-center gap-3">
          {topics.map((tp, i) => (
            <button
              key={tp.name}
              onClick={() => setActive(i)}
              className={`rounded-full border px-5 py-2.5 text-sm font-medium transition-colors ${
                active === i
                  ? 'border-accent bg-accent text-white'
                  : 'border-line bg-surface hover:border-accent/50'
              }`}
            >
              {tp.name}
            </button>
          ))}
        </div>

        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {topic.media.map((m, i) => (
            <button
              key={i}
              onClick={() => setLightboxMedia(m)}
              className="group relative aspect-square w-full overflow-hidden rounded-xl border border-line bg-surface-2 text-left"
            >
              {m.media_type === 'video' ? (
                <video
                  src={m.file}
                  preload="metadata"
                  muted
                  className="h-full w-full bg-paper object-cover transition-transform duration-300 group-hover:scale-105"
                />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={m.file}
                  alt={topic.name}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              )}

              {/* видео без постера не гарантирует превью-кадр — иконка play
                  видна всегда, иначе карточка похожа на сломанную пустышку */}
              <div className="absolute inset-0 flex items-center justify-center bg-ink/0 transition-colors duration-300 group-hover:bg-ink/30">
                <span
                  className={`flex h-11 w-11 items-center justify-center rounded-full bg-white/95 text-ink shadow-lg transition-all duration-300 group-hover:scale-100 group-hover:opacity-100 ${
                    m.media_type === 'video' ? 'scale-100 opacity-90' : 'scale-90 opacity-0'
                  }`}
                >
                  {m.media_type === 'video' ? playIcon : expandIcon}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      <MediaLightbox media={lightboxMedia} onClose={() => setLightboxMedia(null)} />
    </section>
  );
}
