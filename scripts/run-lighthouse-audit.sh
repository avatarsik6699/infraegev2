#!/usr/bin/env bash
set -euo pipefail

repo_dir=$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)
lhci_bin=${INFRAEGE_LHCI_BIN:-${1:-lhci}}
if [[ -z ${INFRAEGE_LHCI_BIN:-} && $# -gt 0 ]]; then
  shift
fi
profile_dir=$(mktemp -d /tmp/infraege-lighthouse.XXXXXX)

cleanup_profile() {
  rm -rf -- "$profile_dir"
}

trap cleanup_profile EXIT
trap 'exit 129' HUP
trap 'exit 130' INT
trap 'exit 143' TERM

lhci_path=$(command -v -- "$lhci_bin" || true)
if [[ -z $lhci_path || ! -x $lhci_path ]]; then
  echo "Lighthouse CI executable is unavailable: $lhci_bin" >&2
  exit 2
fi

export INFRAEGE_LIGHTHOUSE_PROFILE_DIR=$profile_dir
"$lhci_path" autorun "$@"
