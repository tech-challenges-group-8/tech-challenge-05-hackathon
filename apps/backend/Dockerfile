# MindEase Backend (NestJS) - Dockerfile
# Single repo-aware build using pnpm workspaces

FROM node:20-alpine AS builder

# Enable pnpm via corepack
RUN corepack enable

WORKDIR /app

# Copy root manifests needed for dependency resolution
COPY package.json pnpm-workspace.yaml turbo.json tsconfig.base.json ./
# Copy app/package manifests for filtered install
COPY apps/backend/package.json apps/backend/package.json
COPY packages/domain-core/package.json packages/domain-core/package.json
COPY packages/shared-dtos/package.json packages/shared-dtos/package.json
COPY packages/ui-kit/package.json packages/ui-kit/package.json

# Install all dependencies required to build backend + shared packages
RUN pnpm install

# Copy source
COPY . .

# Build shared libs then backend
RUN pnpm --filter @mindease/domain build \
  && pnpm --filter @mindease/dtos build \
  && pnpm --filter @mindease/ui-kit build \
  && pnpm --filter mindease-backend build

# Production stage
FROM node:20-alpine

RUN corepack enable

WORKDIR /app

# Copy built artifacts and dependencies
COPY --from=builder /app/package.json /app/pnpm-workspace.yaml /app/tsconfig.base.json ./
COPY --from=builder /app/apps/backend ./apps/backend
COPY --from=builder /app/packages ./packages
COPY --from=builder /app/node_modules ./node_modules

ENV NODE_ENV=production
EXPOSE 3001
CMD ["sh", "-c", "node apps/backend/dist/migrations/run-all.js && node apps/backend/dist/main.js"]
