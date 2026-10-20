'use client';

import { useRef, useState } from 'react';

export default function CopyTemplateButton({
  text,
  label,
  copiedLabel
}: {
  text: string;
  label: string;
  copiedLabel: string;
}) {
  const [copied, setCopied] = useState(false);
  const [failed, setFailed] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setFailed(false);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // буфер обмена недоступен (разрешения/старый браузер) — показываем текст для ручного копирования
      setFailed(true);
      setTimeout(() => textareaRef.current?.select(), 0);
    }
  };

  return (
    <div>
      <button
        type="button"
        onClick={handleCopy}
        className="rounded-2xl border border-line px-6 py-3 text-sm font-semibold text-paper transition-colors hover:border-accent hover:text-accent"
      >
        {copied ? copiedLabel : label}
      </button>

      {failed && (
        <textarea
          ref={textareaRef}
          readOnly
          value={text}
          onFocus={(e) => e.currentTarget.select()}
          className="mt-3 w-full rounded-xl border border-line bg-surface-2 p-3 text-sm text-paper"
          rows={10}
        />
      )}
    </div>
  );
}
