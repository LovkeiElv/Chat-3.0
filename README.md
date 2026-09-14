# Nexa — простой мессенджер (клон Telegram)

Минималистичный чат-мессенджер: регистрация/вход, список пользователей, личные чаты
в реальном времени. Стек: **React + Vite** (клиент), **Node.js + Express + Socket.io + Redis**
(сервер), **Firebase** (Auth + Firestore).

```
telegram-clone/
├── client/     # React-приложение (интерфейс)
├── server/     # Node.js сервер (API + realtime + Firebase Admin + Redis)
├── render.yaml # конфиг для Render (включает Redis)
├── REDIS.md    # документация Redis интеграции
└── README.md   # этот файл
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
REDIS_URL=redis://localhost:6379    # см. REDIS.md для деталей
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
# Redis (в отдельном терминале)
redis-server              # или docker run -d -p 6379:6379 redis:latest

# сервер (в отдельном терминале)
cd server
npm install
npm run dev               # http://localhost:4000

# клиент (в отдельном терминале)
cd client
npm install
npm run dev               # http://localhost:5173
```

**Подробнее про Redis:** см. [REDIS.md](REDIS.md)

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

Проект уже содержит `render.yaml` с конфигурацией для **Web Service + Redis** —
Render сам создаст оба сервиса при подключении репозитория ("Blueprint").

**Что создаёт render.yaml:**
1. **Web Service** (`nexa-chat`): Node.js приложение
2. **Redis Service** (`nexa-redis`): Redis инстанс для Socket.io синхронизации

**Шаги деплоя:**
1. Render → **Blueprints** → подключи репозиторий
2. Confirm: `render.yaml` будет прочитан автоматически
3. Добавь переменные окружения:
   - `FIREBASE_SERVICE_ACCOUNT_BASE64` (твой base64 ключ)
   - `CLIENT_ORIGIN` = `*` (или конкретный URL)
   - `REDIS_URL` — автоматически установится из Redis сервиса
4. Deploy!

После деплоя:
- Сервер доступен по одному URL (Web Service)
- Redis автоматически используется для Socket.io
- Клиент собирается и отдаётся как статика

## Что реализовано

- ✅ Регистрация / вход по email + паролю (Firebase Auth)
- ✅ Список всех пользователей, поиск по имени
- ✅ Личные чаты 1-на-1 в реальном времени (Socket.io + Redis)
- ✅ История сообщений хранится в Firestore
- ✅ Индикатор "в сети" / "был(а) недавно"
- ✅ Адаптивный дизайн (мобильные и десктоп)
- ✅ Redis для синхронизации между инстансами

## Чего нет (можно добавить следующим этапом)

- Групповые чаты
- Отправка файлов/изображений
- Push-уведомления
- Голосовые/видеозвонки
- Редактирование и удаление сообщений
