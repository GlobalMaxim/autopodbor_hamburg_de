// подчёркивающая линия под заголовком — стиль как у Hero.tsx (красный градиент, затухающий вправо).
export default function AccentUnderline({ className = '' }: { className?: string }) {
  return <div className={`h-[3px] w-full max-w-lg bg-gradient-to-r from-accent to-transparent ${className}`} />;
}
