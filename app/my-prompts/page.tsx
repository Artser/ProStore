import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'

/**
 * Защищённая страница "Мои фильмы"
 * Показывает только фильмы текущего пользователя
 */
export default async function MyPromptsPage() {
  const session = await auth()

  // Проверка авторизации
  if (!session?.user?.id) {
    redirect('/login')
  }

  const userId = session.user.id

  // Получаем фильмы только текущего пользователя
  const myFilms = await prisma.film.findMany({
    where: {
      ownerId: userId, // Фильтр по владельцу
    },
    include: {
      category: true,
      owner: {
        select: {
          name: true,
          email: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: 20, // Ограничение для примера
  })

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '2rem',
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          background: 'white',
          borderRadius: '12px',
          padding: '2rem',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
        }}
      >
        {/* Шапка */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '2rem',
          }}
        >
          <h1 style={{ fontSize: '2rem', color: '#333' }}>Мои фильмы</h1>
          <Link
            href="/dashboard"
            style={{
              padding: '0.5rem 1rem',
              background: '#f0f0f0',
              color: '#333',
              textDecoration: 'none',
              borderRadius: '6px',
            }}
          >
            ← Назад
          </Link>
        </div>

        {/* Список фильмов */}
        {myFilms.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: '3rem',
              color: '#999',
            }}
          >
            <p>У вас пока нет фильмов</p>
            <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>
              Создайте свой первый фильм!
            </p>
          </div>
        ) : (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
            }}
          >
            {myFilms.map((film) => (
              <div
                key={film.id}
                style={{
                  padding: '1.5rem',
                  border: '1px solid #e0e0e0',
                  borderRadius: '8px',
                  background: '#f8f9fa',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'start',
                    marginBottom: '0.5rem',
                  }}
                >
                  <h3 style={{ fontSize: '1.2rem', color: '#333' }}>
                    {film.title}
                  </h3>
                  <span
                    style={{
                      padding: '0.25rem 0.5rem',
                      background:
                        film.visibility === 'PUBLIC' ? '#10b981' : '#f59e0b',
                      color: 'white',
                      borderRadius: '4px',
                      fontSize: '0.75rem',
                      fontWeight: '600',
                    }}
                  >
                    {film.visibility === 'PUBLIC' ? 'Публичный' : 'Приватный'}
                  </span>
                </div>
                {film.description && (
                  <p style={{ color: '#666', marginBottom: '0.5rem' }}>
                    {film.description}
                  </p>
                )}
                <div
                  style={{
                    fontSize: '0.875rem',
                    color: '#999',
                    display: 'flex',
                    gap: '1rem',
                  }}
                >
                  <span>Категория: {film.category.category}</span>
                  <span>
                    Создано:{' '}
                    {new Date(film.createdAt).toLocaleDateString('ru-RU')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}


