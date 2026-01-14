# MindEase Mobile (Expo) - Dockerfile
# Note: This runs the Expo dev server inside the container.

FROM node:20-alpine

RUN corepack enable
WORKDIR /app

# Root manifests for pnpm workspaces
COPY package.json pnpm-workspace.yaml turbo.json tsconfig.base.json ./
# App + shared package manifests
COPY apps/mobile/package.json apps/mobile/package.json
COPY packages/domain-core/package.json packages/domain-core/package.json
COPY packages/shared-dtos/package.json packages/shared-dtos/package.json
COPY packages/ui-kit/package.json packages/ui-kit/package.json

# Install all deps needed to run Expo + shared packages
RUN pnpm install --prod=false

# Copy source
COPY . .

# Build shared libs (optional but helpful for type safety)
RUN pnpm --filter @mindease/domain build \
  && pnpm --filter @mindease/dtos build \
  && pnpm --filter @mindease/ui-kit build

ENV NODE_ENV=development \
    EXPO_DEVTOOLS_LISTEN_ADDRESS=0.0.0.0 \
    EXPO_PACKAGER_HOSTNAME=0.0.0.0

# Expo uses 19000 (Metro), 19001 (logs), 19002 (DevTools), 8081 (web)
EXPOSE 19000 19001 19002 8081

CMD ["pnpm", "--filter", "mindease-mobile", "start", "--", "--non-interactive", "--tunnel", "--clear"]
