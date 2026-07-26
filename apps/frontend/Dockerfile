# --------------------------------------------------------
# Stage 1: Build Angular Frontend
# --------------------------------------------------------
FROM node:18-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
COPY apps/frontend/package.json ./apps/frontend/
RUN npm ci

COPY . .
RUN npm run build --prefix apps/frontend

# --------------------------------------------------------
# Stage 2: Production Nginx Server
# --------------------------------------------------------
FROM nginx:1.25-alpine AS runner
WORKDIR /usr/share/nginx/html

# Custom nginx configuration for Angular SPA routing
RUN rm -rf ./* && \
    echo 'server { \
      listen 80; \
      location / { \
        root /usr/share/nginx/html; \
        index index.html index.htm; \
        try_files $uri $uri/ /index.html; \
      } \
      location /health { \
        access_log off; \
        return 200 "OK"; \
      } \
    }' > /etc/nginx/conf.d/default.conf

COPY --from=builder /app/apps/frontend/dist/frontend-user/browser/ /usr/share/nginx/html/

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost/health || exit 1

CMD ["nginx", "-g", "daemon off;"]
