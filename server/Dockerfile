FROM ghcr.io/puppeteer/puppeteer:24.4.0

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=false \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome

WORKDIR /usr/server/app

COPY package*.json ./
COPY prisma ./prisma

RUN npm ci && npx prisma generate
COPY . .

RUN chmod -R o+rwx /usr/server/app/node_modules/puppeteer-core/.local-chromium

CMD ["node", "app.js"]

