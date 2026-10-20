import { getLocale, getTranslations } from 'next-intl/server';
import LeadCTA from '@/components/LeadCTA';
import ServiceSteps from '@/components/ServiceSteps';
import ServiceDetails from '@/components/ServiceDetails';
import AccentUnderline from '@/components/AccentUnderline';
import { checkPricing, additionalServices } from '@/lib/content';

export default async function CheckServicePage() {
  const t = await getTranslations('services');
  const p = await getTranslations('pricing');
  const locale = await getLocale();

  const checklist = t.raw('checklist') as string[];
  const processSteps = t.raw('check.processSteps') as string[];
  const historyCheck = additionalServices.find((a) => a.label === 'Проверка истории обслуживания');
  const extraPrice = historyCheck ? `+${historyCheck.price} €` : t('extraPrice');

  return (
    <div className="mx-auto max-w-5xl px-5 py-16">
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

      {/* что входит + цена — общий шаблон для обеих страниц услуг */}
      <ServiceDetails
        includedTitle={t('check.includedTitle')}
        checklist={checklist}
        extraLabel={t('extraLabel')}
        extraTitle={t('extraTitle')}
        extraPrice={extraPrice}
        price={{
          title: t('check.priceIntro'),
          subtitle: t('check.priceSubtitle'),
          tiers: checkPricing,
          locale,
          under: p('under'),
          over: p('over'),
          note: t('check.priceNote'),
          cta: t('check.cta')
        }}
      />

      {/* на десктопе дублируется кнопкой внутри карточки цены */}
      <div className="mt-10 lg:hidden">
        <LeadCTA variant="card" label={t('check.cta')} />
      </div>
    </div>
  );
}
