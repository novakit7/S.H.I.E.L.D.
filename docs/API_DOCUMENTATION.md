# API documentation

Base URL: `http://localhost:5000/api`. Protected routes require the server session cookie.

## Health and authentication

| Method | Path | Access | Purpose |
|---|---|---|---|
| GET | `/health` | Public | Server health |
| POST | `/auth/register` | Public | Start registration and send OTP |
| POST | `/auth/verify-otp` | Public | Verify six-digit registration OTP |
| POST | `/auth/resend-otp` | Public | Resend registration OTP |
| POST | `/auth/login` | Public | Create authenticated session |
| GET | `/auth/me` | Authenticated | Return current user |
| POST | `/auth/logout` | Authenticated | Revoke current session |

## Student API

| Method | Path | Purpose |
|---|---|---|
| GET | `/dashboard` | Dashboard aggregation |
| GET/PATCH | `/users/me` | Read/update current profile |
| GET | `/announcements` | Search published announcements |
| GET | `/campus/locations` | Search active campus locations |
| GET | `/community/posts` | Search and paginate posts |
| POST | `/community/posts` | Create a post |
| POST | `/community/posts/:id/likes` | Toggle a like |
| POST | `/community/posts/:id/reports` | Report a post |
| GET | `/lost-found` | Search and paginate listings |
| POST | `/lost-found` | Create a listing |
| POST | `/assistant/chat` | Ask the authenticated server assistant |

Community filters include `q`, `category`, `page`, `limit`, and `sort`. Lost-and-found filters include `q`, `status`, `category`, `page`, and `limit`. Announcement and location list endpoints provide search and pagination parameters.

## Admin API

All `/admin` routes require an authenticated user with role `admin`.

| Method | Path | Purpose |
|---|---|---|
| GET | `/admin/summary` | Administrator summary |
| GET/POST | `/admin/announcements` | List/create managed announcements |
| PATCH/DELETE | `/admin/announcements/:id` | Update/delete an announcement |
| GET | `/admin/reports` | List moderation reports |
| PATCH | `/admin/reports/:id` | Review or dismiss a report |
| GET | `/admin/users` | Search and paginate users |
| PATCH | `/admin/users/:id` | Change user role or status |

## AIML API

The independent service defaults to `http://localhost:8000`.

| Method | Path | Request | Response |
|---|---|---|---|
| GET | `/health` | — | Service status |
| POST | `/api/assistant/chat` | `{question}` | `{answer, source}` |
| POST | `/api/matching/find` | `{query, candidates, limit}` | `{matches}` |

The Express response wrapper is defined by `server/src/utils/apiResponse.js`.

## Route inventory and request details

The following inventory is generated from the registered route modules. All Express JSON requests use `Content-Type: application/json`; browser calls that use cookies must send credentials. Successful Express responses use the shared `success`, `message`, and `data` shape.

| Endpoint | Controller | Body/query | Auth | Status |
|---|---|---|---|---|
| `POST /auth/register` | `register` | `name`, `email`, `studentId`, `department`, `password` | Public | Implemented |
| `POST /auth/verify-otp` | `verifySignup` | `code`, optional `registrationToken` | Public challenge | Implemented |
| `POST /auth/resend-otp` | `resendOtp` | optional `registrationToken` | Public challenge | Implemented |
| `POST /auth/login` | `login` | `email`, `password` | Public | Implemented |
| `GET /auth/me` | `getCurrentUser` | — | Authenticated | Implemented |
| `POST /auth/logout` | `logout` | — | Authenticated | Implemented |
| `GET /community/posts` | `listPosts` | `q`, `category`, `page`, `limit`, `sort` | Authenticated | Implemented |
| `POST /community/posts` | `createPost` | `body`, optional `title`, optional `category` | Authenticated | Implemented |
| `POST /community/posts/:id/likes` | `toggleLike` | ObjectId path | Authenticated | Implemented |
| `POST /community/posts/:id/reports` | `reportPost` | ObjectId path, optional `reason` | Authenticated | Implemented |
| `GET /lost-found` | `listItems` | `q`, `status`, `category`, `page`, `limit` | Authenticated | Implemented |
| `POST /lost-found` | `createItem` | `title`, `category`, `location`, `status`, `description` | Authenticated | Implemented |
| `GET /announcements` | `listAnnouncements` | `q`, `category`, `department`, `page`, `limit` | Authenticated | Implemented |
| `GET /campus/locations` | `listLocations` | `q`, `page`, `limit` | Authenticated | Implemented |
| `GET /users/me` | `getProfile` | — | Authenticated | Implemented |
| `PATCH /users/me` | `updateProfile` | optional `name`, `department`, `bio`, `avatar` | Authenticated | Implemented |
| `GET /dashboard` | `getDashboard` | — | Authenticated | Implemented |
| `POST /assistant/chat` | `chatWithAssistant` | `message`, optional `conversationHistory` | Authenticated | Implemented |
| `GET /admin/summary` | `adminSummary` | — | Admin | Implemented |
| `GET /admin/announcements` | `listManagedAnnouncements` | `q`, `category`, `department`, `status`, `page`, `limit` | Admin | Implemented |
| `POST /admin/announcements` | `createAnnouncement` | announcement fields | Admin | Implemented |
| `PATCH /admin/announcements/:id` | `updateAnnouncement` | optional announcement fields | Admin | Implemented |
| `DELETE /admin/announcements/:id` | `deleteAnnouncement` | ObjectId path | Admin | Implemented |
| `GET /admin/reports` | `listReports` | `status`, `page`, `limit` | Admin | Implemented |
| `PATCH /admin/reports/:id` | `reviewReport` | `status`: `reviewed` or `dismissed` | Admin | Implemented |
| `GET /admin/users` | `listUsers` | `q`, `role`, `status`, `department`, `page`, `limit` | Admin | Implemented |
| `PATCH /admin/users/:id` | `updateUser` | optional `role`, `status` | Admin | Implemented |

Example:

```json
POST /api/community/posts
{
  "body": "Is the library open this evening?",
  "title": "Library hours",
  "category": "Campus life"
}
```

Validation failures, authentication failures, rate-limit responses, not-found errors, and provider failures are returned as JSON errors by the centralized error middleware. There are no registered Express comment or claims routes; report functionality is the implemented moderation mechanism.
