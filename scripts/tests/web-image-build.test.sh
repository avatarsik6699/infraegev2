#!/usr/bin/env bash
# Web image builder (Change 137): when the `pnpm install` layer is restored from the build cache and
# `COPY apps/web` is fresh, the manifests are newer than the install and pnpm's deep dependency
# check rejects the tree. The builder re-runs the frozen install offline after copying the sources,
# and the workspace keeps verifying dependencies before every run.
set -Eeuo pipefail

repo_dir=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/../.." && pwd)
dockerfile="$repo_dir/apps/web/Dockerfile"

# Instructions of the builder stage, one per line.
builder=$(awk '/^FROM /{inside = / AS builder$/; next} inside && NF' "$dockerfile")

line_of() {
  grep -Fxn "$1" <<<"$builder" | cut -d: -f1
}

copy=$(line_of 'COPY apps/web apps/web')
install=$(line_of 'RUN pnpm install --frozen-lockfile --offline')
build=$(line_of 'RUN pnpm --filter web build')
[[ -n $copy && -n $install && -n $build ]]
((copy < install && install < build))

grep -Fxq 'verifyDepsBeforeRun: error' "$repo_dir/pnpm-workspace.yaml"

echo "web-image-build: ok"
