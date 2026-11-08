import { getTranslations, setRequestLocale } from 'next-intl/server';
import SocialLinks from '@/components/SocialLinks';
import Breadcrumbs from '@/components/Breadcrumbs';

export default async function SocialsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const tCommon = await getTranslations('common');

  return (
    <div className="mx-auto max-w-3xl px-5 py-16">
      <Breadcrumbs items={[{ label: tCommon('nav.socials') }]} />
      <h1 className="text-4xl font-semibold tracking-tight">Соцсети</h1>
      <p className="mt-3 text-muted">
        Есть вопросы по подбору? Напишите нам напрямую.
      </p>
      <div className="mt-10">
        <SocialLinks />
      </div>
    </div>
  );
}
