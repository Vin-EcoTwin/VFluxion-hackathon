# Backend - FastAPI Digital Twin Core

Backend duoc to chuc theo huong modular + domain-driven de scale:

- api: routers REST versioned (/api/v1/*).
- domains: nghiep vu entities/simulation/grid.
- ditto_integration: client giao tiep Eclipse Ditto (HTTP + WS).
- websocket: quan ly ket noi realtime.
- core: config, logging, security.
- schemas: Pydantic v2 models.

## Endpoint roadmap

- GET /api/v1/health
- GET/POST /api/v1/entities
- POST /api/v1/simulation/run
- GET/PUT /api/v1/ditto/things/{thing_id}
- WS /ws/realtime

## Chay local

1. Copy env mau:

	Copy-Item .env.example .env

2. Dan MongoDB Atlas URI vao bien MONGO_URI
	(hoac MONGODB_ATLAS_URI) trong file .env.

3. Tao virtual environment:

	python -m venv .venv

4. Kich hoat:

	.venv\Scripts\Activate.ps1

5. Cai dependencies:

	pip install -r requirements.txt

6. Chay backend:

	uvicorn src.main:app --reload --host 0.0.0.0 --port 8000

7. OpenAPI docs:

	http://localhost:8000/docs
