'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  MessageSquare,
  Star,
  History,
  Settings,
  Film as FilmIcon,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface SidebarItem {
  href: string
  label: string
  icon: React.ReactNode
}

const sidebarItems: SidebarItem[] = [
  { href: '/dashboard', label: 'Фильмы', icon: <FilmIcon className="h-5 w-5" /> },
  { href: '/dashboard/favorites', label: 'Избранное', icon: <Star className="h-5 w-5" /> },
  { href: '/dashboard/public', label: 'Публичные промты', icon: <MessageSquare className="h-5 w-5" /> },
  { href: '/dashboard/history', label: 'История', icon: <History className="h-5 w-5" /> },
  { href: '/dashboard/settings', label: 'Настройки', icon: <Settings className="h-5 w-5" /> },
]

interface DashboardSidebarProps {
  user: {
    name?: string | null
    email?: string | null
    image?: string | null
  }
}

/**
 * Боковая панель навигации для личного кабинета
 * Показывает аватар пользователя и меню навигации
 */
export function DashboardSidebar({ user }: DashboardSidebarProps) {
  const pathname = usePathname()

  return (
    <aside className="w-[280px] min-h-screen bg-gradient-to-b from-blue-50 to-blue-100/50 border-r border-blue-200/50 p-6 flex flex-col">
      {/* Аватар и имя пользователя */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          {user.image ? (
            <img
              src={user.image}
              alt={user.name || 'User'}
              className="w-12 h-12 rounded-full border-2 border-white shadow-sm"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-blue-200 flex items-center justify-center text-blue-700 font-semibold">
              {user.name?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase() || 'U'}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-gray-900 truncate">
              {user.name || 'Пользователь'}
            </p>
            {user.email && (
              <p className="text-xs text-gray-600 truncate">{user.email}</p>
            )}
          </div>
        </div>
      </div>

      {/* Навигационное меню */}
      <nav className="flex-1 space-y-1">
        {sidebarItems.map((item) => {
          const isActive = pathname === item.href || 
            (item.href !== '/dashboard' && pathname.startsWith(item.href))
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                isActive
                  ? "bg-blue-500 text-white shadow-sm"
                  : "text-gray-700 hover:bg-blue-50 hover:text-blue-700"
              )}
            >
              {item.icon}
              <span className="font-medium">{item.label}</span>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}

