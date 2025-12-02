# Build container
FROM node:18-alpine AS builder

# Accept build arguments for Supabase credentials
# These will be passed from Azure DevOps during build
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_PUBLISHABLE_KEY

# Set them as environment variables so Vite can access them during build
ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL
ENV VITE_SUPABASE_PUBLISHABLE_KEY=$VITE_SUPABASE_PUBLISHABLE_KEY

# Make sure we got brotli compression
RUN apk update
RUN apk add --upgrade brotli
WORKDIR /usr

# Copy package files and install dependencies
COPY package*.json ./
COPY src ./src
COPY public ./public
ADD . .
RUN npm install
RUN npm run build
RUN cd /usr/dist && find . -type f -exec brotli {} \;

# Actual runtime container
FROM alpine
RUN apk add brotli nginx nginx-mod-http-brotli

# Minimal config
COPY nginx/nginx.conf /etc/nginx/http.d/default.conf
# Actual data
COPY --from=builder /usr/dist /usr/share/nginx/html
CMD ["nginx", "-g", "daemon off;"]
EXPOSE 8080