FROM node:20-slim

WORKDIR /app

# Install required system packages
RUN apt-get update && apt-get install -y openssl

# Copy files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest
COPY . .

# Generate Prisma client inside container
RUN npx prisma generate

# Build the project
RUN npm run build

EXPOSE 3000

CMD ["node", "dist/server.js"]
