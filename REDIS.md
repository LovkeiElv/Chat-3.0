# Redis Integration Guide

## What Was Added

Redis поддержка добавлена для:
- **Socket.io adapter**: Синхронизация Socket.io между несколькими инстансами сервера
- **Graceful shutdown**: Правильная очистка подключений при остановке
- **Optional**: Приложение работает без Redis (в памяти) если Redis недоступен

## Local Development with Redis

### Option 1: Docker (Recommended)
```bash
# Запуск Redis контейнера
docker run -d -p 6379:6379 --name redis redis:latest

# Проверка
docker ps
```

### Option 2: Install Redis
- **Windows**: [Redis Windows](https://github.com/microsoftarchive/redis/releases)
- **macOS**: `brew install redis`
- **Linux**: `sudo apt-get install redis-server`

### Run Application with Redis
```bash
# Terminal 1: Start Redis
redis-server

# Terminal 2: Start server
cd server
npm run dev

# Terminal 3: Start client
cd client
npm run dev
```

## Environment Variables

### Local Development
```env
PORT=4000
CLIENT_ORIGIN=http://localhost:5173
REDIS_URL=redis://localhost:6379
FIREBASE_SERVICE_ACCOUNT_BASE64=...
```

### Production (Render)
```env
REDIS_URL=<automatically set from Redis service>
FIREBASE_SERVICE_ACCOUNT_BASE64=<your base64 key>
CLIENT_ORIGIN=*
```

## Render Deployment

The `render.yaml` now includes:
1. **Web Service**: Node.js сервер (Nexa Chat)
2. **Redis Service**: Redis инстанс (nexa-redis)

Redis автоматически:
- Создается при деплое
- Доступен как `REDIS_URL` в web service
- Используется для Socket.io синхронизации

### Deploy Steps
1. Push changes to GitHub
2. Render автоматически запустит deployment
3. Redis будет создан автоматически
4. Socket.io будет подключен к Redis

## Performance Benefits

- **Multi-instance**: Несколько инстансов сервера могут синхронизировать Socket.io
- **Scalability**: Готово для горизонтального масштабирования
- **Reliability**: Graceful shutdown обеспечивает чистое отключение

## Fallback Behavior

Если Redis недоступен:
- Приложение продолжит работать
- Socket.io будет в режиме памяти (только для одного инстанса)
- Логируется предупреждение о отсутствии Redis

```
⚠️  Socket.io running in memory mode without Redis
```

## Architecture

```
Client
  ↓
Express Server
  ↓
Socket.io ← Redis Adapter ← Redis
  ↓
Firebase (Auth + Firestore)
```
