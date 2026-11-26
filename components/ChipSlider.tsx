'use client';

import { useEffect, useRef, useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from './reports/icons';

// Телефон и планшет (<lg): плитки в одну строку с горизонтальной прокруткой — пальцем или (от sm) стрелками.
// Стрелки и затухание по краям появляются только когда плитки не помещаются и в ту сторону есть что листать.
// Компьютер (lg+): ленты нет, плитки переносятся на следующую строку по ширине.

const ARROW =
  'absolute top-1/2 z-10 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-line bg-white text-paper shadow-sm transition-colors hover:border-accent hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 sm:flex lg:hidden';

export default function ChipSlider({
  children,
  prevLabel,
  nextLabel
}: {
  children: React.ReactNode;
  prevLabel: string;
  nextLabel: string;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ prev: false, next: false });

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const update = () =>
      setEdges({
        prev: el.scrollLeft > 4,
        next: el.scrollLeft + el.clientWidth < el.scrollWidth - 4
      });
    update();
    el.addEventListener('scroll', update, { passive: true });
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => {
      el.removeEventListener('scroll', update);
      observer.disconnect();
    };
  }, []);

  const move = (direction: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    el.scrollBy({ left: direction * el.clientWidth * 0.7, behavior: reducedMotion ? 'auto' : 'smooth' });
  };

  return (
    <div className="relative min-w-0">
      {/* -m-1 p-1: чтобы кольцо фокуса и рамка выбранной плитки не обрезались лентой */}
      <div ref={trackRef} className="no-scrollbar -m-1 flex gap-2 overflow-x-auto p-1 lg:flex-wrap lg:overflow-visible">
        {children}
      </div>

      {edges.prev && (
        <>
          <div aria-hidden className="pointer-events-none absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-surface to-transparent lg:hidden" />
          <button type="button" aria-label={prevLabel} onClick={() => move(-1)} className={`${ARROW} left-0`}>
            <ChevronLeftIcon className="h-4 w-4" />
          </button>
        </>
      )}

      {edges.next && (
        <>
          <div aria-hidden className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-surface to-transparent lg:hidden" />
          <button type="button" aria-label={nextLabel} onClick={() => move(1)} className={`${ARROW} right-0`}>
            <ChevronRightIcon className="h-4 w-4" />
          </button>
        </>
      )}
    </div>
  );
}
