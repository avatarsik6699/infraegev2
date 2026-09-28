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
  "$test_root/apps/ops/source" \
  "$test_root/apps/api/.venv/keep" \
  "$test_root/apps/api/app/__pycache__" \
  "$test_root/apps/web/node_modules/keep" \
  "$test_root/apps/web/.fallow" \
  "$test_root/apps/web/src/entities/course/api" \
  "$test_root/docs/artifacts" \
  "$test_root/infra/practice-import-120.local" \
  "$test_root/infra/task-files.local" \
  "$test_root/data"
cp "$repo_dir/scripts/clean-local-artifacts.sh" "$test_root/scripts/clean-local-artifacts.sh"
touch \
  "$test_root/.lighthouseci/report.json" \
  "$test_root/.fallow/cache.json" \
  "$test_root/C:\Users\user\AppData\Local\lighthouse.1234/Local State" \
  "$test_root/apps/ops/source/main.py" \
  "$test_root/apps/api/.venv/keep/python" \
  "$test_root/apps/api/app/__pycache__/module.pyc" \
  "$test_root/apps/web/node_modules/keep/package.json" \
  "$test_root/apps/web/.fallow/cache.bin" \
  "$test_root/data/keep.db" \
  "$test_root/docs/artifacts/authored.md" \
  "$test_root/infra/practice-import-120.local/bank.json" \
  "$test_root/infra/task-files.local/attachment.bin" \
  "$test_root/secrets.enc.yaml" \
  "$test_root/athanor.yaml" \
  "$test_root/.env"

dry_run=$(bash "$test_root/scripts/clean-local-artifacts.sh" --dry-run)
grep -Fq 'would remove .lighthouseci' <<<"$dry_run"
grep -Fq 'would remove C:\Users\user\AppData\Local\lighthouse.1234' <<<"$dry_run"
if grep -Fq 'would remove apps/ops' <<<"$dry_run"; then
  echo 'cleanup dry run unexpectedly selected apps/ops' >&2
  exit 1
fi
test -f "$test_root/.lighthouseci/report.json"

if bash "$test_root/scripts/clean-local-artifacts.sh" --check >/dev/null 2>&1; then
  echo 'cleanup check unexpectedly accepted remaining artifacts' >&2
  exit 1
fi

bash "$test_root/scripts/clean-local-artifacts.sh" --apply >/dev/null
test ! -e "$test_root/.lighthouseci"
test ! -e "$test_root/.fallow"
test ! -e "$test_root/C:\Users\user\AppData\Local\lighthouse.1234"
test -f "$test_root/apps/ops/source/main.py"
test ! -e "$test_root/apps/api/app/__pycache__"
test ! -e "$test_root/apps/web/src/entities/course/api"
test ! -e "$test_root/apps/web/.fallow"
test -f "$test_root/apps/api/.venv/keep/python"
test -f "$test_root/apps/web/node_modules/keep/package.json"
test -f "$test_root/data/keep.db"
test -f "$test_root/.env"
test -f "$test_root/docs/artifacts/authored.md"
test -f "$test_root/infra/practice-import-120.local/bank.json"
test -f "$test_root/infra/task-files.local/attachment.bin"
test -f "$test_root/secrets.enc.yaml"
test -f "$test_root/athanor.yaml"
bash "$test_root/scripts/clean-local-artifacts.sh" --check >/dev/null

# A lexical repository prefix must never permit traversal into external data.
mkdir -p "$test_root/external/.output" "$test_root/symlink-repo/scripts" "$test_root/symlink-repo/apps"
touch "$test_root/external/.output/keep.db"
cp "$repo_dir/scripts/clean-local-artifacts.sh" "$test_root/symlink-repo/scripts/clean-local-artifacts.sh"
ln -s "$test_root/external" "$test_root/symlink-repo/apps/web"
for mode in --dry-run --check --apply; do
  if bash "$test_root/symlink-repo/scripts/clean-local-artifacts.sh" "$mode" >"$test_root/symlink-result" 2>&1; then
    echo "cleanup unexpectedly accepted a symlink ancestor in $mode" >&2
    exit 1
  fi
  grep -Fq 'refusing cleanup through symlink: apps/web' "$test_root/symlink-result"
  test -f "$test_root/external/.output/keep.db"
done

if bash "$test_root/scripts/clean-local-artifacts.sh" --unknown >/dev/null 2>&1; then
  echo 'unknown cleanup mode unexpectedly succeeded' >&2
  exit 1
fi

echo 'local artifact cleanup contract: PASS'
