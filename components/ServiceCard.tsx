import LeadCTA from './LeadCTA';

type Props = {
  title: string;
  description: string;
  steps: string[];
  image: string;
  ctaLabel: string;
};

export default function ServiceCard({ title, description, steps, image, ctaLabel }: Props) {
  return (
    <div className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-surface shadow-[inset_0_2px_24px_rgba(218,22,38,0.18)] transition-all duration-300 hover:-translate-y-1 hover:border-accent/50 hover:shadow-[0_20px_50px_-20px_rgba(233,32,49,0.35)]">
      <div className="relative h-48 w-full shrink-0 overflow-hidden">
        <img
          src={image}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />
      </div>

      <div className="flex flex-1 flex-col p-8">
        <h3 className="text-2xl font-extrabold tracking-tight">{title}</h3>
        <p
          className="mt-3 min-h-[4.5rem] font-[650] text-[#365b70]"
          style={{ fontFamily: 'var(--font-manrope)' }}
        >
          {description}
        </p>

        {/* градиентный разделитель */}
        <div className="my-6 h-px w-full bg-gradient-to-r from-accent via-accent/40 to-transparent" />

        <ul className="flex-1 space-y-2 text-sm text-[#365b70]">
          {steps.map((s) => (
            <li key={s} className="flex items-start gap-2">
              <svg
                className="mt-0.5 h-4 w-4 shrink-0 text-accent"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 6 9 17l-5-5" />
              </svg>
              <span>{s}</span>
            </li>
          ))}
        </ul>

        <div className="mt-8">
          <LeadCTA variant="light" label={ctaLabel} />
        </div>
      </div>
    </div>
  );
}
