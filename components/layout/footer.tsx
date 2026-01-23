import Link from 'next/link';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-background">
      <div className="container flex flex-col items-center justify-between gap-4 py-6 md:h-16 md:flex-row md:py-0">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            © {currentYear} FilmStore. Все права защищены.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/policy"
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            Политика
          </Link>
          <Link
            href="/contacts"
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            Контакты
          </Link>
        </div>
      </div>
    </footer>
  );
}




