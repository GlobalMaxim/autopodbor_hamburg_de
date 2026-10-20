'use client';

import { useTranslations } from 'next-intl';
import type { Verdict } from '@/lib/content';

const STYLES = {
  good: 'border-good/30 bg-good/15 text-good',
  warn: 'border-warn/30 bg-warn/15 text-warn',
  bad: 'border-bad/30 bg-bad/15 text-bad'
} as const;

const DOT = {
  good: 'bg-good',
  warn: 'bg-warn',
  bad: 'bg-bad'
} as const;

export default function VerdictBadge({ verdict }: { verdict: Verdict }) {
  const t = useTranslations('verdicts');

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold ${STYLES[verdict]}`}
    >
      <span className="relative flex h-2 w-2">
        <span
          className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-50 ${DOT[verdict]}`}
        />
        <span
          className={`relative inline-flex h-2 w-2 rounded-full ${DOT[verdict]}`}
        />
      </span>
      {t(verdict)}
    </span>
  );
}
