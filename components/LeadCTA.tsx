'use client';

import { useTranslations } from 'next-intl';
import { telegramUrl } from '@/lib/content';

const variants = {
  default: {
    classes:
      'rounded-full px-6 py-3 text-sm bg-accent text-white hover:bg-accent-strong hover:shadow-[0_8px_30px_-8px_rgba(233,32,49,0.6)]',
    arrow: true
  },
  light: {
    classes:
      'rounded-lg px-5 py-2.5 text-lg uppercase tracking-wide border border-accent-strong bg-gradient-to-r from-[#e0394a] to-[#a4111d] text-white hover:shadow-[0_8px_30px_-8px_rgba(233,32,49,0.6)]',
    arrow: false
  },
  // та же палитра, что у default, но со скруглением как у карточек (rounded-2xl вместо pill) — нужно для /services/check
  card: {
    classes:
      'rounded-2xl px-6 py-3 text-sm bg-accent text-white hover:bg-accent-strong hover:shadow-[0_8px_30px_-8px_rgba(233,32,49,0.6)]',
    arrow: true
  }
};

export default function LeadCTA({
  label,
  variant = 'default',
  href
}: {
  label?: string;
  variant?: keyof typeof variants;
  href?: string;
}) {
  const t = useTranslations('common');
  const v = variants[variant];

  return (
    <a
      href={href ?? telegramUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-2 whitespace-nowrap font-semibold transition-all duration-300 hover:scale-[1.03] active:scale-95 ${v.classes}`}
    >
      {label ?? t('ctaDiscuss')}
      {v.arrow ? ' →' : ''}
    </a>
  );
}
