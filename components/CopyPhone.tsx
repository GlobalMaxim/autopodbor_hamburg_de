'use client';

import { useState } from 'react';

export default function CopyPhone({ number, copiedLabel }: { number: string; copiedLabel: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(number);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // буфер обмена недоступен — молча игнорируем
    }
  };

  return (
    <button type="button" onClick={handleCopy} className="group/phone flex cursor-pointer items-center gap-2">
      <span className="text-2xl font-semibold tracking-tight text-paper transition-colors group-hover/phone:text-accent">
        {number}
      </span>
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-4 w-4 shrink-0 text-muted transition-colors group-hover/phone:text-paper"
      >
        <rect x="9" y="9" width="11" height="11" rx="2" />
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
      </svg>
      <span className={`text-xs font-medium text-accent transition-opacity ${copied ? 'opacity-100' : 'opacity-0'}`}>
        {copiedLabel}
      </span>
    </button>
  );
}
