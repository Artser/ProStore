import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Начинаем seeding...')

  // Очищаем существующие данные
  await prisma.note.deleteMany()

  // Создаем тестовые заметки
  const notes = await prisma.note.createMany({
    data: [
      { title: 'Первая заметка' },
      { title: 'Вторая заметка' },
      { title: 'Третья заметка' },
    ],
  })

  console.log(`Создано заметок: ${notes.count}`)
  console.log('Seeding завершен!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
