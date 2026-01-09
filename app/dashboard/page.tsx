import { auth, signOut } from '@/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'

/**
 * Защищённая страница Dashboard
 * Доступна только авторизованным пользователям
 */
export default async function DashboardPage() {
  const session = await auth()

  // Если пользователь не авторизован - редирект на /login
  // (должно обрабатываться middleware, но на всякий случай)
  if (!session?.user) {
    redirect('/login')
  }

  const user = session.user

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
        {/* Шапка с информацией о пользователе */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '2rem',
            paddingBottom: '1rem',
            borderBottom: '1px solid #e0e0e0',
          }}
        >
          <div>
            <h1
              style={{
                fontSize: '2rem',
                marginBottom: '0.5rem',
                color: '#333',
              }}
            >
              Личный кабинет
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              {user.image && (
                <img
                  src={user.image}
                  alt={user.name || 'User'}
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                  }}
                />
              )}
              <div>
                <p style={{ fontWeight: '600', color: '#333' }}>
                  {user.name || 'Пользователь'}
                </p>
                <p style={{ fontSize: '0.875rem', color: '#666' }}>
                  {user.email}
                </p>
              </div>
            </div>
          </div>

          {/* Кнопка выхода */}
          <form
            action={async () => {
              'use server'
              await signOut({ redirectTo: '/login' })
            }}
          >
            <button
              type="submit"
              style={{
                padding: '0.5rem 1rem',
                background: '#ef4444',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: '600',
              }}
            >
              Выйти
            </button>
          </form>
        </div>

        {/* Основной контент */}
        <div>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#333' }}>
            Добро пожаловать, {user.name || 'Пользователь'}!
          </h2>
          <p style={{ color: '#666', marginBottom: '2rem' }}>
            Ваш ID: <code style={{ background: '#f5f5f5', padding: '0.25rem 0.5rem', borderRadius: '4px' }}>{user.id}</code>
          </p>

          {/* Навигация */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
              gap: '1rem',
            }}
          >
            <Link
              href="/my-prompts"
              style={{
                textDecoration: 'none',
                color: 'inherit',
              }}
            >
              <div
                style={{
                  padding: '1.5rem',
                  border: '2px solid #e0e0e0',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.borderColor = '#667eea'
                  e.currentTarget.style.transform = 'translateY(-2px)'
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.borderColor = '#e0e0e0'
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: '#333' }}>
                  Мои промты
                </h3>
                <p style={{ fontSize: '0.875rem', color: '#666' }}>
                  Просмотр и управление вашими промтами
                </p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

