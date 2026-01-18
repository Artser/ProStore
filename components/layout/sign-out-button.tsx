'use client'

import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'

/**
 * Кнопка выхода из аккаунта
 * Client component для обработки выхода
 */
export function SignOutButton() {
  const router = useRouter()

  const handleSignOut = async () => {
    try {
      const response = await fetch('/api/auth/signout', {
        method: 'POST',
      })
      if (response.ok) {
        router.push('/')
        router.refresh()
      }
    } catch (error) {
      console.error('Ошибка при выходе:', error)
    }
  }

  return (
    <DropdownMenuItem onClick={handleSignOut}>
      <LogOut className="h-4 w-4 mr-2" />
      Выйти
    </DropdownMenuItem>
  )
}

