# syntax=docker/dockerfile:1

FROM python:3.12-slim@sha256:7a8b475003c4fe15a2cd4e55e5cfc2f3560bdc9333d624f24cdd6d4340fd7a17

RUN apt-get update \
    && DEBIAN_FRONTEND=noninteractive apt-get install -y --no-install-recommends --only-upgrade \
        bsdutils=1:2.41.5-0+deb13u1 \
        libblkid1=2.41.5-0+deb13u1 \
        liblastlog2-2=2.41.5-0+deb13u1 \
        libmount1=2.41.5-0+deb13u1 \
        libsmartcols1=2.41.5-0+deb13u1 \
        libssl3t64=3.5.7-1~deb13u2 \
        libuuid1=2.41.5-0+deb13u1 \
        login=1:4.16.0-2+really2.41.5-0+deb13u1 \
        mount=2.41.5-0+deb13u1 \
        openssl=3.5.7-1~deb13u2 \
        openssl-provider-legacy=3.5.7-1~deb13u2 \
        util-linux=2.41.5-0+deb13u1 \
    && rm -rf /var/lib/apt/lists/*

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
