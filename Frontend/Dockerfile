# Frontend Dockerfile
FROM node:22-alpine

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install pnpm and dependencies
RUN npm install -g pnpm && pnpm install --no-frozen-lockfile

# Copy application code
COPY . .

# Expose frontend port
EXPOSE 5173

# Start the development server
CMD ["pnpm", "dev"]
