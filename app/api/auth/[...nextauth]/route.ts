import { handlers } from '@/auth'

/**
 * API Route для Auth.js
 * Обрабатывает все запросы аутентификации:
 * - /api/auth/signin - вход
 * - /api/auth/signout - выход
 * - /api/auth/callback/google - callback от Google OAuth
 * - /api/auth/session - получение текущей сессии
 */
export const { GET, POST } = handlers

