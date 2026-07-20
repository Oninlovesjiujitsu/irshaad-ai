# Stage 1: Prune workspace to only what agent-worker needs
FROM node:20-bookworm-slim AS pruner
WORKDIR /app
RUN npm install -g pnpm turbo
COPY . .
RUN turbo prune --filter=@irshaad/agent-worker --docker

# Stage 2: Install dependencies safely
FROM node:20-bookworm-slim AS installer
WORKDIR /app
RUN npm install -g pnpm
COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
RUN pnpm install --frozen-lockfile

# Stage 3: Build the TypeScript code
FROM node:20-bookworm-slim AS builder
WORKDIR /app
RUN npm install -g pnpm turbo
COPY --from=installer /app/ .
COPY --from=pruner /app/out/full/ .
RUN turbo run build --filter=@irshaad/agent-worker

# Stage 4: Production Runner (Hugging Face ready)
FROM node:20-bookworm-slim AS runner
WORKDIR /app

ENV PORT=7860
EXPOSE 7860

# Critical: Hugging Face Spaces fail if run as root.
RUN useradd -m -u 1000 user
USER user

COPY --from=builder --chown=user:user /app/ .

# The 'start' argument is required by the LiveKit CLI for production mode
CMD ["node", "apps/agent-worker/dist/index.js", "start"]
