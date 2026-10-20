// общий блок пронумерованных шагов для /services/* — кружок с номером + текст.
// Ряд от sm (640px), столбик на мобильных. cols — сколько шагов в ряд на sm+ (статичные классы для Tailwind JIT).
export type ServiceStep = { text: string; note?: string };

const GRID_COLS: Record<number, string> = {
  2: 'sm:grid-cols-2',
  3: 'sm:grid-cols-3',
  4: 'sm:grid-cols-2 lg:grid-cols-4'
};

export default function ServiceSteps({
  title,
  steps,
  cols = 3
}: {
  title: string;
  steps: ServiceStep[];
  cols?: 2 | 3 | 4;
}) {
  return (
    <div className="mt-14">
      <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
      <div className={`mt-5 grid gap-6 ${GRID_COLS[cols]}`}>
        {steps.map((step, i) => (
          <div key={step.text} className="flex items-start gap-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-accent text-sm font-semibold text-accent">
              {i + 1}
            </span>
            <div>
              <p className="text-paper leading-8">{step.text}</p>
              {step.note && <p className="mt-1 text-xs text-muted">{step.note}</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
