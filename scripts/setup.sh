#!/usr/bin/env bash
set -euo pipefail

project_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd -P)"
cd "$project_root"

bash scripts/sync-env.sh "$@"

if ! command -v node >/dev/null 2>&1; then
  echo "Node.js is required. Install Node.js 18 or newer, then rerun setup."
  exit 1
fi

node_major="$(node -p "Number(process.versions.node.split('.')[0])")"
if [[ "$node_major" -lt 18 ]]; then
  echo "Node.js 18 or newer is required. Current version: $(node --version)"
  exit 1
fi

if [[ -f package-lock.json ]]; then
  npm ci || {
    echo "npm ci failed because the lockfile is out of sync; falling back to npm install."
    npm install
  }
else
  npm install
fi
