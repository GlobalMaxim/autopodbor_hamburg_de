import type { ReactNode } from 'react';

const PATHS: Record<string, ReactNode> = {
  telegram: (
    <>
      <path d="M22 2 11 13" />
      <path d="M22 2 15 22l-4-9-9-4 22-5z" />
    </>
  ),
  tiktok: (
    <>
      <circle cx="8" cy="18" r="4" />
      <path d="M12 18V2l7 4" />
    </>
  ),
  instagram: (
    <>
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <path d="M16 11.37a4 4 0 1 1-7.75 1.26 4 4 0 0 1 7.75-1.26z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </>
  ),
  youtube: (
    <>
      <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
      <path d="m10 15 5-3-5-3z" />
    </>
  ),
  facebook: <path d="M15 3h-2a5 5 0 0 0-5 5v3H6v4h2v6h4v-6h3l1-4h-4V8a1 1 0 0 1 1-1h3z" />,
  whatsapp: (
    <>
      <path d="M12 2a10 10 0 0 0-8.5 15.2L2 22l4.9-1.5A10 10 0 1 0 12 2z" />
      <path d="M8.5 9c0-.5.4-1 .9-1h.5l1 2-1 1a5 5 0 0 0 3 3l1-1 2 1v.5c0 .5-.5 1-1 1-3 0-6.4-3.6-6.4-6.5z" />
    </>
  )
};

export default function SocialIcon({
  platform,
  className = 'h-4 w-4'
}: {
  platform: string;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {PATHS[platform]}
    </svg>
  );
}
