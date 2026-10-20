import { socials } from '@/lib/content';
import SocialIcon from './SocialIcon';

export default function SocialLinks() {
  return (
    <div className="flex flex-wrap gap-3">
      {socials
        .filter((s) => s.enabled)
        .sort((a, b) => a.order - b.order)
        .map((s) => (
          <a
            key={s.platform}
            href={s.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-5 py-2.5 text-sm font-medium transition-colors hover:border-accent hover:text-accent"
          >
            <SocialIcon platform={s.platform} />
            {s.label}
          </a>
        ))}
    </div>
  );
}
