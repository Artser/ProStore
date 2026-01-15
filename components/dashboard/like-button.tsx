'use client'

import { useState } from 'react'
import { ThumbsUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useRouter } from 'next/navigation'

interface LikeButtonProps {
  filmId: string
  initialLiked: boolean
  initialCount: number
  disabled?: boolean
}

/**
 * Кнопка лайка с оптимистичным обновлением
 * Показывает количество лайков и состояние (лайкнут/не лайкнут)
 */
export function LikeButton({
  filmId,
  initialLiked,
  initialCount,
  disabled = false,
}: LikeButtonProps) {
  const router = useRouter()
  const [liked, setLiked] = useState(initialLiked)
  const [count, setCount] = useState(initialCount)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleLike = async () => {
    if (isLoading || disabled) return

    // Оптимистичное обновление
    const previousLiked = liked
    const previousCount = count
    setLiked(!liked)
    setCount((prev) => (liked ? prev - 1 : prev + 1))
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/films/${filmId}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        
        // Если не авторизован - редирект на логин
        if (response.status === 401) {
          window.location.href = '/login'
          return
        }

        // Откатываем оптимистичное обновление
        setLiked(previousLiked)
        setCount(previousCount)
        setError(data.error || 'Ошибка при обработке лайка')
        return
      }

      const data = await response.json()
      // Обновляем состояние на основе ответа сервера
      setLiked(data.liked)
      setCount(data.likesCount)

      // Обновляем страницу для синхронизации с сервером
      router.refresh()
    } catch (err) {
      // Откатываем оптимистичное обновление при ошибке сети
      setLiked(previousLiked)
      setCount(previousCount)
      setError('Ошибка сети. Попробуйте позже.')
      console.error('Ошибка при обработке лайка:', err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={handleLike}
        disabled={isLoading || disabled}
        className={cn(
          'flex items-center gap-1.5',
          liked && 'text-blue-600 hover:text-blue-700',
          !liked && 'text-gray-600 hover:text-gray-700',
          isLoading && 'opacity-50 cursor-not-allowed'
        )}
        title={error || (liked ? 'Убрать лайк' : 'Поставить лайк')}
      >
        <ThumbsUp
          className={cn(
            'h-4 w-4',
            liked && 'fill-current'
          )}
        />
        <span className="text-sm font-medium">{count}</span>
      </Button>
      {error && (
        <span className="text-xs text-red-600" title={error}>
          ⚠️
        </span>
      )}
    </div>
  )
}

