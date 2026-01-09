import NextAuth from 'next-auth'
import Google from 'next-auth/providers/google'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { prisma } from '@/lib/prisma'
import { authConfig } from './auth.config'

/**
 * Главная конфигурация Auth.js
 * Настраивает провайдеры, адаптер БД и сессии
 */
export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma) as any, // PrismaAdapter совместим с Auth.js v5
  session: {
    strategy: 'jwt', // Используем JWT сессии для лучшей производительности
  },
  secret: process.env.AUTH_SECRET, // Секретный ключ для подписи токенов
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      /**
       * При первом входе через Google:
       * 1. Auth.js автоматически создаст пользователя в БД
       * 2. Заполнит поля: email, name, image
       * 3. Создаст связь с Account
       */
    }),
  ],
  /**
   * Callbacks для кастомизации данных пользователя
   */
  callbacks: {
    ...authConfig.callbacks,
    /**
     * Дополнительная обработка при входе через OAuth
     */
    async signIn({ user, account, profile }) {
      // Можно добавить дополнительную логику проверки
      // Например, разрешить вход только определённым email-доменам
      return true
    },
  },
})

