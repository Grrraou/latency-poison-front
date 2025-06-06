FROM node:18-alpine

# Install dependencies
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package files
COPY package.json pnpm-lock.yaml* ./

# Install dependencies
RUN pnpm install

# Copy the rest of the application
COPY . .

# Expose the port
EXPOSE 3000

# Start the development server
CMD ["pnpm", "dev"] 