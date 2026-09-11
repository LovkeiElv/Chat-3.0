# Nexa — простой мессенджер (клон Telegram)

Минималистичный чат-мессенджер: регистрация/вход, список пользователей, личные чаты
в реальном времени. Стек: **React + Vite** (клиент), **Node.js + Express + Socket.io**
(сервер), **Firebase** (Auth + Firestore).

```
telegram-clone/
├── client/     # React-приложение (интерфейс)
├── server/     # Node.js сервер (API + realtime + Firebase Admin)
└── render.yaml # описание сервиса для Render
```

## 1. Создай проект Firebase

1. Зайди на https://console.firebase.google.com → **Add project**.
2. В разделе **Build → Authentication** включи провайдер **Email/Password**.
3. В разделе **Build → Firestore Database** создай базу (режим "production").
4. Зайди в **Project settings → General → Your apps → Web app**, зарегистрируй
   веб-приложение и скопируй объект `firebaseConfig` — он понадобится для клиента.
5. Зайди в **Project settings → Service accounts → Generate new private key** —
   скачается JSON-файл. Он понадобится для сервера (Firebase Admin).

## 2. Настрой переменные окружения

**client/.env** (скопируй из `client/.env.example`):
```
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
VITE_SERVER_URL=http://localhost:4000
```

**server/.env** (скопируй из `server/.env.example`):
```
PORT=4000
CLIENT_ORIGIN=http://localhost:5173
FIREBASE_SERVICE_ACCOUNT_BASE64=... # см. ниже
```

Чтобы получить `FIREBASE_SERVICE_ACCOUNT_BASE64`, закодируй скачанный JSON-файл
сервисного аккаунта в base64 одной строкой:

```bash
# macOS/Linux
base64 -i serviceAccountKey.json | tr -d '\n'
# Windows PowerShell
[Convert]::ToBase64String([IO.File]::ReadAllBytes("serviceAccountKey.json"))
```

Полученную строку вставь как значение `FIREBASE_SERVICE_ACCOUNT_BASE64`.

## 3. Запуск локально

```bash
# сервер
cd server
npm install
npm run dev        # http://localhost:4000

# в другом терминале — клиент
cd client
npm install
npm run dev         # http://localhost:5173
```

## 4. Firestore Security Rules (рекомендуется)

Данные пишутся только через сервер (Firebase Admin, у которого полный доступ),
поэтому напрямую с клиента запись не идёт. Можно закрыть Firestore для прямого
доступа клиентов:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

## 5. Залить на GitHub

```bash
cd telegram-clone
git init
git add .
git commit -m "Initial commit: Telegram-like chat app"
git branch -M main
git remote add origin https://github.com/<твой-юзернейм>/<репозиторий>.git
git push -u origin main
```

## 6. Деплой на Render

Проект уже содержит `render.yaml` — Render сам предложит настройки при
подключении репозитория ("Blueprint"). Вручную это выглядит так:

1. Render → **New → Web Service** → подключи репозиторий.
2. **Root Directory**: `server`
3. **Build Command**: `npm install && npm run build:client`
   (эта команда также соберёт клиент, см. `server/package.json`)
4. **Start Command**: `npm start`
5. Добавь переменные окружения: `FIREBASE_SERVICE_ACCOUNT_BASE64`,
   `CLIENT_ORIGIN` (можно временно поставить `*`), `PORT` — Render подставит сам.
6. После деплоя сервер отдаёт собранный клиент как статику — отдельный
   frontend-сервис не нужен, всё работает на одном URL.

Если хочешь клиент и сервер как два отдельных Render-сервиса (Static Site +
Web Service) — тоже вариант, просто пропиши `VITE_SERVER_URL` на адрес API-сервиса.

## Что реализовано

- Регистрация / вход по email + паролю (Firebase Auth)
- Список всех пользователей, поиск по имени
- Личные чаты 1-на-1 в реальном времени (Socket.io)
- История сообщений хранится в Firestore
- Индикатор "в сети" / "был(а) недавно"
- Адаптивный дизайн (мобильные и десктоп)

## Чего нет (можно добавить следующим этапом)

- Групповые чаты
- Отправка файлов/изображений
- Push-уведомления
- Голосовые/видеозвонки
- Редактирование и удаление сообщений
