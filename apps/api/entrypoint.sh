#!/bin/sh
set -e

# uv run alembic upgrade head   # placeholder — no DB models exist yet (docs/SPEC.md §3);
                                 # uncomment once a future analytics change adds one.

if [ "${APP_ENV}" = "development" ]; then
  exec .venv/bin/uvicorn app.main:app --no-access-log --host 0.0.0.0 --port 8000 \
    --reload --reload-dir /app
else
  # Middleware emits structured path-only events; Uvicorn's access format includes query strings.
  exec .venv/bin/uvicorn app.main:app --no-access-log --host 0.0.0.0 --port 8000
fi
