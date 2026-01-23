import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface FilmCardProps {
  film: {
    id: string;
    title: string;
    description: string | null;
    createdAt: Date;
    owner: {
      name: string | null;
    };
    tags: Array<{
      tag: {
        name: string;
      };
    }>;
    _count: {
      votes: number;
    };
    likedByMe?: boolean;
  };
  showLikeButton?: boolean;
}

export function FilmCard({ film, showLikeButton = false }: FilmCardProps) {
  const timeAgo = formatDistanceToNow(new Date(film.createdAt), {
    addSuffix: true,
  });

  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <CardTitle className="line-clamp-2">{film.title}</CardTitle>
        <CardDescription>
          Автор: {film.owner.name || 'Неизвестно'} • {timeAgo}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        {film.description && (
          <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
            {film.description}
          </p>
        )}
        {film.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {film.tags.map((filmTag) => (
              <Badge key={filmTag.tag.name} variant="secondary">
                {filmTag.tag.name}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          {showLikeButton && (
            <Button
              variant="ghost"
              size="icon"
              className={film.likedByMe ? 'text-red-500' : ''}
            >
              <Heart
                className={`h-4 w-4 ${film.likedByMe ? 'fill-current' : ''}`}
              />
            </Button>
          )}
          <span className="text-sm text-muted-foreground">
            {film._count.votes} {film._count.votes === 1 ? 'лайк' : 'лайков'}
          </span>
        </div>
        <Button asChild variant="outline">
          <Link href={`/prompts/${film.id}`}>Открыть</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

