#!/usr/bin/env bash

set -euo pipefail

inventory=${1:?inventory path is required}
playbook=${2:?playbook path is required}
target=${3:?target is required}

tmp_output="$(mktemp)"
trap 'rm -f "$tmp_output"' EXIT

ansible-playbook -i "$inventory" "$playbook" --limit "$target" | tee "$tmp_output"

if grep -Eq 'changed=[1-9]' "$tmp_output"; then
  echo "playbook was not idempotent on the second run" >&2
  exit 1
fi
