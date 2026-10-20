// общий чек-лист для /services/* — нейтральная галочка + жирное начало пункта до тире.
// Используется на страницах "Проверка авто" и "Подбор авто" (components/Diagnostics.tsx не трогает).
function ChecklistItem({ text }: { text: string }) {
  const dashIndex = text.indexOf(' — ');
  const lead = dashIndex === -1 ? null : text.slice(0, dashIndex);
  const rest = dashIndex === -1 ? text : text.slice(dashIndex);

  return (
    <li className="flex items-start gap-3">
      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-surface-2 text-paper">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-3 w-3"
        >
          <path d="M20 6 9 17l-5-5" />
        </svg>
      </span>
      <span className="text-paper">
        {lead && <strong className="font-semibold">{lead}</strong>}
        {rest}
      </span>
    </li>
  );
}

export default function ServiceChecklist({ items }: { items: string[] }) {
  return (
    <ul className="mt-5 space-y-3">
      {items.map((item) => (
        <ChecklistItem key={item} text={item} />
      ))}
    </ul>
  );
}
