#!/usr/bin/env bash
set -euo pipefail

repo_dir=$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd -P)
mode=${1:---apply}
artifacts_found=0
removed_count=0

if [[ $mode != --apply && $mode != --dry-run && $mode != --check ]]; then
  echo 'usage: scripts/clean-local-artifacts.sh [--dry-run|--check|--apply]' >&2
  exit 2
fi

require_local_parent() {
  local target=$1
  [[ $target == "$repo_dir"/* ]] || {
    echo "refusing path outside repository: $target" >&2
    exit 2
  }
  local parent=${target%/*}
  while [[ $parent != "$repo_dir" ]]; do
    if [[ -L $parent ]]; then
      echo "refusing cleanup through symlink: ${parent#"$repo_dir"/}" >&2
      exit 2
    fi
    parent=${parent%/*}
  done
}

remove_path() {
  local target=$1
  require_local_parent "$target"
  [[ -e $target || -L $target ]] || return 0
  case $mode in
    --dry-run)
      printf 'would remove %s\n' "${target#"$repo_dir"/}"
      ;;
    --check)
      printf 'artifact remains %s\n' "${target#"$repo_dir"/}"
      artifacts_found=1
      ;;
    --apply)
      rm -rf -- "$target"
      removed_count=$((removed_count + 1))
      ;;
  esac
}

static_targets=(
  .lighthouseci
  .output
  .vinxi
  .tanstack
  .fallow
  .fallow-review
  apps/web/.output
  apps/web/.vinxi
  apps/web/.tanstack
  apps/web/.fallow
  apps/web/dist
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

# Lint and test caches (.eslintcache, .ruff_cache, .pytest_cache) stay: the next gate reuses them.
for search_root in "$repo_dir/apps/api" "$repo_dir/ops" "$repo_dir/scripts" "$repo_dir/content" "$repo_dir/docs/artifacts"; do
  require_local_parent "$search_root/cache"
  [[ -d $search_root ]] || continue
  while IFS= read -r cache_dir; do
    remove_path "$cache_dir"
  done < <(
    find "$search_root" \
      -type d \( -name .venv -o -name node_modules \) -prune -o \
      -type d -name __pycache__ -print
  )
done

empty_candidates=(
  apps/web/.impeccable/live/annotations
  apps/web/.impeccable/live/sessions
)

for relative_path in "${empty_candidates[@]}"; do
  target=$repo_dir/$relative_path
  require_local_parent "$target/entry"
  [[ -d $target ]] || continue
  if [[ -z $(find "$target" -mindepth 1 -print -quit) ]]; then
    remove_path "$target"
  fi
done

for relative_path in apps/web/.impeccable/live apps/web/.impeccable; do
  target=$repo_dir/$relative_path
  require_local_parent "$target/entry"
  [[ -d $target ]] || continue
  if [[ -z $(find "$target" -mindepth 1 -print -quit) ]]; then
    remove_path "$target"
  fi
done

case $mode in
  --dry-run)
    echo 'Cleanup dry run complete.'
    ;;
  --check)
    if ((artifacts_found > 0)); then
      echo 'Repository still contains allowlisted local artifacts.' >&2
      exit 1
    fi
    echo 'Repository contains no allowlisted local artifacts.'
    ;;
  --apply)
    # Applying re-scans with --check so one command both cleans and proves the result.
    echo "Removed $removed_count regenerable local artifact path(s)."
    exec bash "$0" --check
    ;;
esac
