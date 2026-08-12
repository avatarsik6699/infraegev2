#!/usr/bin/env bash
set -euo pipefail

repo_dir=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)
images=(infraege-gate-web infraege-gate-api infraege-gate-nginx)
scan_root=${TMPDIR:-/tmp}
if [[ -d /mnt/wsl && -w /mnt/wsl ]]; then
  scan_root=/mnt/wsl
fi
scan_dir=$(mktemp -d "$scan_root/infraege-image-gate.XXXXXX")
cache_dir="$scan_dir/cache"
mkdir "$cache_dir"
trap 'rm -rf "$scan_dir"' EXIT

docker build --pull --file "$repo_dir/apps/web/Dockerfile" \
  --build-arg SITE_URL=https://infraege.ru \
  --build-arg VITE_FEEDBACK_URL=https://infraege.ru/feedback \
  --build-arg VITE_UMAMI_WEBSITE_ID=00000000-0000-0000-0000-000000000000 \
  --tag "${images[0]}:local" "$repo_dir"
docker build --pull --file "$repo_dir/apps/api/Dockerfile" --tag "${images[1]}:local" "$repo_dir"
docker build --pull --file "$repo_dir/infra/nginx/Dockerfile" --tag "${images[2]}:local" "$repo_dir"

for image in "${images[@]}"; do
  archive="$scan_dir/${image}.tar"
  docker image save --output "$archive" "$image:local"
  docker run --rm \
    --user "$(id -u):$(id -g)" \
    --mount "type=bind,src=$archive,dst=/scan/${image}.tar,readonly" \
    --mount "type=bind,src=$cache_dir,dst=/tmp/trivy-cache" \
    aquasec/trivy:0.73.0 image \
    --cache-dir /tmp/trivy-cache \
    --input "/scan/${image}.tar" \
    --severity HIGH,CRITICAL --ignore-unfixed --exit-code 1
done
