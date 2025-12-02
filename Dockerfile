# Build container
FROM node:18-alpine AS builder

# Make sure we got brotli compression
RUN apk update
RUN apk add --upgrade brotli
WORKDIR /usr
COPY package*.json ./
COPY src ./src
COPY public ./public
COPY index.html ./
COPY vite.config.ts ./
COPY tsconfig*.json ./
COPY generate-sitemap.ts ./
COPY verify-ssg.ts ./
COPY tailwind.config.ts ./
COPY postcss.config.js ./
COPY eslint.config.js ./

# Accept build arguments for Supabase
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_PUBLISHABLE_KEY

# Set environment variables for build
ENV VITE_SUPABASE_URL="https://mitejukmgshjyusgnpps.supabase.co"
ENV VITE_SUPABASE_PUBLISHABLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1pdGVqdWttZ3Noanl1c2ducHBzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkzNDYzOTMsImV4cCI6MjA3NDkyMjM5M30.d0rft-Zxcz8EVnqVCBHx7z3oxtWS4lIC1vFCErslr3o"

RUN npm install
RUN npm run build
# RUN cd /usr/dist && find . -type f -exec brotli {} \; # Optional: Compress if serving static directly, but express static handles gzip usually. keeping simple for now.

# Actual runtime container
FROM node:18-alpine
WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY --from=builder /usr/dist ./dist
COPY server.js ./

EXPOSE 3000
CMD ["node", "server.js"]