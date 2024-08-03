# Stage 1: Build React application
FROM node:18-alpine as build

WORKDIR /app

# Copy package.json and package-lock.json to install dependencies
COPY package*.json ./
RUN npm install

# Copy the entire frontend directory content into the container
COPY . .

# Build the React app
RUN npm run build

# Stage 2: Serve React application using Nginx
FROM nginx:alpine

# Copy build artifacts from the build stage
COPY --from=build /app/build /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Default command to run when the container starts
CMD ["nginx", "-g", "daemon off;"]
