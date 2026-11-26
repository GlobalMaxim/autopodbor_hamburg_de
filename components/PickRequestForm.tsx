'use client';

import { useId, useState } from 'react';
import { useTranslations } from 'next-intl';
import AccentUnderline from './AccentUnderline';
import ChipSlider from './ChipSlider';
import TelegramChat from './TelegramChat';

// Форма заявки на подбор: девять критериев (подписи — pick.form.labels, подписи строк сообщения —
// pick.templateLines), собранные в три блока (pick.form.blocks).
// Из заполненного собирается готовое сообщение: справа оно показано как чат Telegram, кнопка открывает Telegram
// с этим текстом в поле ввода. Все поля необязательные, пустые в сообщение не попадают.

type State = {
  car: string;
  yearFrom: string;
  yearTo: string;
  fuels: string[];
  volume: string;
  gearbox: string[];
  bodies: string[];
  drives: string[];
  interiors: string[];
  kmFrom: string;
  kmTo: string;
  budgetFrom: string;
  budgetTo: string;
  colors: string[];
  colorOther: string;
};

const EMPTY: State = {
  car: '',
  yearFrom: '',
  yearTo: '',
  fuels: [],
  volume: '',
  gearbox: [],
  bodies: [],
  drives: [],
  interiors: [],
  kmFrom: '',
  kmTo: '',
  budgetFrom: '',
  budgetTo: '',
  colors: [],
  colorOther: ''
};

// образцы цвета для плиток — порядок как в pick.form.colors
const SWATCHES = ['#1d4ed8', '#d62828', '#15803d', '#ffffff', '#111111', '#8a8f94'];

// количество критериев в форме — для шкалы заполнения
const TOTAL_FIELDS = 9;

const digits = (v: string) => v.replace(/\D/g, '');
// "20000" → "20 000"
const group = (v: string) => v.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

const INPUT =
  'h-11 w-full rounded-xl border border-line bg-[#f7f7f7] px-3 text-base text-paper placeholder:text-[#8a8f94] transition-colors focus:border-accent focus:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/30';

function Chip({
  label,
  active,
  onClick,
  swatch
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  swatch?: string;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`inline-flex min-h-11 shrink-0 items-center whitespace-nowrap rounded-full border px-4 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 ${
        active ? 'border-accent bg-accent font-semibold text-white' : 'border-line bg-white text-paper hover:border-accent'
      }`}
    >
      {swatch && (
        <span
          aria-hidden
          className={`mr-2 inline-block h-3 w-3 rounded-full border ${active ? 'border-white' : 'border-black/20'}`}
          style={{ backgroundColor: swatch }}
        />
      )}
      {label}
    </button>
  );
}

// выделяет часть подписи ("не подходят") — тем же приёмом, что «в один клик» в карточке стоимости
function accentPart(label: string, part: string): React.ReactNode {
  const at = label.indexOf(part);
  if (at < 0) return label;
  return (
    <>
      {label.slice(0, at)}
      <span className="font-bold underline decoration-accent decoration-2 underline-offset-4">{part}</span>
      {label.slice(at + part.length)}
    </>
  );
}

function Group({ legend, children }: { legend: React.ReactNode; children: React.ReactNode }) {
  return (
    <fieldset className="min-w-0">
      <legend className="mb-2 text-sm font-medium text-paper">{legend}</legend>
      {children}
    </fieldset>
  );
}

// блок формы: номер, заголовок и зелёная пометка «заполнено», когда в блоке есть хоть одно значение
function Block({
  number,
  title,
  filled,
  filledLabel,
  children
}: {
  number: number;
  title: string;
  filled: boolean;
  filledLabel: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-line bg-surface p-5 sm:p-6">
      <div className="mb-5 flex items-center gap-3">
        <span
          aria-hidden
          className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-semibold text-white"
        >
          {number}
        </span>
        <h3 className="text-base font-semibold text-paper">{title}</h3>
        {filled && (
          <span className="ml-auto rounded-full bg-[#eaf6ef] px-2.5 py-[3px] text-xs font-medium text-good">
            ✓ {filledLabel}
          </span>
        )}
      </div>
      <div className="grid min-w-0 grid-cols-1 gap-5 sm:grid-cols-2">{children}</div>
    </section>
  );
}

