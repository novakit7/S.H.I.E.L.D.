# Development status

## Implemented

- Express startup, MongoDB connection, health endpoint, centralized errors, validation, CORS, Helmet, and rate limiting.
- Server-side registration OTP flow, bcrypt passwords, JWT cookies, logout revocation, profile, dashboard, content, announcements, moderation, and admin APIs.
- React route tree, layouts, reusable feedback components, student/admin page shells, and assistant interaction UI.
- Independent FastAPI health, assistant, and matching endpoints with tests.

## Feature matrix

| Feature | Frontend | Backend | Database | Integration status |
|---|---|---|---|---|
| Registration and OTP | Mock/local flow | Completed | Completed | Partially implemented |
| Login/session | Mock/local flow | Completed | Completed | Partially implemented |
| Community posts | Demo/local arrays | Completed | Completed | Partially implemented |
| Likes and reports | Demo UI | Completed | Completed | Partially implemented |
| Lost and found | Demo/local arrays | Completed | Completed | Partially implemented |
| Announcements | Demo/local arrays | Completed | Completed | Partially implemented |
| Campus locations/map | Placeholder/demo | Completed list endpoint | Completed | Partially implemented |
| Student profile | Demo content | Completed | Completed | Partially implemented |
| Admin dashboard/tables | Demo content | Completed | Completed | Partially implemented |
| Express assistant | Connected service wrapper | Completed | Not required | Implemented when provider is configured |
| FastAPI AIML assistant | Not connected | Independent service | Not required | Optional/independent |
| FastAPI matching | Not connected | Independent service | Not required | Optional/independent |

## Partial or demonstration-only

- Frontend auth uses local demo users and `localStorage`.
- Dashboard, community, lost-and-found, announcements, profile, map, and admin views primarily render local data from `Pages.jsx`.
- Several buttons and admin actions are presentational rather than persistent API mutations.
- Campus map is a placeholder/“coming soon” experience.
- The Express assistant and AIML assistant are separate integrations; the client currently uses the Express path.

## Not yet production-ready

- Full frontend/API data integration.
- Replacement of embedded demo credentials and route-access behavior.
- Production hardening of the independently exposed AIML service.
- Complete end-to-end coverage across browser, API, database, and providers.
