# Решение ошибки EPERM при npm install

## Проблема

При выполнении `npm install` возникает ошибка:
```
EPERM: operation not permitted, rename '...query_engine-windows.dll.node.tmp...' -> '...query_engine-windows.dll.node'
```

## Причина

Это известная проблема Windows - файл Prisma Client заблокирован другим процессом Node.js (например, запущенным dev-сервером).

## Решения

### Решение 1: Закрыть все процессы Node.js (рекомендуется)

```powershell
# Остановить все процессы Node.js
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force

# Затем запустить установку
npm install
```

### Решение 2: Установить без postinstall (если Prisma Client уже есть)

```powershell
# Установить зависимости, пропустив postinstall
npm install --ignore-scripts

# Затем сгенерировать Prisma Client вручную (если нужно)
npx prisma generate
```

### Решение 3: Игнорировать ошибку (если Prisma Client уже сгенерирован)

Если файл `node_modules/.prisma/client/index.js` существует, то ошибка не критична - Prisma Client уже работает. Просто продолжайте использовать проект.

### Решение 4: Временно отключить postinstall

Если проблема повторяется часто, можно временно убрать postinstall из package.json:

```json
// Закомментировать эту строку:
// "postinstall": "prisma generate"
```

Но это не рекомендуется, так как на Vercel postinstall нужен для автоматической генерации.

## Проверка

После установки проверьте:
1. Зависимости установлены: `Test-Path node_modules\next`
2. Prisma Client существует: `Test-Path node_modules\.prisma\client\index.js`

Если оба файла существуют - всё в порядке, можно продолжать работу!

## Для разработки

Просто запустите:
```powershell
npm run dev
```

Если Prisma Client уже существует - проект запустится нормально, несмотря на ошибку при установке.

