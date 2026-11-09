# S.H.I.E.L.D. API integration context

This file records the Express contract used by the React client. The backend is the source of truth. The client uses `VITE_API_URL` (default `http://localhost:5000/api`) and Axios `withCredentials: true` so the server's HTTP-only cookies are sent.

## Authentication contract

- Session cookie: `shield_token`, set by the server on login or OTP verification.
- Registration cookie: `shield_registration`, set by registration and used by OTP verification/resend.
- The server also returns a JWT in the login/verification response, but the client does not persist it in browser storage.
- Mutating cookie-authenticated requests must originate from the configured client origin; the backend performs this CSRF-origin check.
- Roles: `student`, `faculty`, `publisher`, `moderator`, `admin`.
- Active, verified users are required by `requireAuth`; `/admin/*` additionally requires `admin`.
- Express responses use `{ success, message, data }`; errors use `{ success: false, message, error: { code, details? } }`.

## Endpoint inventory

| Module | Method | Endpoint | Auth / role | Request data | Success data | Controller/service | Status |
|---|---|---|---|---|---|---|---|
| Auth | POST | `/auth/register` | Public | `name`, `email`, `studentId`, `department`, `password` | `email`, `expiresAt`, `registrationToken` | `register` / mail service | Integrated |
| Auth | POST | `/auth/verify-otp` | Registration cookie/token | `code`, optional `registrationToken` | `user`, `token` | `verifySignup` | Integrated |
| Auth | POST | `/auth/resend-otp` | Registration cookie/token | optional `registrationToken` | `email`, `expiresAt` | `resendOtp` / mail service | Integrated |
| Auth | POST | `/auth/login` | Public | `email`, `password` | `user`, `token` | `login` | Integrated |
| Auth | GET | `/auth/me` | Authenticated | — | `user` | `getCurrentUser` | Integrated |
| Auth | POST | `/auth/logout` | Authenticated | — | `null` | `logout` | Integrated |
| User | GET | `/users/me` | Authenticated | — | `user`, `activity` | `getProfile` | Integrated |
| User | PATCH | `/users/me` | Authenticated | optional `name`, `department`, `bio`, `avatar` | `user` | `updateProfile` | Integrated |
| Dashboard | GET | `/dashboard` | Authenticated | — | stats, announcements, posts, lostFoundItems | `getDashboard` | Integrated |
| Community | GET | `/community/posts` | Authenticated | query `q`, `category`, `page`, `limit`, `sort` | `items`, `pagination` | `listPosts` | Integrated |
| Community | POST | `/community/posts` | Authenticated | `body`, optional `title`, `category` | `post` | `createPost` | Integrated |
| Community | POST | `/community/posts/:id/likes` | Authenticated | ObjectId path | `likes`, `liked` | `toggleLike` | Integrated |
| Reports | POST | `/community/posts/:id/reports` | Authenticated | optional `reason` | `reportId`, `status` | `reportPost` | Integrated |
| Lost & Found | GET | `/lost-found` | Authenticated | query `q`, `status`, `category`, `page`, `limit` | `items`, `pagination` | `listItems` | Integrated |
| Lost & Found | POST | `/lost-found` | Authenticated | `title`, `category`, `location`, `status`, `description` | `item` | `createItem` | Integrated |
| Announcements | GET | `/announcements` | Authenticated | query `q`, `category`, `department`, `page`, `limit` | `items`, `pagination` | `listAnnouncements` | Integrated |
| Locations | GET | `/campus/locations` | Authenticated | query `q`, `page`, `limit` | `items`, `pagination` | `listLocations` | Integrated |
| Admin | GET | `/admin/summary` | Admin | — | summary counters | `adminSummary` | Integrated |
| Admin | GET | `/admin/announcements` | Admin | announcement filters and pagination | `items`, `pagination` | `listManagedAnnouncements` | Integrated |
| Admin | POST | `/admin/announcements` | Admin | announcement fields | `announcement` | `createAnnouncement` | Not connected to UI create form |
| Admin | PATCH | `/admin/announcements/:id` | Admin | partial announcement fields | `announcement` | `updateAnnouncement` | Service available; UI edit unavailable |
| Admin | DELETE | `/admin/announcements/:id` | Admin | ObjectId path | `id` | `deleteAnnouncement` | Integrated |
| Admin | GET | `/admin/reports` | Admin | `status`, `page`, `limit` | `items`, `pagination` | `listReports` | Integrated |
| Admin | PATCH | `/admin/reports/:id` | Admin | `status` = `reviewed` or `dismissed` | `id`, `status`, `reviewedAt` | `reviewReport` | Integrated |
| Admin | GET | `/admin/users` | Admin | `q`, `role`, `status`, `department`, `page`, `limit` | `items`, `pagination` | `listUsers` | Integrated |
| Admin | PATCH | `/admin/users/:id` | Admin | optional `role`, `status` | `user` | `updateUser` | Integrated |
| Assistant | POST | `/assistant/chat` | Authenticated | `message`, optional `conversationHistory` | `reply`, `conversationId` | `chatWithAssistant` / OpenRouter service | Integrated |

## Unavailable backend capabilities

The backend has no registered endpoints for comments, individual post retrieval/update/delete, claims, individual lost-and-found retrieval/update/delete, announcement details, password changes, image uploads, or map categories. The client does not fabricate those operations. The Python AIML service is intentionally not called by this frontend.

## Frontend mapping

| Client service | Pages/components |
|---|---|
| `authService.js` | `AuthPages.jsx`, `AuthContext.jsx` |
| `userService.js` | Dashboard and Profile |
| `communityService.js` | Community and `PostCard` |
| `lostFoundService.js` | Lost & Found |
| `announcementService.js` | Announcements |
| `locationService.js` | Campus Map |
| `adminService.js` | Admin dashboard and management pages |
| `assistantService.js` | Assistant page |

## Verification state

The service methods and page wiring are statically checked by the client build. Live endpoint testing requires MongoDB, SMTP, and provider configuration; no live integration result is claimed when those dependencies are unavailable.
