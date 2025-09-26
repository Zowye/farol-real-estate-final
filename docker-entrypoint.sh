#!/bin/sh
set -e

# Porta/host p/ Cloud Run
export NITRO_HOST=0.0.0.0
export NITRO_PORT="${PORT:-8080}"

# Sanidade: mostrar porta/host e garantir build existe
echo "PORT=${PORT} NITRO_PORT=${NITRO_PORT} NITRO_HOST=${NITRO_HOST}"
[ -f ".output/server/index.mjs" ] || { echo "Build missing: .output/server/index.mjs"; exit 1; }

# DB
if [ -z "$DATABASE_URL" ]; then
  echo "ERROR: DATABASE_URL is not set"
  exit 1
fi

echo "==> Prisma migrate deploy"
npx prisma migrate deploy

echo "==> Prisma seed (idempotent)"
npx prisma db seed || echo "Seed skipped."

echo "==> Start Nitro"
node .output/server/index.mjs
