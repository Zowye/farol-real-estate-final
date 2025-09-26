#!/bin/sh
set -e

# Porta/host para Cloud Run (PORT é injetada pelo Cloud Run)
export NITRO_HOST=0.0.0.0
export NITRO_PORT="${PORT:-8080}"

# Checagem DB
if [ -z "$DATABASE_URL" ]; then
  echo "ERROR: DATABASE_URL is not set"
  exit 1
fi

echo "==> Prisma migrate deploy"
npx prisma migrate deploy

echo "==> Prisma seed (idempotent)"
npx prisma db seed || echo "Seed script not configured or skipped."

echo "==> Start Nuxt (SSR) on $NITRO_HOST:$NITRO_PORT"
npm run start
