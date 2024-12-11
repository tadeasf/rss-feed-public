# services/torrent-service/Dockerfile
FROM node:20-alpine

WORKDIR /app

# Install wget for healthcheck
RUN apk add --no-cache wget

COPY package*.json ./

RUN npm install --production

COPY . .

EXPOSE 3001

# Update healthcheck to use the actual endpoint that works
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3001/api/1337x/test || exit 1

USER node

CMD ["npm", "run", "start"]