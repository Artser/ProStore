'use client'

import { useState } from 'react'
import { FilmCard } from './film-card'
import { FilmDialog } from './film-dialog'
import { SearchInput } from './search-input'
import { Button } from '@/components/ui/button'
import { Plus, ChevronLeft, ChevronRight, TrendingUp, Clock } from 'lucide-react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'

interface Film {
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

interface FilmsListProps {
  films: Film[]
  currentUserId: string
  searchQuery?: string
  page?: number
  totalPages?: number
  total?: number
  sort?: 'popular' | 'recent'
}

/**
 * Список фильмов с пагинацией и диалогом создания/редактирования
 */
export function FilmsList({
  films,
  currentUserId,
  searchQuery = '',
  page = 1,
  totalPages = 1,
  total = 0,
  sort = 'recent',
}: FilmsListProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingFilm, setEditingFilm] = useState<Film | null>(null)

  const handleEdit = (filmId: string) => {
    const film = films.find((f) => f.id === filmId)
    if (film) {
      setEditingFilm(film)
      setDialogOpen(true)
    }
  }

  const handleCreate = () => {
    setEditingFilm(null)
    setDialogOpen(true)
  }

  const handleSearch = (query: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (query) {
      params.set('search', query)
    } else {
      params.delete('search')
    }
    params.set('page', '1')
    router.push(`${pathname}?${params.toString()}`)
  }

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', newPage.toString())
    router.push(`${pathname}?${params.toString()}`)
  }

  const handleSortChange = (newSort: 'popular' | 'recent') => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('sort', newSort)
    params.set('page', '1') // Сброс страницы при смене сортировки
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <>
      {/* Поиск, сортировка и кнопка создания */}
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex items-center gap-4">
          <div className="flex-1 max-w-md">
            <SearchInput
              onSearch={handleSearch}
              placeholder="Поиск по названию или содержимому..."
            />
          </div>
          <Button onClick={handleCreate}>
            <Plus className="h-4 w-4 mr-2" />
            Новый фильм
          </Button>
        </div>
        
        {/* Переключатель сортировки (только для публичных фильмов) */}
        {pathname?.includes('/public') && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Сортировка:</span>
            <Button
              variant={sort === 'popular' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleSortChange('popular')}
            >
              <TrendingUp className="h-4 w-4 mr-2" />
              По популярности
            </Button>
            <Button
              variant={sort === 'recent' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleSortChange('recent')}
            >
              <Clock className="h-4 w-4 mr-2" />
              По дате
            </Button>
          </div>
        )}
      </div>

      {/* Пустое состояние */}
      {films.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg mb-4">
            {searchQuery
              ? 'Ничего не найдено'
              : 'У вас пока нет фильмов — создайте первый'}
          </p>
          {!searchQuery && (
            <Button onClick={handleCreate}>
              <Plus className="h-4 w-4 mr-2" />
              Создать фильм
            </Button>
          )}
        </div>
      ) : (
        <>
          {/* Список фильмов */}
          <div className="space-y-4 mb-8">
            {films.map((film) => (
              <FilmCard
                key={film.id}
                film={film}
                currentUserId={currentUserId}
                onEdit={handleEdit}
                showLikeButton={pathname?.includes('/public')}
              />
            ))}
          </div>

          {/* Пагинация */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Показано {(page - 1) * 10 + 1} - {Math.min(page * 10, total)} из {total}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm text-gray-600">
                  Страница {page} из {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page >= totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Диалоги создания и редактирования */}
      <FilmDialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open)
          if (!open) setEditingFilm(null)
        }}
        film={editingFilm}
      />
    </>
  )
}

