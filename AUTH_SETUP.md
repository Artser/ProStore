# Настройка аутентификации через Google OAuth

## Обзор

Проект использует Auth.js (NextAuth v5) для аутентификации через Google OAuth.

## Шаг 1: Настройка Google OAuth

1. Перейдите в [Google Cloud Console](https://console.cloud.google.com/)
2. Создайте новый проект или выберите существующий
3. Включите Google+ API:
   - Перейдите в "APIs & Services" → "Library"
   - Найдите "Google+ API" и включите её
4. Создайте OAuth 2.0 credentials:
   - Перейдите в "APIs & Services" → "Credentials"
   - Нажмите "Create Credentials" → "OAuth client ID"
   - Выберите "Web application"
   - Добавьте Authorized redirect URIs:
     - Для разработки: `http://localhost:3000/api/auth/callback/google`
     - Для продакшна: `https://your-domain.vercel.app/api/auth/callback/google`
5. Скопируйте Client ID и Client Secret

## Шаг 2: Настройка переменных окружения

Добавьте в файл `.env`:

```env
# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Auth.js Secret (сгенерируйте случайную строку)
AUTH_SECRET="your-random-secret-key"

# Database (уже должно быть)
DATABASE_URL="postgresql://..."
```

### Генерация AUTH_SECRET

```powershell
# Windows PowerShell
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | % {[char]$_})

# Или используйте онлайн генератор:
# https://generate-secret.vercel.app/32
```

## Шаг 3: Обновление базы данных

Примените изменения схемы Prisma:

```powershell
# Применить схему
npx prisma db push

# Или создать миграцию
npx prisma migrate dev --name add_auth_models
```

Это создаст таблицы:
- `accounts` - OAuth аккаунты пользователей
- `sessions` - сессии пользователей
- `verification_tokens` - токены для верификации

## Шаг 4: Установка зависимостей

```powershell
npm install
```

## Шаг 5: Проверка работы

1. Запустите dev-сервер:
```powershell
npm run dev
```

2. Откройте [http://localhost:3000/login](http://localhost:3000/login)

3. Нажмите "Войти через Google"

4. После входа вы будете перенаправлены на `/dashboard`

## Структура файлов

```
auth.ts                    # Главная конфигурация Auth.js
auth.config.ts            # Базовые настройки и callbacks
middleware.ts             # Защита страниц
app/api/auth/[...nextauth]/route.ts  # API routes для Auth.js
app/login/page.tsx        # Страница входа
app/dashboard/page.tsx    # Защищённая страница (пример)
app/my-prompts/page.tsx   # Защищённая страница (пример)
lib/auth-helpers.ts       # Вспомогательные функции
types/next-auth.d.ts     # Расширение типов TypeScript
```

## Использование в коде

### Получение сессии на сервере

```typescript
import { auth } from '@/auth'

export default async function MyPage() {
  const session = await auth()
  
  if (!session?.user) {
    redirect('/login')
  }
  
  const userId = session.user.id
  // Используйте userId для запросов к БД
}
```

### Использование вспомогательных функций

```typescript
import { getRequiredUserId } from '@/lib/auth-helpers'

export default async function MyPage() {
  const userId = await getRequiredUserId() // Автоматический редирект, если не авторизован
  // userId гарантированно существует
}
```

### Проверка владельца ресурса

```typescript
import { checkPrivateResourceAccess } from '@/lib/auth-helpers'

export default async function FilmPage({ params }: { params: { id: string } }) {
  const session = await auth()
  const film = await prisma.film.findUnique({ where: { id: params.id } })
  
  if (!film) {
    notFound()
  }
  
  // Проверка доступа к приватному промту
  if (film.visibility === 'PRIVATE') {
    await checkPrivateResourceAccess(film.ownerId, session?.user?.id)
  }
  
  // Показываем промт
}
```

## Защищённые страницы

Страницы автоматически защищены через `middleware.ts`:
- `/dashboard` - требует авторизации
- `/my-prompts` - требует авторизации

Неавторизованные пользователи автоматически перенаправляются на `/login`.

## Выход из системы

```typescript
import { signOut } from '@/auth'

// В Server Action
await signOut({ redirectTo: '/login' })

// В Client Component
<form action={async () => {
  'use server'
  await signOut({ redirectTo: '/login' })
}}>
  <button type="submit">Выйти</button>
</form>
```

## Деплой на Vercel

1. Добавьте переменные окружения в Vercel Dashboard:
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`
   - `AUTH_SECRET`
   - `DATABASE_URL`

2. Обновите Authorized redirect URIs в Google Cloud Console:
   - Добавьте: `https://your-domain.vercel.app/api/auth/callback/google`

3. Задеплойте проект

## Безопасность

- ✅ Все сессии хранятся в JWT токенах
- ✅ Пароли не хранятся (используется OAuth)
- ✅ Приватные данные фильтруются по `ownerId`
- ✅ Middleware защищает все защищённые страницы
- ✅ `AUTH_SECRET` используется для подписи токенов

## Troubleshooting

### Ошибка "Invalid credentials"
- Проверьте правильность `GOOGLE_CLIENT_ID` и `GOOGLE_CLIENT_SECRET`
- Убедитесь, что redirect URI добавлен в Google Cloud Console

### Ошибка "AUTH_SECRET is missing"
- Добавьте `AUTH_SECRET` в `.env`
- Перезапустите dev-сервер

### Пользователь не создаётся в БД
- Проверьте подключение к БД (`DATABASE_URL`)
- Убедитесь, что Prisma schema применена (`npx prisma db push`)

### Middleware не работает
- Проверьте, что `middleware.ts` находится в корне проекта
- Убедитесь, что экспортируется функция `middleware`

