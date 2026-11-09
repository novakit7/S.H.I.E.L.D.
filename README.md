# S.H.I.E.L.D.

## One Campus. One Network. Infinite Connections.

S.H.I.E.L.D. is a campus community platform for announcements, community discussions, lost-and-found listings, campus information, and an AI-assisted campus help experience.

The repository does not define an expanded acronym for “S.H.I.E.L.D.”; this documentation therefore uses the project name without inventing a full form.

> **Documentation status:** This repository contains a working Express/MongoDB API, an independent FastAPI AIML service, and a React/Vite frontend that is partly connected to those services. The frontend currently includes a demonstration layer and must not be treated as the final authorization boundary.

## Overview

The project is organized as three applications:

- `client/` — React 19 and Vite frontend.
- `server/` — Express 5 API backed by MongoDB.
- `aiml/` — independent FastAPI service for assistant and lost-and-found matching experiments.

The platform addresses the fragmentation of campus communication by bringing announcements, peer interaction, campus locations, and item recovery into one interface.

## Objectives and key features

- Centralize campus announcements.
- Enable moderated community posts with anonymous aliases.
- Create and search lost-and-found listings.
- Provide searchable campus locations.
- Support student profiles and administrator workflows.
- Offer a verified-campus-information assistant.
- Provide a separate semantic matching service for lost-and-found candidates.

## Technology stack

| Area | Technologies |
|---|---|
| Client | React, React Router, Vite, Axios, Tailwind CSS, Lucide React |
| Server | Node.js 18.18+, Express, Mongoose, MongoDB, JWT, bcryptjs, Nodemailer |
| Security | Helmet, CORS allow-listing, HTTP-only cookies, rate limiting, request validation |
| AIML | Python, FastAPI, Pydantic, Gemini integration, Sentence Transformers, cosine similarity |

## Architecture

```text
Browser (client)
    |
    | REST / HTTP-only session cookie
    v
Express API (server) ---- MongoDB
    |
    +---- SMTP for registration OTP
    +---- OpenRouter-compatible model for the server assistant

FastAPI AIML service (aiml)
    +---- Gemini assistant integration
    +---- SentenceTransformer lost-and-found matching
```

The AIML service is independently runnable. The current React assistant path calls the Express `/api/assistant/chat` endpoint; it does not automatically proxy through the FastAPI service.

## Repository structure

```text
.
├── client/                 React/Vite application
├── server/                 Express API and Mongoose models
├── aiml/                   FastAPI assistant and matching service
└── docs/                   Architecture, API, schema, setup, and evaluation guides
```

## Prerequisites

- Node.js 18.18 or newer.
- MongoDB for the server.
- Python 3.11+ recommended for the AIML service.
- SMTP credentials for real registration OTP delivery.
- An OpenRouter-compatible API key for the server assistant, if that feature is enabled.
- A Gemini API key for the AIML assistant, if that integration is enabled.

## Installation and environment setup

Each application has its own dependency manifest and environment file. Copy the relevant `.env.example` to `.env`; do not commit secrets.

- Server: see [server/README.md](./server/README.md) and [docs/ENVIRONMENT_SETUP.md](./docs/ENVIRONMENT_SETUP.md).
- Client: see [client/README.md](./client/README.md).
- AIML: see [aiml/README.md](./aiml/README.md).

## Run the project

In separate terminals:

```powershell
cd server
npm install
npm run dev
```

```powershell
cd client
npm install
npm run dev
```

Optional AIML service:

```powershell
cd aiml
python -m venv .venv
.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

The client defaults to `http://localhost:5000/api`. Override it with `VITE_API_URL`.

## Mid-term evaluation notice

The frontend currently has a **temporary route-access bypass for the mid-term evaluation** in the form of local demo authentication and demo data. Evaluators can explore the student and administrator pages without waiting for complete backend integration.

- This is a frontend demonstration mechanism only.
- Several pages render dummy data or local mock services.
- Many displayed operations are not connected to persistent backend functionality.
- Authentication and authorization integration between the frontend and API is still being completed.
- This bypass is not the final security implementation.
- Backend authorization must remain independently enforced.
- Remove the bypass and local demo credentials before production deployment.

Do not describe the current application as fully integrated.

## Development status

| Area | Status |
|---|---|
| Express API, MongoDB models, validation, and server auth | Implemented |
| OTP registration and email delivery | Implemented when SMTP is configured |
| React layouts and major routes | Implemented as UI |
| React data pages and admin tables | Partly demo/local-state based |
| Server OpenRouter assistant | Implemented when configured |
| FastAPI assistant and matching endpoints | Implemented as an independent service |
| Campus map content and interactions | Placeholder/demo |
| Production-ready frontend/API authorization integration | In progress |

## Security considerations

Use a strong production `JWT_SECRET`, HTTPS, restricted `CLIENT_URL`, real SMTP app passwords, and non-demo credentials. Keep server authorization active even while the frontend bypass is present. Review CORS, cookie, rate-limit, validation, and provider-key settings before deployment.

## Future scope

Potential next steps include wiring all frontend pages to the API, replacing local demo authentication, connecting the FastAPI service where appropriate, adding durable map data, expanding moderation workflows, and adding end-to-end integration tests.

## Project information

S.H.I.E.L.D. is a student campus-network project. See the [documentation index](./docs/README.md) for subsystem-specific references.

### Documentation index

- [Client README](./client/README.md)
- [Server README](./server/README.md)
- [AIML README](./aiml/README.md)
- [Architecture](./docs/ARCHITECTURE.md)
- [API documentation](./docs/API_DOCUMENTATION.md)
- [Database schema](./docs/DATABASE_SCHEMA.md)
- [Authentication](./docs/AUTHENTICATION.md)
- [Environment setup](./docs/ENVIRONMENT_SETUP.md)
- [Development status](./docs/DEVELOPMENT_STATUS.md)
- [Evaluation guide](./docs/EVALUATION_GUIDE.md)