FROM oven/bun:1.1.38-debian AS builder

WORKDIR /app

# Copy package files
COPY package.json bun.lockb ./
RUN bun install

# Copy source files
COPY . .

# Environment variables for build
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
ENV NODE_OPTIONS="--no-warnings"
ENV TORRENT_SERVICE_URL=http://torrent-service:3001

# Build the application
RUN bun run build

FROM oven/bun:1.1.38-debian AS runner

WORKDIR /app

# Copy necessary files from builder
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./
COPY --from=builder /app/bun.lockb ./
COPY --from=builder /app/node_modules ./node_modules

# Runtime environment variables
ENV NODE_ENV=production
ENV HOSTNAME=0.0.0.0
ENV PORT=3000
ENV NEXT_TELEMETRY_DISABLED=1
ENV TORRENT_SERVICE_URL=http://torrent-service:3001

EXPOSE 3000

CMD ["bun", "run", "start"]