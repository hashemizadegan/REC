FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json tsconfig*.json tailwind.config.ts next.config.mjs ./
RUN npm ci

COPY src ./src
RUN npm run build

FROM node:20-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production

COPY package*.json ./
RUN npm install --only=production

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public 2>/dev/null || true
COPY --from=builder /app/next.config.mjs ./

EXPOSE 3001

CMD ["npm", "start", "--", "-p", "3001"]
