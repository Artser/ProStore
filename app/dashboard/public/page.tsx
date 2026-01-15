import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { FilmsListWrapper } from '@/components/dashboard/films-list-wrapper'

/**
 * Страница "Публичные фильмы"
 * Показывает все публичные фильмы всех пользователей
 */
export default async function PublicFilmsPage({
  searchParams,
}: {
  searchParams: { search?: string; page?: string; sort?: 'popular' | 'recent' }
}) {
  const session = await auth()

  if (!session?.user?.id) {
    redirect('/login')
  }

  const userId = session.user.id
  const searchQuery = searchParams.search || ''
  const sort = searchParams.sort || 'recent' // По умолчанию сортировка по дате
  const page = parseInt(searchParams.page || '1')
  const pageSize = 10
  const skip = (page - 1) * pageSize

  // Построение фильтра поиска
  const searchFilter = searchQuery
    ? {
        OR: [
          { title: { contains: searchQuery, mode: 'insensitive' as const } },
          { content: { contains: searchQuery, mode: 'insensitive' as const } },
          {
            description: {
              contains: searchQuery,
              mode: 'insensitive' as const,
            },
          },
        ],
      }
    : {}

  // Для сортировки по популярности нужно получить все фильмы, отсортировать и применить пагинацию
  // Для сортировки по дате можно использовать orderBy в запросе
  const orderBy =
    sort === 'popular'
      ? undefined // Будем сортировать после получения данных
      : {
          createdAt: 'desc' as const,
        }

  // Получение публичных фильмов с лайками
  // Если сортировка по популярности - получаем больше данных для корректной сортировки
  const takeCount = sort === 'popular' ? 100 : pageSize // Для популярности берем больше, чтобы отсортировать правильно

  const [films, total] = await Promise.all([
    prisma.film.findMany({
      where: {
        isPublic: true,
        ...searchFilter,
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
          },
        },
        _count: true,
        likes: {
          select: {
            id: true,
            userId: true,
          },
        },
      } as any, // Временное решение: Prisma типы могут не обновиться сразу после добавления новой модели
      ...(orderBy ? { orderBy } : {}),
      ...(sort === 'popular' ? {} : { skip, take: pageSize }),
      ...(sort === 'popular' ? { take: takeCount } : {}),
    }),
    prisma.film.count({
      where: {
        isPublic: true,
        ...searchFilter,
      },
    }),
  ])

  // Преобразуем данные для передачи в компонент
  let filmsWithLikes = films.map((film: any) => {
    // Проверяем, лайкнул ли текущий пользователь этот фильм
    const likedByMe = film.likes?.some((like: any) => like.userId === userId) || false
    
    return {
      id: film.id,
      title: film.title,
      content: film.content,
      description: film.description,
      isPublic: film.isPublic,
      isFavorite: film.isFavorite,
      createdAt: film.createdAt,
      owner: film.owner,
      likesCount: film._count?.likes || 0,
      likedByMe,
    }
  })

  // Сортировка по популярности (если выбрана)
  if (sort === 'popular') {
    filmsWithLikes = filmsWithLikes.sort((a, b) => {
      // Сначала по количеству лайков (убывание)
      if (b.likesCount !== a.likesCount) {
        return (b.likesCount || 0) - (a.likesCount || 0)
      }
      // Если лайков одинаково - по дате (убывание)
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })
    // Применяем пагинацию после сортировки
    filmsWithLikes = filmsWithLikes.slice(skip, skip + pageSize)
  }

  const totalPages = Math.ceil(total / pageSize)

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Публичные фильмы
        </h1>
        <p className="text-gray-600">
          Все опубликованные фильмы от пользователей сообщества
        </p>
      </div>

      <FilmsListWrapper
        films={filmsWithLikes}
        currentUserId={userId}
        searchQuery={searchQuery}
        page={page}
        totalPages={totalPages}
        total={total}
        sort={sort}
      />
    </div>
  )
}

