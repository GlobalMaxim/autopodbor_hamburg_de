// общий блок "Дополнительно" для /services/* — доп. опции.
// variant 'price' (по умолчанию, /pick) — текущий вид с ценой справа.
// variant 'available' (/check, клиент не показывает цены) — галочка + пилюля "Доступно" вместо цены.
// "Дополнительно" показывается один раз, строк может быть несколько.
export type ServiceExtraItem = { title: string; price?: string; note?: string };

// #eaf6ef — чуть светлее формально заданного #e8f3ec: с ним текст #15803d (--color-good) не
// дотягивал до контраста 4.5:1 (WCAG AA) на 12px-пилюле, с этим оттенком — ок
const AVAILABLE_BG = '#eaf6ef';

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

export default function ServiceExtra({
  label,
  items,
  variant = 'price',
  availableLabel
}: {
  label: string;
  items: ServiceExtraItem[];
  variant?: 'price' | 'available';
  availableLabel?: string;
}) {
  if (variant === 'available') {
    return (
      <div className="mt-5 border-t border-line pt-4">
        <div className="text-base font-medium text-muted">{label}</div>
        <div className="mt-1.5 divide-y divide-line">
          {items.map((item) => (
            <div key={item.title} className="flex items-center justify-between gap-3 py-3">
              <div className="flex min-w-0 items-center gap-3">
                <span
                  className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-good"
                  style={{ backgroundColor: AVAILABLE_BG }}
                >
                  <CheckIcon className="h-3.5 w-3.5" />
                </span>
                <div className="min-w-0">
                  <div className="text-paper">{item.title}</div>
                  {item.note && <p className="mt-0.5 text-xs text-muted">{item.note}</p>}
                </div>
              </div>
              <span
                className="shrink-0 whitespace-nowrap rounded-full px-2.5 py-[3px] text-xs font-medium text-good"
                style={{ backgroundColor: AVAILABLE_BG }}
              >
                {availableLabel}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mt-5 border-t border-line pt-4">
      <div className="text-base font-medium text-muted">{label}</div>
      <div className="mt-1.5 space-y-3">
        {items.map((item) => (
          <div key={item.title}>
            <div className="flex items-center justify-between gap-3">
              <span className="text-paper">{item.title}</span>
              <span className="shrink-0 whitespace-nowrap font-semibold text-accent">{item.price}</span>
            </div>
            {item.note && <p className="mt-1 text-xs text-muted">{item.note}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
