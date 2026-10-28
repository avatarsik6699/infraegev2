# syntax=docker/dockerfile:1

FROM nginx:1.30.6-alpine@sha256:47928bf67eb62a1863cb08d9ecb52d3e704304ba614eaee17884204677702951

RUN apk update \
    && apk add --upgrade --no-cache \
        brotli-libs=1.2.1-r0 \
        curl=8.23.0-r0 \
        libcurl=8.23.0-r0 \
    && rm -rf /var/cache/apk/*

COPY infra/nginx/nginx.conf /etc/nginx/nginx.conf
COPY infra/nginx/conf.d/infraege.prod.conf /etc/nginx/conf.d/default.conf

COPY infra/nginx/snippets /etc/nginx/snippets
COPY infra/nginx/auxiliary /usr/share/nginx/auxiliary
COPY apps/web/public/brand/kodumka-mark.svg /usr/share/nginx/auxiliary/assets/kodumka-mark.svg
COPY apps/web/public/fonts/onest/ /usr/share/nginx/auxiliary/assets/fonts/onest/

EXPOSE 80 443
HEALTHCHECK --interval=30s --timeout=5s --retries=3 CMD nginx -t
