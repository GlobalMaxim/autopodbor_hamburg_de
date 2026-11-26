import { useTranslations } from 'next-intl';

// Карточка-переход на телефоне и планшете (на lg+ скрыта): вопрос о цене, пояснение и стрелка вниз к блоку чата/заявки.
// Вид общий для /services/check и /services/pick; на подборе своя первая строка (lead), ведущая к заявке. Покачивание стрелки — .jump-arrow в globals.css.
export default function JumpCard({ lead, className = '' }: { lead?: string; className?: string }) {
  const t = useTranslations('services');

  return (
    <a
      href="#request"
      className={`block rounded-2xl border border-t-4 border-[#f1c9cd] border-t-accent bg-gradient-to-b from-[#ffe8eb] to-[#fff8f9] px-5 pb-3 pt-5 text-center lg:hidden ${className}`}
    >
      <span className="block text-2xl font-semibold leading-tight text-paper">
        {t('check.priceCardTitle')}
      </span>
      <span className="mt-2 block text-sm leading-relaxed text-muted">
        <span className="whitespace-pre-line">{lead ?? t('jumpText')}</span>
        <br />
        <span className="whitespace-nowrap">
          <span className="font-semibold text-paper underline decoration-accent decoration-2 underline-offset-4">
            {t('jumpAccent')}
          </span>
          .
        </span>
      </span>
      <svg
        aria-hidden
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="jump-arrow mx-auto mt-2 h-7 w-7 text-accent"
      >
        <path d="M12 5v14M19 12l-7 7-7-7" />
      </svg>
    </a>
  );
}
