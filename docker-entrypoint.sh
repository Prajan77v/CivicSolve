#!/bin/sh
set -e

echo "🚀 [CivicSolve] Initializing container..."

# Check if SQLite database file exists in /app/prisma
if [ ! -f /app/prisma/dev.db ]; then
  echo "📦 [CivicSolve] Database not found at /app/prisma/dev.db. Initializing schema and seed data..."
  npx prisma db push --accept-data-loss
  npx ts-node --compiler-options '{"module":"commonjs"}' prisma/seed.ts
  echo "✅ [CivicSolve] Database initialized and seeded successfully!"
else
  echo "✅ [CivicSolve] Existing database found at /app/prisma/dev.db. Verifying schema..."
  npx prisma db push --accept-data-loss || true
fi

echo "🌟 [CivicSolve] Starting CivicSolve Next.js application on port 3000..."
exec npm run start
