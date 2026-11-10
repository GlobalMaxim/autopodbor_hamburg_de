import type { ReactNode } from 'react';
import ServiceChecklist from './ServiceChecklist';
import ServiceExtra, { type ServiceExtraItem } from './ServiceExtra';
import ServicePriceCard, { type ServicePriceCardProps } from './ServicePriceCard';

// общий блок 3 для /services/* — слева состав проверки + "Дополнительно", справа цена.
// Верх заголовков колонок выровнен по одной линии (lg:pt-8 слева = p-* справа).
// price — таблица тарифов (как сейчас, /pick); priceSlot — любая другая правая колонка (например
// ServicePriceTeaser на /check, где цены не показываем); если задан priceSlot, price игнорируется.
export default function ServiceDetails({
  includedTitle,
  checklist,
  extraLabel,
  extraItems,
  extraVariant = 'price',
  extraAvailableLabel,
  price,
  priceSlot
}: {
  includedTitle: string;
  checklist: string[];
  extraLabel: string;
  extraItems: ServiceExtraItem[];
  extraVariant?: 'price' | 'available';
  extraAvailableLabel?: string;
  price?: ServicePriceCardProps;
  priceSlot?: ReactNode;
}) {
  return (
    <div className="mt-12 grid gap-8 lg:grid-cols-2 lg:items-start">
      <div className="lg:pt-8">
        <h2 className="text-xl font-semibold tracking-tight">{includedTitle}</h2>
        <ServiceChecklist items={checklist} />
        <ServiceExtra
          label={extraLabel}
          items={extraItems}
          variant={extraVariant}
          availableLabel={extraAvailableLabel}
        />
      </div>

      {priceSlot ?? (price && <ServicePriceCard {...price} />)}
    </div>
  );
}
