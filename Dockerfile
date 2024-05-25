# Use an official Node.js runtime as a parent image
FROM node:14

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and yarn.lock
COPY package*.json yarn.lock ./

# Install project dependencies
RUN yarn install

# Copy the rest of the application code
COPY . .

# Install Tex Live for LaTeX compilation
RUN apt-get update && \
    apt-get install -y texlive && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Expose the port the app runs on
EXPOSE 8080

# Define the command to run the app
CMD ["node", "server.js"]
