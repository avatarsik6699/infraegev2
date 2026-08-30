#!/usr/bin/env bash
set -euo pipefail

repo_dir=$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)
mode=${1:---apply}

if [[ $mode != --apply && $mode != --dry-run ]]; then
  echo 'usage: scripts/clean-local-artifacts.sh [--dry-run|--apply]' >&2
  exit 2
fi

remove_path() {
  local target=$1
  [[ $target == "$repo_dir"/* ]] || {
    echo "refusing path outside repository: $target" >&2
    exit 2
  }
  [[ -e $target || -L $target ]] || return 0
  if [[ $mode == --dry-run ]]; then
    printf 'would remove %s\n' "${target#"$repo_dir"/}"
  else
    rm -rf -- "$target"
    printf 'removed %s\n' "${target#"$repo_dir"/}"
  fi
}

static_targets=(
  .lighthouseci
  .output
  .vinxi
  .tanstack
  .fallow
  .fallow-review
  .ruff_cache
  apps/ops
  apps/web/.output
  apps/web/.vinxi
  apps/web/.tanstack
  apps/web/dist
  apps/web/.eslintcache
)

for relative_path in "${static_targets[@]}"; do
  remove_path "$repo_dir/$relative_path"
done

while IFS= read -r profile; do
  remove_path "$profile"
done < <(
  find "$repo_dir" -mindepth 1 -maxdepth 1 -type d \
    -name 'C:\\Users\\user\\AppData\\Local\\lighthouse.*' -print
)

for search_root in "$repo_dir/apps/api" "$repo_dir/ops" "$repo_dir/scripts"; do
  [[ -d $search_root ]] || continue
  while IFS= read -r cache_dir; do
    remove_path "$cache_dir"
  done < <(
    find "$search_root" \
      -type d \( -name .venv -o -name node_modules \) -prune -o \
      -type d \( -name __pycache__ -o -name .pytest_cache -o -name .ruff_cache \) -print
  )
done

empty_candidates=(
  apps/web/.impeccable/live/annotations
  apps/web/.impeccable/live/sessions
  apps/web/src/entities/course/api
  apps/web/src/features/course-progress/model
  apps/web/src/features/course-progress
  apps/web/src/shared/components/popover
)

for relative_path in "${empty_candidates[@]}"; do
  target=$repo_dir/$relative_path
  [[ -d $target ]] || continue
  if [[ -z $(find "$target" -mindepth 1 -print -quit) ]]; then
    remove_path "$target"
  fi
done

for relative_path in apps/web/.impeccable/live apps/web/.impeccable; do
  target=$repo_dir/$relative_path
  [[ -d $target ]] || continue
  if [[ -z $(find "$target" -mindepth 1 -print -quit) ]]; then
    remove_path "$target"
  fi
done

if [[ $mode == --dry-run ]]; then
  echo 'Cleanup dry run complete.'
else
  echo 'Regenerable local reports, retired outputs, and caches removed.'
fi
