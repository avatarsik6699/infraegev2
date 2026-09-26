# syntax=docker/dockerfile:1

FROM nginx:1.31.0-alpine@sha256:2f07d83bf561b506400dc183b1b2003803e39efbd22451f848adaba14d28c7c7

RUN apk update \
    && apk add --upgrade --no-cache \
        libcrypto3=3.5.8-r0 \
        libssl3=3.5.8-r0 \
        libexpat=2.8.5-r0 \
        libuuid=2.42.3-r1 \
    && rm -rf /var/cache/apk/*

COPY infra/nginx/nginx.conf /etc/nginx/nginx.conf
COPY infra/nginx/conf.d/infraege.prod.conf /etc/nginx/conf.d/default.conf

COPY infra/nginx/snippets /etc/nginx/snippets
COPY infra/nginx/auxiliary /usr/share/nginx/auxiliary
COPY apps/web/public/brand/infraege-mark.svg /usr/share/nginx/auxiliary/assets/infraege-mark.svg
COPY apps/web/public/fonts/alegreya/ /usr/share/nginx/auxiliary/assets/fonts/alegreya/
COPY apps/web/public/fonts/golos-text/ /usr/share/nginx/auxiliary/assets/fonts/golos-text/

EXPOSE 80 443
HEALTHCHECK --interval=30s --timeout=5s --retries=3 CMD nginx -t
