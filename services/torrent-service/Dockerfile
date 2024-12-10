FROM oven/bun:1

WORKDIR /app

COPY services/torrent-service/package.json .
COPY services/torrent-service/bun.lockb .

COPY src/types ./src/types

RUN bun install

COPY services/torrent-service .

CMD ["bun", "run", "index.ts"] 