export default function PickRequestForm({
  avatarSrc,
  before
}: {
  avatarSrc: string | null;
  // что стоит в левой колонке над формой («Что входит в проверку»): чат справа идёт вдоль обеих секций
  before?: React.ReactNode;
}) {
  const t = useTranslations('services');
  const uid = useId();
  const [s, setS] = useState<State>(EMPTY);

  const labels = t.raw('pick.form.labels') as string[]; // подписи полей формы
  // подписи строк сообщения — из шаблона заявки, без уточнений в скобках ("Двигатель:", "Пробег:")
  const lines = (t.raw('pick.templateLines') as string[]).map((line) => line.replace(/\s*\([^)]*\)/g, ''));
  const blocks = t.raw('pick.form.blocks') as string[];
  const slider = { prevLabel: t('pick.form.scrollPrev'), nextLabel: t('pick.form.scrollNext') };
  const fuels = t.raw('pick.form.fuels') as string[];
  const gearboxes = t.raw('pick.form.gearboxes') as string[];
  const bodies = t.raw('pick.form.bodies') as string[];
  const drives = t.raw('pick.form.drives') as string[];
  const interiors = t.raw('pick.form.interiors') as string[];
  const colors = t.raw('pick.form.colors') as string[];
  const from = t('pick.form.from');
  const to = t('pick.form.to');

  const set = <K extends keyof State>(key: K, value: State[K]) => setS((prev) => ({ ...prev, [key]: value }));
  const toggle = (key: 'fuels' | 'gearbox' | 'bodies' | 'drives' | 'interiors' | 'colors', value: string) =>
    setS((prev) => ({
      ...prev,
      [key]: prev[key].includes(value) ? prev[key].filter((x) => x !== value) : [...prev[key], value]
    }));

  // "от 2018 до 2023" / "от 2018" / "до 2023"
  const range = (a: string, b: string, format: (v: string) => string = (v) => v, suffix = '') => {
    if (a && b) return `${from} ${format(a)} ${to} ${format(b)}${suffix}`;
    if (a) return `${from} ${format(a)}${suffix}`;
    if (b) return `${to} ${format(b)}${suffix}`;
    return '';
  };

  // значения по порядку pick.form.labels
  const values = [
    s.car,
    range(s.yearFrom, s.yearTo),
    [...s.fuels, s.volume ? `${s.volume} ${t('pick.form.liter')}` : ''].filter(Boolean).join(', '),
    s.gearbox.join(', '),
    [...s.bodies, ...s.drives].join(', '),
    s.interiors.join(', '),
    range(s.kmFrom, s.kmTo, group, ` ${t('pick.form.kmUnit')}`),
    range(s.budgetFrom, s.budgetTo, group, ' €'),
    [...s.colors, s.colorOther.trim()].filter(Boolean).join(', ')
  ].map((v) => v.trim());

  const rows = values.map((value, i) => ({ label: lines[i], value })).filter((row) => row.value);
  const intro = t('pick.form.intro');
  const message = rows.length
    ? `${intro}\n\n${rows.map((row) => `${row.label} ${row.value}`).join('\n')}`
    : intro;

  const has = (...indexes: number[]) => indexes.some((i) => values[i]);
  const dirty = JSON.stringify(s) !== JSON.stringify(EMPTY);

  // пара полей «от — до»
  const rangeFields = (
    label: string,
    a: 'yearFrom' | 'kmFrom' | 'budgetFrom',
    b: 'yearTo' | 'kmTo' | 'budgetTo',
    placeholders: [string, string],
    unit?: string
  ) => (
    <div className="flex items-center gap-2">
      {[
        { key: a, ph: placeholders[0], word: from },
        { key: b, ph: placeholders[1], word: to }
      ].map(({ key, ph, word }) => (
        <div key={key} className="relative min-w-0 flex-1">
          <input
            type="text"
            inputMode="numeric"
            autoComplete="off"
            maxLength={7}
            aria-label={`${label}: ${word}`}
            placeholder={`${word} ${ph}`}
            value={s[key]}
            onChange={(e) => set(key, digits(e.target.value))}
            className={`${INPUT} !px-2.5 ${unit ? '!pr-8' : ''}`}
          />
          {unit && (
            <span aria-hidden className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-sm text-muted">
              {unit}
            </span>
          )}
        </div>
      ))}
    </div>
  );

  const chips = (key: 'fuels' | 'gearbox' | 'bodies' | 'drives' | 'interiors', options: string[]) => (
    <ChipSlider {...slider}>
      {options.map((o) => (
        <Chip key={o} label={o} active={s[key].includes(o)} onClick={() => toggle(key, o)} />
      ))}
    </ChipSlider>
  );

  return (
    <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] lg:items-start lg:gap-8">
      <div className="min-w-0">
        {before}

        {/* scroll-mt — чтобы при переходе по #request заголовок не уезжал под шапку */}
        <div id="request" className="mt-14 scroll-mt-24">
          <div className="inline-block">
            <h2 className="text-2xl font-semibold tracking-tight">{t('pick.form.title')}</h2>
            <AccentUnderline className="mt-2" />
          </div>
          <p className="mt-3 max-w-2xl text-sm text-muted">{t('pick.form.subtitle')}</p>

          <form onSubmit={(e) => e.preventDefault()} className="mt-6 min-w-0 space-y-4">
          {/* 1. Общие сведения */}
          <Block number={1} title={blocks[0]} filled={has(0, 1, 6, 7)} filledLabel={t('pick.form.filled')}>
            <div className="min-w-0 sm:col-span-2">
              <label htmlFor={`${uid}-car`} className="mb-2 block text-sm font-medium text-paper">
                {labels[0]}
              </label>
              <input
                id={`${uid}-car`}
                type="text"
                autoComplete="off"
                maxLength={80}
                placeholder={t('pick.form.carPlaceholder')}
                value={s.car}
                onChange={(e) => set('car', e.target.value)}
                className={INPUT}
              />
            </div>

            {/* пары «от — до»: по две в ряд только на широких экранах, иначе подсказки в полях обрезаются */}
            <div className="min-w-0 sm:col-span-2 xl:col-span-1">
              <Group legend={labels[1]}>{rangeFields(labels[1], 'yearFrom', 'yearTo', ['2010', '2025'])}</Group>
            </div>
            <div className="min-w-0 sm:col-span-2 xl:col-span-1">
              <Group legend={labels[6]}>
                {rangeFields(labels[6], 'kmFrom', 'kmTo', ['20000', '250000'], t('pick.form.kmUnit'))}
              </Group>
            </div>
            <div className="min-w-0 sm:col-span-2">
              <Group legend={labels[7]}>
                <div className="xl:max-w-[calc(50%-0.625rem)]">
                  {rangeFields(labels[7], 'budgetFrom', 'budgetTo', ['10000', '60000'], '€')}
                </div>
              </Group>
            </div>
          </Block>

          {/* 2. Двигатель и коробка */}
          <Block number={2} title={blocks[1]} filled={has(2, 3) || s.drives.length > 0 || s.bodies.length > 0} filledLabel={t('pick.form.filled')}>
            <div className="min-w-0 sm:col-span-2">
              <Group legend={labels[2]}>
                {chips('fuels', fuels)}
                <div className="mt-3 sm:max-w-[calc(50%-0.625rem)]">
                  <label htmlFor={`${uid}-vol`} className="sr-only">
                    {t('pick.form.volumeLabel')}
                  </label>
                  <input
                    id={`${uid}-vol`}
                    type="text"
                    inputMode="decimal"
                    autoComplete="off"
                    maxLength={4}
                    placeholder={t('pick.form.volumePlaceholder')}
                    value={s.volume}
                    onChange={(e) => set('volume', e.target.value.replace(/[^\d.,]/g, ''))}
                    className={INPUT}
                  />
                </div>
              </Group>
            </div>
            <div className="min-w-0 sm:col-span-2">
              <Group legend={labels[3]}>{chips('gearbox', gearboxes)}</Group>
            </div>
            <div className="min-w-0 sm:col-span-2">
              <Group legend={labels[4]}>
                <p className="mb-2 text-xs text-muted">{t('pick.form.bodyLabel')}</p>
                {chips('bodies', bodies)}
                <p className="mb-2 mt-4 text-xs text-muted">{t('pick.form.driveLabel')}</p>
                {chips('drives', drives)}
              </Group>
            </div>
          </Block>

          {/* 3. Интерьер и экстерьер */}
          <Block number={3} title={blocks[2]} filled={has(5, 8)} filledLabel={t('pick.form.filled')}>
            <div className="min-w-0 sm:col-span-2">
              <Group legend={labels[5]}>{chips('interiors', interiors)}</Group>
            </div>
            <div className="min-w-0 sm:col-span-2">
              <Group legend={accentPart(labels[8], t('pick.form.colorsAccent'))}>
                <ChipSlider {...slider}>
                  {colors.map((c, i) => (
                    <Chip
                      key={c}
                      label={c}
                      swatch={SWATCHES[i]}
                      active={s.colors.includes(c)}
                      onClick={() => toggle('colors', c)}
                    />
                  ))}
                </ChipSlider>
                <div className="mt-3">
                  <label htmlFor={`${uid}-color`} className="sr-only">
                    {t('pick.form.colorOtherPlaceholder')}
                  </label>
                  <input
                    id={`${uid}-color`}
                    type="text"
                    autoComplete="off"
                    maxLength={80}
                    placeholder={t('pick.form.colorOtherPlaceholder')}
                    value={s.colorOther}
                    onChange={(e) => set('colorOther', e.target.value)}
                    className={INPUT}
                  />
                </div>
              </Group>
            </div>
          </Block>

          {dirty && (
            <button
              type="button"
              onClick={() => setS(EMPTY)}
              className="inline-flex min-h-11 items-center text-sm text-muted underline underline-offset-4 transition-colors hover:text-paper"
            >
              {t('pick.form.clear')}
            </button>
          )}
        </form>
        </div>
      </div>

        {/* чат с собранным сообщением: на десктопе справа вдоль списка проверки и формы, на мобильном под формой */}
        <TelegramChat
          avatarSrc={avatarSrc}
          message={message}
          className="lg:ml-6 xl:-mr-6 xl:ml-16"
          progress={
            // шкала появляется, когда клиент начал заполнять
            rows.length > 0 && (
              <div className="mb-4">
                <div className="flex justify-between text-xs text-muted">
                  <span>{t('pick.form.progress')}</span>
                  <span>{t('pick.form.progressValue', { count: rows.length, total: TOTAL_FIELDS })}</span>
                </div>
                <div
                  role="progressbar"
                  aria-label={t('pick.form.progress')}
                  aria-valuemin={0}
                  aria-valuemax={TOTAL_FIELDS}
                  aria-valuenow={rows.length}
                  className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-[#eee]"
                >
                  <div
                    className="h-full rounded-full bg-accent transition-[width] duration-300 motion-reduce:transition-none"
                    style={{ width: `${(rows.length / TOTAL_FIELDS) * 100}%` }}
                  />
                </div>
              </div>
            )
          }
        >
          <p>{intro}</p>
          {rows.length > 0 && (
            <div className="mt-2">
              {rows.map((row) => (
                <p key={row.label}>
                  <span className="font-semibold">{row.label}</span> {row.value}
                </p>
              ))}
            </div>
          )}
        </TelegramChat>
    </div>
  );
}
