'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { createFilmSchema, type CreateFilmInput } from '@/lib/validations/film'
import { createFilm, updateFilm } from '@/app/actions/film-actions'
import { useRouter } from 'next/navigation'

interface FilmDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  film?: {
    id: string
    title: string
    content: string
    description?: string | null
    isPublic: boolean
  } | null
}

/**
 * Диалог для создания/редактирования фильма
 * Использует react-hook-form для валидации и управления формой
 */
export function FilmDialog({ open, onOpenChange, film }: FilmDialogProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<CreateFilmInput>({
    resolver: zodResolver(createFilmSchema),
    defaultValues: {
      title: '',
      content: '',
      description: '',
      isPublic: false,
    },
  })

  const isPublic = watch('isPublic')

  // Сброс формы при открытии/закрытии диалога
  useEffect(() => {
    if (open) {
      if (film) {
        setValue('title', film.title)
        setValue('content', film.content)
        setValue('description', film.description || '')
        setValue('isPublic', film.isPublic)
      } else {
        reset()
      }
    }
  }, [open, film, setValue, reset])

  const onSubmit = async (data: CreateFilmInput) => {
    setIsSubmitting(true)
    try {
      if (film) {
        // Редактирование
        await updateFilm({ ...data, id: film.id })
      } else {
        // Создание
        await createFilm(data)
      }
      router.refresh()
      onOpenChange(false)
      reset()
    } catch (error) {
      console.error('Ошибка при сохранении фильма:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {film ? 'Редактировать фильм' : 'Новый фильм'}
          </DialogTitle>
          <DialogDescription>
            {film
              ? 'Измените информацию о фильме'
              : 'Создайте новый фильм для вашей коллекции'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Название */}
          <div className="space-y-2">
            <Label htmlFor="title">Название *</Label>
            <Input
              id="title"
              {...register('title')}
              placeholder="Введите название фильма"
              className={errors.title ? 'border-destructive' : ''}
            />
            {errors.title && (
              <p className="text-sm text-destructive">
                {errors.title.message}
              </p>
            )}
          </div>

          {/* Описание (необязательно) */}
          <div className="space-y-2">
            <Label htmlFor="description">Описание (необязательно)</Label>
            <Input
              id="description"
              {...register('description')}
              placeholder="Краткое описание"
            />
            {errors.description && (
              <p className="text-sm text-destructive">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Содержимое */}
          <div className="space-y-2">
            <Label htmlFor="content">Содержимое *</Label>
            <Textarea
              id="content"
              {...register('content')}
              placeholder="Введите содержимое фильма"
              rows={8}
              className={errors.content ? 'border-destructive' : ''}
            />
            {errors.content && (
              <p className="text-sm text-destructive">
                {errors.content.message}
              </p>
            )}
          </div>

          {/* Публичность */}
          <div className="flex items-center justify-between space-x-2 rounded-md border p-4">
            <div className="space-y-0.5">
              <Label htmlFor="isPublic">Публичный фильм</Label>
              <p className="text-sm text-muted-foreground">
                Виден всем пользователям
              </p>
            </div>
            <Switch
              id="isPublic"
              checked={isPublic}
              onCheckedChange={(checked) => setValue('isPublic', checked)}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Отмена
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? 'Сохранение...'
                : film
                ? 'Сохранить изменения'
                : 'Создать'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

