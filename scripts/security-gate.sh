#!/usr/bin/env bash
set -euo pipefail

repo_dir=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)

docker run --rm --volume "$repo_dir:/src:ro" zricethezav/gitleaks:v8.30.1 \
  detect --source=/src --no-banner --redact --no-git

(cd "$repo_dir" && uvx --from semgrep==1.172.0 semgrep scan --config p/default --error)

docker run --rm --volume "$repo_dir:/src:ro" aquasec/trivy:0.73.0 \
  fs --scanners vuln,misconfig,secret --severity HIGH,CRITICAL --ignore-unfixed --exit-code 1 \
  --ignorefile /src/.trivyignore.yaml /src

(cd "$repo_dir" && pnpm audit --prod --audit-level high)
uvx --from pip-audit==2.10.1 pip-audit --requirement \
  <(cd "$repo_dir/apps/api" && uv export --frozen --no-dev --no-emit-project --format requirements-txt)
