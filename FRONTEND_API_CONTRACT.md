# Frontend API Contract (Draft)

Данный документ описывает ожидаемые API endpoints для будущего подключения бекенда.
Все запросы должны иметь префикс `/api/v1` (настраивается через `VITE_API_BASE_URL`).

## Публичное API (Без авторизации)

### Каталог и объекты
*   `GET /categories`
    *   Ответ: `CategoriesResponse` (список категорий, отсортированный по `sortIndex`)
*   `GET /objects`
    *   Query параметры: `q`, `category`, `distance` (в км от текущей точки), `lat`, `lng`, `sort`
    *   Ответ: `ObjectsResponse` (с пагинацией)
*   `GET /objects/:slug`
    *   Ответ: Детальная информация по объекту `TourismObject`

## Личный кабинет (Требует авторизации, Header: `Authorization: Bearer <token>`)

### Авторизация и профиль
*   `POST /auth/login` (email, password) -> JWT token
*   `POST /auth/register` (email, password)
*   `POST /auth/register-business` (BusinessRegistrationRequest Omit<id, status, created_at>)
*   `GET /auth/me` -> `User`

### Бизнес-пользователь
*   `GET /business/objects` -> `ObjectsResponse` (мои объекты)
*   `POST /business/objects` -> `TourismObject` (создание, уходит в статус `MODERATION`)
*   `PUT /business/objects/:id` -> `TourismObject`
*   `DELETE /business/objects/:id`
*   `POST /business/upload` (multipart/form-data: файлы, фото) -> `{ url: string }`

### Модератор (Требует `role: MODERATOR`)
*   `GET /moderation/objects` (Query: `status`) -> `ObjectsResponse`
*   `POST /moderation/objects/:id/publish`
*   `POST /moderation/objects/:id/reject`
*   `POST /moderation/objects/:id/requires-correction` (body: `ModerationComment`)
*   `GET /moderation/registrations` -> Список заявок (`BusinessRegistrationRequest[]`)
*   `POST /moderation/registrations/:id/approve`
*   `POST /moderation/registrations/:id/reject`

### Администратор (Требует `role: ADMIN`)
*   `GET /admin/users` -> Список пользователей
*   `PUT /admin/users/:id/status` -> Изменение статуса (бан/активация)
*   `POST /admin/categories`
*   `PUT /admin/categories/:id`
*   `GET /admin/logs` -> Список журнала событий (`LogEvent[]`)
*   `GET /admin/stats` -> `{ counts: { moderation: number, active_businesses: number }, popular_categories: [] }`
