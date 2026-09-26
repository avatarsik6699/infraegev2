#!/usr/bin/env bash
set -euo pipefail

portfolio=${1:-}
if [[ $portfolio != production || $# -ne 1 ]]; then
  echo "usage: $0 production" >&2
  exit 64
fi

# One production build feeds the smoke and layout assertions in one Playwright run.
pnpm --filter web build
pnpm --filter web test:browser:production:once
