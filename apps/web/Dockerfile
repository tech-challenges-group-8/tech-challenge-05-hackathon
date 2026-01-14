# MindEase Web (Next.js App Router) - Dockerfile

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

# Prune to production deps for the web app
RUN pnpm prune --prod --filter mindease-web

ENV NODE_ENV=production
EXPOSE 3000
CMD ["pnpm", "--filter", "mindease-web", "start"]
