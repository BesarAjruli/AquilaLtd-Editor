# Use an official Node.js image as the base
FROM node:18-slim

# Install necessary system dependencies for Puppeteer and PostgreSQL
RUN apt-get update && apt-get install -y \
    libatk1.0-0 libx11-xcb1 libnss3 libxcomposite1 \
    libxcursor1 libxdamage1 libxfixes3 libxi6 libxrandr2 libgbm1 \
    libasound2 libpango1.0-0 libcups2 \
    && rm -rf /var/lib/apt/lists/*

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json first (to leverage Docker caching)
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install --omit=dev

# Copy the rest of the application files
COPY . .

# Expose the port (change if your backend runs on a different port)
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
