'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams, useParams } from 'next/navigation'

interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

function TableViewContent() {
  const router = useRouter()
  const params = useParams()
  const searchParams = useSearchParams()
  const tableName = params.name as string
  const dbType = searchParams.get('db') || 'local'

  const [data, setData] = useState<any[]>([])
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editData, setEditData] = useState<any>({})
  const [showCreate, setShowCreate] = useState(false)
  const [createData, setCreateData] = useState<any>({})

  useEffect(() => {
    fetchData()
  }, [tableName, dbType, pagination.page])

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch(
        `/api/view-db/table/${tableName}?db=${dbType}&page=${pagination.page}&limit=${pagination.limit}`
      )
      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Ошибка при загрузке данных')
      }

      setData(result.data)
      setPagination(result.pagination)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Вы уверены, что хотите удалить эту запись?')) {
      return
    }

    try {
      const response = await fetch(
        `/api/view-db/table/${tableName}?db=${dbType}&id=${id}`,
        { method: 'DELETE' }
      )

      if (!response.ok) {
        const result = await response.json()
        throw new Error(result.error || 'Ошибка при удалении')
      }

      fetchData()
    } catch (err: any) {
      alert(err.message)
    }
  }

  const handleUpdate = async () => {
    try {
      const response = await fetch(
        `/api/view-db/table/${tableName}?db=${dbType}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...editData, id: editingId }),
        }
      )

      if (!response.ok) {
        const result = await response.json()
        throw new Error(result.error || 'Ошибка при обновлении')
      }

      setEditingId(null)
      setEditData({})
      fetchData()
    } catch (err: any) {
      alert(err.message)
    }
  }

  const handleCreate = async () => {
    try {
      const response = await fetch(
        `/api/view-db/table/${tableName}?db=${dbType}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(createData),
        }
      )

      if (!response.ok) {
        const result = await response.json()
        throw new Error(result.error || 'Ошибка при создании')
      }

      setShowCreate(false)
      setCreateData({})
      fetchData()
    } catch (err: any) {
      alert(err.message)
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

  if (error) {
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
        }}>
          <div style={{ color: '#c33', marginBottom: '1rem' }}>{error}</div>
          <button
            onClick={() => router.push(`/view-db/tables?db=${dbType}`)}
            style={{
              padding: '0.5rem 1rem',
              background: '#667eea',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
            }}
          >
            ← Назад к таблицам
          </button>
        </div>
      </div>
    )
  }

  const columns = data.length > 0 ? Object.keys(data[0]) : []

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '2rem',
    }}>
      <div style={{
        maxWidth: '1400px',
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
              Таблица: {tableName}
            </h1>
            <p style={{ color: '#666' }}>
              {dbType === 'local' ? 'Локальная БД' : 'Рабочая БД'} • Всего записей: {pagination.total}
            </p>
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button
              onClick={() => setShowCreate(true)}
              style={{
                padding: '0.5rem 1rem',
                background: '#10b981',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: '600',
              }}
            >
              + Создать
            </button>
            <button
              onClick={() => router.push(`/view-db/tables?db=${dbType}`)}
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
        </div>

        {/* Таблица */}
        <div style={{ overflowX: 'auto', marginBottom: '2rem' }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontSize: '0.875rem',
          }}>
            <thead>
              <tr style={{ background: '#f8f9fa' }}>
                {columns.map((col) => (
                  <th
                    key={col}
                    style={{
                      padding: '0.75rem',
                      textAlign: 'left',
                      borderBottom: '2px solid #e0e0e0',
                      fontWeight: '600',
                      color: '#333',
                    }}
                  >
                    {col}
                  </th>
                ))}
                <th style={{
                  padding: '0.75rem',
                  textAlign: 'left',
                  borderBottom: '2px solid #e0e0e0',
                  fontWeight: '600',
                  color: '#333',
                }}>
                  Действия
                </th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid #e0e0e0' }}>
                  {columns.map((col) => (
                    <td
                      key={col}
                      style={{
                        padding: '0.75rem',
                        maxWidth: '200px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {editingId === row.id ? (
                        <input
                          type="text"
                          value={editData[col] ?? row[col] ?? ''}
                          onChange={(e) =>
                            setEditData({ ...editData, [col]: e.target.value })
                          }
                          style={{
                            width: '100%',
                            padding: '0.25rem',
                            border: '1px solid #667eea',
                            borderRadius: '4px',
                          }}
                        />
                      ) : (
                        String(row[col] ?? '')
                      )}
                    </td>
                  ))}
                  <td style={{ padding: '0.75rem' }}>
                    {editingId === row.id ? (
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                          onClick={handleUpdate}
                          style={{
                            padding: '0.25rem 0.5rem',
                            background: '#10b981',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '0.75rem',
                          }}
                        >
                          ✓
                        </button>
                        <button
                          onClick={() => {
                            setEditingId(null)
                            setEditData({})
                          }}
                          style={{
                            padding: '0.25rem 0.5rem',
                            background: '#999',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '0.75rem',
                          }}
                        >
                          ✕
                        </button>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                          onClick={() => {
                            setEditingId(row.id)
                            setEditData({ ...row })
                          }}
                          style={{
                            padding: '0.25rem 0.5rem',
                            background: '#667eea',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '0.75rem',
                          }}
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleDelete(row.id)}
                          style={{
                            padding: '0.25rem 0.5rem',
                            background: '#ef4444',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '0.75rem',
                          }}
                        >
                          🗑️
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Пагинация */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <div style={{ color: '#666' }}>
            Страница {pagination.page} из {pagination.totalPages}
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={() =>
                setPagination({ ...pagination, page: pagination.page - 1 })
              }
              disabled={pagination.page === 1}
              style={{
                padding: '0.5rem 1rem',
                background: pagination.page === 1 ? '#f0f0f0' : '#667eea',
                color: pagination.page === 1 ? '#999' : 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: pagination.page === 1 ? 'not-allowed' : 'pointer',
              }}
            >
              ← Назад
            </button>
            <button
              onClick={() =>
                setPagination({ ...pagination, page: pagination.page + 1 })
              }
              disabled={pagination.page >= pagination.totalPages}
              style={{
                padding: '0.5rem 1rem',
                background:
                  pagination.page >= pagination.totalPages
                    ? '#f0f0f0'
                    : '#667eea',
                color:
                  pagination.page >= pagination.totalPages ? '#999' : 'white',
                border: 'none',
                borderRadius: '6px',
                cursor:
                  pagination.page >= pagination.totalPages
                    ? 'not-allowed'
                    : 'pointer',
              }}
            >
              Вперёд →
            </button>
          </div>
        </div>

        {/* Модальное окно создания */}
        {showCreate && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}>
            <div style={{
              background: 'white',
              borderRadius: '12px',
              padding: '2rem',
              maxWidth: '500px',
              width: '90%',
              maxHeight: '80vh',
              overflow: 'auto',
            }}>
              <h2 style={{ marginBottom: '1rem', color: '#333' }}>
                Создать запись
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {columns
                  .filter((col) => col !== 'id' && col !== 'createdAt' && col !== 'updatedAt')
                  .map((col) => (
                    <div key={col}>
                      <label style={{
                        display: 'block',
                        marginBottom: '0.5rem',
                        fontWeight: '600',
                        color: '#333',
                      }}>
                        {col}
                      </label>
                      <input
                        type="text"
                        value={createData[col] ?? ''}
                        onChange={(e) =>
                          setCreateData({ ...createData, [col]: e.target.value })
                        }
                        style={{
                          width: '100%',
                          padding: '0.5rem',
                          border: '1px solid #e0e0e0',
                          borderRadius: '6px',
                        }}
                      />
                    </div>
                  ))}
              </div>
              <div style={{
                display: 'flex',
                gap: '1rem',
                marginTop: '2rem',
                justifyContent: 'flex-end',
              }}>
                <button
                  onClick={() => {
                    setShowCreate(false)
                    setCreateData({})
                  }}
                  style={{
                    padding: '0.5rem 1rem',
                    background: '#f0f0f0',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                  }}
                >
                  Отмена
                </button>
                <button
                  onClick={handleCreate}
                  style={{
                    padding: '0.5rem 1rem',
                    background: '#10b981',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: '600',
                  }}
                >
                  Создать
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function TableViewPage() {
  return (
    <Suspense fallback={
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
    }>
      <TableViewContent />
    </Suspense>
  )
}

