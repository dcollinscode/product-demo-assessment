# ── Stage 1: deps ─────────────────────────────────────────────────────────
FROM node:20-alpine AS deps

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

# Install ALL deps here (including prisma CLI) so generate works
RUN npm ci

# Generate Prisma client for the current platform
# This creates the correct native binary for linux-musl-arm64
RUN npx prisma generate

# ── Stage 2: builder ───────────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm ci

COPY tsconfig.json ./
COPY src ./src

RUN npm run build

# ── Stage 3: runner ────────────────────────────────────────────────────────
FROM node:20-alpine AS runner

RUN addgroup -S appgroup && adduser -S appuser -G appgroup

WORKDIR /app

# Copy package files and prisma schema
COPY package*.json ./
COPY prisma ./prisma/

# Install production deps AND prisma CLI so we can run generate + migrate
RUN npm ci --omit=dev

# Re-run prisma generate IN the runner stage so the binary is native
# to this exact image/platform — not copied from another stage
RUN npx prisma generate

# Copy compiled source from builder
COPY --from=builder /app/dist ./dist

USER appuser

EXPOSE 3001

CMD ["node", "dist/app.js"]