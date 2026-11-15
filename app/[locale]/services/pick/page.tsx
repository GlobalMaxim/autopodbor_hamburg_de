import { getTranslations, setRequestLocale } from 'next-intl/server';
import LeadCTA from '@/components/LeadCTA';
import ServiceSteps, { type ServiceStep } from '@/components/ServiceSteps';
import ServiceDetails from '@/components/ServiceDetails';
import ServicePriceTeaser from '@/components/ServicePriceTeaser';
import AccentUnderline from '@/components/AccentUnderline';
import Breadcrumbs from '@/components/Breadcrumbs';
import CopyTemplateButton from '@/components/CopyTemplateButton';
import PageContainer from '@/components/PageContainer';

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
  const criteria = t.raw('pick.criteria') as string[];
  const templateLines = t.raw('pick.templateLines') as string[];

  const template = templateLines.join('\n');

  return (
    <PageContainer>
      <Breadcrumbs
        items={[{ label: tCommon('nav.services'), href: '/#services' }, { label: t('pick.title') }]}
      />
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

      {/* что входит + карточка-тизер цены (цены клиент показывать не хочет, как на /check) */}
      <ServiceDetails
        includedTitle={t('pick.includedTitle')}
        checklist={checklist}
        extraLabel={t('extraLabel')}
        extraVariant="available"
        extraAvailableLabel={t('pick.extraAvailable')}
        extraItems={[{ title: t('extraTitle') }]}
        priceSlot={
          <ServicePriceTeaser
            title={t('pick.priceCardTitle')}
            text={t.rich('pick.priceCardText', {
              // выделение ключевой фразы: тёмный полужирный + тонкое красное подчёркивание
              accent: (chunks) => (
                <span className="font-semibold text-paper underline decoration-accent decoration-2 underline-offset-4">
                  {chunks}
                </span>
              )
            })}
            cta={t('pick.priceCardCta')}
            status={t('pick.priceCardStatus')}
          />
        }
      />

      {/* что указать в заявке */}
      <div className="mt-14">
        <h2 className="text-xl font-semibold tracking-tight">{t('pick.criteriaTitle')}</h2>
        <ul className="mt-5 grid gap-x-8 gap-y-3 sm:grid-cols-2">
          {criteria.map((item) => (
            <li key={item} className="flex items-start gap-3">
              <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-muted" />
              <span className="text-paper">{item}</span>
            </li>
          ))}
        </ul>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <LeadCTA variant="card" label={t('pick.cta')} />
          <CopyTemplateButton
            text={template}
            label={t('pick.copyTemplate')}
            copiedLabel={t('pick.copied')}
          />
        </div>
      </div>
    </PageContainer>
  );
}
