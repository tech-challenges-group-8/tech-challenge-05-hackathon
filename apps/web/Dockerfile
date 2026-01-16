# MindEase Web (Expo React Native) - Dockerfile

FROM node:20-alpine

RUN corepack enable
WORKDIR /app

# Root manifests for pnpm workspaces
COPY package.json pnpm-workspace.yaml turbo.json tsconfig.base.json ./
# App + shared package manifests
COPY apps/web/package.json apps/web/package.json
COPY packages/domain-core/package.json packages/domain-core/package.json
COPY packages/shared-dtos/package.json packages/shared-dtos/package.json
COPY packages/ui-kit/package.json packages/ui-kit/package.json

# Install all deps needed to build web + shared packages
RUN pnpm install --prod=false

# Copy source
COPY . .

# Build shared libs then web
RUN pnpm --filter @mindease/domain build \
  && pnpm --filter @mindease/dtos build \
  && pnpm --filter @mindease/ui-kit build \
  && pnpm --filter mindease-web build

# Install serve for production
RUN pnpm add -g serve

ENV NODE_ENV=production
EXPOSE 3000
WORKDIR /app/apps/web
CMD ["serve", "dist", "-l", "3000"]
