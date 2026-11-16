import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';

type Item = { href: '/services/pick' | '/services/check'; title: string; desc: string; icon: 'search' | 'clipboard' };

function Icon({ name }: { name: Item['icon'] }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {name === 'search' ? (
        <>
          <circle cx="11" cy="11" r="7" />
          <path d="m21 21-4.3-4.3" />
        </>
      ) : (
        <>
          <rect x="5" y="4" width="14" height="17" rx="2" />
          <path d="M9 4h6v3H9zM9 14l2 2 4-4" />
        </>
      )}
    </svg>
  );
}

// блок выбора услуги под шагами на /how-it-works: две равнозначные карточки-ссылки
export default async function HowItWorksChoice() {
  const t = await getTranslations('how');
  const s = await getTranslations('services');

  const items: Item[] = [
    { href: '/services/pick', title: s('pick.title'), desc: t('choosePickDesc'), icon: 'search' },
    { href: '/services/check', title: s('check.title'), desc: t('chooseCheckDesc'), icon: 'clipboard' }
  ];

  return (
    <div className="mx-auto max-w-3xl px-5 pb-20">
      <h2 className="text-center text-2xl font-semibold tracking-tight text-paper">{t('chooseTitle')}</h2>
      <div className="mt-5 flex justify-center" aria-hidden>
        <span className="flex h-9 w-9 animate-bounce items-center justify-center rounded-full border border-[#f1c9cd] bg-[#fff4f5] text-accent motion-reduce:animate-none">
          <svg
            viewBox="0 0 24 24"
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </span>
      </div>
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="group flex flex-col gap-3 rounded-2xl border border-[#f4e1e3] bg-[#fffbfb] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_8px_24px_-18px_rgba(60,20,25,0.18)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#f1c9cd] hover:bg-[#fff4f5] hover:shadow-[0_16px_34px_-18px_rgba(218,22,38,0.5)] motion-reduce:transition-none motion-reduce:hover:translate-y-0"
          >
            {/* телефон: иконка и название в одной строке; планшет/десктоп: иконка над названием */}
            <span className="flex items-center gap-3 md:flex-col md:items-start">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent text-white shadow-[0_6px_14px_-6px_rgba(218,22,38,0.6)]">
                <Icon name={item.icon} />
              </span>
              <span className="text-base font-semibold leading-snug text-paper">{item.title}</span>
            </span>
            <span className="text-sm leading-5 text-[#5b6166]">{item.desc}</span>
            <span className="mt-auto pt-1 text-sm font-medium text-accent">
              {t('chooseMore')}
              <span className="ml-1 inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
