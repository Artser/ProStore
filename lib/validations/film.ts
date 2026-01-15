import { z } from "zod"

/**
 * Схема валидации для создания/обновления фильма
 */
export const createFilmSchema = z.object({
  title: z.string().min(1, "Название обязательно").max(200, "Слишком длинное название"),
  content: z.string().min(1, "Содержимое обязательно"),
  description: z.string().max(500, "Описание слишком длинное").optional(),
  isPublic: z.boolean().default(false),
})

export const updateFilmSchema = createFilmSchema.extend({
  id: z.string().min(1, "ID обязателен"),
})

export type CreateFilmInput = z.infer<typeof createFilmSchema>
export type UpdateFilmInput = z.infer<typeof updateFilmSchema>



