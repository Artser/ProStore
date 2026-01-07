import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getDatabaseUrl, DbType } from '@/lib/db-config'

// Маппинг имён моделей
const MODEL_NAMES: Record<string, string> = {
  user: 'user',
  note: 'note',
  category: 'category',
  film: 'film',
  tag: 'tag',
  filmTag: 'filmTag',
  vote: 'vote',
}

export async function GET(
  request: NextRequest,
  { params }: { params: { name: string } }
) {
  try {
    const searchParams = request.nextUrl.searchParams
    const dbType = (searchParams.get('db') || 'local') as DbType
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit

    const modelName = params.name
    if (!MODEL_NAMES[modelName]) {
      return NextResponse.json(
        { error: 'Неизвестная таблица' },
        { status: 404 }
      )
    }

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

    const model = (prisma as any)[MODEL_NAMES[modelName]]
    
    // Получаем данные с пагинацией
    // Для filmTag используем составной ключ для сортировки
    const orderBy = modelName === 'filmTag' 
      ? { filmId: 'asc' as const }
      : { id: 'asc' as const }
    
    const [data, total] = await Promise.all([
      model.findMany({
        skip,
        take: limit,
        orderBy,
      }),
      model.count(),
    ])

    await prisma.$disconnect()

    return NextResponse.json({
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error: any) {
    console.error('Ошибка при получении данных:', error)
    return NextResponse.json(
      { error: error.message || 'Ошибка при получении данных' },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { name: string } }
) {
  try {
    const searchParams = request.nextUrl.searchParams
    const dbType = (searchParams.get('db') || 'local') as DbType
    const body = await request.json()

    const modelName = params.name
    if (!MODEL_NAMES[modelName]) {
      return NextResponse.json(
        { error: 'Неизвестная таблица' },
        { status: 404 }
      )
    }

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

    const model = (prisma as any)[MODEL_NAMES[modelName]]
    const result = await model.create({ data: body })

    await prisma.$disconnect()

    return NextResponse.json(result, { status: 201 })
  } catch (error: any) {
    console.error('Ошибка при создании записи:', error)
    return NextResponse.json(
      { error: error.message || 'Ошибка при создании записи' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { name: string } }
) {
  try {
    const searchParams = request.nextUrl.searchParams
    const dbType = (searchParams.get('db') || 'local') as DbType
    const body = await request.json()
    const { id, ...data } = body

    if (!id) {
      return NextResponse.json(
        { error: 'ID обязателен для обновления' },
        { status: 400 }
      )
    }

    const modelName = params.name
    if (!MODEL_NAMES[modelName]) {
      return NextResponse.json(
        { error: 'Неизвестная таблица' },
        { status: 404 }
      )
    }

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

    const model = (prisma as any)[MODEL_NAMES[modelName]]
    const result = await model.update({
      where: { id },
      data,
    })

    await prisma.$disconnect()

    return NextResponse.json(result)
  } catch (error: any) {
    console.error('Ошибка при обновлении записи:', error)
    return NextResponse.json(
      { error: error.message || 'Ошибка при обновлении записи' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { name: string } }
) {
  try {
    const searchParams = request.nextUrl.searchParams
    const dbType = (searchParams.get('db') || 'local') as DbType
    const modelName = params.name

    if (!MODEL_NAMES[modelName]) {
      return NextResponse.json(
        { error: 'Неизвестная таблица' },
        { status: 404 }
      )
    }

    const databaseUrl = getDatabaseUrl(dbType)
    if (!databaseUrl) {
      return NextResponse.json(
        { error: 'DATABASE_URL не настроен' },
        { status: 500 }
      )
    }

    // Для filmTag нужен составной ключ
    let whereClause: any
    if (modelName === 'filmTag') {
      const filmId = searchParams.get('filmId')
      const tagId = searchParams.get('tagId')
      if (!filmId || !tagId) {
        return NextResponse.json(
          { error: 'Для filmTag нужны filmId и tagId' },
          { status: 400 }
        )
      }
      whereClause = {
        filmId_tagId: {
          filmId,
          tagId,
        },
      }
    } else {
      const id = searchParams.get('id')
      if (!id) {
        return NextResponse.json(
          { error: 'ID обязателен для удаления' },
          { status: 400 }
        )
      }
      whereClause = { id }
    }

    const prisma = new PrismaClient({
      datasources: {
        db: {
          url: databaseUrl,
        },
      },
    })

    const model = (prisma as any)[MODEL_NAMES[modelName]]
    await model.delete({ where: whereClause })

    await prisma.$disconnect()

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Ошибка при удалении записи:', error)
    return NextResponse.json(
      { error: error.message || 'Ошибка при удалении записи' },
      { status: 500 }
    )
  }
}

