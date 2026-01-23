import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { FilmCard } from '@/components/film-card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Separator } from '@/components/ui/separator';

async function getRecentFilms() {
  return await prisma.film.findMany({
    where: {
      visibility: 'PUBLIC',
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: 20,
    include: {
      owner: {
        select: {
          name: true,
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
      _count: {
        select: {
          votes: true,
        },
      },
    },
  });
}

async function getPopularFilms() {
  const films = await prisma.film.findMany({
    where: {
      visibility: 'PUBLIC',
    },
    include: {
      owner: {
        select: {
          name: true,
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
      _count: {
        select: {
          votes: true,
        },
      },
    },
  });

  // Сортируем по количеству лайков
  return films
    .sort((a, b) => b._count.votes - a._count.votes)
    .slice(0, 20);
}

async function getLikedFilmIds(userId: string, filmIds: string[]) {
  if (filmIds.length === 0) return new Set<string>();
  
  const votes = await prisma.vote.findMany({
    where: {
      userId,
      promptId: {
        in: filmIds,
      },
    },
    select: {
      promptId: true,
    },
  });

  return new Set(votes.map((v) => v.promptId));
}

export default async function HomePage() {
  const session = await getSession();
  const [recentFilms, popularFilms] = await Promise.all([
    getRecentFilms(),
    getPopularFilms(),
  ]);

  // Получаем список лайкнутых фильмов для авторизованного пользователя
  let likedFilmIds = new Set<string>();
  if (session?.user?.id) {
    const allFilmIds = [
      ...recentFilms.map((f) => f.id),
      ...popularFilms.map((f) => f.id),
    ];
    likedFilmIds = await getLikedFilmIds(session.user.id, allFilmIds);
  }

  const enrichFilms = (films: typeof recentFilms) => {
    return films.map((film) => ({
      ...film,
      likedByMe: session?.user?.id ? likedFilmIds.has(film.id) : false,
    }));
  };

  const enrichedRecentFilms = enrichFilms(recentFilms);
  const enrichedPopularFilms = enrichFilms(popularFilms);

  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="border-b bg-gradient-to-b from-background to-muted/20 py-12 md:py-24">
        <div className="container px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight md:text-6xl">
              Добро пожаловать в FilmStore
            </h1>
            <p className="mt-4 text-lg text-muted-foreground md:text-xl">
              Откройте для себя коллекцию лучших промптов и фильмов от
              сообщества
            </p>
            <div className="mt-8">
              {session ? (
                <Button asChild size="lg">
                  <Link href="/my-prompts/new">Добавить фильм</Link>
                </Button>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <Button asChild size="lg">
                    <Link href="/login">Добавить фильм</Link>
                  </Button>
                  <p className="text-sm text-muted-foreground">
                    Войдите, чтобы добавлять фильмы
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Recent Films Section */}
      <section className="container py-12 px-4">
        <div className="mb-8">
          <h2 className="text-3xl font-bold tracking-tight">Новые</h2>
          <p className="mt-2 text-muted-foreground">
            Последние добавленные публичные фильмы
          </p>
        </div>
        {enrichedRecentFilms.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {enrichedRecentFilms.map((film) => (
              <FilmCard
                key={film.id}
                film={film}
                showLikeButton={!!session}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-dashed p-12 text-center">
            <p className="text-muted-foreground">
              Пока нет публичных фильмов
            </p>
          </div>
        )}
      </section>

      <Separator />

      {/* Popular Films Section */}
      <section className="container py-12 px-4">
        <div className="mb-8">
          <h2 className="text-3xl font-bold tracking-tight">Популярные</h2>
          <p className="mt-2 text-muted-foreground">
            Самые популярные фильмы по количеству лайков
          </p>
        </div>
        {enrichedPopularFilms.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {enrichedPopularFilms.map((film) => (
              <FilmCard
                key={film.id}
                film={film}
                showLikeButton={!!session}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-dashed p-12 text-center">
            <p className="text-muted-foreground">
              Пока нет популярных фильмов
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
