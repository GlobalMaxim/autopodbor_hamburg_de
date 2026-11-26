import { getTranslations, setRequestLocale } from 'next-intl/server';
import ServiceSteps, { type ServiceStep } from '@/components/ServiceSteps';
import ServiceChecklist from '@/components/ServiceChecklist';
import ServiceExtra from '@/components/ServiceExtra';
import AccentUnderline from '@/components/AccentUnderline';
import Breadcrumbs from '@/components/Breadcrumbs';
import PageContainer from '@/components/PageContainer';
import PickRequestForm from '@/components/PickRequestForm';
import JumpCard from '@/components/JumpCard';
import { findReviewsAvatar } from '@/lib/reviewsAvatar';

export default async function PickServicePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('services');
  const tCommon = await getTranslations('common');

  const checklist = t.raw('checklist') as string[];
  const pickIcons: ServiceStep['icon'][] = ['list', 'search'];
  const processSteps = (t.raw('pick.processSteps') as ServiceStep[]).map((s, i) => ({
    ...s,
    icon: pickIcons[i]
  }));

  return (
    <PageContainer>
      <Breadcrumbs items={[{ label: tCommon('nav.services'), href: '/#services' }, { label: t('pick.title') }]} />
      <h1 className="text-4xl font-semibold tracking-tight">{t('pick.title')}</h1>
      <AccentUnderline className="mt-3" />
      {/* text-muted не проходит WCAG AA (≈4:1) на светлом фоне */}
      <p className="mt-4 max-w-2xl text-[#5b6166]">{t('pick.pageSubtitle')}</p>

      {/*
        TODO: данные не заполнены владельцем сайта — когда появятся, решить насчёт шага
        "Сопровождаем покупку" (сейчас убран, т.к. состав сопровождения не подтверждён;
        если подтвердится — вернуть шаг и приписку "...и сопровождаем покупку" в pageSubtitle).
      */}
      <ServiceSteps title={t('pick.stepsTitle')} steps={processSteps} />

      {/*
        Один путь отправки — форма. На lg+ чат с кнопкой стоит справа и идёт вдоль списка проверки и формы;
        на телефоне и планшете он под формой, а после списка проверки — карточка-переход к ней.
      */}
      <PickRequestForm
        avatarSrc={findReviewsAvatar()}
        before={
          <>
            <h2 className="text-xl font-semibold tracking-tight">{t('pick.includedTitle')}</h2>
            <ServiceChecklist items={checklist} />
            <ServiceExtra label={t('extraLabel')} items={[{ title: t('extraTitle') }]} variant="available" />

            {/* телефон и планшет: переход к заявке — сразу после списка проверки */}
            <JumpCard lead={t('pick.jumpText')} className="mt-10" />
          </>
        }
      />
    </PageContainer>
  );
}
