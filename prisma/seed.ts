import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Начало заполнения базы данных...');

  // Создаем пользователя
  const user = await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: {},
    create: {
      email: 'test@example.com',
      name: 'Тестовый пользователь',
    },
  });

  console.log('Пользователь создан:', user);

  // Создаем категорию
  const category = await prisma.category.upsert({
    where: { category: 'Общее' },
    update: {},
    create: {
      category: 'Общее',
    },
  });

  console.log('Категория создана:', category);

  // Создаем заметку
  const note = await prisma.note.create({
    data: {
      title: 'Первая заметка',
      ownerId: user.id,
    },
  });

  console.log('Заметка создана:', note);

  // Создаем тег
  const tag = await prisma.tag.upsert({
    where: { name: 'тестовый' },
    update: {},
    create: {
      name: 'тестовый',
    },
  });

  console.log('Тег создан:', tag);

  // Создаем фильм (промт)
  const film = await prisma.film.create({
    data: {
      title: 'Пример промта',
      content: 'Это пример содержимого промта',
      description: 'Описание промта',
      ownerId: user.id,
      categoryId: category.id,
      visibility: 'PUBLIC',
      tags: {
        create: {
          tagId: tag.id,
        },
      },
    },
  });

  console.log('Фильм создан:', film);

  console.log('База данных успешно заполнена!');
}

main()
  .catch((e) => {
    console.error('Ошибка при заполнении базы данных:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });




