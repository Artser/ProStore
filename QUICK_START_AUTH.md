# Быстрый старт: Аутентификация через Google

## 1. Установите зависимости

```powershell
npm install
```

## 2. Настройте Google OAuth

1. Откройте [Google Cloud Console](https://console.cloud.google.com/)
2. Создайте OAuth 2.0 Client ID
3. Добавьте redirect URI: `http://localhost:3000/api/auth/callback/google`

## 3. Настройте .env

```env
GOOGLE_CLIENT_ID="ваш-client-id"
GOOGLE_CLIENT_SECRET="ваш-client-secret"
AUTH_SECRET="случайная-строка-32-символа"
DATABASE_URL="postgresql://..."
```

## 4. Примените схему БД

```powershell
npx prisma db push
```

## 5. Запустите проект

```powershell
npm run dev
```

## 6. Откройте страницу входа

[http://localhost:3000/login](http://localhost:3000/login)

## Готово! 🎉

Теперь вы можете:
- Войти через Google
- Просматривать защищённые страницы
- Видеть только свои данные

Подробная документация: [AUTH_SETUP.md](./AUTH_SETUP.md)






