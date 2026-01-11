## Что есть в системе (сущности):

Note - заметки
User — владелец фильмов, автор, голосующий
Film — сам фильм (может быть приватным или публичным)
Tag — метки (многие-ко-многим с Film)
Vote — голос пользователя за публичный фильм (уникально: один пользователь → один голос на фильм)
(опционально) Collection / Folder — папки/коллекции для организации
(опционально) PromptVersion — версии фильма (история изменений)

## Ключевые правила:

- Публичность — это свойство Film (visibility)
- Голосовать можно только по публичным (проверяется на уровне приложения; можно усилить триггером/констрейнтом позже)
- Голос уникален: (userId, promptId) — уникальный индекс

## Схема базы данных
- Note: id, ownerId -> User, title, createdAt
- User: id (cuid), email unique, name optional, createdAt
- Film: id, ownerId -> User, title, content, description optional, categoryId -> Category,
  visibility (PRIVATE|PUBLIC, default PRIVATE), createdAt, updatedAt, publishedAt nullable
- Vote: id, userId -> User, promptId -> Film, value int default 1, createdAt
- Category: id, category
- Ограничение: один пользователь может проголосовать за фильм только один раз:
  UNIQUE(userId, promptId)
- Индексы:
  Film(ownerId, updatedAt)
  Film(visibility, createdAt)
  Vote(promptId)
  Vote(userId)
- onDelete: Cascade для связей
