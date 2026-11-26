// общий блок шагов для /services/* — карточки с номером, иконкой и стрелками-связками.
// Десктоп (md+): ряд карточек, между ними шевроны. Мобильный: вертикальная цепочка с линией.
import type { ReactNode } from "react";

export type ServiceStepIcon = "link" | "phone" | "video" | "list" | "search";
export type ServiceStep = {
  text: string;
  note?: string;
  icon?: ServiceStepIcon;
};

const ICONS: Record<ServiceStepIcon, ReactNode> = {
  link: (
    <>
      <path d="M10 13a5 5 0 0 0 7.07 0l3-3a5 5 0 0 0-7.07-7.07l-1.5 1.5" />
      <path d="M14 11a5 5 0 0 0-7.07 0l-3 3a5 5 0 0 0 7.07 7.07l1.5-1.5" />
    </>
  ),
  phone: (
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92Z" />
  ),
  video: (
    <>
      <path d="m16 13 5.22 3.48a.5.5 0 0 0 .78-.42V7.94a.5.5 0 0 0-.78-.42L16 11" />
      <rect x="2" y="6" width="14" height="12" rx="2" />
    </>
  ),
  list: (
    <>
      <path d="M8 6h13M8 12h13M8 18h13" />
      <path d="M3 6h.01M3 12h.01M3 18h.01" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.3-4.3" />
    </>
  ),
};

function StepIcon({ name }: { name: ServiceStepIcon }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {ICONS[name]}
    </svg>
  );
}

export default function ServiceSteps({
  title,
  steps,
}: {
  title: string;
  steps: ServiceStep[];
  /** оставлено для совместимости со страницами; раскладка теперь зависит от числа шагов */
  cols?: 2 | 3 | 4;
}) {
  return (
    <div className="mt-14 pb-6 sm:pb-8">
      <h2 className="text-xl font-semibold tracking-tight">{title}</h2>

      {/* мобильный: вертикальная цепочка */}
      <ol className="mt-7 md:hidden">
        {steps.map((step, i) => (
          <li
            key={step.text}
            className="relative mb-3 flex items-center gap-4 last:mb-0"
          >
            {/* соединительная линия между иконками: центр иконки = центр карточки */}
            {i > 0 && (
              <span
                aria-hidden
                className="absolute left-[19.5px] top-0 h-[calc(50%-26px)] w-px bg-[#e5e5e5]"
              />
            )}
            {i < steps.length - 1 && (
              <span
                aria-hidden
                className="absolute -bottom-3 left-[19.5px] top-[calc(50%+26px)] w-px bg-[#e5e5e5]"
              />
            )}
            {step.icon && (
              <span className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border-[1.5px] border-accent bg-white text-accent">
                <StepIcon name={step.icon} />
              </span>
            )}
            <div className="min-w-0 flex-1 rounded-xl border border-[#e8e8e8] bg-white px-4 py-3.5 shadow-[0_1px_3px_rgba(0,0,0,0.06),0_10px_24px_-10px_rgba(0,0,0,0.16)]">
              <p className="font-medium leading-6 text-paper">{step.text}</p>
              {step.note && (
                <p className="mt-1 text-sm leading-5 text-[#5b6166]">
                  {step.note}
                </p>
              )}
            </div>
          </li>
        ))}
      </ol>

      {/* десктоп: ряд карточек со стрелками */}
      <ol className="mt-7 hidden items-stretch md:flex">
        {steps.map((step, i) => (
          <li key={step.text} className="flex min-w-0 flex-1 items-stretch">
            {/* обёртка не двигается: курсор у нижнего края не «теряет» карточку при подъёме (без дрожания) */}
            <div className="group flex min-w-0 flex-1">
              <div className="flex flex-1 flex-col items-center gap-3 rounded-2xl border border-[#e8e8e8] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.06),0_10px_24px_-10px_rgba(0,0,0,0.16)] px-4 py-6 text-center lg:flex-row lg:gap-4 lg:px-5 lg:text-left transition-[translate,box-shadow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-1 group-hover:shadow-[0_1px_3px_rgba(0,0,0,0.06),0_16px_30px_-12px_rgba(0,0,0,0.2)] motion-reduce:transition-none motion-reduce:group-hover:translate-y-0">
                {step.icon && (
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border-[1.5px] border-accent bg-white text-accent">
                    <StepIcon name={step.icon} />
                  </span>
                )}
                <div className="min-w-0">
                  <p className="font-medium leading-6 text-paper">{step.text}</p>
                  {step.note && (
                    <p className="mt-1 text-sm leading-5 text-[#5b6166]">
                      {step.note}
                    </p>
                  )}
                </div>
              </div>
            </div>
            {i < steps.length - 1 && (
              <span
                aria-hidden
                className="flex w-10 shrink-0 items-center justify-center lg:w-14"
              >
                <span className="flex h-7 w-7 items-center justify-center text-[#b5b9bd]">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m9 6 6 6-6 6" />
                  </svg>
                </span>
              </span>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}
