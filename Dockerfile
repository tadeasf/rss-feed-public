FROM oven/bun:1.1.38-debian AS builder

WORKDIR /app
COPY package.json bun.lockb ./
RUN bun install

# Install additional dependencies needed by torrent-search-api
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

COPY . .
RUN bun run build

FROM oven/bun:1.1.38-debian AS runner

WORKDIR /app
COPY --from=builder /app/package.json ./
COPY --from=builder /app/bun.lockb ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules

ENV NODE_ENV=production
ENV HOSTNAME=0.0.0.0
ENV PORT 3000

EXPOSE 3000

CMD ["bun", "run", "start"]
