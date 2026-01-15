import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getDatabaseUrl, DbType } from '@/lib/db-config'

// Список всех моделей из Prisma schema
const MODEL_NAMES = [
  'user',
  'note',
  'category',
  'film',
  'tag',
  'filmTag',
  'vote',
]

// Маппинг имён моделей на имена таблиц
const MODEL_TO_TABLE: Record<string, string> = {
  user: 'users',
  note: 'notes',
  category: 'categories',
  film: 'films',
  tag: 'tags',
  filmTag: 'film_tags',
  vote: 'votes',
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const dbType = (searchParams.get('db') || 'local') as DbType

    // Проверяем подключение к БД
    const databaseUrl = getDatabaseUrl(dbType)
    if (!databaseUrl) {
      return NextResponse.json(
        { error: 'DATABASE_URL не настроен' },
        { status: 500 }
      )
    }

    const prisma = new PrismaClient({
      datasources: {
        db: {
          url: databaseUrl,
        },
      },
    })

    // Проверяем доступность каждой таблицы
    const tables = await Promise.all(
      MODEL_NAMES.map(async (modelName) => {
        const tableName = MODEL_TO_TABLE[modelName] || modelName
        try {
          // Пытаемся выполнить простой запрос для проверки существования таблицы
          const count = await (prisma as any)[modelName].count()
          return {
            name: modelName,
            tableName,
            displayName: modelName.charAt(0).toUpperCase() + modelName.slice(1),
            count,
            available: true,
          }
        } catch (error) {
          return {
            name: modelName,
            tableName,
            displayName: modelName.charAt(0).toUpperCase() + modelName.slice(1),
            count: 0,
            available: false,
          }
        }
      })
    )

    await prisma.$disconnect()

    return NextResponse.json({ tables, dbType })
  } catch (error: any) {
    console.error('Ошибка при получении списка таблиц:', error)
    return NextResponse.json(
      { error: error.message || 'Ошибка при получении списка таблиц' },
      { status: 500 }
    )
  }
}





