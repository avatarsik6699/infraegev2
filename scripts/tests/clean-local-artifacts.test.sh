#!/usr/bin/env bash
set -euo pipefail

repo_dir=$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)
test_root=$(mktemp -d)
trap 'rm -rf -- "$test_root"' EXIT

mkdir -p \
  "$test_root/scripts" \
  "$test_root/.lighthouseci" \
  "$test_root/.fallow" \
  "$test_root/C:\Users\user\AppData\Local\lighthouse.1234" \
  "$test_root/apps/ops/dist" \
  "$test_root/apps/api/.venv/keep" \
  "$test_root/apps/api/app/__pycache__" \
  "$test_root/apps/web/node_modules/keep" \
  "$test_root/apps/web/src/entities/course/api" \
  "$test_root/data"
cp "$repo_dir/scripts/clean-local-artifacts.sh" "$test_root/scripts/clean-local-artifacts.sh"
touch \
  "$test_root/.lighthouseci/report.json" \
  "$test_root/.fallow/cache.json" \
  "$test_root/C:\Users\user\AppData\Local\lighthouse.1234/Local State" \
  "$test_root/apps/ops/dist/main.js" \
  "$test_root/apps/api/.venv/keep/python" \
  "$test_root/apps/api/app/__pycache__/module.pyc" \
  "$test_root/apps/web/node_modules/keep/package.json" \
  "$test_root/data/keep.db" \
  "$test_root/.env"

dry_run=$(bash "$test_root/scripts/clean-local-artifacts.sh" --dry-run)
grep -Fq 'would remove .lighthouseci' <<<"$dry_run"
grep -Fq 'would remove apps/ops' <<<"$dry_run"
grep -Fq 'would remove C:\Users\user\AppData\Local\lighthouse.1234' <<<"$dry_run"
test -f "$test_root/.lighthouseci/report.json"

bash "$test_root/scripts/clean-local-artifacts.sh" --apply >/dev/null
test ! -e "$test_root/.lighthouseci"
test ! -e "$test_root/.fallow"
test ! -e "$test_root/C:\Users\user\AppData\Local\lighthouse.1234"
test ! -e "$test_root/apps/ops"
test ! -e "$test_root/apps/api/app/__pycache__"
test ! -e "$test_root/apps/web/src/entities/course/api"
test -f "$test_root/apps/api/.venv/keep/python"
test -f "$test_root/apps/web/node_modules/keep/package.json"
test -f "$test_root/data/keep.db"
test -f "$test_root/.env"

if bash "$test_root/scripts/clean-local-artifacts.sh" --unknown >/dev/null 2>&1; then
  echo 'unknown cleanup mode unexpectedly succeeded' >&2
  exit 1
fi

echo 'local artifact cleanup contract: PASS'
