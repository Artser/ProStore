# Настройка базы данных на Vercel

## Проблема
После деплоя на Vercel страница показывает "Заметок пока нет" и предупреждение о подключении к БД.

## Решение

### Шаг 1: Проверьте переменную окружения DATABASE_URL на Vercel

1. Откройте [Vercel Dashboard](https://vercel.com/dashboard)
2. Выберите ваш проект
3. Перейдите в **Settings** → **Environment Variables**
4. Убедитесь, что есть переменная `DATABASE_URL` со значением строки подключения из Neon
5. Если переменной нет — добавьте её:
   - **Name**: `DATABASE_URL`
   - **Value**: ваша строка подключения из Neon Dashboard
   - **Environment**: выберите Production, Preview и Development

### Шаг 2: Примените схему к продакшн-базе

Выполните команды локально, указав продакшн DATABASE_URL:

```powershell
# Установите переменную окружения с продакшн-строкой подключения
$env:DATABASE_URL="postgresql://user:password@host/database?sslmode=require"

# Примените схему к базе данных
npx prisma db push

# Заполните базу тестовыми данными
npm run db:seed
```

**Важно**: Используйте строку подключения из Neon Dashboard для продакшн-базы!

### Шаг 3: Проверьте результат

1. Откройте URL вашего проекта на Vercel
2. Обновите страницу (Ctrl+F5)
3. Должны появиться заметки из базы данных

## Альтернативный способ через Vercel CLI

```powershell
# Установите Vercel CLI (если еще не установлен)
npm i -g vercel

# Логин
vercel login

# Получите переменные окружения
vercel env pull .env.production

# Примените схему
npx prisma db push

# Заполните данными
npm run db:seed
```

## Проверка подключения

Чтобы проверить, правильно ли настроена БД, выполните:

```powershell
# Установите DATABASE_URL
$env:DATABASE_URL="your-production-database-url"

# Проверьте подключение через Prisma Studio
npx prisma studio
```

Prisma Studio откроется в браузере, где вы сможете увидеть данные в базе.

## Частые проблемы

### Ошибка "Can't reach database server"
- Проверьте, что строка подключения правильная
- Убедитесь, что БД доступна из интернета (Neon по умолчанию доступна)
- Проверьте, что в строке подключения указан `?sslmode=require`

### Ошибка "relation 'notes' does not exist"
- Схема не применена к БД — выполните `npx prisma db push`

### Данные не отображаются
- Проверьте, что seed выполнен: `npm run db:seed`
- Проверьте логи в Vercel Dashboard (Functions → Logs)
- Убедитесь, что переменная `DATABASE_URL` установлена для Production окружения

