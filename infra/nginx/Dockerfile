# syntax=docker/dockerfile:1

FROM nginx:1.31.5-alpine@sha256:72ba65eb42c10344912a84ff42408db7d34f2feb642204570ab8fc5ffd29f1d3

RUN apk update \
    && apk add --upgrade --no-cache \
        libcrypto3=3.5.8-r0 \
        libssl3=3.5.8-r0 \
        libexpat=2.8.4-r0 \
    && rm -rf /var/cache/apk/*

COPY infra/nginx/nginx.conf /etc/nginx/nginx.conf
COPY infra/nginx/conf.d/infraege.prod.conf /etc/nginx/conf.d/default.conf

EXPOSE 80 443
HEALTHCHECK --interval=30s --timeout=5s --retries=3 CMD nginx -t
