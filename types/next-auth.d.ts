import 'next-auth'
import { DefaultSession } from 'next-auth'

/**
 * Расширение типов NextAuth
 * Добавляет userId в объект сессии
 */
declare module 'next-auth' {
  interface Session {
    user: {
      id: string
    } & DefaultSession['user']
  }

  interface User {
    id: string
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    userId?: string
  }
}


