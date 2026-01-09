// Конфигурация для работы с разными базами данных

export type DbType = 'local' | 'production'

export function getDatabaseUrl(dbType: DbType): string {
  if (dbType === 'local') {
    return process.env.DATABASE_URL || ''
  } else {
    return process.env.DATABASE_URL_PRODUCTION || process.env.DATABASE_URL || ''
  }
}

export function getDbDisplayName(dbType: DbType): string {
  return dbType === 'local' ? 'Локальная БД' : 'Рабочая БД'
}


