import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

/**
 * POST /api/films/[id]/like
 * Toggle лайка для публичного фильма
 * 
 * Требования:
 * - Пользователь должен быть авторизован
 * - Фильм должен существовать и быть публичным
 * - Один пользователь = один лайк на фильм (уникальный индекс)
 * 
 * Возвращает:
 * { liked: boolean, likesCount: number }
 */
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Проверка авторизации
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Необходима авторизация' },
        { status: 401 }
      )
    }

    const userId = session.user.id
    const filmId = params.id

    // Проверка существования фильма и его публичности
    const film = await prisma.film.findUnique({
      where: { id: filmId },
      select: { id: true, isPublic: true },
    })

    if (!film) {
      return NextResponse.json(
        { error: 'Фильм не найден' },
        { status: 404 }
      )
    }

    if (!film.isPublic) {
      return NextResponse.json(
        { error: 'Можно лайкать только публичные фильмы' },
        { status: 403 }
      )
    }

    // Проверка существования лайка
    const existingLike = await prisma.like.findUnique({
      where: {
        userId_filmId: {
          userId,
          filmId,
        },
      },
    })

    let liked: boolean
    if (existingLike) {
      // Удаляем лайк (toggle off)
      await prisma.like.delete({
        where: {
          id: existingLike.id,
        },
      })
      liked = false
    } else {
      // Создаём лайк (toggle on)
      await prisma.like.create({
        data: {
          userId,
          filmId,
        },
      })
      liked = true
    }

    // Подсчёт общего количества лайков
    const likesCount = await prisma.like.count({
      where: { filmId },
    })

    return NextResponse.json({
      liked,
      likesCount,
    })
  } catch (error) {
    console.error('Ошибка при обработке лайка:', error)
    
    // Обработка ошибки уникального индекса (на случай race condition)
    if (error instanceof Error && error.message.includes('Unique constraint')) {
      // Если произошла гонка, просто возвращаем текущее состояние
      const session = await auth()
      if (session?.user?.id) {
        const existingLike = await prisma.like.findUnique({
          where: {
            userId_filmId: {
              userId: session.user.id,
              filmId: params.id,
            },
          },
        })
        const likesCount = await prisma.like.count({
          where: { filmId: params.id },
        })
        return NextResponse.json({
          liked: !!existingLike,
          likesCount,
        })
      }
    }

    return NextResponse.json(
      { error: 'Ошибка сервера. Попробуйте позже.' },
      { status: 500 }
    )
  }
}



