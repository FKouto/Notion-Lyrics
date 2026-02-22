FROM node:18-alpine

WORKDIR /app

# Install dependencies based on package.json
COPY package.json ./
# We use npm install since we don't have a lockfile yet
RUN npm install

# Copy application code
# (In development we mount the volume, but this is good practice)
COPY . .

# Expose Next.js default port
EXPOSE 3000

# Start development server with hot reload
CMD ["npm", "run", "dev"]
