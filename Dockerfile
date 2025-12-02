# ----------------------------
# BUILD STAGE
# ----------------------------
FROM node:18-alpine AS builder

# Accept Supabase values from Cloud Build
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_PUBLISHABLE_KEY

# Export for Vite build
ENV VITE_SUPABASE_URL=${VITE_SUPABASE_URL}
ENV VITE_SUPABASE_PUBLISHABLE_KEY=${VITE_SUPABASE_PUBLISHABLE_KEY}

RUN apk update && apk add --upgrade brotli

WORKDIR /usr

COPY package*.json ./
COPY src ./src
COPY public ./public
ADD . .

RUN npm install
RUN npm run build

# Create brotli compressed assets
RUN cd /usr/dist && find . -type f -exec brotli --best {} \;

# ----------------------------
# RUNTIME STAGE
# ----------------------------
FROM alpine

RUN apk add --no-cache brotli nginx nginx-mod-http-brotli

COPY nginx/nginx.conf /etc/nginx/http.d/default.conf

COPY --from=builder /usr/dist /usr/share/nginx/html

EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
