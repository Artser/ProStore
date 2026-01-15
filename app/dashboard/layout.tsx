import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { DashboardSidebar } from '@/components/dashboard/dashboard-sidebar'
import { signOut } from '@/auth'

/**
 * Layout для всех страниц dashboard
 * Обеспечивает общий layout с сайдбаром и проверкой авторизации
 */
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  if (!session?.user) {
    redirect('/login')
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Боковая панель */}
      <DashboardSidebar user={session.user} />

      {/* Основной контент */}
      <main className="flex-1 bg-white">
        {children}
      </main>
    </div>
  )
}



