import { prisma } from '@/lib/prisma'

async function getNotes() {
  try {
    const notes = await prisma.note.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    })
    return notes
  } catch (error) {
    console.error('Ошибка при получении заметок:', error)
    return []
  }
}

export default async function Home() {
  const notes = await getNotes()

  return (
    <main style={{
      maxWidth: '800px',
      margin: '0 auto',
      background: 'white',
      borderRadius: '12px',
      padding: '2rem',
      boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
    }}>
      <h1 style={{
        fontSize: '2.5rem',
        marginBottom: '1rem',
        color: '#333',
        textAlign: 'center',
      }}>
        ProStore
      </h1>
      <p style={{
        textAlign: 'center',
        color: '#666',
        marginBottom: '2rem',
        fontSize: '1.1rem',
      }}>
        Next.js + Prisma + NeonDB (PostgreSQL)
      </p>

      {notes.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '3rem',
          color: '#999',
        }}>
          <p>Заметок пока нет. Запустите seed для добавления тестовых данных:</p>
          <code style={{
            display: 'block',
            marginTop: '1rem',
            padding: '0.5rem',
            background: '#f5f5f5',
            borderRadius: '4px',
          }}>
            npm run db:seed
          </code>
        </div>
      ) : (
        <div>
          <h2 style={{
            fontSize: '1.5rem',
            marginBottom: '1rem',
            color: '#333',
          }}>
            Заметки из базы данных ({notes.length})
          </h2>
          <ul style={{
            listStyle: 'none',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}>
            {notes.map((note) => (
              <li
                key={note.id}
                style={{
                  padding: '1rem',
                  background: '#f8f9fa',
                  borderRadius: '8px',
                  border: '1px solid #e9ecef',
                }}
              >
                <div style={{
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  color: '#333',
                  marginBottom: '0.5rem',
                }}>
                  {note.title}
                </div>
                <div style={{
                  fontSize: '0.875rem',
                  color: '#666',
                }}>
                  Создано: {new Date(note.createdAt).toLocaleString('ru-RU')}
                </div>
                <div style={{
                  fontSize: '0.75rem',
                  color: '#999',
                  marginTop: '0.25rem',
                  fontFamily: 'monospace',
                }}>
                  ID: {note.id}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div style={{
        marginTop: '2rem',
        padding: '1rem',
        background: '#e7f3ff',
        borderRadius: '8px',
        fontSize: '0.875rem',
        color: '#0066cc',
      }}>
        <strong>Статус подключения:</strong> {notes.length > 0 ? '✅ Подключено к PostgreSQL (Neon)' : '⚠️ Проверьте подключение к БД'}
      </div>
    </main>
  )
}

