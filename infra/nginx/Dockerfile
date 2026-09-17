# syntax=docker/dockerfile:1

FROM nginx:1.30.4-alpine@sha256:97d490c12ba55b4946b01546d1c3ed324e8d41ab1c9fcb2a616aa470620e5b46

RUN apk update \
    && apk add --upgrade --no-cache \
        libcrypto3=3.5.8-r0 \
        libssl3=3.5.8-r0 \
        libexpat=2.8.4-r0 \
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
