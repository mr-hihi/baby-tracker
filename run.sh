#!/bin/bash
ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
FRONTEND_PORT=4071
# Isolated local test stack (E2E): a separate origin, so its localStorage never mixes with dev data.
TEST_FRONTEND_PORT=5101

export PATH="$ROOT_DIR/node_modules/.bin:$PATH"

require_deps() {
  command -v next >/dev/null 2>&1 || { echo "Error: run 'sh run.sh setup' first."; exit 1; }
}

# node, not lsof: lsof does not exist in Git Bash on Windows.
port_in_use() {
  node -e "const s=require('net').createServer();s.once('error',()=>process.exit(0));s.listen($1,()=>s.close(()=>process.exit(1)))"
}

require_free_port() {
  if port_in_use "$1"; then
    echo "Error: port $1 already in use — stop that process first."; exit 1
  fi
}

winget_install() {
  winget install --id "$1" -e --source winget --accept-package-agreements --accept-source-agreements
}

setup_macos() {
  command -v brew >/dev/null 2>&1 || { echo "Install Homebrew first: https://brew.sh"; exit 1; }
  command -v node >/dev/null 2>&1 || brew install node
}

setup_windows() {
  command -v winget >/dev/null 2>&1 || { echo "winget missing — install 'App Installer' from the Microsoft Store."; exit 1; }
  if ! command -v node >/dev/null 2>&1; then
    winget_install OpenJS.NodeJS.LTS
    export PATH="/c/Program Files/nodejs:$PATH"
    command -v node >/dev/null 2>&1 || { echo "Node installed — open a new terminal, then re-run setup."; exit 1; }
  fi
}

cmd_setup() {
  set -e
  case "$(uname -s)" in
    Darwin)               setup_macos ;;
    MINGW*|MSYS*|CYGWIN*) setup_windows ;;
    *) echo "No installer for $(uname -s) — install Node LTS yourself." ;;
  esac
  echo "=== npm ci ==="
  npm --prefix "$ROOT_DIR" ci
  [ -f "$ROOT_DIR/.env" ] || cp "$ROOT_DIR/.env.example" "$ROOT_DIR/.env"
  echo "Setup done. Start the app: sh run.sh start"
}

cmd_start() {
  require_deps
  require_free_port "$FRONTEND_PORT"
  echo "Frontend: http://localhost:$FRONTEND_PORT"
  cd "$ROOT_DIR" && next dev --port "$FRONTEND_PORT"
}

cmd_start_test() {
  # NODE_ENV=test makes Next load .env.test instead of .env.local.
  require_deps
  require_free_port "$TEST_FRONTEND_PORT"
  echo "TEST Frontend: http://localhost:$TEST_FRONTEND_PORT (.env.test, separate localStorage)"
  cd "$ROOT_DIR" && NODE_ENV=test next dev --port "$TEST_FRONTEND_PORT"
}

cmd_test() {
  require_deps
  cd "$ROOT_DIR" && vitest run
}

cmd_build() {
  set -e
  require_deps
  cd "$ROOT_DIR" && next build
  echo "Static site written to $ROOT_DIR/out — deploys to GitHub Pages on push to main."
}

case "${1}" in
  setup)      cmd_setup ;;
  start)      cmd_start ;;
  start_test) cmd_start_test ;;
  test)       cmd_test ;;
  build)      cmd_build ;;
  *) echo "Usage: sh run.sh {setup|start|start_test|test|build}  (Windows cmd / PowerShell: run <command>)"; exit 1 ;;
esac
