'use server'

import { revalidatePath } from 'next/cache'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { createFilmSchema, updateFilmSchema } from '@/lib/validations/film'
import { redirect } from 'next/navigation'

/**
 * Server Action: Создание нового фильма
 * Проверяет авторизацию и создаёт фильм для текущего пользователя
 */
export async function createFilm(data: {
  title: string
  content: string
  description?: string
  isPublic: boolean
}) {
  const session = await auth()
  
  if (!session?.user?.id) {
    redirect('/login')
  }

  // Валидация данных
  const validated = createFilmSchema.parse(data)
  
  // Получаем первую категорию для дефолта (или создаём, если нет)
  let category = await prisma.category.findFirst()
  if (!category) {
    category = await prisma.category.create({
      data: { category: 'Без категории' },
    })
  }

  // Создаём фильм
  const film = await prisma.film.create({
    data: {
      title: validated.title,
      content: validated.content,
      description: validated.description || null,
      isPublic: validated.isPublic,
      ownerId: session.user.id,
      categoryId: category.id,
      visibility: validated.isPublic ? 'PUBLIC' : 'PRIVATE',
    },
  })

  // Обновляем кэш страниц
  revalidatePath('/dashboard')
  revalidatePath('/dashboard/public')
  revalidatePath('/dashboard/favorites')

  return { success: true, film }
}

/**
 * Server Action: Обновление фильма
 * Проверяет, что пользователь является владельцем
 */
export async function updateFilm(data: {
  id: string
  title: string
  content: string
  description?: string
  isPublic: boolean
}) {
  const session = await auth()
  
  if (!session?.user?.id) {
    redirect('/login')
  }

  // Валидация
  const validated = updateFilmSchema.parse(data)

  // Проверка прав доступа
  const existingFilm = await prisma.film.findUnique({
    where: { id: validated.id },
  })

  if (!existingFilm) {
    return { success: false, error: 'Фильм не найден' }
  }

  if (existingFilm.ownerId !== session.user.id) {
    return { success: false, error: 'Нет прав на редактирование' }
  }

  // Обновляем фильм
  const film = await prisma.film.update({
    where: { id: validated.id },
    data: {
      title: validated.title,
      content: validated.content,
      description: validated.description || null,
      isPublic: validated.isPublic,
      visibility: validated.isPublic ? 'PUBLIC' : 'PRIVATE',
    },
  })

  revalidatePath('/dashboard')
  revalidatePath('/dashboard/public')
  revalidatePath('/dashboard/favorites')

  return { success: true, film }
}

/**
 * Server Action: Удаление фильма
 * Проверяет права доступа
 */
export async function deleteFilm(id: string) {
  const session = await auth()
  
  if (!session?.user?.id) {
    redirect('/login')
  }

  // Проверка прав доступа
  const film = await prisma.film.findUnique({
    where: { id },
  })

  if (!film) {
    return { success: false, error: 'Фильм не найден' }
  }

  if (film.ownerId !== session.user.id) {
    return { success: false, error: 'Нет прав на удаление' }
  }

  // Удаляем фильм
  await prisma.film.delete({
    where: { id },
  })

  revalidatePath('/dashboard')
  revalidatePath('/dashboard/public')
  revalidatePath('/dashboard/favorites')

  return { success: true }
}

/**
 * Server Action: Переключение публичности
 */
export async function togglePublic(id: string) {
  const session = await auth()
  
  if (!session?.user?.id) {
    redirect('/login')
  }

  const film = await prisma.film.findUnique({
    where: { id },
  })

  if (!film) {
    return { success: false, error: 'Фильм не найден' }
  }

  if (film.ownerId !== session.user.id) {
    return { success: false, error: 'Нет прав' }
  }

  const updated = await prisma.film.update({
    where: { id },
    data: {
      isPublic: !film.isPublic,
      visibility: !film.isPublic ? 'PUBLIC' : 'PRIVATE',
    },
  })

  revalidatePath('/dashboard')
  revalidatePath('/dashboard/public')
  revalidatePath('/dashboard/favorites')

  return { success: true, film: updated }
}

/**
 * Server Action: Переключение избранного
 */
export async function toggleFavorite(id: string) {
  const session = await auth()
  
  if (!session?.user?.id) {
    redirect('/login')
  }

  const film = await prisma.film.findUnique({
    where: { id },
  })

  if (!film) {
    return { success: false, error: 'Фильм не найден' }
  }

  // Проверяем права: владелец может изменять своё избранное
  // Для упрощения делаем избранное только для владельца
  if (film.ownerId !== session.user.id) {
    return { success: false, error: 'Нет прав' }
  }

  const updated = await prisma.film.update({
    where: { id },
    data: {
      isFavorite: !film.isFavorite,
    },
  })

  revalidatePath('/dashboard')
  revalidatePath('/dashboard/public')
  revalidatePath('/dashboard/favorites')

  return { success: true, film: updated }
}





