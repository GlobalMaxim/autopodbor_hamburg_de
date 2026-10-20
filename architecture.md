# Архитектура — autopodbor-hamburg.de

Premium-сайт личного бренда специалиста по подбору автомобилей в Германии.
Две услуги: проверка под ключ, подбор под ключ. Главная конверсия — переход
в соцсети (Telegram / TikTok / Instagram).

НЕ система автоматизации продаж: без CRM, конфигураторов, онлайн-оплаты,
каталога, регистрации.

## Стек

| Слой | Выбор | Почему |
|---|---|---|
| Frontend | **Next.js 15 (App Router) + React + TypeScript** | SSG/ISR, React |
| Backend/админка | **Django + django-ninja + PostgreSQL** | Admin-панель из коробки под контент заказчика (кейсы/отзывы/видео-примеры), API для фронтенда |
| Стили/UI | **Tailwind CSS + shadcn/ui** | Быстро, доступные компоненты (WCAG AA) |
| Анимации | **Motion (framer-motion)** | HERO-маркеры, анимации секций |
| Аналитика | **PostHog** | События воронки, главная конверсия — переход в соцсеть |
| Monitoring | **Sentry** | Ошибки фронта и API |
| Storage | **AWS S3** | Фото/видео кейсов/отзывов, OG-изображения |
| Hosting | **AWS Lightsail, Docker Compose** | Next.js + Django + Postgres + Caddy на одном сервере, домен autopodbor-hamburg.de |
| Testing | **Vitest** (юнит) + **Playwright** (e2e) | DoD: тесты проходят |
| Языки | **next-intl** — RU / DE / UK | Аудитория русскоязычная в Германии, расширение |

## Мультиязычность (i18n)

Стек: **next-intl** + locale-сегмент в URL (`[locale]`). Дефолт — `ru`.
Локали: `ru` (главный), `de`, `uk`.

```
/                      → redirect → /ru (или Accept-Language)
/ru                    — главная
/ru/cases              — кейсы
/de/...                — немецкая версия
/uk/...                — украинская версия
```

Подход: **locale-prefix always** — без голого `/`, иначе SEO-дубли и проблемы
канонических URL.

Словари:

```
messages/
  ru.json   de.json   uk.json
```
При росте — по доменам: `common` (шапка/CTA/вердикты), `home`, `service`,
`how`, `about`, `pricing`.

Локализация:
- UI, CTA, заголовки, этапы, вердикты → словари.
- Кейсы/отзывы/гайды → контент Payload с полем `locale` (локализация коллекций).
- Бренд, имя специалиста — не локализуем.

SEO: `generateMetadata` + `hreflang` + `alternates.languages` на каждую страницу.

## Структура страниц

```
app/
  [locale]/
    page.tsx                  — лендинг
    about/page.tsx            — о специалисте
    how-it-works/page.tsx     — процесс
    cases/page.tsx            — список кейсов (+ фильтры по вердикту)
    cases/[slug]/page.tsx     — кейс (storytelling)
    socials/page.tsx          — соцсети
    guides/page.tsx           — гайды (SEO-контент)
    guides/[slug]/page.tsx    — гайд
    prices/page.tsx           — цены
    impressum/page.tsx        — юр.
    datenschutz/page.tsx      — юр.
  layout.tsx                  — шапка/подвал, переключатель языка
  sitemap.ts / robots.ts      — SEO
```

## Данные (Django)

Django-приложения (`backend/`), подробное техническое описание — `admin-panel-spec.md`:

```
cases    — Case (title, slug, brand, model, year, mileage, price, engine,
           transmission, verdict, clientTask, process, inspection,
           findings, decision, result, published) + CasePhoto/CaseVideo (FK)
reviews  — Review (name, text, rating, date, source, mediaType,
           photo/video/tiktokUrl, published)
process  — ReportExample (title, step, video/photo, order, published)
           — видео-примеры отчётов для блока "Как это работает"
```

Auth: без публичной регистрации (конфликтовало бы с п.17 исходного ТЗ).
Первый суперпользователь — `manage.py createsuperuser` при деплое, остальные
сотрудники заводятся им вручную через Django admin (`is_staff`). Путь до
админки не дефолтный `/admin/` — задаётся через `ADMIN_URL` в `.env`.

API — **django-ninja**, только чтение опубликованного контента
(`/api/cases`, `/api/reviews`, `/api/process`), редактирование — исключительно
через Django admin.

Весь стек — на одном AWS Lightsail-сервере через Docker Compose (не Vercel +
managed-сервисы, как планировалось раньше): Next.js и Django — два контейнера
за общим доменом, Caddy разводит по пути (`/api/*`, `/static/*`, `/media/*` →
Django, всё остальное → Next.js). Один origin — CORS не нужен.

Схема:

```
Caddy (TLS, роутинг по пути)
   ├── /            → Next.js (ISR, читает Django API)
   └── /api /admin   → Django + django-ninja
                            │
                       PostgreSQL (в docker-compose)
                       AWS S3 (медиа)      PostHog / Sentry
```

## Ключевые компоненты

- `VerdictBadge` — 🟢 Рекомендуем / 🟡 Есть нюансы / 🔴 Не рекомендуем
- `ServiceCard` — две большие карточки услуг (этапы + CTA)
- `HowItWorksSteps` — 7 шагов процесса
- `CaseCard` / `CaseFilter` — карточка кейса + фильтр по вердикту
- `SocialLinks` / `SocialCTA` — централизованные ссылки + CTA
- `LeadCTA` — кнопка «Обсудить подбор» → Telegram/TikTok/Instagram
- `GuideCard` — карточка гайда (SEO)

## SEO / структурированные данные

`metadata` + Open Graph + canonical + sitemap + robots.txt + structured data:
`LocalBusiness`, `Service`, `Review`, `Article`, `BreadcrumbList`.

## Дизайн

Premium Automotive / Modern Editorial: тёмный графит + белый + нейтральные
оттенки + один акцентный цвет; крупная типографика; качественные фото;
много воздуха; минималистичные карточки; сильные CTA.

## Производительность / доступность

- Lighthouse ≥90: Next/Image, lazy loading, responsive images, Server
  Components, минимум JS, lazy loading видео, оптимизированные шрифты.
- WCAG 2.2 AA: keyboard nav, labels, semantic HTML, contrast, focus states,
  alt, prefers-reduced-motion.

## Фазы

1. **MVP** — Next.js + Payload (Case/Review/SiteSettings), лендинг + 2 услуги +
   кейсы + about + how-it-works + соцсети, RU-локаль, PostHog, Sentry.
2. **Расширение** — гайды (SEO), фильтры кейсов, локали DE/UK, дополнительные
   услуги, цены.
3. **Полировка** — e2e-тесты Playwright, Lighthouse-тунинг, R2-оптимизация медиа.
