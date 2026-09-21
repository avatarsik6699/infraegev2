#!/usr/bin/env bash
# Explicit CLI model selection outranks the project's everyday Terra default.
set -euo pipefail
repo_dir=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)
cd "$repo_dir"
exec codex --model gpt-6-astra -c 'model_reasoning_effort="medium"' "$@"
