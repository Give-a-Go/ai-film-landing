#!/usr/bin/env bash
set -euo pipefail

project_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd -P)"
cd "$project_root"

if ! command -v npm >/dev/null 2>&1; then
  echo "npm is required. Install Node.js 18 or newer, then rerun ./run.sh."
  exit 1
fi

needs_install=0
if [[ ! -d node_modules ]]; then
  needs_install=1
elif [[ -f package-lock.json && package-lock.json -nt node_modules/.package-lock.json ]]; then
  needs_install=1
elif [[ package.json -nt node_modules/.package-lock.json ]]; then
  needs_install=1
fi

if [[ "$needs_install" -eq 1 ]]; then
  bash scripts/setup.sh
else
  bash scripts/sync-env.sh
fi

port="${PORT:-3000}"
host="${HOST:-0.0.0.0}"

vite_args=(--host "$host" --port "$port")
if [[ -n "${PORT:-}" ]]; then
  vite_args+=(--strictPort)
fi

echo "Starting Vite on http://localhost:${port} (host: ${host})"
exec npm run dev -- "${vite_args[@]}"
