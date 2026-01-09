import { auth } from '@/auth'
import { redirect } from 'next/navigation'

/**
 * Вспомогательные функции для работы с аутентификацией
 */

/**
 * Получает текущую сессию пользователя
 * Если пользователь не авторизован - редирект на /login
 * @returns Объект сессии с гарантированным userId
 */
export async function getRequiredSession() {
  const session = await auth()

  if (!session?.user?.id) {
    redirect('/login')
  }

  return session
}

/**
 * Получает userId текущего пользователя
 * Если пользователь не авторизован - редирект на /login
 * @returns userId пользователя
 */
export async function getRequiredUserId(): Promise<string> {
  const session = await getRequiredSession()
  return session.user.id
}

/**
 * Проверяет, является ли пользователь владельцем ресурса
 * @param resourceOwnerId ID владельца ресурса
 * @param userId ID текущего пользователя
 * @returns true, если пользователь является владельцем
 */
export function isOwner(resourceOwnerId: string, userId: string): boolean {
  return resourceOwnerId === userId
}

/**
 * Проверяет доступ к приватному ресурсу
 * @param resourceOwnerId ID владельца ресурса
 * @param userId ID текущего пользователя
 * @throws Редирект на /login, если пользователь не авторизован
 * @throws Редирект на /dashboard, если доступ запрещён
 */
export async function checkPrivateResourceAccess(
  resourceOwnerId: string,
  userId?: string
) {
  if (!userId) {
    redirect('/login')
  }

  if (!isOwner(resourceOwnerId, userId)) {
    redirect('/dashboard')
  }
}

