#!/usr/bin/env bash

production_env_quote() {
  [[ $# == 1 ]] || return 64
  local value=$1

  case $value in
    *$'\n'*|*$'\r'*|*\'*) return 65 ;;
  esac

  printf "'%s'" "$value"
}

production_env_validate() {
  [[ $# == 1 && -r $1 ]] || return 64

  (
    set -a
    # shellcheck disable=SC1090
    source "$1"
    set +a
  ) >/dev/null 2>&1
}
