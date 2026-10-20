import { Link } from '@/i18n/navigation';
import VerdictBadge from './VerdictBadge';
import type { Case } from '@/lib/content';

export default function CaseCard({ car }: { car: Case }) {
  return (
    <Link
      href={`/cases/${car.slug}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-line bg-surface p-6 transition-all duration-300 hover:-translate-y-1 hover:border-accent/50 hover:shadow-[0_20px_50px_-20px_rgba(233,32,49,0.35)]"
    >
      <div className="text-lg font-semibold">
        {car.brand} {car.model}
      </div>
      <div className="mt-1 text-sm text-muted">
        {car.year} · {car.mileage.toLocaleString('ru-RU')} км · {car.engine} ·{' '}
        {car.transmission}
      </div>

      <div className="mt-3">
        <VerdictBadge verdict={car.verdict} />
      </div>

      <p className="mt-4 text-sm text-muted line-clamp-3">{car.findings}</p>

      <div className="mt-auto flex items-center justify-between pt-4">
        <span className="text-sm font-semibold">
          € {car.price.toLocaleString('ru-RU')}
        </span>
        <span className="text-sm text-accent opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100">
          →
        </span>
      </div>
    </Link>
  );
}
