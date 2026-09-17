#!/usr/bin/env bash
# Focused maintenance boundary; grow this allowlist when migrating additional shell owners.
set -euo pipefail
repo_dir=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)
cd "$repo_dir"
scripts=(
  scripts/check-shell.sh scripts/backup.sh scripts/restore-check.sh scripts/db-export.sh
  scripts/db-provision-roles.sh scripts/db-inventory.sh
  scripts/deploy-remote.sh scripts/lib/application-db.sh scripts/lib/application-db-release.sh
)
for script in "${scripts[@]}"; do bash -n "$script"; done
shellcheck --external-sources --source-path=SCRIPTDIR --severity=style "${scripts[@]}"
