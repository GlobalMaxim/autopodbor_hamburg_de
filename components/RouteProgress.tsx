'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';

type Phase = 'idle' | 'loading' | 'done';

// лёгкая полоса загрузки без внешних зависимостей: ловим клик по внутренней ссылке
// (глобальный слушатель, не нужно оборачивать каждый Link) и завершаем по смене pathname.
export default function RouteProgress() {
  const pathname = usePathname();
  const [phase, setPhase] = useState<Phase>('idle');
  const startTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const doneTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prevPathname = useRef(pathname);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

      const anchor = (e.target as HTMLElement)?.closest?.('a');
      if (!anchor || !(anchor instanceof HTMLAnchorElement)) return;
      if (anchor.target && anchor.target !== '_self') return;
      if (anchor.hasAttribute('download')) return;

      let url: URL;
      try {
        url = new URL(anchor.href, window.location.href);
      } catch {
        return;
      }
      if (url.origin !== window.location.origin) return;
      // якорь на той же странице — браузер просто проскроллит, полоса загрузки не нужна
      if (url.pathname === window.location.pathname && url.hash) return;

      if (startTimer.current) clearTimeout(startTimer.current);
      startTimer.current = setTimeout(() => setPhase('loading'), 100);
    };

    document.addEventListener('click', onClick);
    return () => {
      document.removeEventListener('click', onClick);
      if (startTimer.current) clearTimeout(startTimer.current);
    };
  }, []);

  useEffect(() => {
    if (pathname === prevPathname.current) return;
    prevPathname.current = pathname;

    if (startTimer.current) {
      clearTimeout(startTimer.current);
      startTimer.current = null;
    }

    setPhase((p) => (p === 'idle' ? p : 'done'));
    doneTimer.current = setTimeout(() => setPhase('idle'), 200);

    return () => {
      if (doneTimer.current) clearTimeout(doneTimer.current);
    };
  }, [pathname]);

  if (phase === 'idle') return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-[70] h-0.5 bg-transparent">
      <div
        className={`h-full bg-accent transition-[width] duration-[2500ms] ease-out motion-reduce:transition-none ${
          phase === 'done' ? 'w-full !duration-200' : 'w-[85%]'
        }`}
      />
    </div>
  );
}
