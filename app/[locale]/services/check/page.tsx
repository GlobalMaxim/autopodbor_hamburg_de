import { getTranslations, setRequestLocale } from 'next-intl/server';
import ServiceSteps from '@/components/ServiceSteps';
import ServiceDetails from '@/components/ServiceDetails';
import ServicePriceTeaser from '@/components/ServicePriceTeaser';
import AccentUnderline from '@/components/AccentUnderline';
import Breadcrumbs from '@/components/Breadcrumbs';
import PageContainer from '@/components/PageContainer';

export default async function CheckServicePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('services');
  const tCommon = await getTranslations('common');

  const checklist = t.raw('checklist') as string[];
  const processSteps = t.raw('check.processSteps') as string[];

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
        cols={3}
        steps={processSteps.map((text) => ({ text }))}
      />

      {/* что входит + карточка-тизер цены (цены клиент показывать не хочет) */}
      <ServiceDetails
        includedTitle={t('check.includedTitle')}
        checklist={checklist}
        extraLabel={t('extraLabel')}
        extraVariant="available"
        extraAvailableLabel={t('check.extraAvailable')}
        extraItems={[
          { title: t('extraTitle') },
          { title: t('check.escortTitle'), note: t('check.escortNote') }
        ]}
        priceSlot={
          <ServicePriceTeaser
            title={t('check.priceCardTitle')}
            text={t.rich('check.priceCardText', {
              // выделение ключевой фразы: тёмный полужирный + тонкое красное подчёркивание
              accent: (chunks) => (
                <span className="font-semibold text-paper underline decoration-accent decoration-2 underline-offset-4">
                  {chunks}
                </span>
              )
            })}
            cta={t('check.priceCardCta')}
            status={t('check.priceCardStatus')}
          />
        }
      />
    </PageContainer>
  );
}
