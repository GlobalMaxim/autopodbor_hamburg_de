import { getTranslations, setRequestLocale } from 'next-intl/server';
import ServiceSteps, { type ServiceStepIcon } from '@/components/ServiceSteps';
import ServiceDetails from '@/components/ServiceDetails';
import TelegramChat from '@/components/TelegramChat';
import JumpCard from '@/components/JumpCard';
import AccentUnderline from '@/components/AccentUnderline';
import Breadcrumbs from '@/components/Breadcrumbs';
import PageContainer from '@/components/PageContainer';
import { findReviewsAvatar } from '@/lib/reviewsAvatar';

export default async function CheckServicePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('services');
  const tCommon = await getTranslations('common');

  const checklist = t.raw('checklist') as string[];
  const checkIcons: ServiceStepIcon[] = ['link', 'phone', 'video'];
  const processSteps = t.raw('check.processSteps') as string[];
  const message = t('check.priceCardMessage');

  return (
    <PageContainer>
      <Breadcrumbs
        items={[{ label: tCommon('nav.services'), href: '/#services' }, { label: t('check.title') }]}
      />
      <h1 className="text-4xl font-semibold tracking-tight">{t('check.title')}</h1>
      <AccentUnderline className="mt-3" />
      {/* text-muted не проходит WCAG AA (≈4:1) на светлом фоне */}
      <p className="mt-4 max-w-2xl text-[#5b6166]">{t('check.pageSubtitle')}</p>

      {/* как это работает — сразу под подзаголовком */}
      {/*
        TODO: срок и формат отчёта (шаг 3) не заполнены владельцем сайта —
        когда появятся данные, передать третьему шагу note (например "в день проверки, PDF с фото и замерами ЛКП").
      */}
      <ServiceSteps
        title={t('check.stepsTitle')}
        steps={processSteps.map((text, i) => ({ text, icon: checkIcons[i] }))}
      />

      {/* что входит + чат Telegram с готовым сообщением (цены клиент показывать не хочет) */}
      <ServiceDetails
        includedTitle={t('check.includedTitle')}
        checklist={checklist}
        extraLabel={t('extraLabel')}
        extraVariant="available"
        extraItems={[
          { title: t('extraTitle'), price: t('check.extraPrice') },
          { title: t('check.escortTitle'), note: t('check.escortNote') }
        ]}
        priceSlot={
          // тот же блок, что на /services/pick; ширина и сдвиг вправо как там, левая колонка прежняя
          <>
            <JumpCard />
            <TelegramChat
              id="request"
              avatarSrc={findReviewsAvatar()}
              message={message}
              className="lg:mt-8 lg:w-full lg:max-w-[440px] lg:justify-self-end xl:-mr-6"
            >
              <p>{message}</p>
            </TelegramChat>
          </>
        }
      />
    </PageContainer>
  );
}
