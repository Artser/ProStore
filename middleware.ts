import { auth } from '@/auth'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * Middleware для защиты страниц
 * Выполняется перед каждым запросом
 */
export async function middleware(request: NextRequest) {
  const session = await auth()

  // Защищённые страницы
  const protectedPaths = ['/dashboard', '/my-prompts']
  const isProtectedPath = protectedPaths.some((path) =>
    request.nextUrl.pathname.startsWith(path)
  )

  // Если страница защищена и пользователь не авторизован
  if (isProtectedPath && !session) {
    const loginUrl = new URL('/login', request.url)
    // Сохраняем URL, на который пользователь хотел зайти
    loginUrl.searchParams.set('callbackUrl', request.nextUrl.pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Если пользователь авторизован и пытается зайти на /login
  if (request.nextUrl.pathname.startsWith('/login') && session) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

/**
 * Конфигурация middleware
 * Указываем, для каких путей запускать middleware
 */
export const config = {
  matcher: [
    /*
     * Запускаем middleware для всех путей, кроме:
     * - api (API routes)
     * - _next/static (статические файлы)
     * - _next/image (оптимизация изображений)
     * - favicon.ico (иконка сайта)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}

