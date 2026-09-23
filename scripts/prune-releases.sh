#!/usr/bin/env bash
# Keep the newest KEEP_RELEASES releases on the host, plus the release just deployed and every release
# `current` or `database-current` points to; remove the release directories, uploaded archives,
# deploy scripts and application images of all other SHAs (Change 138). Images still used by a
# container are skipped, never forced. Usage: prune-releases.sh DEPLOYED_SHA
set -euo pipefail

deployed=${1:-}
[[ $deployed =~ ^[0-9a-f]{40}$ ]] || { echo 'usage: prune-releases.sh DEPLOYED_SHA' >&2; exit 64; }
keep=${KEEP_RELEASES:-3}
if ! [[ $keep =~ ^[0-9]+$ ]] || ((keep < 2)); then
  echo 'KEEP_RELEASES must be at least 2' >&2
  exit 64
fi
root=${INFRAEGE_ROOT:-/opt/infraege}
archives=${INFRAEGE_ARCHIVE_DIR:-/root}
releases="$root/releases"
[[ -d $releases ]] || exit 0

declare -A kept=([$deployed]=1)
for link in current database-current; do
  target=$(readlink -f "$root/$link" 2>/dev/null || true)
  [[ -n $target ]] && kept[$(basename -- "$target")]=1
done
# Release directories named by a full SHA, newest first by modification time.
mapfile -t by_age < <(find "$releases" -mindepth 1 -maxdepth 1 -type d -regextype posix-extended \
  -regex '.*/[0-9a-f]{40}' -printf '%T@ %f\n' | sort -rn | cut -d' ' -f2)
for sha in "${by_age[@]:0:keep}"; do kept[$sha]=1; done

pruned=()
for sha in "${by_age[@]}"; do
  [[ -n ${kept[$sha]:-} ]] && continue
  rm -rf -- "${releases:?}/$sha"
  rm -f -- "$archives/infraege-$sha.tar.gz" "$archives/infraege-deploy-$sha.sh"
  pruned+=("$sha")
done

declare -A gone=()
for sha in "${pruned[@]}"; do gone[$sha]=1; done
while read -r image; do
  [[ $image =~ ^ghcr\.io/avatarsik6699/infraegev2-(api|web|nginx):([0-9a-f]{40})$ ]] || continue
  if [[ -n ${gone[${BASH_REMATCH[2]}]:-} ]]; then
    docker rmi "$image" >/dev/null || echo "kept image in use: $image" >&2
  fi
done < <(docker image ls --format '{{.Repository}}:{{.Tag}}')
docker image prune -f >/dev/null

echo "Release retention: kept ${#kept[@]}, pruned ${#pruned[@]} release(s)."
