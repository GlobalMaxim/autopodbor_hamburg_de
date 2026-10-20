const BRANDS = [
  'BMW',
  'Mercedes-Benz',
  'Audi',
  'Porsche',
  'Volkswagen',
  'Tesla',
  'Volvo',
  'Toyota'
];

// повторы, чтобы одна половина ленты была шире любого экрана — бесшовная петля
const ROW = Array.from({ length: 6 }, () => BRANDS).flat();

export default function BrandMarquee() {
  return (
    <div className="relative max-w-full overflow-hidden border-b border-line bg-surface py-6 [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
      <div className="animate-marquee flex w-max">
        {[0, 1].map((dup) => (
          <div key={dup} className="flex shrink-0 items-center gap-12 pr-12">
            {ROW.map((b, i) => (
              <span
                key={`${dup}-${i}`}
                className="whitespace-nowrap text-lg font-semibold tracking-tight text-muted/60"
              >
                {b}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
