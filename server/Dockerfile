FROM ghcr.io/puppeteer/puppeteer:24.4.0

WORKDIR /usr/server/app

COPY package*.json ./
COPY prisma ./prisma

RUN npm ci && npx prisma generate
COPY . .
CMD ["node", "app.js"]

