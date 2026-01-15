# Как найти домен проекта на Vercel

## 🎯 Быстрый способ

После деплоя проекта на Vercel, домен автоматически создаётся в формате:
```
https://ваш-проект.vercel.app
```

Где `ваш-проект` - это имя вашего проекта (например, `prostore`, `my-app` и т.д.)

## 📍 Где найти домен в Vercel Dashboard

### Способ 1: В списке проектов

1. Откройте [Vercel Dashboard](https://vercel.com/dashboard)
2. В списке проектов найдите ваш проект **ProStore**
3. Под названием проекта будет указан домен:
   ```
   prostore.vercel.app
   ```
   или
   ```
   prostore-abc123.vercel.app
   ```

### Способ 2: На странице проекта

1. Откройте [Vercel Dashboard](https://vercel.com/dashboard)
2. Нажмите на ваш проект **ProStore**
3. В верхней части страницы увидите:
   - **Production** - основной домен (например: `prostore.vercel.app`)
   - Возможно также есть **Preview** и **Development** домены

### Способ 3: В разделе Deployments

1. Откройте ваш проект на Vercel
2. Перейдите в раздел **Deployments**
3. Нажмите на последний деплой
4. В правом верхнем углу будет ссылка:
   ```
   Visit: https://prostore-abc123.vercel.app
   ```

### Способ 4: Через Vercel CLI

```powershell
# Установите Vercel CLI (если еще не установлен)
npm i -g vercel

# Логин
vercel login

# Перейдите в папку проекта
cd C:\Work\ProStore

# Посмотрите информацию о проекте
vercel inspect
```

## 🔧 Как использовать домен для Google OAuth

### Пример

Если ваш домен на Vercel:
```
https://prostore.vercel.app
```

То Redirect URI для Google OAuth будет:
```
https://prostore.vercel.app/api/auth/callback/google
```

### Где добавить Redirect URI

1. Откройте [Google Cloud Console](https://console.cloud.google.com/)
2. Выберите ваш проект
3. Перейдите в **APIs & Services** → **Credentials**
4. Найдите ваш **OAuth 2.0 Client ID**
5. Нажмите на него для редактирования
6. В разделе **Authorized redirect URIs** нажмите **+ ADD URI**
7. Добавьте ваш Redirect URI:
   ```
   https://ваш-домен.vercel.app/api/auth/callback/google
   ```
   Например:
   ```
   https://prostore.vercel.app/api/auth/callback/google
   ```
8. Нажмите **SAVE**

## 📋 Чеклист

- [ ] Нашли домен проекта на Vercel (например: `prostore.vercel.app`)
- [ ] Открыли Google Cloud Console
- [ ] Нашли OAuth 2.0 Client ID
- [ ] Добавили Redirect URI: `https://ваш-домен.vercel.app/api/auth/callback/google`
- [ ] Сохранили изменения

## ⚠️ Важно

1. **Используйте HTTPS** - всегда используйте `https://`, а не `http://`
2. **Точный путь** - путь должен быть точно `/api/auth/callback/google`
3. **Без слеша в конце** - не добавляйте `/` в конце URL
4. **Production и Preview** - если у вас есть разные домены для Production и Preview, добавьте оба

## 🔍 Примеры правильных Redirect URIs

```
https://prostore.vercel.app/api/auth/callback/google
https://prostore-abc123.vercel.app/api/auth/callback/google
https://prostore-git-main-username.vercel.app/api/auth/callback/google
```

## ❌ Примеры неправильных Redirect URIs

```
http://prostore.vercel.app/api/auth/callback/google  ❌ (используйте https)
https://prostore.vercel.app/api/auth/callback/google/  ❌ (не добавляйте / в конце)
https://prostore.vercel.app/auth/callback/google  ❌ (неправильный путь)
```



