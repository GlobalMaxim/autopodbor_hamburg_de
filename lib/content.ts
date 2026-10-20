// Mock-данные до подключения Payload CMS.
// Структура повторяет коллекции Payload из ТЗ (Case, Review, SocialLink, Guide).

export type Verdict = 'good' | 'warn' | 'bad';

export const site = {
  name: 'AutoPodbor Hamburg',
  phone: '+49 000 000 00 00',
  email: 'info@autopodbor-hamburg.de',
  location: 'Гамбург, Германия'
};

export type SocialLink = {
  platform: string;
  label: string;
  url: string;
  icon: string;
  enabled: boolean;
  order: number;
};

export const socials: SocialLink[] = [
  { platform: 'telegram', label: 'Telegram', url: 'https://t.me/', icon: '✈️', enabled: true, order: 1 },
  { platform: 'tiktok', label: 'TikTok', url: 'https://tiktok.com/@autopodbor_hamburg_de', icon: '🎵', enabled: true, order: 2 },
  { platform: 'instagram', label: 'Instagram', url: 'https://instagram.com/autopodbor_hamburg_de', icon: '📸', enabled: true, order: 3 },
  { platform: 'youtube', label: 'YouTube', url: 'https://youtube.com/', icon: '▶️', enabled: true, order: 4 },
  // плейсхолдер — заменить на реальную ссылку от заказчика перед публикацией
  { platform: 'whatsapp', label: 'WhatsApp', url: 'https://wa.me/', icon: '💬', enabled: true, order: 5 },
  { platform: 'facebook', label: 'Facebook', url: 'https://facebook.com/', icon: '👍', enabled: true, order: 6 }
];

// основной канал обращения — главная конверсия сайта (ТЗ п.15)
export const telegramUrl =
  socials.find((s) => s.platform === 'telegram' && s.enabled)?.url ?? socials[0].url;

// тариф: нижняя/верхняя граница цены авто (max: null = "от") → стоимость услуги
export type PriceTier = { min: number; max: number | null; price: number };

// формат диапазона: "15 000 – 20 000 €" — границы ступеней пересекаются (min текущей = max
// предыдущей), без «+1»; единый формат для /services/* и /prices.
export function formatTierLabel(tier: PriceTier, locale: string, under: string, over: string) {
  const fmt = (n: number) => n.toLocaleString(locale);
  if (tier.min === 0) return `${under} ${fmt(tier.max as number)} €`;
  if (tier.max === null) return `${over} ${fmt(tier.min)} €`;
  return `${fmt(tier.min)} – ${fmt(tier.max)} €`;
}

// разовый осмотр — тариф по стоимости авто (актуальные цены от заказчика)
export const checkPricing: PriceTier[] = [
  { min: 0, max: 8000, price: 120 },
  { min: 8000, max: 15000, price: 150 },
  { min: 15000, max: 20000, price: 200 },
  { min: 20000, max: 50000, price: 250 },
  { min: 50000, max: null, price: 300 }
];

// подбор под ключ — тариф по бюджету на авто
export const pickPricing: PriceTier[] = [
  { min: 0, max: 10000, price: 450 },
  { min: 10000, max: 15000, price: 500 },
  { min: 15000, max: 20000, price: 550 },
  { min: 20000, max: 40000, price: 600 },
  { min: 40000, max: null, price: 650 }
];

export type Case = {
  slug: string;
  brand: string;
  model: string;
  year: number;
  mileage: number;
  price: number;
  engine: string;
  transmission: string;
  verdict: Verdict;
  task: string;
  findings: string;
  decision: string;
  result: string;
};

export const cases: Case[] = [
  {
    slug: 'bmw-x5-2021',
    brand: 'BMW',
    model: 'X5',
    year: 2021,
    mileage: 62000,
    price: 49900,
    engine: '3.0d',
    transmission: 'Автомат',
    verdict: 'bad',
    task: 'Клиент нашёл X5 на Mobile.de в 300 км от Гамбурга и хотел проверить перед покупкой.',
    findings: 'Следы ремонта передней части, ошибки в блоках, несоответствие толщины ЛКП.',
    decision: 'Отказаться от покупки.',
    result: 'Клиент сэкономил €50 000 и продолжил поиск с нашим сопровождением.'
  },
  {
    slug: 'mercedes-e220-2020',
    brand: 'Mercedes-Benz',
    model: 'E220',
    year: 2020,
    mileage: 54000,
    price: 32500,
    engine: '2.0d',
    transmission: 'Автомат',
    verdict: 'good',
    task: 'Клиент хотел уверенный семейный седан с прозрачной историей.',
    findings: 'Состояние соответствует заявленному продавцом.',
    decision: 'Рекомендовать к покупке.',
    result: 'Сделка закрыта, клиент доволен автомобилем.'
  },
  {
    slug: 'audi-a6-2019',
    brand: 'Audi',
    model: 'A6',
    year: 2019,
    mileage: 78000,
    price: 29900,
    engine: '2.0 TFSI',
    transmission: 'Автомат',
    verdict: 'bad',
    task: 'Проверка перед покупкой у частного продавца.',
    findings: 'Существенные дефекты подвески, скрытые следы ДТП.',
    decision: 'Отказаться от покупки.',
    result: 'Клиент отказался от проблемного автомобиля и не потерял деньги.'
  }
];

export type Review = {
  name: string;
  text: string;
  rating: number;
  source: string;
};

export const reviews: Review[] = [
  {
    name: 'Андрей',
    text: 'Нашёл BMW в 400 км от себя. Ребята съездили вместо меня и нашли проблемы, которых не было видно по фото.',
    rating: 5,
    source: 'Google'
  },
  {
    name: 'Марина',
    text: 'Подобрали Mercedes под ключ, всё оформили. Я даже не ездила на осмотры.',
    rating: 5,
    source: 'Telegram'
  }
];

// прямые контакты — телефонные номера с WhatsApp + Telegram на каждом
// порядок массива не менять — Services.tsx берёт contactPhones[0] для CTA;
// порядок отображения на /contacts (Германия первой) задаётся локально в page.tsx
export type ContactPhone = {
  number: string;
  digits: string;
  countryKey: 'germany' | 'ukraine';
  telegramUsername: string;
};

export const contactPhones: ContactPhone[] = [
  { number: '+380 63 505 90 25', digits: '380635059025', countryKey: 'ukraine', telegramUsername: 'AutoPodborHamburg' },
  { number: '+49 162 933 50 15', digits: '491629335015', countryKey: 'germany', telegramUsername: 'AutoHamburg' }
];

export type AdditionalService = {
  label: string;
  price: number;
};

export const additionalServices: AdditionalService[] = [
  { label: 'Проверка истории обслуживания', price: 25 },
  { label: 'Сопровождение сделки и документов', price: 100 },
  { label: 'Временные номера (5 дней)', price: 150 },
  { label: 'Экспортные номера (30 дней)', price: 300 }
];
