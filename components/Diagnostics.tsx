'use client';

import { useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

type Item = { title: string; desc: string };

const ROW_HEIGHT = 110;

// фото 1:1 с порядком diagnostics.items в messages/*.json
const PHOTOS = [
  '/images/diagnostics/lkp.jpg',
  '/images/diagnostics/scanner.jpg',
  '/images/diagnostics/mileage.jpg',
  '/images/diagnostics/hood.jpg',
  '/images/diagnostics/suspension.jpg'
];

// кратчайшее расстояние по кольцу (зацикленный список: после последнего пункта снова идёт первый)
function wrapOffset(offset: number, total: number) {
  let wrapped = offset;
  if (wrapped > total / 2) wrapped -= total;
  if (wrapped < -total / 2) wrapped += total;
  return wrapped;
}

export default function Diagnostics() {
  const t = useTranslations('diagnostics');
  const items = t.raw('items') as Item[];

  // контейнер списка точно вмещает все пункты: активный по центру + по половине сверху/снизу
  const listHeight = items.length * ROW_HEIGHT;
  const activeY = listHeight / 2;

  const sectionRef = useRef<HTMLElement | null>(null);
  const stickyRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!sectionRef.current || !stickyRef.current) return;

    const ctx = gsap.context(() => {
      const rows = gsap.utils.toArray('.diag-row') as HTMLElement[];
      const photos = gsap.utils.toArray('.diag-photo') as HTMLElement[];
      const total = rows.length;
      if (!total) return;

      const wasActive: boolean[] = new Array(total).fill(false);

      gsap.set(rows, { yPercent: -50 });

      const entryEase = gsap.parseEase('power1.inOut');

      const render = (rawProgress: number) => {
        // плавный разгон/торможение на входе и выходе из закреплённого блока —
        // без этого скорость скролла здесь ощущается как резкий скачок относительно обычной прокрутки страницы
        const progress = entryEase(rawProgress);
        const continuousIndex = progress * (total - 1);

        rows.forEach((row, i) => {
          const offset = wrapOffset(i - continuousIndex, total);
          const focus = gsap.utils.clamp(0, 1, 1 - Math.abs(offset));

          const title = row.querySelector<HTMLElement>('.diag-title');
          const desc = row.querySelector<HTMLElement>('.diag-desc');

          gsap.set(row, {
            y: offset * ROW_HEIGHT,
            zIndex: Math.round(gsap.utils.interpolate(1, 30, focus))
          });
          gsap.set(title, {
            opacity: gsap.utils.interpolate(0.3, 1, focus),
            color: focus > 0.5 ? 'var(--color-paper)' : 'var(--color-muted)'
          });

          const isActive = focus > 0.45;
          if (isActive !== wasActive[i]) {
            wasActive[i] = isActive;
            gsap.to(desc, {
              opacity: isActive ? 1 : 0,
              y: isActive ? 0 : 8,
              duration: 0.3,
              ease: 'power2.out'
            });
          }

          const photo = photos[i];
          if (photo) {
            gsap.set(photo, {
              opacity: focus,
              scale: gsap.utils.interpolate(0.96, 1, focus),
              zIndex: Math.round(focus * 10)
            });
          }
        });
      };

      render(0);

      const trigger = ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top top',
        end: `+=${total * 90}%`,
        pin: stickyRef.current,
        scrub: 0.7,
        pinSpacing: true,
        invalidateOnRefresh: true,
        onUpdate: (self) => render(self.progress)
      });

      return () => trigger.kill();
    }, sectionRef);

    return () => ctx.revert();
  }, [items.length]);

  return (
    <section ref={sectionRef} className="relative border-t border-line bg-surface">
      <div className="relative mx-auto max-w-6xl px-5 pt-20">
        <div className="inline-block">
          <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
            {t('title')}
          </h2>
          <div className="mt-3 h-[3px] w-full bg-gradient-to-r from-accent to-transparent" />
        </div>
      </div>

      <div ref={stickyRef} className="relative mx-auto flex h-screen max-w-6xl items-center px-5">
        <div className="absolute inset-y-0 left-1/2 w-screen -translate-x-1/2 overflow-hidden">
          <img
            src="/images/diagnostics/background_image.jpeg"
            alt=""
            className="h-full w-full object-cover opacity-45"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-surface via-surface/40 to-surface" />
        </div>
        <div className="relative grid w-full items-center gap-10 lg:grid-cols-2">
          {/* список услуг — активный пункт по центру, пройденные видны затухающими сверху */}
          <div className="relative overflow-hidden" style={{ height: listHeight }}>
            {items.map((it) => (
              <div
                key={it.title}
                className="diag-row absolute inset-x-0"
                style={{ top: activeY }}
              >
                <div
                  className="diag-title text-xl font-black tracking-tight transition-colors md:text-2xl"
                  style={{ fontFamily: 'var(--font-manrope)' }}
                >
                  {it.title}
                </div>
                <div
                  className="diag-desc mt-2 max-w-md translate-y-2 font-[650] text-[#365b70] opacity-0"
                  style={{ fontFamily: 'var(--font-manrope)' }}
                >
                  {it.desc}
                </div>
              </div>
            ))}
          </div>

          {/* активное фото — одно, кроссфейдится между пунктами; рассеянный свет вместо рамки отделяет его от фона */}
          <div className="relative mx-auto">
            <div className="absolute inset-0 scale-110 rounded-full bg-surface/70 blur-3xl" />
            <div className="relative h-[290px] w-[435px] sm:h-[360px] sm:w-[540px]">
            {items.map((it, i) => (
              <div
                key={it.title}
                className="diag-photo absolute inset-0 overflow-hidden rounded-[16px] shadow-[0_30px_60px_rgba(0,0,0,0.28),0_8px_20px_rgba(0,0,0,0.16)]"
              >
                <img
                  src={PHOTOS[i]}
                  alt={it.title}
                  className="absolute inset-0 h-full w-full object-cover"
                  draggable={false}
                />
              </div>
            ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
