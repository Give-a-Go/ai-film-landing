#!/usr/bin/env bash
set -euo pipefail

project_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd -P)"
cd "$project_root"

force=0
if [[ "${1:-}" == "--force" ]]; then
  force=1
fi

is_secret_env_file() {
  local name="$1"

  case "$name" in
    .env|.env.*)
      case "$name" in
        .env.example|.env.sample|.env.template)
          return 1
          ;;
      esac
      return 0
      ;;
  esac

  return 1
}

file_mtime() {
  if stat -f '%m' "$1" >/dev/null 2>&1; then
    stat -f '%m' "$1"
  else
    stat -c '%Y' "$1"
  fi
}

contains_name() {
  local needle="$1"
  shift

  local value
  for value in "$@"; do
    [[ "$value" == "$needle" ]] && return 0
  done

  return 1
}

worktrees=()
while IFS= read -r worktree; do
  [[ -n "$worktree" ]] && worktrees+=("$worktree")
done < <(git worktree list --porcelain 2>/dev/null | sed -n 's/^worktree //p')

if [[ "${#worktrees[@]}" -eq 0 ]]; then
  echo "No git worktrees found; skipping env sync."
  exit 0
fi

env_names=()
for worktree in "${worktrees[@]}"; do
  [[ -d "$worktree" ]] || continue

  for candidate in "$worktree"/.env "$worktree"/.env.*; do
    [[ -f "$candidate" ]] || continue

    name="${candidate##*/}"
    is_secret_env_file "$name" || continue
    if [[ "${#env_names[@]}" -gt 0 ]] && contains_name "$name" "${env_names[@]}"; then
      continue
    fi

    env_names+=("$name")
  done
done

if [[ "${#env_names[@]}" -eq 0 ]]; then
  echo "No env files found in other worktrees."
  exit 0
fi

copied=0
for name in "${env_names[@]}"; do
  target="$project_root/$name"

  if [[ -f "$target" && "$force" -ne 1 ]]; then
    echo "Keeping existing $name."
    continue
  fi

  newest_source=""
  newest_mtime=0

  for worktree in "${worktrees[@]}"; do
    [[ -d "$worktree" ]] || continue

    worktree_root="$(cd "$worktree" && pwd -P)"
    [[ "$worktree_root" == "$project_root" ]] && continue

    source="$worktree/$name"
    [[ -f "$source" ]] || continue

    source_mtime="$(file_mtime "$source")"
    if [[ -z "$newest_source" || "$source_mtime" -gt "$newest_mtime" ]]; then
      newest_source="$source"
      newest_mtime="$source_mtime"
    fi
  done

  if [[ -z "$newest_source" ]]; then
    continue
  fi

  cp -p "$newest_source" "$target"
  echo "Copied $name from $(dirname "$newest_source")."
  copied=$((copied + 1))
done

if [[ "$copied" -eq 0 ]]; then
  echo "No env files needed copying."
fi
