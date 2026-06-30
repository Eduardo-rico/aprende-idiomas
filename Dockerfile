# syntax=docker/dockerfile:1
# Multi-stage build for the Manual Lusitano Next.js app.
# Produces a small runtime image using Next's standalone output.
#
#   docker build -t portugues-app .
#   docker run -p 3000:3000 portugues-app
#
# The ~451 MB audio corpus under public/audio is baked into the image so
# the container is fully self-contained (no external storage needed).

# ---- deps: install production+build deps once, cached on lockfile ----
FROM node:22-bookworm-slim AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci

# ---- builder: compile the standalone server ----
FROM node:22-bookworm-slim AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# MINIMAX_API_KEY is NOT needed to build — audio is already committed under
# public/audio. A dummy keeps any env-reading module from throwing at build.
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# ---- runner: minimal image that serves the app ----
FROM node:22-bookworm-slim AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# Run as non-root.
RUN addgroup --system --gid 1001 nodejs \
 && adduser --system --uid 1001 nextjs

# Standalone server + its trimmed node_modules.
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
# Static assets (JS/CSS chunks) and the public dir (incl. public/audio).
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]
