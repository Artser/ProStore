import { auth } from '@/auth'
import { redirect } from 'next/navigation'

/**
 * Главная страница
 * Редиректит на /dashboard если пользователь авторизован, иначе на /login
 */
export default async function Home() {
  const session = await auth()

  // Если пользователь авторизован - редирект на dashboard
  if (session?.user) {
    redirect('/dashboard')
  }

  // Если не авторизован - редирект на login
  redirect('/login')
}

