'use client';

import { Suspense, useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import type { TopicData, TopicVideoItem } from '@/lib/reports/types';
import PhotoViewerProvider, { usePhotoViewer } from './PhotoViewerProvider';
import TopicFolderCard from './TopicFolderCard';
import TopicModal from './TopicModal';

type ModalState = { topicId: string | null; playing: TopicVideoItem | null };

function TopicQuerySync({ onOpen }: { onOpen: (id: string) => void }) {
  const params = useSearchParams();
  const [handled, setHandled] = useState(false);

  useEffect(() => {
    if (handled) return;
    const id = params.get('topic');
    if (id) {
      setHandled(true);
      onOpen(id);
    }
  }, [params, handled, onOpen]);

  return null;
}

function TopicsSectionInner({ topics }: { topics: TopicData[] }) {
  const t = useTranslations('videoReports');
  const { isOpen: photoViewerOpen } = usePhotoViewer();
  const [modal, setModal] = useState<ModalState>({ topicId: null, playing: null });
  const cardRefs = useRef(new Map<string, HTMLButtonElement>());
  const prevTopicIdRef = useRef<string | null>(null);

  const openTopic = (id: string, push: boolean) => {
    setModal({ topicId: id, playing: null });
    if (push) {
      window.history.pushState({}, '', `${window.location.pathname}?topic=${id}`);
    }
  };

  const openFromQuery = (id: string) => {
    if (!topics.some((topic) => topic.id === id)) return;
    window.history.replaceState(null, '', window.location.pathname);
    openTopic(id, true);
  };

  const playVideo = (item: TopicVideoItem) => {
    setModal((s) => ({ ...s, playing: item }));
    window.history.pushState({}, '', window.location.href);
  };

  const requestBack = () => {
    if (photoViewerOpen) return;
    window.history.back();
  };

  useEffect(() => {
    const onPopState = () => {
      setModal((s) => (s.playing ? { ...s, playing: null } : { topicId: null, playing: null }));
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  // фокус возвращается на карточку папки только при полном закрытии (не при выходе из плеера на уровень папки)
  useEffect(() => {
    if (prevTopicIdRef.current && !modal.topicId) {
      cardRefs.current.get(prevTopicIdRef.current)?.focus();
    }
    prevTopicIdRef.current = modal.topicId;
  }, [modal.topicId]);

  const activeTopic = topics.find((topic) => topic.id === modal.topicId) ?? null;

  return (
    <section className="mt-16">
      <Suspense fallback={null}>
        <TopicQuerySync onOpen={openFromQuery} />
      </Suspense>

      <div className="flex flex-wrap items-baseline gap-2">
        <h2 className="text-2xl font-semibold tracking-tight">{t('topicsTitle')}</h2>
        <span className="text-sm text-muted">{t('topicsCount', { count: topics.length })}</span>
      </div>

      <div className="relative mt-5 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 -mx-5 no-scrollbar sm:mx-0 sm:grid sm:snap-none sm:gap-5 sm:overflow-visible sm:px-0 sm:grid-cols-[repeat(auto-fill,minmax(220px,1fr))]">
        {topics.map((topic) => (
          <div key={topic.id} className="w-[200px] shrink-0 snap-start sm:w-auto sm:shrink">
            <TopicFolderCard
              title={topic.title}
              counts={topic.counts}
              cover={topic.cover}
              coverIsVideo={topic.coverIsVideo}
              ariaLabel={t('topicFolderAria', { title: topic.title })}
              onClick={() => openTopic(topic.id, true)}
              buttonRef={(el) => {
                if (el) cardRefs.current.set(topic.id, el);
                else cardRefs.current.delete(topic.id);
              }}
            />
          </div>
        ))}
      </div>

      {activeTopic && (
        <TopicModal topic={activeTopic} playingItem={modal.playing} onPlay={playVideo} onBack={requestBack} />
      )}
    </section>
  );
}

export default function TopicsSection({ topics }: { topics: TopicData[] }) {
  if (!topics.length) return null;

  return (
    <PhotoViewerProvider>
      <TopicsSectionInner topics={topics} />
    </PhotoViewerProvider>
  );
}
