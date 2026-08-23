#!/usr/bin/env bash
set -Eeuo pipefail
[[ -n ${MANAGEMENT_SSH_PASSWORD:-} ]] || exit 1
printf '%s\n' "$MANAGEMENT_SSH_PASSWORD"
