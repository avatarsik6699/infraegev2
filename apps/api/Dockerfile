# syntax=docker/dockerfile:1

FROM python:3.12-slim@sha256:229a2c5bfa27522db7815ea81f9bed70af17ccb9de9fc7ad142b1877b5830d36
COPY --from=ghcr.io/astral-sh/uv:0.12.3@sha256:2d890623d310b57771ce840f0da5eed5fc6d657da05ffaa45d82797b53fa3abc /uv /uvx /bin/

WORKDIR /app
COPY apps/api/pyproject.toml apps/api/uv.lock* ./
RUN uv sync --frozen --no-dev --no-install-project

COPY apps/api/app ./app
COPY apps/api/entrypoint.sh ./entrypoint.sh
COPY content /content

RUN chmod +x ./entrypoint.sh \
    && useradd --no-create-home --uid 1000 appuser \
    && chown -R appuser:appuser /app
USER appuser

ENV PYTHONPATH=/app
ENV CONTENT_DIR=/content
# No home dir (--no-create-home) — uv otherwise tries to create $HOME/.cache/uv and gets
# EACCES on every `uv run` invocation.
ENV UV_CACHE_DIR=/app/.cache/uv
EXPOSE 8000
HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
  CMD python -c "import urllib.request; urllib.request.urlopen('http://localhost:8000/health/ready', timeout=3)"
CMD ["./entrypoint.sh"]
