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
| `VITE_USE_MOCK_API` | When `true`, the assistant service returns a local mock response |

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

`src/services/api.js` and `assistantService.js` can call the Express API. The current `authService.js` uses embedded demo users and `localStorage` rather than server auth endpoints. Most content and admin displays also contain local/demo data in `Pages.jsx`; some controls are presentational.

Demo accounts currently embedded in the client:

- Student: `student@shield.demo` / `S.H.I.E.L.D.123!`
- Admin: `admin@shield.demo` / `Admin123!`

These credentials and local route-access behavior are for mid-term evaluation only. Remove them before production and connect pages to authenticated API calls.

## UI behavior

Reusable cards and layouts provide consistent presentation. Skeleton loaders and `PageLoader` cover loading states, `ErrorState` and `EmptyState` cover failure/empty states, and the toast/modal providers expose feedback and confirmation flows. The assistant supports suggested prompts, retries, clearing the conversation, and mock mode.
