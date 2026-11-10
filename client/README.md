# Client

The client is a React 19 single-page application built with Vite. It provides public landing and authentication screens, student-facing campus pages, an assistant chat interface, and administrator views.

## Setup

```powershell
npm install
Copy-Item .env.example .env
npm run dev
```

The default API base URL is `http://localhost:5000/api`.

| Variable | Purpose |
|---|---|
| `VITE_API_URL` | Express API base URL |

## Scripts

`npm run dev`, `npm run build`, `npm run lint`, and `npm run preview` are available.

## Structure

- `src/routes/` — React Router route tree and guards.
- `src/pages/` — public, authentication, student, assistant, profile, and admin pages.
- `src/components/` — layouts, cards, common controls, loaders, errors, toasts, and modals.
- `src/context/` and `src/hooks/` — auth, toast, modal, and convenience hooks.
- `src/services/` — Axios client, auth service, and assistant service.
- `src/styles/` — global, component, and variable styles.

## Routes

Public routes are `/`, `/login`, `/register`, and `/verify-otp`. Authenticated routes are `/dashboard`, `/community`, `/lost-found`, `/announcements`, `/campus-map`, `/assistant`, and `/profile`. Administrator routes are `/admin`, `/admin/announcements`, `/admin/reports`, and `/admin/users`. `/access-denied` and `/404` provide fallback screens.

Client guards improve navigation UX but are not a security boundary; the server must enforce authorization.

## Current integration status

The client uses the Express API for authentication, OTP verification, dashboard, community posts, likes/reports, lost-and-found listings, announcements, campus locations, profiles, administrator operations, and assistant chat. Sessions use the server's HTTP-only cookies; the client does not persist passwords or JWTs in browser storage.

The backend has no comment, claim, file-upload, password-change, or individual-resource endpoints, so the client does not fabricate those operations. The Python AIML service is intentionally independent and is not called by this application. See [docs/API_INTEGRATION_CONTEXT.md](./docs/API_INTEGRATION_CONTEXT.md) for the complete mapping and remaining limitations.

## UI behavior

Reusable cards and layouts provide consistent presentation. Skeleton loaders and `PageLoader` cover loading states, `ErrorState` and `EmptyState` cover failure/empty states, and the toast/modal providers expose feedback and confirmation flows. The assistant supports retries and clearing the conversation.
