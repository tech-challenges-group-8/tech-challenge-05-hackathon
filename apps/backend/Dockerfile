# MindEase Backend (NestJS) - Dockerfile
# Single repo-aware build using pnpm workspaces

FROM node:20-alpine

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
RUN pnpm install --prod=false

# Copy source
COPY . .

# Build shared libs then backend
RUN pnpm --filter @mindease/domain build \
  && pnpm --filter @mindease/dtos build \
  && pnpm --filter @mindease/ui-kit build \
  && pnpm --filter mindease-backend build

# Prune to production deps for backend
RUN pnpm prune --prod --filter mindease-backend

ENV NODE_ENV=production
EXPOSE 3001
CMD ["pnpm", "--filter", "mindease-backend", "start:prod"]
