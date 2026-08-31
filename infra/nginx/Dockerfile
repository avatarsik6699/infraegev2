# syntax=docker/dockerfile:1

FROM nginx:1.31.4-alpine@sha256:db35bfc6b2951e7f8a72db5db120288c127ffaeeb4a6d4b95a26fead017d5913

RUN apk update \
    && apk add --upgrade --no-cache \
        libcrypto3=3.5.8-r0 \
        libssl3=3.5.8-r0 \
    && rm -rf /var/cache/apk/*

COPY infra/nginx/nginx.conf /etc/nginx/nginx.conf
COPY infra/nginx/conf.d/infraege.prod.conf /etc/nginx/conf.d/default.conf

EXPOSE 80 443
HEALTHCHECK --interval=30s --timeout=5s --retries=3 CMD nginx -t
