import { getTranslations, setRequestLocale } from 'next-intl/server';
import LeadCTA from '@/components/LeadCTA';
import ServiceSteps, { type ServiceStep } from '@/components/ServiceSteps';
import ServiceDetails from '@/components/ServiceDetails';
import AccentUnderline from '@/components/AccentUnderline';
import CopyTemplateButton from '@/components/CopyTemplateButton';
import { pickPricing, additionalServices } from '@/lib/content';

export default async function PickServicePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('services');
  const p = await getTranslations('pricing');

  const checklist = t.raw('checklist') as string[];
  const processSteps = t.raw('pick.processSteps') as ServiceStep[];
  const criteria = t.raw('pick.criteria') as string[];
  const templateLines = t.raw('pick.templateLines') as string[];
  const priceConditions = t.raw('pick.priceConditions') as string[];

  const historyCheck = additionalServices.find((a) => a.label === 'Проверка истории обслуживания');
  const extraPrice = historyCheck ? `+${historyCheck.price} €` : t('extraPrice');

  const template = templateLines.join('\n');

  return (
    <div className="mx-auto max-w-5xl px-5 py-16">
      <h1 className="text-4xl font-semibold tracking-tight">{t('pick.title')}</h1>
      <AccentUnderline className="mt-3" />
      {/* text-muted не проходит WCAG AA (≈4:1) на светлом фоне */}
      <p className="mt-4 max-w-2xl text-[#5b6166]">{t('pick.pageSubtitle')}</p>

      {/*
        TODO: данные не заполнены владельцем сайта — когда появятся, решить насчёт шага
        "Сопровождаем покупку" (сейчас убран, т.к. состав сопровождения не подтверждён;
        если подтвердится — вернуть шаг и приписку "...и сопровождаем покупку" в pageSubtitle).
      */}
      <ServiceSteps title={t('pick.stepsTitle')} cols={2} steps={processSteps} />

      <ServiceDetails
        includedTitle={t('pick.includedTitle')}
        checklist={checklist}
        extraLabel={t('extraLabel')}
        extraItems={[{ title: t('extraTitle'), price: extraPrice }]}
        price={{
          title: t('pick.priceIntro'),
          subtitle: t('pick.priceSubtitle'),
          tiers: pickPricing,
          locale,
          under: p('under'),
          over: p('over'),
          conditions: priceConditions,
          cta: t('pick.cta')
        }}
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
    </div>
  );
}
