# syntax=docker/dockerfile:1

FROM nginx:1.31.3-alpine@sha256:4a73073bd557c65b759505da037898b61f1be6cbcc3c2c3aeac22d2a470c1752

COPY infra/nginx/nginx.conf /etc/nginx/nginx.conf
COPY infra/nginx/conf.d/infraege.prod.conf /etc/nginx/conf.d/default.conf

EXPOSE 80 443
HEALTHCHECK --interval=30s --timeout=5s --retries=3 CMD nginx -t
