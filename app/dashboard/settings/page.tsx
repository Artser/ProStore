import { auth } from '@/auth'
import { redirect } from 'next/navigation'

/**
 * Страница "Настройки"
 * Заглушка для будущей функциональности
 */
export default async function SettingsPage() {
  const session = await auth()

  if (!session?.user?.id) {
    redirect('/login')
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Настройки
        </h1>
      </div>

      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">
          Настройки профиля будут доступны в ближайшее время
        </p>
      </div>
    </div>
  )
}



