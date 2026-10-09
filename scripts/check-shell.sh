#!/usr/bin/env bash
# Every tracked shell script; ShellCheck parses each file, so no separate `bash -n` pass is needed.
set -euo pipefail
repo_dir=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)
cd "$repo_dir"
mapfile -t scripts < <(git ls-files '*.sh')
shellcheck --external-sources --source-path=SCRIPTDIR --severity=style "${scripts[@]}"
