import type { ReportDetailSpec } from '@/lib/reports';

export default function SpecsGrid({ specs }: { specs: ReportDetailSpec[] }) {
  if (!specs.length) return null;

  return (
    <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-[repeat(auto-fit,minmax(170px,1fr))]">
      {specs.map((spec) => (
        <div key={spec.label} className="rounded-xl border border-line bg-surface p-4">
          <div className="text-xs text-muted">{spec.label}</div>
          <div className="mt-1 text-base font-semibold">{spec.value}</div>
        </div>
      ))}
    </div>
  );
}
