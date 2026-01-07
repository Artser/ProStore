import { PrismaClient, Visibility } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🧪 Запуск тестового скрипта проверки...\n')

  try {
    // Создаем тестового пользователя
    const user = await prisma.user.upsert({
      where: { email: 'test@example.com' },
      update: {},
      create: {
        email: 'test@example.com',
        name: 'Тестовый пользователь',
      },
    })
    console.log(`✅ Пользователь создан/найден: ${user.email} (ID: ${user.id})`)

    // Создаем или находим категорию
    const category = await prisma.category.upsert({
      where: { category: 'Тестовая категория' },
      update: {},
      create: {
        category: 'Тестовая категория',
      },
    })
    console.log(`✅ Категория создана/найдена: ${category.category} (ID: ${category.id})`)

    // Создаем тестовый промт
    const film = await prisma.film.create({
      data: {
        title: 'Тестовый промт для проверки',
        content: 'Это содержимое тестового промта. Система работает корректно!',
        description: 'Описание тестового промта',
        ownerId: user.id,
        categoryId: category.id,
        visibility: Visibility.PUBLIC,
        publishedAt: new Date(),
      },
    })
    console.log(`✅ Промт создан: "${film.title}" (ID: ${film.id})`)

    // Создаем голос за промт
    const vote = await prisma.vote.upsert({
      where: {
        userId_promptId: {
          userId: user.id,
          promptId: film.id,
        },
      },
      update: {
        value: 1,
      },
      create: {
        userId: user.id,
        promptId: film.id,
        value: 1,
      },
    })
    console.log(`✅ Голос создан/обновлен: значение ${vote.value} (ID: ${vote.id})`)

    // Проверяем связи
    const filmWithRelations = await prisma.film.findUnique({
      where: { id: film.id },
      include: {
        owner: true,
        category: true,
        votes: {
          include: {
            user: true,
          },
        },
      },
    })

    console.log('\n📊 Проверка связей:')
    console.log(`   Промт принадлежит пользователю: ${filmWithRelations?.owner.email}`)
    console.log(`   Категория промта: ${filmWithRelations?.category.category}`)
    console.log(`   Количество голосов: ${filmWithRelations?.votes.length}`)
    if (filmWithRelations?.votes.length) {
      console.log(`   Голос от: ${filmWithRelations.votes[0].user.email}`)
    }

    console.log('\n✅ Тестовый скрипт выполнен успешно!')
    console.log('\n📝 Созданные данные:')
    console.log(`   - Пользователь: ${user.email}`)
    console.log(`   - Промт: "${film.title}"`)
    console.log(`   - Голос: значение ${vote.value}`)
  } catch (error) {
    console.error('❌ Ошибка при выполнении тестового скрипта:', error)
    throw error
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

