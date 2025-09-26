#!/bin/sh
set -e

# Garante que DATABASE_URL existe
if [ -z "$DATABASE_URL" ]; then
  echo "ERROR: DATABASE_URL is not set"
  exit 1
fi

echo "==> Applying Prisma migrations (deploy)..."
npx prisma migrate deploy

echo "==> Running seed script (if exists)..."
npm run seed || echo "Seed script not configured or skipped."

echo "==> Starting Nuxt (SSR)"
npm run start
