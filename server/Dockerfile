FROM ghcr.io/puppeteer/puppeteer:24.4.0

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable

WORKDIR /usr/server/app

COPY package*.json ./
COPY prisma ./prisma

RUN npm ci && npx prisma generate && npx puppeteer browsers install chrome
COPY . .
CMD ["node", "app.js"]

