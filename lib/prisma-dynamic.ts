import { PrismaClient } from '@prisma/client'
import { getDatabaseUrl, DbType } from './db-config'

// Создаёт Prisma Client с указанным DATABASE_URL
export function createPrismaClient(dbType: DbType): PrismaClient {
  const databaseUrl = getDatabaseUrl(dbType)
  
  return new PrismaClient({
    datasources: {
      db: {
        url: databaseUrl,
      },
    },
  })
}

// Получает список всех моделей из Prisma Client
export function getModelNames(): string[] {
  const prisma = new PrismaClient()
  const models = Object.keys(prisma).filter(
    (key) => !key.startsWith('_') && !key.startsWith('$')
  )
  return models
}





