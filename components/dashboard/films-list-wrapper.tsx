'use client'

import { Suspense } from 'react'
import { FilmsList } from './films-list'

interface FilmsListWrapperProps {
  films: any[]
  currentUserId: string
  searchQuery?: string
  page?: number
  totalPages?: number
  total?: number
}

/**
 * Обёртка для FilmsList с Suspense
 * Необходима для использования useSearchParams
 */
export function FilmsListWrapper(props: FilmsListWrapperProps) {
  return (
    <Suspense fallback={<div>Загрузка...</div>}>
      <FilmsList {...props} />
    </Suspense>
  )
}



