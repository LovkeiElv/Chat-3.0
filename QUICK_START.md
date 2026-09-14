# Быстрый старт с Redis

## Локальное тестирование

### 1. Запустить Redis
```bash
# Option A: Docker (рекомендуется)
docker run -d -p 6379:6379 --name redis redis:latest

# Option B: Redis сервер (если установлен)
redis-server
```

### 2. Запустить сервер
```bash
cd server
npm install  # если не запускали
npm run dev  # http://localhost:4000
```

### 3. Запустить клиент
```bash
cd client
npm install  # если не запускали
npm run dev  # http://localhost:5173
```

## Особенности

✅ **Firebase Auth** - регистрация/вход
✅ **Firestore** - история сообщений
✅ **Socket.io** - реальное время (теперь с Redis)
✅ **Redis** - синхронизация между инстансами
✅ **Render** - готово для деплоя

## Деплой на Render

1. Push to GitHub
2. Render → Blueprints → выбрать репозиторий
3. Добавить `FIREBASE_SERVICE_ACCOUNT_BASE64`
4. Deploy!

Redis создастся автоматически ✅

## Документация

- [README.md](README.md) - полное описание проекта
- [REDIS.md](REDIS.md) - подробная Redis документация
- [render.yaml](render.yaml) - конфиг Render

## Статус

- ✅ Redis интегрирован
- ✅ Socket.io adapter включен
- ✅ Render конфиг обновлен
- ✅ Firebase не затронут
- ✅ Готово для production
