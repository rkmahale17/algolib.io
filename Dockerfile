# Build container
FROM node:18-alpine AS builder

# Accept build arguments for Supabase credentials
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_PUBLISHABLE_KEY

# Set them as environment variables so Vite can access them during build
ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL
ENV VITE_SUPABASE_PUBLISHABLE_KEY=$VITE_SUPABASE_PUBLISHABLE_KEY

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