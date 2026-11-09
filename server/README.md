# Server

The server is an Express 5 REST API backed by MongoDB and Mongoose. It owns persistent authentication, authorization, content, moderation, announcements, locations, dashboard aggregation, and the OpenRouter-compatible assistant.

## Setup

```powershell
npm install
Copy-Item .env.example .env
npm run dev
```

The server connects to MongoDB before listening. The default port is `5000`.

## Scripts

- `npm run dev` — start with Nodemon.
- `npm start` — start the production process.
- `npm test` — run Node tests.
- `npm run diagnose:openrouter` — diagnose OpenRouter configuration.

## Modules

- `config/` — environment, MongoDB, mail, OpenRouter, and Redis-related configuration.
- `routes/` — HTTP route definitions.
- `controllers/` — request handlers.
- `models/` — Mongoose schemas.
- `services/` — mail, assistant, and optional administrator bootstrap logic.
- `middlewares/` — auth, validation, and error handling.

Registration creates a hashed, expiring OTP challenge and sends it through SMTP. Passwords are hashed with bcrypt. Successful login issues a JWT in an HTTP-only cookie; logout revokes the token. See [../docs/AUTHENTICATION.md](../docs/AUTHENTICATION.md).

All API paths are prefixed with `/api`. See [../docs/API_DOCUMENTATION.md](../docs/API_DOCUMENTATION.md).

The server uses Helmet, CORS allow-listing, request validation, cookie parsing, and route-specific rate limits. CSRF is not separately implemented; the current cookie configuration (`sameSite: lax`) and CORS policy reduce cross-site exposure but do not replace a dedicated CSRF strategy for every deployment.

Nodemailer delivers registration OTP messages. The OpenAI-compatible SDK is configured for OpenRouter through `OPEN_ROUTER_API_KEY` (with `OPENAI_API_KEY` compatibility), verified campus context, and assistant validation/rate limits.

The server is substantially persistent and protected, but the current frontend still uses local demo authentication and local page data.

## Testing

```powershell
npm test
```

The repository currently includes validation-focused Node tests. Provider, SMTP, MongoDB, and browser integration tests require configured external services.
