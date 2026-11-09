# Evaluation guide

## Start services

1. Start MongoDB.
2. Configure `server/.env` and run `npm run dev` in `server/`.
3. Run `npm run dev` in `client/`.
4. Optionally configure and run `aiml/` on port 8000.

Check `GET http://localhost:5000/api/health` and, if running, `GET http://localhost:8000/health`.

## Frontend demonstration accounts

The current evaluation UI includes local demo accounts:

- Student: `student@shield.demo` / `S.H.I.E.L.D.123!`
- Admin: `admin@shield.demo` / `Admin123!`

These accounts exercise client-only route guards and page demonstrations. They do not prove that a server session is established.

## Suggested walkthrough

1. Visit landing and authentication screens.
2. Open dashboard, community, lost-and-found, announcements, campus map, assistant, and profile.
3. Sign in as the admin demo and inspect administrator overview, announcement, report, and user tables.
4. Independently test Express health, auth, content, and admin endpoints with a real server account.
5. Run AIML tests and exercise its assistant and matching endpoints separately.

## Evaluation caveats

The frontend bypass is only for navigation and demonstration. Dummy data, local sessions, placeholder map content, and unpersisted UI actions must be reported as such. Backend authorization remains authoritative and must be tested independently. Remove demo credentials and bypass behavior before production deployment.
