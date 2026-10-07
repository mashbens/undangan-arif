# --- Tahap 1: build aplikasi React ---
FROM node:20-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

# --- Tahap 2: server Node (file statis + API ucapan) ---
FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production PORT=3000 STATIC_DIR=/app/dist DATA_DIR=/data
COPY server ./server
COPY --from=build /app/dist ./dist
RUN mkdir -p /data && chown node:node /data
USER node
VOLUME /data
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=3s CMD wget -qO- http://127.0.0.1:3000/api/health >/dev/null || exit 1
CMD ["node", "server/index.js"]
