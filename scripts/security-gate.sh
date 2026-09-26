#!/usr/bin/env bash
set -euo pipefail

repo_dir=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)

usage() {
  cat <<'EOF'
Usage:
  security-gate.sh [weekly]
  security-gate.sh pre-push <base-commit> <head-commit>
  security-gate.sh changed-dependencies <base-commit> <head-commit>
  security-gate.sh secrets|history|sast|config|dependencies

With no arguments (or `weekly`), run the broad repository audit. `pre-push` scans
every commit in the unpublished base..head range for secrets. `changed-dependencies`
audits ecosystems with dependency manifests or lockfiles changed in that range.
Commit arguments must be locally available full commit IDs (40 or 64 hex digits).
The candidate head must be the checked-out HEAD; neither command accepts a stale candidate.
EOF
}

die() {
  printf 'security-gate: %s\n' "$*" >&2
  exit 2
}

check_commit() {
  local commit=$1 label=$2 resolved
  [[ "$commit" =~ ^([[:xdigit:]]{40}|[[:xdigit:]]{64})$ ]] ||
    die "$label must be a full 40- or 64-character commit ID"
  resolved=$(git -C "$repo_dir" rev-parse --verify "${commit}^{commit}" 2>/dev/null) ||
    die "$label commit is unavailable locally; refusing to skip the security check"
  [[ "${resolved,,}" == "${commit,,}" ]] ||
    die "$label did not resolve to the supplied commit ID"
}

check_range() {
  local base=$1 head=$2 checked_out_head
  check_commit "$base" base
  check_commit "$head" head
  git -C "$repo_dir" merge-base --is-ancestor "$base" "$head" 2>/dev/null ||
    die "base is not an ancestor of head; refusing an ambiguous range"
  git -C "$repo_dir" rev-list --count "$base..$head" >/dev/null ||
    die "could not enumerate the requested commit range"
  checked_out_head=$(git -C "$repo_dir" rev-parse --verify HEAD) ||
    die "could not identify the checked-out commit"
  [[ "${checked_out_head,,}" == "${head,,}" ]] ||
    die "head must be the checked-out commit so the candidate matches the requested range"
}

gitleaks_dir() {
  docker run --rm --volume "$repo_dir:/src:ro" zricethezav/gitleaks:v8.30.1 \
    dir /src --config=/src/.gitleaks.toml --no-banner --redact
}

gitleaks_history() {
  local log_opts=$1
  docker run --rm --volume "$repo_dir:/src:ro" zricethezav/gitleaks:v8.30.1 \
    git --log-opts="$log_opts" --config=/src/.gitleaks.toml --no-banner --redact /src
}

run_sast() {
  (cd "$repo_dir" && uvx --from semgrep==1.172.0 semgrep scan --config p/default --error)
}

run_config() {
  docker run --rm --volume "$repo_dir:/src:ro" aquasec/trivy:0.73.0 \
    fs --scanners vuln,misconfig,secret --severity HIGH,CRITICAL --ignore-unfixed --exit-code 1 \
    --ignorefile /src/.trivyignore.yaml /src
}

run_pnpm_audit() {
  (cd "$repo_dir" && pnpm audit --audit-level high)
}

run_python_audit() (
  local requirements_file
  requirements_file=$(mktemp /tmp/infraege-python-audit.XXXXXX)
  trap 'rm -f -- "$requirements_file"' EXIT
  (cd "$repo_dir/apps/api" && uv export --locked --all-groups --no-emit-project \
    --format requirements-txt >"$requirements_file")
  (cd "$repo_dir" && uvx --from pip-audit==2.10.1 pip-audit --requirement "$requirements_file")
)

run_dependency_audits() {
  run_pnpm_audit
  run_python_audit
}

audit_changed_dependencies() {
  local base=$1 head=$2 changed_paths="" path pnpm_changed=false python_changed=false
  check_range "$base" "$head"
  git -C "$repo_dir" diff --quiet "$head" -- \
    ':(glob)**/package.json' pnpm-lock.yaml pnpm-workspace.yaml apps/api/pyproject.toml apps/api/uv.lock ||
    die "dependency manifests or lockfiles have uncommitted changes; refusing an ambiguous audit"
  changed_paths=$(git -C "$repo_dir" diff --name-only "$base..$head" --) ||
    die "could not inspect changed paths in the requested range"
  while IFS= read -r path; do
    case "$path" in
      */package.json|package.json|pnpm-lock.yaml|pnpm-workspace.yaml) pnpm_changed=true ;;
      apps/api/pyproject.toml|apps/api/uv.lock) python_changed=true ;;
    esac
  done <<< "$changed_paths"

  if [[ "$pnpm_changed" == true ]]; then
    run_pnpm_audit
  fi
  if [[ "$python_changed" == true ]]; then
    run_python_audit
  fi
  if [[ "$pnpm_changed" == false && "$python_changed" == false ]]; then
    printf 'No dependency manifests or lockfiles changed in %s..%s; no ecosystem audit needed.\n' \
      "$base" "$head"
  fi
}

run_weekly_audit() {
  # Checkout must fetch full history. --all includes every locally fetched branch and tag.
  gitleaks_dir
  gitleaks_history --all
  run_sast
  run_config
  run_dependency_audits
}

mode=${1:-weekly}
case "$mode" in
  pre-push)
    [[ $# -eq 3 ]] || die "pre-push requires <base-commit> <head-commit>"
    check_range "$2" "$3"
    gitleaks_history "$2..$3"
    ;;
  changed-dependencies)
    [[ $# -eq 3 ]] || die "changed-dependencies requires <base-commit> <head-commit>"
    audit_changed_dependencies "$2" "$3"
    ;;
  secrets)
    [[ $# -eq 1 ]] || die "secrets accepts no additional arguments"
    gitleaks_dir
    ;;
  history)
    [[ $# -eq 1 ]] || die "history accepts no additional arguments"
    gitleaks_history --all
    ;;
  sast)
    [[ $# -eq 1 ]] || die "sast accepts no additional arguments"
    run_sast
    ;;
  config)
    [[ $# -eq 1 ]] || die "config accepts no additional arguments"
    run_config
    ;;
  dependencies)
    [[ $# -eq 1 ]] || die "dependencies accepts no additional arguments"
    run_dependency_audits
    ;;
  weekly)
    [[ $# -le 1 ]] || die "weekly accepts no additional arguments"
    run_weekly_audit
    ;;
  -h|--help|help)
    usage
    ;;
  *)
    usage >&2
    die "unknown command: $mode"
    ;;
esac
