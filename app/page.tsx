import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { Button } from '@/components/ui/button'
import { FilmCardPublic } from '@/components/film-card-public'
import Link from 'next/link'
import { Plus, TrendingUp, Clock } from 'lucide-react'

/**
 * Главная страница FilmStore
 * Показывает Hero-блок и два раздела: "Новые" и "Популярные" фильмы
 */
export default async function HomePage() {
  const session = await auth()
  const userId = session?.user?.id || null

  // Количество фильмов для каждого раздела
  const recentFilmsLimit = 12
  const popularFilmsLimit = 12

  // Получаем новые фильмы (сортировка по createdAt desc)
  const recentFilms = await prisma.film.findMany({
    where: {
      isPublic: true,
    },
    include: {
      owner: {
        select: {
          id: true,
          name: true,
        },
      },
      _count: {
        select: {
          likes: true,
        },
      },
      tags: {
        include: {
          tag: {
            select: {
              name: true,
            },
          },
        },
      },
      ...(userId
        ? {
            likes: {
              where: {
                userId,
              },
              select: {
                id: true,
              },
            },
          }
        : {}),
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: recentFilmsLimit,
  })

  // Получаем все публичные фильмы для сортировки по популярности
  // (нужно получить достаточно данных для корректной сортировки)
  const allPublicFilms = await prisma.film.findMany({
    where: {
      isPublic: true,
    },
    include: {
      owner: {
        select: {
          id: true,
          name: true,
        },
      },
      _count: {
        select: {
          likes: true,
        },
      },
      tags: {
        include: {
          tag: {
            select: {
              name: true,
            },
          },
        },
      },
      ...(userId
        ? {
            likes: {
              where: {
                userId,
              },
              select: {
                id: true,
              },
            },
          }
        : {}),
    },
  })

  // Сортируем по популярности (количество лайков)
  const popularFilms = allPublicFilms
    .sort((a, b) => {
      const likesA = a._count?.likes || 0
      const likesB = b._count?.likes || 0
      if (likesB !== likesA) {
        return likesB - likesA
      }
      // Если лайков одинаково - сортируем по дате
      return (
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
    })
    .slice(0, popularFilmsLimit)

  // Преобразуем данные для компонента FilmCardPublic
  const transformFilm = (film: any) => ({
    id: film.id,
    title: film.title,
    content: film.content,
    description: film.description,
    createdAt: film.createdAt,
    likesCount: film._count?.likes || 0,
    likedByMe: userId ? (film.likes?.length > 0 || false) : undefined,
    owner: film.owner,
    tags: film.tags,
  })

  const recentFilmsData = recentFilms.map(transformFilm)
  const popularFilmsData = popularFilms.map(transformFilm)

  return (
    <div className="min-h-screen bg-background">
      {/* Hero-блок */}
      <section className="border-b bg-gradient-to-b from-background to-muted/20 py-16 md:py-24">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col items-center text-center gap-6 max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              Добро пожаловать в FilmStore
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Откройте для себя коллекцию удивительных фильмов. Изучайте, делитесь
              и находите новые любимые истории от сообщества.
            </p>
            {session?.user ? (
              <Button asChild size="lg" className="gap-2">
                <Link href="/dashboard">
                  <Plus className="h-5 w-5" />
                  Добавить фильм
                </Link>
              </Button>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <Button asChild size="lg" className="gap-2">
                  <Link href="/login">
                    <Plus className="h-5 w-5" />
                    Добавить фильм
                  </Link>
                </Button>
                <p className="text-sm text-muted-foreground">
                  Войдите, чтобы добавлять фильмы
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Раздел "Новые фильмы" */}
      <section className="py-12 md:py-16">
        <div className="container px-4 mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Clock className="h-6 w-6 text-primary" />
              <h2 className="text-2xl md:text-3xl font-bold">Новые</h2>
            </div>
            <Button asChild variant="outline" size="sm">
              <Link href="/dashboard/public?sort=recent">
                Смотреть все
              </Link>
            </Button>
          </div>

          {recentFilmsData.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p>Пока нет новых фильмов</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentFilmsData.map((film) => (
                <FilmCardPublic key={film.id} film={film} userId={userId} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Раздел "Популярные фильмы" */}
      <section className="py-12 md:py-16 bg-muted/30">
        <div className="container px-4 mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-6 w-6 text-primary" />
              <h2 className="text-2xl md:text-3xl font-bold">Популярные</h2>
            </div>
            <Button asChild variant="outline" size="sm">
              <Link href="/dashboard/public?sort=popular">
                Смотреть все
              </Link>
            </Button>
          </div>

          {popularFilmsData.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p>Пока нет популярных фильмов</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {popularFilmsData.map((film) => (
                <FilmCardPublic key={film.id} film={film} userId={userId} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
