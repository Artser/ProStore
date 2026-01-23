import Link from 'next/link';
import { Film } from 'lucide-react';

export function Logo() {
  return (
    <Link href="/" className="flex items-center space-x-2.5 hover:opacity-80 transition-opacity">
      {/* Иконка плёнки из lucide-react */}
      <Film className="h-6 w-6" />
      {/* Текст FilmStore */}
      <span className="text-xl font-bold tracking-tight">FilmStore</span>
    </Link>
  );
}

