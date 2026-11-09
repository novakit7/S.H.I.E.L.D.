# Environment setup

Copy each example file to `.env` in its own application directory. Keep real values out of source control.

## Server

| Variable | Required | Default/notes |
|---|---|---|
| `PORT` | No | `5000` |
| `NODE_ENV` | No | `development` |
| `MONGODB_URI` | Production | Local fallback is `mongodb://127.0.0.1:27017/shield` |
| `JWT_SECRET` | Production | At least 32 non-placeholder characters |
| `JWT_EXPIRES_IN` | No | `7d` |
| `CLIENT_URL` | Production | Comma-separated allowed origins |
| `OPEN_ROUTER_API_KEY` | Assistant | Provider key used by OpenRouter config |
| `OPEN_ROUTER_MODEL` | No | `gpt-5.5` |
| `OPEN_ROUTER_MAX_OUTPUT_TOKENS` | No | `600` |
| `OPEN_ROUTER_TIMEOUT` | No | `30000` milliseconds |
| `OPEN_ROUTER_BASE_URL` | No | OpenRouter API base URL |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE` | OTP | SMTP connection |
| `SMTP_USER`, `SMTP_PASS` | Production/OTP | SMTP credentials |
| `MAIL_FROM_NAME`, `MAIL_FROM_EMAIL` | OTP | Sender identity |
| `BOOTSTRAP_ADMIN_*` | Optional | Creates an initial admin when configured |

Aliases also supported by source code are `MONGO_URI`, `mongoUri`, `JWT_KEY`, `EMAIL`, `OPENAI_API_KEY`, `OPENAI_MODEL`, `OPENAI_MAX_OUTPUT_TOKENS`, `OPENAI_TIMEOUT`, and `MONGO_URI`. They exist for compatibility; prefer the names in `server/.env.example`.

## Client

`VITE_API_URL` selects the Express API. `VITE_USE_MOCK_API=true` makes only the assistant client return a local mock response. Current auth demo behavior is in source and is not controlled by an environment flag.

## AIML

`GEMINI_API_KEY` enables Gemini integration. `ENVIRONMENT`, `HOST`, and `PORT` control service execution; the example defaults to development, `127.0.0.1`, and `8000`.

## Local startup

Start MongoDB, then start the server, client, and optionally AIML service as described in the root [README](../README.md).
