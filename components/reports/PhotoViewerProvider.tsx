'use client';

import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { lockScroll, unlockScroll } from '@/lib/scrollLock';
import { ChevronLeftIcon, ChevronRightIcon, CloseIcon } from './icons';

type ViewerState = { photos: string[]; index: number; altBase: string };

type Ctx = { open: (photos: string[], index: number, altBase: string) => void; isOpen: boolean };

const PhotoViewerContext = createContext<Ctx | null>(null);

export function usePhotoViewer(): Ctx {
  const ctx = useContext(PhotoViewerContext);
  if (!ctx) throw new Error('usePhotoViewer must be used inside PhotoViewerProvider');
  return ctx;
}

export default function PhotoViewerProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<ViewerState | null>(null);
  const pushedRef = useRef(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const t = useTranslations('videoReports');

  const open = useCallback((photos: string[], index: number, altBase: string) => {
    setState({ photos, index, altBase });
    window.history.pushState({ photoViewer: true }, '');
    pushedRef.current = true;
  }, []);

  const close = useCallback(() => {
    setState(null);
    if (pushedRef.current) {
      pushedRef.current = false;
      window.history.back();
    }
  }, []);

  const go = useCallback((delta: number) => {
    setState((s) => {
      if (!s) return s;
      const next = s.index + delta;
      if (next < 0 || next >= s.photos.length) return s;
      return { ...s, index: next };
    });
  }, []);

  useEffect(() => {
    const onPopState = () => {
      pushedRef.current = false;
      setState(null);
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  useEffect(() => {
    if (!state) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowLeft') go(-1);
      else if (e.key === 'ArrowRight') go(1);
      else if (e.key === 'Tab') {
        const el = dialogRef.current;
        if (!el) return;
        const focusable = el.querySelectorAll<HTMLElement>('button:not([disabled])');
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener('keydown', onKey);
    lockScroll();
    dialogRef.current?.focus();
    return () => {
      document.removeEventListener('keydown', onKey);
      unlockScroll();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, close, go]);

  const onTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchStart.current = { x: touch.clientX, y: touch.clientY };
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart.current) return;
    const touch = e.changedTouches[0];
    const dx = touch.clientX - touchStart.current.x;
    const dy = touch.clientY - touchStart.current.y;
    touchStart.current = null;

    if (Math.abs(dy) > Math.abs(dx) && dy > 60) {
      close();
    } else if (dx < -50) {
      go(1);
    } else if (dx > 50) {
      go(-1);
    }
  };

  return (
    <PhotoViewerContext.Provider value={{ open, isOpen: state !== null }}>
      {children}

      {state && (
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          tabIndex={-1}
          onClick={close}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
          className="fixed inset-0 z-[90] flex items-center justify-center bg-ink/90 p-4 outline-none"
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              close();
            }}
            aria-label={t('close')}
            className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-surface text-paper shadow-lg transition-colors hover:bg-accent hover:text-white"
          >
            <CloseIcon className="h-5 w-5" />
          </button>

          <div className="absolute left-1/2 top-4 -translate-x-1/2 rounded-full bg-paper/70 px-3 py-1 text-sm font-medium text-white">
            {state.index + 1} / {state.photos.length}
          </div>

          {state.index > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                go(-1);
              }}
              aria-label={t('prevPhoto')}
              className="absolute left-4 top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-surface/90 text-paper shadow-lg transition-colors hover:bg-accent hover:text-white md:flex"
            >
              <ChevronLeftIcon />
            </button>
          )}

          {state.index < state.photos.length - 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                go(1);
              }}
              aria-label={t('nextPhoto')}
              className="absolute right-4 top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-surface/90 text-paper shadow-lg transition-colors hover:bg-accent hover:text-white md:flex"
            >
              <ChevronRightIcon />
            </button>
          )}

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={state.photos[state.index]}
            alt={`${state.altBase} ${state.index + 1}`}
            onClick={(e) => e.stopPropagation()}
            className="max-h-[85vh] max-w-full object-contain"
          />

          {/* подгрузка соседних фото заранее — не влияет на вёрстку, скрыты */}
          {state.photos[state.index - 1] && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={state.photos[state.index - 1]} alt="" className="hidden" />
          )}
          {state.photos[state.index + 1] && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={state.photos[state.index + 1]} alt="" className="hidden" />
          )}
        </div>
      )}
    </PhotoViewerContext.Provider>
  );
}
