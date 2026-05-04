#!/bin/zsh

set -u

ROOT_DIR="${0:A:h}"
LOG_DIR="$ROOT_DIR/.dev-logs"
mkdir -p "$LOG_DIR"

typeset -a STARTED_PIDS
STARTED_PIDS=()

cleanup() {
  if (( ${#STARTED_PIDS[@]} > 0 )); then
    echo ""
    echo "Stopping services started by this launcher..."
    for pid in "${STARTED_PIDS[@]}"; do
      if kill -0 "$pid" >/dev/null 2>&1; then
        kill "$pid" >/dev/null 2>&1
      fi
    done
  fi
}

trap cleanup INT TERM EXIT

is_port_open() {
  local port="$1"
  lsof -nP -iTCP:"$port" -sTCP:LISTEN >/dev/null 2>&1
}

start_service() {
  local name="$1"
  local port="$2"
  local dir="$3"
  local command="$4"
  local log_file="$LOG_DIR/$name.log"

  if is_port_open "$port"; then
    echo "[$name] port $port is already running, skipping start."
    return
  fi

  echo "[$name] starting on port $port..."
  (
    cd "$ROOT_DIR/$dir" || exit 1
    echo "[$name] $(date '+%Y-%m-%d %H:%M:%S')"
    echo "[$name] $command"
    eval "$command"
  ) >"$log_file" 2>&1 &

  STARTED_PIDS+=("$!")
}

wait_for_port() {
  local name="$1"
  local port="$2"
  local max_attempts=45
  local attempt=1

  while (( attempt <= max_attempts )); do
    if is_port_open "$port"; then
      echo "[$name] ready: http://localhost:$port/"
      return 0
    fi
    sleep 1
    attempt=$((attempt + 1))
  done

  echo "[$name] did not become ready on port $port. Check $LOG_DIR/$name.log"
  return 1
}

echo "AI HMP local services"
echo "Project: $ROOT_DIR"
echo ""

start_service "admin-5174" "5174" "react-app" "npm run dev"
start_service "patient-mobile-5177" "5177" "patient-mobile-h5" "npm run dev"
start_service "patient-shell-5176" "5176" "patient-web-preview" "npm run dev"

echo ""
wait_for_port "admin" "5174"
wait_for_port "patient-mobile-h5" "5177"
wait_for_port "patient-shell" "5176"

echo ""
echo "Open these URLs:"
echo "  Admin:         http://localhost:5174/"
echo "  Patient H5:    http://localhost:5177/"
echo "  Patient shell: http://localhost:5176/"
echo ""
echo "Logs are written to:"
echo "  $LOG_DIR"
echo ""
echo "Keep this window open while developing."
echo "Press Ctrl+C to stop services started by this launcher."
echo ""

while true; do
  sleep 3600
done
