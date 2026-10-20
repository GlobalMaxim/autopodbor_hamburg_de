import { getTranslations } from 'next-intl/server';
import { contactPhones, socials } from '@/lib/content';
import BrandIcon from '@/components/BrandIcon';
import AccentUnderline from '@/components/AccentUnderline';
import CopyPhone from '@/components/CopyPhone';

const whatsappBtn =
  'flex flex-1 items-center justify-center gap-2 rounded-2xl bg-[#E8F8EE] px-4 py-2.5 text-sm font-medium text-[#0F6B3A] transition-colors hover:bg-[#D4F2DF] md:flex-none';
const telegramBtn =
  'flex flex-1 items-center justify-center gap-2 rounded-2xl bg-[#E6F3FB] px-4 py-2.5 text-sm font-medium text-[#0B5F8F] transition-colors hover:bg-[#D2EAF8] md:flex-none';

export default async function ContactsPage() {
  const t = await getTranslations('contacts');
  const instagram = socials.find((s) => s.platform === 'instagram' && s.enabled);
  const tiktok = socials.find((s) => s.platform === 'tiktok' && s.enabled);

  const germany = contactPhones.find((p) => p.countryKey === 'germany')!;
  const ukraine = contactPhones.find((p) => p.countryKey === 'ukraine')!;
  const orderedPhones = [germany, ukraine];

  const socialCards = [
    instagram && { ...instagram, label: 'Instagram' },
    tiktok && { ...tiktok, label: 'TikTok' }
  ].filter(Boolean) as { platform: string; url: string; label: string }[];

  return (
    <div className="mx-auto max-w-4xl px-5 py-16">
      <h1 className="text-4xl font-semibold tracking-tight">{t('title')}</h1>
      <AccentUnderline className="mt-3" />
      <p className="mt-4 text-muted">{t('subtitle')}</p>

      <div className="mt-10 rounded-2xl border border-line bg-surface px-4 py-6 md:p-8">
        <div className="divide-y divide-line">
          {orderedPhones.map((p) => (
            <div
              key={p.digits}
              className="flex flex-col gap-3 py-5 first:pt-0 last:pb-0 md:flex-row md:items-center md:justify-between"
            >
              <div>
                <div className="text-sm text-muted">{t(p.countryKey)}</div>
                <CopyPhone number={p.number} copiedLabel={t('copied')} />
              </div>

              <div className="flex gap-3">
                <a href={`https://wa.me/${p.digits}`} target="_blank" rel="noopener noreferrer" className={whatsappBtn}>
                  <BrandIcon platform="whatsapp" className="h-5 w-5 text-[#25D366]" />
                  WhatsApp
                </a>
                <a
                  href={`https://t.me/${p.telegramUsername}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={telegramBtn}
                >
                  <BrandIcon platform="telegram" className="h-5 w-5 text-[#229ED9]" />
                  Telegram
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      <h2 className="mt-14 text-xl font-semibold tracking-tight">{t('socialsTitle')}</h2>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        {socialCards.map((s) => (
          <a
            key={s.platform}
            href={s.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-4 rounded-2xl border border-line bg-surface p-5 transition-colors hover:border-accent/50"
          >
            <BrandIcon
              platform={s.platform}
              className={`h-7 w-7 shrink-0 ${s.platform === 'tiktok' ? 'text-[#000000]' : 'text-[#E1306C]'}`}
            />
            <div className="min-w-0 flex-1">
              <div className="font-medium text-paper">{s.label}</div>
              <div className="text-sm text-muted">@autopodbor_hamburg_de</div>
            </div>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4 shrink-0 text-muted transition-transform duration-200 group-hover:translate-x-1 group-hover:text-accent"
            >
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </a>
        ))}
      </div>
    </div>
  );
}
