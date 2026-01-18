'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Логирование ошибки
    console.error(error)
  }, [error])

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      }}
    >
      <div
        style={{
          background: 'white',
          borderRadius: '12px',
          padding: '3rem',
          maxWidth: '500px',
          textAlign: 'center',
        }}
      >
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#333' }}>
          Что-то пошло не так
        </h2>
        <p style={{ color: '#666', marginBottom: '2rem' }}>
          Произошла ошибка. Попробуйте обновить страницу.
        </p>
        <button
          onClick={reset}
          style={{
            padding: '0.75rem 1.5rem',
            background: '#667eea',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '600',
          }}
        >
          Попробовать снова
        </button>
      </div>
    </div>
  )
}





