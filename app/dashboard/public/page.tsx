import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { FilmsListWrapper } from '@/components/dashboard/films-list-wrapper'

/**
 * Страница "Публичные промты"
 * Показывает все публичные промты всех пользователей
 */
export default async function PublicFilmsPage({
  searchParams,
}: {
  searchParams: { search?: string; page?: string }
}) {
  const session = await auth()

  if (!session?.user?.id) {
    redirect('/login')
  }

  const userId = session.user.id
  const searchQuery = searchParams.search || ''
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

  // Получение публичных фильмов
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
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip,
      take: pageSize,
    }),
    prisma.film.count({
      where: {
        isPublic: true,
        ...searchFilter,
      },
    }),
  ])

  const totalPages = Math.ceil(total / pageSize)

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Публичные промты
        </h1>
        <p className="text-gray-600">
          Все опубликованные промты от пользователей сообщества
        </p>
      </div>

      <FilmsListWrapper
        films={films}
        currentUserId={userId}
        searchQuery={searchQuery}
        page={page}
        totalPages={totalPages}
        total={total}
      />
    </div>
  )
}

