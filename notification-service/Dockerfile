# Use lightweight Node image
FROM node:20-alpine

# Create app directory
WORKDIR /app

# Copy dependency files
COPY package*.json ./

# Install dependencies
RUN npm install --only=production

# Copy source code
COPY src ./src

# Expose backend port
EXPOSE 4001

# Start the server
CMD ["node", "src/server.js"]
