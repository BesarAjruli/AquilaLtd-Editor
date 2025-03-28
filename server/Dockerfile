# Use an official Node.js image as the base
FROM node:18-slim

# Install dependencies, including Chrome
RUN apt-get update && apt-get install -y \
    libatk1.0-0 libx11-xcb1 libnss3 libxcomposite1 \
    libxcursor1 libxdamage1 libxfixes3 libxi6 libxrandr2 libgbm1 \
    libasound2 libpango1.0-0 libcups2 wget unzip \
    && rm -rf /var/lib/apt/lists/*

# Install Google Chrome
RUN wget -qO- https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb > chrome.deb \
    && apt install -y ./chrome.deb \
    && rm chrome.deb

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json first
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install --omit=dev

# Copy the rest of the application
COPY . .

# Expose the application port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
