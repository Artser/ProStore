'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

interface Table {
  name: string
  tableName: string
  displayName: string
  count: number
  available: boolean
}

export default function TablesPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const dbType = searchParams.get('db') || 'local'
  
  const [tables, setTables] = useState<Table[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchTables()
  }, [dbType])

  const fetchTables = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch(`/api/view-db/tables?db=${dbType}`)
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Ошибка при загрузке таблиц')
      }
      
      setTables(data.tables)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <div style={{ color: 'white', fontSize: '1.2rem' }}>Загрузка...</div>
      </div>
    )
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '2rem',
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        background: 'white',
        borderRadius: '12px',
        padding: '2rem',
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem',
        }}>
          <div>
            <h1 style={{
              fontSize: '2rem',
              marginBottom: '0.5rem',
              color: '#333',
            }}>
              Таблицы базы данных
            </h1>
            <p style={{ color: '#666' }}>
              {dbType === 'local' ? 'Локальная БД' : 'Рабочая БД'}
            </p>
          </div>
          <button
            onClick={() => router.push('/view-db')}
            style={{
              padding: '0.5rem 1rem',
              background: '#f0f0f0',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
            }}
          >
            ← Назад
          </button>
        </div>

        {error && (
          <div style={{
            padding: '1rem',
            background: '#fee',
            color: '#c33',
            borderRadius: '8px',
            marginBottom: '1rem',
          }}>
            {error}
          </div>
        )}

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
          gap: '1rem',
        }}>
          {tables.map((table) => (
            <Link
              key={table.name}
              href={`/view-db/table/${table.name}?db=${dbType}`}
              style={{
                textDecoration: 'none',
                color: 'inherit',
              }}
            >
              <div style={{
                padding: '1.5rem',
                border: '2px solid #e0e0e0',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                background: table.available ? 'white' : '#f5f5f5',
                opacity: table.available ? 1 : 0.6,
              }}
              onMouseOver={(e) => {
                if (table.available) {
                  e.currentTarget.style.borderColor = '#667eea'
                  e.currentTarget.style.transform = 'translateY(-2px)'
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'
                }
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.borderColor = '#e0e0e0'
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = 'none'
              }}
              >
                <div style={{
                  fontSize: '1.2rem',
                  fontWeight: '600',
                  marginBottom: '0.5rem',
                  color: '#333',
                }}>
                  {table.displayName}
                </div>
                <div style={{
                  fontSize: '0.875rem',
                  color: '#666',
                  marginBottom: '0.5rem',
                }}>
                  Таблица: {table.tableName}
                </div>
                <div style={{
                  fontSize: '0.875rem',
                  color: table.available ? '#667eea' : '#999',
                  fontWeight: '600',
                }}>
                  {table.available ? `Записей: ${table.count}` : 'Недоступна'}
                </div>
                {table.available && (
                  <div style={{
                    marginTop: '1rem',
                    padding: '0.5rem',
                    background: '#667eea',
                    color: 'white',
                    borderRadius: '4px',
                    textAlign: 'center',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                  }}>
                    Открыть →
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

