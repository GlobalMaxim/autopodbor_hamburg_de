'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { socials } from '@/lib/content';
import SocialIcon from './SocialIcon';

const PRIMARY = 'inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white transition-all duration-300 hover:scale-[1.03] hover:bg-accent-strong hover:shadow-[0_8px_30px_-8px_rgba(233,32,49,0.6)] active:scale-95';
const SECONDARY = 'inline-flex items-center gap-2 rounded-full border border-line px-6 py-3 text-sm font-medium transition-all duration-300 hover:border-accent hover:text-accent';

export default function Footer() {
  const s = useTranslations('socials');
  const cta = useTranslations('footer.cta');

  const channels = socials.filter((c) => c.enabled).sort((a, b) => a.order - b.order);

  return (
    <footer className="relative border-t border-line bg-surface">
      <div className="mx-auto max-w-6xl px-5 py-16">
        <div className="text-center">
          <h2 className="text-3xl font-semibold tracking-tight">{s('title')}</h2>
          <p className="mx-auto mt-3 max-w-xl text-muted">{s('text')}</p>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {channels.map((c, i) => (
              <a
                key={c.platform}
                href={c.url}
                target="_blank"
                rel="noopener noreferrer"
                className={i === 0 ? PRIMARY : SECONDARY}
              >
                <SocialIcon platform={c.platform} />
                {cta.has(c.platform) ? cta(c.platform) : c.label}
              </a>
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-col justify-between gap-4 border-t border-line pt-6 text-sm text-muted md:flex-row">
          <div>© {new Date().getFullYear()} AutoPodbor Hamburg</div>
          <div className="flex gap-5">
            <Link href="/impressum" className="hover:text-paper">
              Impressum
            </Link>
            <Link href="/datenschutz" className="hover:text-paper">
              Datenschutz
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
