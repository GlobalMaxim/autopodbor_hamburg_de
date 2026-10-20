import LeadCTA from './LeadCTA';
import { formatTierRangeDisjoint, type PriceTier } from '@/lib/content';

// карточка цены для /services/* — одна внешняя рамка, без рамки внутри таблицы.
export type ServicePriceCardProps = {
  title: string;
  subtitle: string;
  tiers: PriceTier[];
  locale: string;
  under: string;
  over: string;
  note?: string;
  conditions?: string[];
  cta: string;
  className?: string;
};

export default function ServicePriceCard({
  title,
  subtitle,
  tiers,
  locale,
  under,
  over,
  note,
  conditions,
  cta,
  className = ''
}: ServicePriceCardProps) {
  return (
    <div className={`rounded-2xl border border-line bg-surface p-8 ${className}`}>
      <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
      <p className="mt-1 text-sm text-muted">{subtitle}</p>

      <div className="mt-5 divide-y divide-line">
        {tiers.map((tier) => (
          <div key={`${tier.min}-${tier.max}`} className="flex items-center justify-between py-3">
            <span className="text-base text-paper">
              {formatTierRangeDisjoint(tier, locale, under, over)}
            </span>
            <span className="text-base font-bold">{`${tier.price} €`}</span>
          </div>
        ))}
      </div>

      {note && <p className="mt-4 text-sm text-muted">{note}</p>}

      {conditions && conditions.length > 0 && (
        <ul className="mt-3 space-y-1">
          {conditions.map((c) => (
            <li key={c} className="text-sm text-paper">
              {c}
            </li>
          ))}
        </ul>
      )}

      <div className="mt-6">
        <LeadCTA variant="card" label={cta} />
      </div>
    </div>
  );
}
