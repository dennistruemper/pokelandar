FROM oven/bun:1 AS base
WORKDIR /app

# Install dependencies
FROM base AS install
COPY package.json bun.lock* ./
RUN bun install --frozen-lockfile

# Build the application
FROM base AS build
COPY --from=install /app/node_modules ./node_modules
COPY . .
RUN bun run build

# Production image
FROM base AS runtime
ENV NODE_ENV=production
WORKDIR /app

COPY --from=install /app/node_modules ./node_modules
COPY --from=build /app/build ./build
COPY --from=build /app/package.json ./package.json
# Copy scripts and types needed for seeding
COPY --from=build /app/scripts ./scripts
COPY --from=build /app/src/lib/types ./src/lib/types

EXPOSE 3000
ENV PORT=3000
ENV HOST=0.0.0.0

CMD ["bun", "build/index.js"]

