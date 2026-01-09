import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { LoginButton } from './login-button'

/**
 * Страница входа
 * Если пользователь уже авторизован - редирект на /dashboard
 */
export default async function LoginPage({
  searchParams,
}: {
  searchParams: { callbackUrl?: string }
}) {
  const session = await auth()

  // Если пользователь уже авторизован - редирект
  if (session) {
    redirect('/dashboard')
  }

  const callbackUrl = searchParams.callbackUrl || '/dashboard'

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
      }}
    >
      <div
        style={{
          background: 'white',
          borderRadius: '12px',
          padding: '3rem',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
          maxWidth: '400px',
          width: '100%',
        }}
      >
        <h1
          style={{
            fontSize: '2rem',
            marginBottom: '0.5rem',
            color: '#333',
            textAlign: 'center',
          }}
        >
          Добро пожаловать в ProStore
        </h1>
        <p
          style={{
            textAlign: 'center',
            color: '#666',
            marginBottom: '2rem',
          }}
        >
          Войдите, чтобы продолжить
        </p>

        {/* Форма входа через Google */}
        <LoginButton callbackUrl={callbackUrl} />

        <p
          style={{
            marginTop: '2rem',
            fontSize: '0.875rem',
            color: '#999',
            textAlign: 'center',
          }}
        >
          Используя ProStore, вы соглашаетесь с нашими условиями использования
        </p>
      </div>
    </div>
  )
}

