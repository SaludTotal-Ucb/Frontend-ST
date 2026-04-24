# --- Etapa de Build ---
FROM node:20-alpine AS builder

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./
RUN npm install

# Copiar código fuente y construir la aplicación
COPY . .
RUN npm run build 

# --- Etapa de Producción ---
FROM nginx:alpine

# Copiar los archivos construidos a la carpeta de Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Copiar configuración personalizada de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]