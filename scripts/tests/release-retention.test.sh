#!/usr/bin/env bash
# Release retention (Change 138): a deploy keeps the newest releases plus anything still referenced,
# and removes only the directories, archives, deploy scripts and images of pruned SHAs.
set -Eeuo pipefail

repo_dir=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/../.." && pwd)
test_root=$(mktemp -d)
trap 'rm -rf -- "$test_root"' EXIT
root="$test_root/opt" archives="$test_root/root" bin="$test_root/bin"
mkdir -p "$root/releases" "$archives" "$bin"
sha() { printf '%040d' "$1"; }

# Releases 1..6, oldest first; `current` still points to release 2 (a rollback target).
for i in 1 2 3 4 5 6; do
  mkdir "$root/releases/$(sha "$i")"
  touch -d "2026-09-0$i 12:00" "$root/releases/$(sha "$i")"
  touch "$archives/infraege-$(sha "$i").tar.gz" "$archives/infraege-deploy-$(sha "$i").sh"
done
mkdir "$root/releases/not-a-sha"
touch "$archives/infraege-bootstrap.tar.gz"
ln -s "$root/releases/$(sha 2)" "$root/current"
ln -s "$root/releases/$(sha 6)" "$root/database-current"

cat >"$bin/docker" <<'FAKE'
#!/usr/bin/env bash
printf '%s\n' "$*" >>"$DOCKER_LOG"
if [[ $1 == image && $2 == ls ]]; then
  for i in 1 3 6; do
    for app in api web nginx; do
      printf 'ghcr.io/avatarsik6699/infraegev2-%s:%040d\n' "$app" "$i"
    done
  done
  printf 'postgres:18.6-alpine3.24\n'
fi
FAKE
chmod +x "$bin/docker"

run() {
  PATH="$bin:$PATH" DOCKER_LOG="$test_root/docker.log" INFRAEGE_ROOT="$root" \
    INFRAEGE_ARCHIVE_DIR="$archives" bash "$repo_dir/scripts/prune-releases.sh" "$@"
}

run "$(sha 6)"

kept=$(find "$root/releases" -mindepth 1 -maxdepth 1 -printf '%f\n' | sort | tr '\n' ' ')
[[ $kept == "$(sha 2) $(sha 4) $(sha 5) $(sha 6) not-a-sha " ]] || {
  echo "kept releases: $kept" >&2; exit 1
}
for i in 1 3; do
  [[ ! -e $archives/infraege-$(sha "$i").tar.gz && ! -e $archives/infraege-deploy-$(sha "$i").sh ]]
done
for i in 2 4 5 6; do
  [[ -e $archives/infraege-$(sha "$i").tar.gz && -e $archives/infraege-deploy-$(sha "$i").sh ]]
done
[[ -e $archives/infraege-bootstrap.tar.gz ]]

removed=$(grep '^rmi ' "$test_root/docker.log" | tr ' ' '\n' | grep ghcr | sort | tr '\n' ' ')
expected=""
for app in api nginx web; do expected+="ghcr.io/avatarsik6699/infraegev2-$app:$(sha 1) "; done
for app in api nginx web; do expected+="ghcr.io/avatarsik6699/infraegev2-$app:$(sha 3) "; done
expected=$(tr ' ' '\n' <<<"$expected" | grep . | sort | tr '\n' ' ')
[[ $removed == "$expected" ]] || { echo "removed images: $removed" >&2; exit 1; }
if grep -q 'rmi.*--force\|rmi.*-f ' "$test_root/docker.log"; then echo 'forced image removal' >&2; exit 1; fi
[[ $(grep -c '^image prune -f$' "$test_root/docker.log") == 1 ]]

if KEEP_RELEASES=1 run "$(sha 6)" 2>/dev/null; then
  echo 'KEEP_RELEASES=1 accepted' >&2; exit 1
fi
if run not-a-sha 2>/dev/null; then
  echo 'a non-SHA deploy argument was accepted' >&2; exit 1
fi

# The deploy prunes only after the new release is healthy and its rollback trap is cleared.
deploy="$repo_dir/scripts/deploy-remote.sh"
trap_line=$(grep -n '^trap - EXIT INT TERM$' "$deploy" | cut -d: -f1)
# shellcheck disable=SC2016 # a literal $DEPLOY_SHA is what the deploy script contains
prune_line=$(grep -n -F 'scripts/prune-releases.sh" "$DEPLOY_SHA" ||' "$deploy" | cut -d: -f1)
if [[ -z $trap_line || -z $prune_line ]] || ((trap_line > prune_line)); then
  echo "deploy-remote.sh must prune after clearing its rollback trap" >&2; exit 1
fi

echo "release-retention: ok"
