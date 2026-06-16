# Stage 1: Build the React application
FROM node:20-alpine AS build

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the application
# VITE_API_URL can be passed as a build argument
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build

# Stage 2: Serve the application with Nginx
FROM nginx:stable-alpine

# Copy the build output from the previous stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
