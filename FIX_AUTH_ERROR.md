# Исправление ошибки Auth.js

## Проблема

При входе через Google возникает ошибка:
```
Unknown argument `emailVerified`. Available options are marked with ?.
```

## Причина

Auth.js (NextAuth) требует поле `emailVerified` в модели `User`, но оно отсутствовало в Prisma schema.

## Решение

✅ Поле `emailVerified` уже добавлено в модель `User`:
```prisma
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  emailVerified DateTime?  // ← Добавлено
  name          String?
  image         String?
  createdAt     DateTime  @default(now())
  ...
}
```

✅ Изменения применены к базе данных через `prisma db push`

## Что сделать дальше

1. **Перезапустите dev-сервер:**
   ```powershell
   # Остановите текущий сервер (Ctrl+C)
   # Затем:
   npm run dev
   ```

2. **Если ошибка EPERM при генерации Prisma Client:**
   - Это не критично - изменения уже применены к БД
   - Prisma Client будет перегенерирован автоматически при следующем запуске
   - Или попробуйте закрыть все процессы Node.js и перезапустить терминал

3. **Попробуйте войти снова:**
   - Откройте [http://localhost:3000/login](http://localhost:3000/login)
   - Нажмите "Войти через Google"
   - Теперь должно работать!

## Проверка

После перезапуска сервера проверьте:
- ✅ Вход через Google работает
- ✅ Пользователь создаётся в БД
- ✅ Редирект на /dashboard работает



