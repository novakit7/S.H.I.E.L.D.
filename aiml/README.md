# AIML service

This directory contains an independent FastAPI service for campus question answering and lost-and-found similarity matching.

## Setup and run

```powershell
python -m venv .venv
.venv\Scripts\Activate.ps1
pip install -r requirements.txt
Copy-Item .env.example .env
uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

Configuration includes `GEMINI_API_KEY`, `ENVIRONMENT`, `HOST`, and `PORT`.

## Endpoints

- `GET /health`
- `POST /api/assistant/chat` — accepts `{ "question": "..." }` and returns an answer and source.
- `POST /api/matching/find` — accepts a query item, candidate items, and a result limit; returns ranked matches.

## Implementation

- `app/core/gemini.py` integrates Gemini and handles missing or unusable keys.
- `app/core/similarity.py` combines text embeddings and location/date signals.
- `app/services/assistant_service.py` loads `app/knowledge_base/campus_data.json`.
- `app/services/matching_service.py` ranks lost-and-found candidates.
- `app/api/` contains FastAPI routes and Pydantic schemas.

The service enables permissive CORS for its current development foundation. It is not automatically used by the React assistant, which currently calls the Express assistant endpoint.

## Tests

```powershell
pytest
```
