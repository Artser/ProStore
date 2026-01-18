import Link from 'next/link'
import { MessageSquare, ThumbsUp } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { LikeButton } from '@/components/dashboard/like-button'
import { cn } from '@/lib/utils'

interface FilmCardPublicProps {
  film: {
    id: string
    title: string
    content: string
    description?: string | null
    createdAt: Date
    likesCount: number
    likedByMe?: boolean
    owner: {
      id: string
      name?: string | null
    }
    tags?: Array<{ tag: { name: string } }>
  }
  userId?: string | null // Опционально, если пользователь не авторизован
}

/**
 * Упрощенная карточка фильма для главной страницы
 * Без кнопок редактирования/удаления
 */
export function FilmCardPublic({ film, userId }: FilmCardPublicProps) {
  // Предпросмотр контента
  const preview = film.description || film.content
  const previewLines = preview.split('\n').slice(0, 2).join(' ')
  const displayPreview = previewLines.length > 150
    ? previewLines.substring(0, 150) + '...'
    : previewLines

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex flex-col gap-4">
          {/* Заголовок и автор */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
                {film.title}
              </h3>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span>Автор: {film.owner.name || 'Неизвестно'}</span>
                <span>•</span>
                <span>{formatDate(film.createdAt)}</span>
              </div>
            </div>
            <div className="flex-shrink-0">
              <MessageSquare className="h-6 w-6 text-gray-400" />
            </div>
          </div>

          {/* Описание */}
          <p className="text-sm text-gray-700 line-clamp-3">{displayPreview}</p>

          {/* Теги (если есть) */}
          {film.tags && film.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {film.tags.slice(0, 5).map((filmTag, idx) => (
                <Badge key={idx} variant="secondary" className="text-xs">
                  {filmTag.tag.name}
                </Badge>
              ))}
            </div>
          )}

          {/* Нижняя панель: лайки и кнопка "Открыть" */}
          <div className="flex items-center justify-between pt-2 border-t">
            <div className="flex items-center gap-4">
              {/* Кнопка лайка - только для авторизованных */}
              {userId ? (
                <LikeButton
                  filmId={film.id}
                  initialLiked={film.likedByMe || false}
                  initialCount={film.likesCount}
                />
              ) : (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <ThumbsUp className="h-4 w-4" />
                  <span>{film.likesCount}</span>
                </div>
              )}
            </div>
            <Button asChild variant="outline" size="sm">
              <Link href="/dashboard/public">Открыть</Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

