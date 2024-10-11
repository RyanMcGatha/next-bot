# Use Node.js 18 Alpine version for a smaller image size
FROM node:18-alpine

# Set working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the entire project into the container
COPY . .

# Expose necessary ports for Next.js (3000) and the Discord bot (if needed)
EXPOSE 3000

# Start both Next.js and Discord bot concurrently
CMD ["npm", "run", "dev"]
