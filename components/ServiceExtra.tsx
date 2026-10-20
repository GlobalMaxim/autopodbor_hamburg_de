// общий блок "Дополнительно" для /services/* — платные опции, не выглядит кликабельным/аккордеоном.
// "Дополнительно" показывается один раз, строк может быть несколько (напр. проверка истории + сопровождение сделки).
export type ServiceExtraItem = { title: string; price: string; note?: string };

export default function ServiceExtra({ label, items }: { label: string; items: ServiceExtraItem[] }) {
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
