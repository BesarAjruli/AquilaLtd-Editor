# Use the official Node.js image
FROM node:18-slim

# Install necessary dependencies and Chromium separately
RUN apt-get update && apt-get install -y \
    libatk1.0-0 libx11-xcb1 libnss3 libxcomposite1 \
    libxcursor1 libxdamage1 libxfixes3 libxi6 libxrandr2 libgbm1 \
    libasound2 libpango1.0-0 libcups2 wget chromium \
    && rm -rf /var/lib/apt/lists/*

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json first
COPY package.json package-lock.json ./

# Install Node.js dependencies (excluding dev dependencies)
RUN npm install --omit=dev

# Copy the rest of the app files
COPY . .

# Expose the application port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
