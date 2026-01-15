'use client'

import { MessageSquare, Star, Pencil, Trash2, Globe, Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useState } from 'react'
import { togglePublic, toggleFavorite, deleteFilm } from '@/app/actions/film-actions'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { LikeButton } from './like-button'

interface FilmCardProps {
  film: {
    id: string
    title: string
    content: string
    description?: string | null
    isPublic: boolean
    isFavorite: boolean
    createdAt: Date
    likesCount?: number
    likedByMe?: boolean
    owner: {
      id: string
      name?: string | null
    }
  }
  currentUserId: string
  onEdit?: (id: string) => void
  showLikeButton?: boolean // Показывать ли кнопку лайка (только для публичных фильмов)
}

/**
 * Карточка фильма для списка
 * Отображает информацию о фильме и действия
 */
export function FilmCard({ film, currentUserId, onEdit, showLikeButton = false }: FilmCardProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()
  const isOwner = film.owner.id === currentUserId

  // Предпросмотр контента (первые 2 строки)
  const preview = film.description || film.content
  const previewLines = preview.split('\n').slice(0, 2).join(' ')
  const displayPreview = previewLines.length > 100 
    ? previewLines.substring(0, 100) + '...' 
    : previewLines

  const handleToggleFavorite = async () => {
    if (!isOwner) return
    await toggleFavorite(film.id)
    router.refresh()
  }

  const handleTogglePublic = async () => {
    if (!isOwner) return
    await togglePublic(film.id)
    router.refresh()
  }

  const handleDelete = async () => {
    if (!isOwner || !confirm('Вы уверены, что хотите удалить этот фильм?')) {
      return
    }
    setIsDeleting(true)
    await deleteFilm(film.id)
    router.refresh()
    setIsDeleting(false)
  }

  return (
    <div
      className={cn(
        "rounded-lg border bg-white p-4 shadow-sm transition-shadow hover:shadow-md",
        isDeleting && "opacity-50 pointer-events-none"
      )}
    >
      <div className="flex items-start gap-4">
        {/* Иконка чата */}
        <div className="flex-shrink-0 mt-1">
          <MessageSquare className="h-5 w-5 text-gray-400" />
        </div>

        {/* Основной контент */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 mb-1">{film.title}</h3>
          <p className="text-sm text-gray-600 line-clamp-2">{displayPreview}</p>
          <p className="text-xs text-gray-400 mt-2">
            {new Date(film.createdAt).toLocaleDateString('ru-RU')}
          </p>
        </div>

        {/* Действия */}
        <div className="flex-shrink-0 flex items-center gap-2">
          {/* Кнопка лайка - только для публичных фильмов */}
          {showLikeButton && film.isPublic && (
            <LikeButton
              filmId={film.id}
              initialLiked={film.likedByMe || false}
              initialCount={film.likesCount || 0}
            />
          )}

          {/* Звезда (избранное) - только для владельца */}
          {isOwner && (
            <button
              onClick={handleToggleFavorite}
              className={cn(
                "p-2 rounded-md transition-colors",
                film.isFavorite
                  ? "text-yellow-500 hover:bg-yellow-50"
                  : "text-gray-400 hover:bg-gray-100"
              )}
            >
              <Star className={cn("h-5 w-5", film.isFavorite && "fill-current")} />
            </button>
          )}

          {/* Меню действий */}
          {isOwner && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                  </svg>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit?.(film.id)}>
                  <Pencil className="h-4 w-4 mr-2" />
                  Редактировать
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleTogglePublic}>
                  {film.isPublic ? (
                    <>
                      <Lock className="h-4 w-4 mr-2" />
                      Сделать приватным
                    </>
                  ) : (
                    <>
                      <Globe className="h-4 w-4 mr-2" />
                      Опубликовать
                    </>
                  )}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleDelete}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Удалить
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* Иконка публичности для всех */}
          <div className="flex-shrink-0" title={film.isPublic ? "Публичный" : "Приватный"}>
            {film.isPublic ? (
              <Globe className="h-4 w-4 text-green-500" />
            ) : (
              <Lock className="h-4 w-4 text-gray-400" />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

