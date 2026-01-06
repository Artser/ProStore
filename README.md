# ProStore - Next.js + Prisma + NeonDB

Минимальный рабочий проект на Next.js (App Router) с Prisma и NeonDB (PostgreSQL), готовый к деплою на Vercel.

## Технологии

- **Next.js 14** (App Router, TypeScript)
- **Prisma** (ORM)
- **NeonDB** (PostgreSQL)
- **Vercel** (деплой)

## Быстрый старт

### 1. Установка зависимостей

```powershell
npm install
```

### 2. Настройка базы данных

1. Создайте аккаунт на [Neon](https://neon.tech)
2. Создайте новый проект и базу данных
3. Скопируйте строку подключения (Connection String) из Dashboard
4. Создайте файл `.env` на основе `.env.example`:

```powershell
Copy-Item .env.example .env
```

5. Вставьте строку подключения в `.env`:

```
DATABASE_URL="postgresql://user:password@host/database?sslmode=require"
```

### 3. Настройка Prisma

Примените схему к базе данных:

```powershell
npx prisma db push
```

Или создайте миграцию:

```powershell
npx prisma migrate dev --name init
```

### 4. Заполнение базы данных (seed)

```powershell
npm run db:seed
```

### 5. Запуск проекта

```powershell
npm run dev
```

Откройте [http://localhost:3000](http://localhost:3000) в браузере.

## Деплой на Vercel

### 1. Подготовка

1. Убедитесь, что все изменения закоммичены в Git
2. Создайте репозиторий на GitHub/GitLab/Bitbucket

### 2. Деплой через Vercel Dashboard

1. Перейдите на [vercel.com](https://vercel.com)
2. Нажмите "Add New Project"
3. Импортируйте ваш репозиторий
4. В настройках проекта добавьте переменную окружения:
   - **Name**: `DATABASE_URL`
   - **Value**: ваша строка подключения из Neon
5. Нажмите "Deploy"

### 3. Деплой через Vercel CLI

```powershell
# Установка Vercel CLI (если еще не установлен)
npm i -g vercel

# Логин
vercel login

# Деплой
vercel

# Добавление переменной окружения
vercel env add DATABASE_URL
```

### 4. После деплоя

После успешного деплоя выполните миграции и seed на продакшн-базе:

```powershell
# Установите DATABASE_URL для продакшн
$env:DATABASE_URL="your-production-database-url"

# Примените схему
npx prisma db push

# Заполните данными
npm run db:seed
```

Или используйте Prisma Studio для управления данными:

```powershell
npx prisma studio
```

## Структура проекта

```
.
├── app/
│   ├── layout.tsx      # Корневой layout
│   ├── page.tsx        # Главная страница с чтением из БД
│   └── globals.css     # Глобальные стили
├── lib/
│   └── prisma.ts       # Singleton Prisma Client
├── prisma/
│   ├── schema.prisma   # Схема Prisma
│   └── seed.ts         # Seed скрипт
├── .env.example        # Пример переменных окружения
├── next.config.js      # Конфигурация Next.js
├── package.json        # Зависимости и скрипты
└── tsconfig.json       # Конфигурация TypeScript
```

## Модель данных

### Note

- `id` (String, UUID) - уникальный идентификатор
- `title` (String) - заголовок заметки
- `createdAt` (DateTime) - дата создания

## Полезные команды

```powershell
# Разработка
npm run dev

# Сборка
npm run build

# Запуск продакшн-версии
npm start

# Prisma команды
npx prisma db push              # Применить схему без миграции
npx prisma migrate dev          # Создать и применить миграцию
npx prisma generate             # Сгенерировать Prisma Client
npx prisma studio               # Открыть Prisma Studio

# Seed
npm run db:seed
```

## Примечания

- При деплое на Vercel переменная `DATABASE_URL` должна быть установлена в настройках проекта
- Скрипт `postinstall` автоматически генерирует Prisma Client при деплое
- Для продакшн-базы рекомендуется использовать connection pooling (Neon предоставляет это автоматически)

