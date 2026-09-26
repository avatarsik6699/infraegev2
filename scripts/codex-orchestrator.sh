#!/usr/bin/env bash
# Load the trusted repository's native agent setup; preserve normal CLI overrides.
set -euo pipefail
repo_dir=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)
cd "$repo_dir"
exec codex "$@"
