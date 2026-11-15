'use client';

import { useEffect, useRef, useState } from 'react';

// счётчик «от нуля до значения». value — строка вида "5000+": число и произвольный суффикс/префикс.
// На сервере и без JS показывается итоговое значение; на клиенте при появлении в зоне видимости
// число обнуляется и плавно растёт (ease-out). При prefers-reduced-motion анимации нет.
export default function CountUp({
  value,
  duration = 1800,
  className
}: {
  value: string;
  duration?: number;
  className?: string;
}) {
  const match = value.match(/^(\D*)(\d+)(.*)$/);
  const prefix = match?.[1] ?? '';
  const target = match ? Number(match[2]) : 0;
  const suffix = match?.[3] ?? '';

  const ref = useRef<HTMLSpanElement>(null);
  const [current, setCurrent] = useState<number | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !match) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let raf = 0;
    const run = () => {
      const start = performance.now();
      const tick = (now: number) => {
        const p = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        setCurrent(Math.round(target * eased));
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      setCurrent(0);
      raf = requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          io.disconnect();
          run();
        }
      },
      { threshold: 0.4 }
    );
    io.observe(el);

    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, duration]);

  if (!match) return <span className={className}>{value}</span>;

  return (
    <span ref={ref} className={className} aria-label={value}>
      <span aria-hidden>
        {prefix}
        {current ?? target}
        {suffix}
      </span>
    </span>
  );
}
