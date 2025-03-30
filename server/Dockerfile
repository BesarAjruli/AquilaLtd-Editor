FROM ghcr.io/puppeteer/puppeteer:24.4.0

WORKDIR /usr/server/app

ENV NODE_ENV=production
ENV PORT=8000

COPY package*.json ./
COPY prisma ./prisma

RUN npm ci && npx prisma generate
COPY . .
CMD ["node", "app.js"]

