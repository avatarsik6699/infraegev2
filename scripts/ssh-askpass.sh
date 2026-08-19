#!/bin/sh
set -eu

: "${INFRAEGE_SSH_PASSWORD:?INFRAEGE_SSH_PASSWORD is required}"
printf '%s\n' "$INFRAEGE_SSH_PASSWORD"
