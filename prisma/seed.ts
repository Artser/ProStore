import { PrismaClient, Visibility } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Начинаем seeding...')

  // Очищаем существующие данные (в правильном порядке из-за foreign keys)
  await prisma.vote.deleteMany()
  await prisma.filmTag.deleteMany()
  await prisma.film.deleteMany()
  await prisma.note.deleteMany()
  await prisma.tag.deleteMany()
  await prisma.category.deleteMany()
  await prisma.user.deleteMany()

  // Создаем тестового пользователя
  const user = await prisma.user.create({
    data: {
      email: 'test@example.com',
      name: 'Тестовый пользователь',
    },
  })
  console.log(`Создан пользователь: ${user.email}`)

  // Создаем категорию
  const category = await prisma.category.create({
    data: {
      category: 'Тестовая категория',
    },
  })
  console.log(`Создана категория: ${category.category}`)

  // Создаем тестовый промт (Film)
  const film = await prisma.film.create({
    data: {
      title: 'Тестовый промт',
      content: 'Это содержимое тестового промта для проверки работы системы.',
      description: 'Описание тестового промта',
      ownerId: user.id,
      categoryId: category.id,
      visibility: Visibility.PUBLIC,
      publishedAt: new Date(),
    },
  })
  console.log(`Создан промт: ${film.title}`)

  // Создаем тег
  const tag = await prisma.tag.create({
    data: {
      name: 'тестовый',
    },
  })
  console.log(`Создан тег: ${tag.name}`)

  // Связываем промт с тегом
  await prisma.filmTag.create({
    data: {
      filmId: film.id,
      tagId: tag.id,
    },
  })
  console.log('Промт связан с тегом')

  // Создаем голос (Vote) от пользователя за промт
  const vote = await prisma.vote.create({
    data: {
      userId: user.id,
      promptId: film.id,
      value: 1,
    },
  })
  console.log(`Создан голос: значение ${vote.value}`)

  // Создаем заметку для пользователя
  const note = await prisma.note.create({
    data: {
      ownerId: user.id,
      title: 'Тестовая заметка',
    },
  })
  console.log(`Создана заметка: ${note.title}`)

  console.log('\n✅ Seeding завершен успешно!')
  console.log(`\nСоздано:`)
  console.log(`- Пользователей: 1`)
  console.log(`- Промтов: 1`)
  console.log(`- Голосов: 1`)
  console.log(`- Заметок: 1`)
  console.log(`- Категорий: 1`)
  console.log(`- Тегов: 1`)
}

main()
  .catch((e) => {
    console.error('Ошибка при seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
