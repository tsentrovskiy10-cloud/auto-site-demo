# APEX DETAILING

Демонстрационный одностраничный сайт премиального детейлинг-центра и современного автосервиса. Проект ориентирован на публичную презентацию клиентам: адаптивный интерфейс, интерактивное сравнение «до/после», портфолио, отзывы, контакты и рабочая demo-форма заявки.

## Технологии

- React 19, TypeScript и Vite
- CSS с адаптивной mobile-first системой и reduced-motion
- Lucide React для иконок
- Vitest + Testing Library
- Playwright для E2E на mobile, tablet и desktop

## Требования и запуск

Требуется Node.js 20+ и npm.

```bash
npm install
npm run dev
```

Vite выведет локальный адрес (обычно `http://localhost:5173`). Production-сборка:

```bash
npm run build
```

Готовые статические файлы появятся в `dist`.

## Проверки

```bash
npm run lint
npm run test
npx playwright install chromium
npm run test:e2e
```

## Структура

- `src/App.tsx` — секции и интерактивные компоненты страницы
- `src/styles.css` — дизайн-система и адаптивные стили
- `src/data/siteConfig.ts` — компания, услуги, цены, проекты, преимущества и отзывы
- `src/services/leadService.ts` — абстракция отправки заявки
- `public/images` — локальные оптимизированные изображения
- `e2e` — браузерные сценарии

## Как адаптировать под клиента

Название, телефон, адрес, часы, ссылки на мессенджеры и карту меняются в `src/data/siteConfig.ts` в объекте `company`. В этом же файле находятся массивы `services`, `benefits`, `projects` и `reviews`: там меняются услуги, цены, тексты и пути к изображениям. Новые изображения положите в `public/images`, сохранив или обновив пути в конфигурации.

Demo-форма использует `src/services/leadService.ts` и сохраняет заявки в `localStorage` под ключом `apex-leads`. Для Telegram, CRM, email, webhook или backend API достаточно заменить реализацию метода `leadService.submit`, не меняя форму.

SEO-данные находятся в `index.html`, а `robots.txt`, `sitemap.xml`, favicon и Open Graph-изображение — в `public`.

## Cloudflare Pages

- Production branch: `main`
- Build command: `npm run build`
- Build output directory: `dist`
- Переменные окружения не требуются

Перед публикацией замените демонстрационный домен `example.com` в `index.html`, `public/robots.txt`, `public/sitemap.xml` и demo-ссылках конфигурации на фактический адрес сайта.
