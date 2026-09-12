#!/usr/bin/env bash
set -euo pipefail
repo_dir=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/../.." && pwd)
test_root=$(mktemp -d)
trap 'rm -rf -- "$test_root"' EXIT
mkdir "$test_root/bin"
cat >"$test_root/bin/docker" <<'FAKE'
#!/usr/bin/env bash
echo 'unexpected Docker access' >>"$DB_TEST_LOG"
exit 99
FAKE
cp "$test_root/bin/docker" "$test_root/bin/restic"
chmod +x "$test_root/bin/docker" "$test_root/bin/restic"
export PATH="$test_root/bin:$PATH" DB_TEST_LOG="$test_root/access.log"
reject() {
  if "$@" >"$test_root/output" 2>&1; then
    echo 'unsafe invocation accepted' >&2; exit 1
  fi
  [[ ! -e $DB_TEST_LOG ]]
}
reject env DB_ENV=dev DB_PROJECT=infraege bash "$repo_dir/scripts/backup.sh" /not/read
reject env DB_ENV=prod DB_PROJECT=infraege-ops bash "$repo_dir/scripts/backup.sh" /not/read
reject env DB_ENV=prod DB_PROJECT=infraege bash "$repo_dir/scripts/restore-check.sh"
reject env DB_ENV=restore DB_PROJECT=infraege bash "$repo_dir/scripts/restore-check.sh"
reject env DB_ENV=dev DB_PROJECT=infraege-dev bash "$repo_dir/scripts/db-export.sh" "$test_root/export"
reject env DB_ENV=prod DB_PROJECT=infraege bash "$repo_dir/scripts/db-export.sh" "$test_root"
source "$repo_dir/scripts/lib/application-db.sh"
mkdir "$test_root/bundle"
if db_validate_bundle "$test_root/bundle" >/dev/null 2>&1; then exit 1; fi
echo 'application backup/restore fail-closed contracts: PASS (real SQL proof: practice-db-foundation.test.sh)'
