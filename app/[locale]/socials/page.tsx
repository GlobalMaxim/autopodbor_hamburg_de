import { getTranslations, setRequestLocale } from 'next-intl/server';
import SocialLinks from '@/components/SocialLinks';
import Breadcrumbs from '@/components/Breadcrumbs';
import PageContainer from '@/components/PageContainer';

export default async function SocialsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const tCommon = await getTranslations('common');

  return (
    <PageContainer className="py-16">
      <div className="max-w-3xl">
        <Breadcrumbs items={[{ label: tCommon('nav.socials') }]} />
        <h1 className="text-4xl font-semibold tracking-tight">Соцсети</h1>
        <p className="mt-3 text-muted">
          Есть вопросы по подбору? Напишите нам напрямую.
        </p>
        <div className="mt-10">
          <SocialLinks />
        </div>
      </div>
    </PageContainer>
  );
}
