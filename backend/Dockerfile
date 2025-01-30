FROM node:20-alpine

# Install pnpm
RUN npm install -g pnpm

WORKDIR /usr/src/app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install

# Copy source code
COPY . .

# Build application
RUN pnpm run build

# Expose port
EXPOSE 3000

# Start application
CMD ["pnpm", "run", "start:prod"]
