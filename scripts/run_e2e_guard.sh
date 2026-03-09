#!/usr/bin/env bash
set -euo pipefail

LOG_DIR="logs"
mkdir -p "$LOG_DIR"

DEV_LOG="${LOG_DIR}/e2e-webserver.log"
E2E_LOG="${LOG_DIR}/playwright.log"
PORT_CANDIDATES="${PORT_CANDIDATES:-4000}"
READY_WAIT_SEC="${READY_WAIT_SEC:-40}"

echo "[e2e-guard] starting guarded E2E" >"$DEV_LOG"
SERVER_PID=""
SELECTED_PORT=""
SELECTED_HOST=""

cleanup() {
  if [[ -n "${SERVER_PID}" ]]; then
    kill "$SERVER_PID" >/dev/null 2>&1 || true
  fi
}
trap cleanup EXIT

start_server() {
  local port="$1"
  local host="$2"
  echo "[e2e-guard] trying host=${host} port=${port}" >>"$DEV_LOG"
  PORT="${port}" npm run dev -- --hostname "${host}" >>"$DEV_LOG" 2>&1 &
  SERVER_PID=$!

  local base_url="http://127.0.0.1:${port}"
  local max_tries=$((READY_WAIT_SEC / 2))
  for _ in $(seq 1 "$max_tries"); do
    if curl -fsS "${base_url}" >/dev/null 2>&1; then
      SELECTED_PORT="${port}"
      SELECTED_HOST="${host}"
      echo "[e2e-guard] webserver ready ${base_url}" >>"$DEV_LOG"
      return 0
    fi
    if ! kill -0 "$SERVER_PID" >/dev/null 2>&1; then
      break
    fi
    sleep 2
  done

  kill "$SERVER_PID" >/dev/null 2>&1 || true
  SERVER_PID=""
  return 1
}

for port in $PORT_CANDIDATES; do
  if start_server "$port" "127.0.0.1"; then
    break
  fi
  if grep -q "EPERM: operation not permitted" "$DEV_LOG"; then
    echo "[e2e-guard] EPERM on 127.0.0.1:${port}, retry with 0.0.0.0" >>"$DEV_LOG"
    if start_server "$port" "0.0.0.0"; then
      break
    fi
  fi
done

if [[ -z "${SELECTED_PORT}" ]]; then
  echo "[e2e-guard] webserver_not_ready after retries (ports: ${PORT_CANDIDATES})" | tee -a "$DEV_LOG"
  exit 2
fi

BASE_URL="http://127.0.0.1:${SELECTED_PORT}"
echo "[e2e-guard] run playwright against ${BASE_URL} (host=${SELECTED_HOST})" | tee "$E2E_LOG"
PLAYWRIGHT_BASE_URL="${BASE_URL}" npx playwright test --trace on >>"$E2E_LOG" 2>&1
