import { getLocale, getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';

type BreadcrumbItem = { label: string; href?: string };

function ArrowRightIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M5 12h14M13 5l7 7-7 7" />
    </svg>
  );
}

export default async function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  const locale = await getLocale();
  const t = await getTranslations('common');
  const tb = await getTranslations('breadcrumbs');

  const allItems: BreadcrumbItem[] = [{ label: t('nav.home'), href: '/' }, ...items];

  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? '').replace(/\/+$/, '');
  const toAbsoluteUrl = (href: string) => `${siteUrl}/${locale}${href === '/' ? '' : href}`;

  return (
    <>
      <nav aria-label={tb('ariaLabel')} className="mb-8">
        <ol className="flex flex-nowrap items-center overflow-hidden">
          {allItems.map((item, i) => {
            const isLast = i === allItems.length - 1;
            return (
              <li key={i} className={`flex items-center ${isLast ? 'min-w-0' : 'shrink-0'}`}>
                {i > 0 && (
                  <span aria-hidden="true" className="flex shrink-0 items-center px-2 pt-3 pb-px text-accent">
                    <ArrowRightIcon className="h-3.5 w-3.5" />
                  </span>
                )}
                {!isLast && item.href ? (
                  <Link
                    href={item.href}
                    className="rounded-sm border-b border-transparent pb-px pt-3 text-sm text-muted transition-colors duration-150 hover:border-accent hover:text-paper focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span
                    aria-current="page"
                    className="min-w-0 truncate border-b-2 border-accent pb-px pt-3 text-sm font-medium text-paper"
                  >
                    {item.label}
                  </span>
                )}
              </li>
            );
          })}
        </ol>
      </nav>

      {siteUrl && (
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'BreadcrumbList',
              itemListElement: allItems.map((item, i) => ({
                '@type': 'ListItem',
                position: i + 1,
                name: item.label,
                ...(i < allItems.length - 1 && item.href ? { item: toAbsoluteUrl(item.href) } : {})
              }))
            })
          }}
        />
      )}
    </>
  );
}
