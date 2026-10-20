import { notFound } from 'next/navigation';
import { cases } from '@/lib/content';
import VerdictBadge from '@/components/VerdictBadge';

export function generateStaticParams() {
  return cases.map((c) => ({ slug: c.slug }));
}

export default async function CasePage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const car = cases.find((c) => c.slug === slug);
  if (!car) notFound();

  const sections: Array<[string, string]> = [
    ['Задача клиента', car.task],
    ['Что обнаружили', car.findings],
    ['Решение специалиста', car.decision],
    ['Итог', car.result]
  ];

  return (
    <div className="mx-auto max-w-4xl px-5 py-16">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-4xl font-semibold tracking-tight">
          {car.brand} {car.model}
        </h1>
        <VerdictBadge verdict={car.verdict} />
      </div>

      <div className="mt-2 text-muted">
        {car.year} · {car.mileage.toLocaleString('ru-RU')} км · {car.engine} ·{' '}
        {car.transmission} · € {car.price.toLocaleString('ru-RU')}
      </div>

      <div className="mt-10 space-y-8">
        {sections.map(([head, body]) => (
          <section
            key={head}
            className="rounded-2xl border border-line bg-surface p-6"
          >
            <h2 className="text-sm font-semibold uppercase tracking-widest text-accent">
              {head}
            </h2>
            <p className="mt-3 text-muted">{body}</p>
          </section>
        ))}
      </div>
    </div>
  );
}
