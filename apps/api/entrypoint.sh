#!/bin/sh
set -e

# uv run alembic upgrade head   # placeholder — no DB models exist yet (docs/SPEC.md §3);
                                 # uncomment once a future analytics change adds one.

if [ "${APP_ENV}" = "development" ]; then
  exec uv run uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
else
  exec uv run uvicorn app.main:app --host 0.0.0.0 --port 8000
fi
