import Link from 'next/link'

/**
 * Footer компонент для всех страниц
 * Отображает копирайт и ссылки на политику и контакты
 */
export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t bg-background">
      <div className="container px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {currentYear} FilmStore. Все права защищены.
          </p>
          <nav className="flex items-center gap-6">
            <Link
              href="/policy"
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Политика
            </Link>
            <Link
              href="/contacts"
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Контакты
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  )
}

