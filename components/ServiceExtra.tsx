// общий блок "Дополнительно" для /services/* — платная опция, не выглядит кликабельной/аккордеоном.
export default function ServiceExtra({
  label,
  title,
  price
}: {
  label: string;
  title: string;
  price: string;
}) {
  return (
    <div className="mt-5 border-t border-line pt-4">
      <div className="text-base font-medium text-muted">{label}</div>
      <div className="mt-1.5 flex items-center justify-between gap-3">
        <span className="text-paper">{title}</span>
        <span className="shrink-0 whitespace-nowrap font-semibold text-accent">{price}</span>
      </div>
    </div>
  );
}
