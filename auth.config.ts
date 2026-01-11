import type { NextAuthConfig } from 'next-auth'

/**
 * Конфигурация Auth.js
 * Используется для типизации и базовых настроек
 */
export const authConfig = {
  pages: {
    signIn: '/login', // Страница входа
  },
  callbacks: {
    /**
     * Вызывается при авторизации пользователя
     * Проверяет и возвращает данные пользователя для сессии
     */
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard')
      const isOnMyPrompts = nextUrl.pathname.startsWith('/my-prompts')
      const isOnLogin = nextUrl.pathname.startsWith('/login')

      // Защищённые страницы требуют авторизации
      if (isOnDashboard || isOnMyPrompts) {
        if (isLoggedIn) return true
        return false // Редирект на /login
      }

      // Если пользователь уже авторизован и пытается зайти на /login - редирект
      if (isOnLogin && isLoggedIn) {
        return Response.redirect(new URL('/dashboard', nextUrl))
      }

      return true
    },
    /**
     * Вызывается при создании JWT токена
     * Добавляет userId в токен для удобного доступа
     */
    async jwt({ token, user }) {
      if (user) {
        token.userId = user.id
      }
      return token
    },
    /**
     * Вызывается при создании сессии
     * Добавляет userId в объект сессии
     */
    async session({ session, token }) {
      if (session.user && token.userId) {
        session.user.id = token.userId as string
      }
      return session
    },
  },
  providers: [], // Провайдеры добавляются в auth.ts
} satisfies NextAuthConfig


