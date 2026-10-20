# AutoPodbor Hamburg

Premium-сайт личного бренда специалиста по подбору автомобилей в Германии.

Две услуги: проверка под ключ, подбор под ключ. Главная конверсия — переход
в соцсети (Telegram / TikTok / Instagram).

## Стек

Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · next-intl.

## Запуск

```bash
npm install
npm run dev
```

Сайт: http://localhost:3000 → редирект на `/ru`.

## Локали

`/ru` (дефолт), `/de`, `/uk`. Переключатель в шапке. Словари — `messages/*.json`.

## Структура

```
app/[locale]/            — страницы (лендинг, about, cases, guides, prices…)
components/              — UI-компоненты
lib/content.ts           — mock-данные (кейсы, соцсети, цены) до подключения backend/
i18n/                    — next-intl роутинг и middleware
messages/                — словари RU / DE / UK
backend/                 — Django + django-ninja: админка заказчика и API
```

## Backend (админка)

```bash
cd backend
python3.12 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env   # поправить DATABASE_URL под локальный Postgres
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

Админка — на пути из `ADMIN_URL` в `.env` (не `/admin/`). Публичный API —
`/api/cases`, `/api/reviews`, `/api/process`, документация — `/api/docs`.

Полный стек одной командой — `docker compose up --build` (нужен `.env` в корне
и `backend/.env`, см. `.env.example`).

## Дальше

PostHog, Sentry, деплой на AWS — см. `architecture.md` и `admin-panel-spec.md`.
