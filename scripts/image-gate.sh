#!/usr/bin/env bash
set -euo pipefail

repo_dir=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)
images=(infraege-gate-web infraege-gate-api infraege-gate-nginx)

docker build --file "$repo_dir/apps/web/Dockerfile" \
  --build-arg SITE_URL=https://infraege.ru \
  --build-arg VITE_FEEDBACK_URL=https://infraege.ru/feedback \
  --build-arg VITE_UMAMI_WEBSITE_ID=00000000-0000-0000-0000-000000000000 \
  --tag "${images[0]}:local" "$repo_dir"
docker build --file "$repo_dir/apps/api/Dockerfile" --tag "${images[1]}:local" "$repo_dir"
docker build --file "$repo_dir/infra/nginx/Dockerfile" --tag "${images[2]}:local" "$repo_dir"

for image in "${images[@]}"; do
  docker run --rm aquasec/trivy:0.73.0 image \
    --severity HIGH,CRITICAL --ignore-unfixed --exit-code 1 "$image:local"
done
