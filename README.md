# ИИ-чат (виджет в стиле Jivo)

Демо SPA на React + Vite и backend на Express с **Google Gemini** для ответов агента.

## Настройка

1. Скопируйте пример окружения:

```bash
cp .env.example .env
```

2. Получите API-ключ в [Google AI Studio](https://aistudio.google.com/apikey) и добавьте в `.env`:

```env
GEMINI_API_KEY=ваш_ключ
GEMINI_MODEL=gemini-3.8-flash
```

3. Установите зависимости и запустите фронт + API:

```bash
npm install
npm run dev
```

- Сайт: http://localhost:5173  
- API: http://localhost:3001 (`GET /api/health`, `POST /api/chat`)

Запросы с фронта идут на `/api/*` через прокси Vite.

После изменения `.env` **перезапустите** `npm run dev` (backend читает переменные только при старте).

При перегрузке Gemini backend пробует **резервные модели** и при необходимости отвечает **заготовками** (`GEMINI_MOCK_ON_OVERLOAD=true` по умолчанию).

### Только моки (без Gemini)

В `.env`:

```env
VITE_USE_MOCK=true
```

## Сборка фронта

```bash
npm run build
npm run preview
```

Для production разверните `server/` рядом со статикой и задайте `VITE_API_URL` на URL backend при сборке.

## Структура

- `src/components/` — виджет чата
- `src/services/chatApi.js` — вызов `POST /api/chat` или моки
- `server/index.js` — Express API
- `server/gemini.js` — интеграция Gemini

## Тема

Переключатель светлой/тёмной темы в шапке виджета. Выбор сохраняется в `localStorage`.

## Роль агента

Консультант отвечает на вопросы о **лекарствах и медтоварах**; остальные темы перенаправляет на оператора. Телефон задаётся в `OPERATOR_PHONE` в [`src/data/mocks.js`](src/data/mocks.js).
