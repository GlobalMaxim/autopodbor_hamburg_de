import ServiceChecklist from './ServiceChecklist';
import ServiceExtra from './ServiceExtra';
import ServicePriceCard, { type ServicePriceCardProps } from './ServicePriceCard';

// общий блок 3 для /services/* — слева состав проверки + "Дополнительно", справа карточка цены.
// Верх заголовков колонок выровнен по одной линии (lg:pt-8 слева = p-8 карточки справа).
export default function ServiceDetails({
  includedTitle,
  checklist,
  extraLabel,
  extraTitle,
  extraPrice,
  price
}: {
  includedTitle: string;
  checklist: string[];
  extraLabel: string;
  extraTitle: string;
  extraPrice: string;
  price: ServicePriceCardProps;
}) {
  return (
    <div className="mt-12 grid gap-8 lg:grid-cols-2 lg:items-start">
      <div className="lg:pt-8">
        <h2 className="text-xl font-semibold tracking-tight">{includedTitle}</h2>
        <ServiceChecklist items={checklist} />
        <ServiceExtra label={extraLabel} title={extraTitle} price={extraPrice} />
      </div>

      <ServicePriceCard {...price} />
    </div>
  );
}
