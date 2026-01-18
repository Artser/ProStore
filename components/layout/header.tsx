import Link from 'next/link'
import { auth } from '@/auth'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Film, LogIn, LogOut, User } from 'lucide-react'
import { SignOutButton } from './sign-out-button'

/**
 * Header компонент для всех страниц
 * Отображает навигацию и информацию о пользователе
 */
export async function Header() {
  const session = await auth()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Лого и название */}
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Film className="h-6 w-6" />
          <span className="text-xl">FilmStore</span>
        </Link>

        {/* Навигация */}
        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/"
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            Главная
          </Link>
          <Link
            href="/dashboard/public"
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            Каталог
          </Link>
          {session?.user && (
            <Link
              href="/dashboard"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Мои фильмы
            </Link>
          )}
        </nav>

        {/* Авторизация / Профиль */}
        <div className="flex items-center gap-4">
          {session?.user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2">
                  {session.user.image ? (
                    <img
                      src={session.user.image}
                      alt={session.user.name || 'User'}
                      className="h-8 w-8 rounded-full"
                    />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-4 w-4" />
                    </div>
                  )}
                  <span className="hidden sm:inline">
                    {session.user.name || session.user.email}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href="/dashboard" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Личный кабинет
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <SignOutButton />
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild variant="default">
              <Link href="/login" className="flex items-center gap-2">
                <LogIn className="h-4 w-4" />
                Войти
              </Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}

