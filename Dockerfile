# Use an official Node.js runtime as a parent image
FROM node:16-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application to the container
COPY . .

# Expose the port (optional, depending on your bot's web features)
# EXPOSE 3000

# Set environment variables from the host
ENV DISCORD_TOKEN=$DISCORD_TOKEN
ENV OPENAI_API_KEY=$OPENAI_API_KEY

# Run the Discord bot
CMD ["node", "bot/discordBot.js"]
