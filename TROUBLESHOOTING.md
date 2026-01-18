# Решение проблем с Dashboard

## Ошибка "Server error" / "There is a problem with the server configuration"

### Решение 1: Установите все зависимости

```powershell
npm install
```

Убедитесь, что установлены все зависимости, особенно:
- `@radix-ui/react-dialog`
- `@radix-ui/react-dropdown-menu`
- `@radix-ui/react-switch`
- `tailwindcss`
- `lucide-react`
- `zod`
- `react-hook-form`

### Решение 2: Примените изменения Prisma схемы

```powershell
# Остановите dev-сервер (Ctrl+C)
# Затем:
npx prisma db push
npx prisma generate
```

### Решение 3: Очистите кэш и перезапустите

```powershell
# Удалите кэш Next.js
Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue

# Перезапустите dev-сервер
npm run dev
```

### Решение 4: Проверьте переменные окружения

Убедитесь, что файл `.env` содержит:
```env
DATABASE_URL="postgresql://..."
AUTH_SECRET="..."
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."
```

### Решение 5: Проверьте консоль браузера

Откройте DevTools (F12) и проверьте вкладку Console на наличие ошибок.

### Решение 6: Проверьте терминал

Посмотрите на вывод терминала, где запущен `npm run dev` - там должны быть подробные ошибки.

## Частые ошибки

### "Cannot find module '@radix-ui/...'"
```powershell
npm install
```

### "Prisma Client is not generated"
```powershell
npx prisma generate
```

### "Error: useSearchParams() should be wrapped in a suspense boundary"
Используйте `FilmsListWrapper` вместо `FilmsList` - это уже исправлено.

### Стили не применяются
1. Убедитесь, что Tailwind настроен в `globals.css`
2. Перезапустите dev-сервер

### "EPERM: operation not permitted" при генерации Prisma
Это ошибка Windows - файл заблокирован. Попробуйте:
1. Закрыть все процессы Node.js
2. Перезапустить терминал
3. Или просто игнорировать - Prisma Client уже должен быть сгенерирован

## Если ничего не помогло

1. Проверьте логи в терминале, где запущен `npm run dev`
2. Проверьте консоль браузера (F12)
3. Убедитесь, что все файлы сохранены
4. Попробуйте полностью переустановить зависимости:
   ```powershell
   Remove-Item -Recurse -Force node_modules
   Remove-Item package-lock.json
   npm install
   ```





