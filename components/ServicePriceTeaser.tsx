import type { ReactNode } from 'react';
import LeadCTA from './LeadCTA';
import { findReviewsAvatar } from '@/lib/reviewsAvatar';

// карточка-тизер цены для /services/check — вместо таблицы цен (клиент не хочет их показывать).
// Оформлена как входящее сообщение: левый верхний угол прямой, к нему прикреплён «хвостик».
// Эффекты (стили в globals.css, префикс teaser-): онлайн-точка у аватара, блик на кнопке, «печатает…» при
// загрузке, лёгкий розовый оттенок фона, подъём при наведении. Все анимации отключаются при reduced-motion.
// На lg+ карточка липкая и держится по центру высоты окна: top = 50vh минус половина высоты карточки
// (~290px → 9rem), но не выше 6rem, чтобы не уйти под шапку на низких окнах.
// justify-self-center — по центру правой колонки; items-start уже стоит на родительской grid в ServiceDetails.
export type ServicePriceTeaserProps = {
  title: string;
  // текст может содержать выделенную фразу (результат t.rich), поэтому ReactNode
  text: ReactNode;
  cta: string;
  // подпись под названием в шапке «сообщения», например «на связи в Telegram»
  status: string;
};

// хвостик: два треугольника — внешний цвета границы, внутренний цвета фона на 1px правее.
// Цвета совпадают с оттенком карточки (граница #f1c9cd, верх фона #fff4f5).
const TAIL =
  'before:absolute before:-left-[11px] before:-top-px before:h-0 before:w-0 before:border-l-[11px] before:border-t-[16px] before:border-l-transparent before:border-t-[#f1c9cd] ' +
  'after:absolute after:-left-[9px] after:top-0 after:h-0 after:w-0 after:border-l-[10px] after:border-t-[14px] after:border-l-transparent after:border-t-[#fff4f5]';

export default function ServicePriceTeaser({ title, text, cta, status }: ServicePriceTeaserProps) {
  // фото профиля TikTok (public/reviews/avatar.*); если файла нет — красный круг с инициалами «AH»
  const avatarSrc = findReviewsAvatar();

  return (
    <div
      className={`relative ml-[11px] flex w-[calc(100%-11px)] flex-col rounded-bl-[22px] rounded-br-[22px] rounded-tl-none rounded-tr-[22px] border border-[#f1c9cd] bg-gradient-to-b from-[#fff4f5] to-surface to-[62%] p-6 transition-transform duration-300 hover:-translate-y-[3px] motion-reduce:transition-none motion-reduce:hover:translate-y-0 sm:p-7 lg:sticky lg:top-[max(6rem,calc(50vh-9rem))] lg:max-w-[340px] lg:justify-self-center ${TAIL}`}
    >
      <div className="flex items-center gap-3">
        <span
          aria-hidden
          className="relative flex h-[36px] w-[36px] shrink-0 items-center justify-center rounded-full bg-accent text-xs font-semibold text-white"
        >
          {avatarSrc ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={avatarSrc} alt="" className="h-full w-full rounded-full object-cover" />
          ) : (
            'AH'
          )}
          {/* онлайн-точка с мягкой пульсацией кольца */}
          <span className="teaser-dot-ring absolute bottom-0 right-0 h-[9px] w-[9px] rounded-full border-2 border-white bg-[#22a45d]" />
        </span>
        <span className="text-xs leading-snug text-muted">
          <span className="block text-[13px] font-semibold text-paper">AutoPodbor Hamburg</span>
          {status}
        </span>
      </div>

      {/* «печатает…»: три точки поверх места сообщения, затем текст плавно появляется */}
      <div className="relative">
        <div
          aria-hidden
          className="teaser-typing absolute left-0 top-5 w-14 items-center justify-center gap-[5px] rounded-2xl bg-[#f1f1f1] py-3"
        >
          <i className="h-[7px] w-[7px] rounded-full bg-[#9aa0a5]" />
          <i className="h-[7px] w-[7px] rounded-full bg-[#9aa0a5]" />
          <i className="h-[7px] w-[7px] rounded-full bg-[#9aa0a5]" />
        </div>

        <div className="teaser-msg">
          <h2 className="mt-5 text-[22px] font-semibold leading-tight tracking-tight">{title}</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted">{text}</p>
        </div>
      </div>

      <div className="mt-6">
        <LeadCTA variant="card" label={cta} className="teaser-shine min-h-[48px] w-full justify-center" />
      </div>
    </div>
  );
}
