# ==========================================
# 1. Base image with Node.js
# ==========================================
FROM node:20-alpine AS base
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app

# ==========================================
# 2. Dependencies installation
# ==========================================
FROM base AS deps
COPY package.json package-lock.json* ./
COPY prisma ./prisma
RUN npm ci

# ==========================================
# 3. Builder
# ==========================================
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma Client for current environment
ENV DATABASE_URL="file:./dev.db"
ENV NEXT_TELEMETRY_DISABLED=1
ENV NEXTAUTH_SECRET="civicsolve-sih2026-secret-key-32chars"
ENV NEXTAUTH_URL="http://localhost:3000"
RUN npx prisma generate

# Build Next.js application
RUN npm run build

# ==========================================
# 4. Production Runner
# ==========================================
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
ENV NEXT_TELEMETRY_DISABLED=1
ENV DATABASE_URL="file:/app/prisma/dev.db"
ENV NEXTAUTH_SECRET="civicsolve-sih2026-secret-key-32chars"
ENV NEXTAUTH_URL="http://localhost:3000"

# Copy package and node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/prisma ./prisma
COPY docker-entrypoint.sh ./docker-entrypoint.sh
RUN sed -i 's/\r$//' ./docker-entrypoint.sh && chmod +x ./docker-entrypoint.sh

# Expose standard port
EXPOSE 3000

# Health check to ensure service readiness
HEALTHCHECK --interval=15s --timeout=5s --start-period=30s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/api/auth/csrf || exit 1

ENTRYPOINT ["./docker-entrypoint.sh"]
