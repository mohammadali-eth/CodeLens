# --------------------------------------------------------
# Stage 1: Base Environment
# --------------------------------------------------------
FROM node:18-alpine AS base
WORKDIR /app
RUN apk add --no-co-cache libc6-compat
ENV NODE_ENV=production

# --------------------------------------------------------
# Stage 2: Dependencies
# --------------------------------------------------------
FROM base AS dependencies
WORKDIR /app
COPY package.json package-lock.json ./
COPY packages/shared-dto/package.json ./packages/shared-dto/
COPY apps/backend/package.json ./apps/backend/
RUN npm ci --include=dev

# --------------------------------------------------------
# Stage 3: Builder & Code Generation
# --------------------------------------------------------
FROM base AS builder
WORKDIR /app
COPY --from=dependencies /app/node_modules ./node_modules
COPY --from=dependencies /app/apps/backend/node_modules ./apps/backend/node_modules
COPY . .

# Build shared packages and Prisma Client
RUN npm run build --prefix packages/shared-dto || true
RUN npx prisma generate --schema=apps/backend/prisma/schema.prisma
RUN npm run build --prefix apps/backend

# --------------------------------------------------------
# Stage 4: Production Runner (Non-Root User)
# --------------------------------------------------------
FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=4000

# Security: Create non-root system user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nestjs

# Copy runtime assets and built bundles
COPY --chown=nestjs:nodejs package.json package-lock.json ./
COPY --chown=nestjs:nodejs apps/backend/package.json ./apps/backend/
COPY --chown=nestjs:nodejs --from=builder /app/node_modules ./node_modules
COPY --chown=nestjs:nodejs --from=builder /app/apps/backend/node_modules ./apps/backend/node_modules
COPY --chown=nestjs:nodejs --from=builder /app/apps/backend/dist ./apps/backend/dist
COPY --chown=nestjs:nodejs --from=builder /app/apps/backend/prisma ./apps/backend/prisma

# Switch to non-root user
USER nestjs

EXPOSE 4000

HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:4000/health/liveness || exit 1

CMD ["node", "apps/backend/dist/main"]
