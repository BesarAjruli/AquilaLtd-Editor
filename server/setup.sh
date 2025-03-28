#!/bin/bash
# File: setup.sh

# Update and install system dependencies (only on Linux)
if [ "$(uname)" = "Linux" ]; then
  apt update && apt install -y \
    libatk1.0-0 libx11-xcb1 libnss3 libxcomposite1 \
    libxcursor1 libxdamage1 libxfixes3 libxi6 libxrandr2 libgbm1 \
    libasound2 libpango1.0-0 libcups2
fi

# Install Puppeteer browsers (via npx)
npx puppeteer browsers install