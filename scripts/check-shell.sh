#!/usr/bin/env bash
# Focused maintenance boundary; grow this allowlist when migrating additional shell owners.
set -euo pipefail
repo_dir=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)
cd "$repo_dir"
scripts=(
  scripts/check-shell.sh scripts/backup.sh scripts/restore-check.sh scripts/db-export.sh
  scripts/purge-account-artifacts.sh scripts/tests/account-retention.test.sh
  ops/install-backup-timers.sh
  scripts/rehearse-account-cutover.sh scripts/lib/account-cutover.sh scripts/tests/account-cutover.test.sh
  scripts/db-provision-roles.sh scripts/db-inventory.sh
  scripts/tests/auth-edge.test.sh
  scripts/deploy-remote.sh scripts/lib/application-db.sh scripts/lib/application-db-release.sh
  scripts/tests/practice-read-limit.test.sh
  scripts/codex-orchestrator.sh
  scripts/security-gate.sh scripts/run-browser-portfolio.sh scripts/run-isolated-browser-audit.sh
)
for script in "${scripts[@]}"; do bash -n "$script"; done
shellcheck --external-sources --source-path=SCRIPTDIR --severity=style "${scripts[@]}"
