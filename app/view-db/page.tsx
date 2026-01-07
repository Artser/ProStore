'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function ViewDbPage() {
  const [dbType, setDbType] = useState<'local' | 'production'>('local')
  const router = useRouter()

  const handleContinue = () => {
    // Сохраняем выбор в sessionStorage
    sessionStorage.setItem('dbType', dbType)
    router.push(`/view-db/tables?db=${dbType}`)
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '2rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <div style={{
        background: 'white',
        borderRadius: '12px',
        padding: '3rem',
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
        maxWidth: '500px',
        width: '100%',
      }}>
        <h1 style={{
          fontSize: '2rem',
          marginBottom: '1rem',
          color: '#333',
          textAlign: 'center',
        }}>
          View DB
        </h1>
        <p style={{
          textAlign: 'center',
          color: '#666',
          marginBottom: '2rem',
        }}>
          Выберите базу данных для просмотра
        </p>

        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          marginBottom: '2rem',
        }}>
          <label style={{
            display: 'flex',
            alignItems: 'center',
            padding: '1rem',
            border: '2px solid #e0e0e0',
            borderRadius: '8px',
            cursor: 'pointer',
            transition: 'all 0.2s',
            background: dbType === 'local' ? '#f0f7ff' : 'white',
            borderColor: dbType === 'local' ? '#667eea' : '#e0e0e0',
          }}>
            <input
              type="radio"
              name="dbType"
              value="local"
              checked={dbType === 'local'}
              onChange={(e) => setDbType(e.target.value as 'local' | 'production')}
              style={{ marginRight: '1rem', width: '20px', height: '20px' }}
            />
            <div>
              <div style={{ fontWeight: '600', color: '#333' }}>Локальная БД</div>
              <div style={{ fontSize: '0.875rem', color: '#666' }}>
                Использует DATABASE_URL из .env
              </div>
            </div>
          </label>

          <label style={{
            display: 'flex',
            alignItems: 'center',
            padding: '1rem',
            border: '2px solid #e0e0e0',
            borderRadius: '8px',
            cursor: 'pointer',
            transition: 'all 0.2s',
            background: dbType === 'production' ? '#f0f7ff' : 'white',
            borderColor: dbType === 'production' ? '#667eea' : '#e0e0e0',
          }}>
            <input
              type="radio"
              name="dbType"
              value="production"
              checked={dbType === 'production'}
              onChange={(e) => setDbType(e.target.value as 'local' | 'production')}
              style={{ marginRight: '1rem', width: '20px', height: '20px' }}
            />
            <div>
              <div style={{ fontWeight: '600', color: '#333' }}>Рабочая БД</div>
              <div style={{ fontSize: '0.875rem', color: '#666' }}>
                Использует DATABASE_URL_PRODUCTION или DATABASE_URL
              </div>
            </div>
          </label>
        </div>

        <button
          onClick={handleContinue}
          style={{
            width: '100%',
            padding: '1rem',
            background: '#667eea',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '1rem',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'background 0.2s',
          }}
          onMouseOver={(e) => e.currentTarget.style.background = '#5568d3'}
          onMouseOut={(e) => e.currentTarget.style.background = '#667eea'}
        >
          Продолжить
        </button>
      </div>
    </div>
  )
}

