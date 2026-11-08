import type { ReactNode } from 'react';

// единый внешний контейнер страниц — ширина как в Header/Footer и секциях главной (max-w-6xl px-5),
// чтобы левый/правый край контента везде совпадал
export default function PageContainer({
  className = '',
  children
}: {
  className?: string;
  children: ReactNode;
}) {
  return <div className={`mx-auto max-w-6xl px-5 py-5 ${className}`}>{children}</div>;
}
