#!/usr/bin/env bash
# Update undangan di VM: git pull + build ulang container.  Pakai:  ./deploy/deploy.sh
# Pastikan perubahan sudah di-push ke GitHub dulu.
# Login: SSH key, atau set SSHPASS=... (butuh sshpass) agar tidak ditanya password.
set -euo pipefail

HOST="root@103.147.32.28"
PORT=20262
APP_DIR="/root/undangan-arif"

SSH=(ssh -p "$PORT" -o StrictHostKeyChecking=accept-new)
[[ -n "${SSHPASS:-}" ]] && SSH=(sshpass -e "${SSH[@]}")

"${SSH[@]}" "$HOST" "
  set -e
  cd '$APP_DIR'
  git pull --ff-only
  docker compose up -d --build
  docker image prune -f >/dev/null
"

echo "✓ https://undangan.bgcipta.web.id/arif-fitria/"
