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
ARG VITE_SUPABASE_PROJECT_ID
ARG VITE_ADMIN_USER_ID
ARG JUDGE0_API_KEY
ARG JUDGE0_API_HOST
ARG JUDGE0_API_URL

# Set environment variables for build
ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL
ENV VITE_SUPABASE_PUBLISHABLE_KEY=$VITE_SUPABASE_PUBLISHABLE_KEY
ENV VITE_SUPABASE_PROJECT_ID=$VITE_SUPABASE_PROJECT_ID
ENV VITE_ADMIN_USER_ID=$VITE_ADMIN_USER_ID

RUN npm install
RUN npm run build
# RUN cd /usr/dist && find . -type f -exec brotli {} \; # Optional: Compress if serving static directly, but express static handles gzip usually. keeping simple for now.

# Actual runtime container
FROM node:18-alpine
WORKDIR /app

# Accept runtime arguments for Judge0
ARG JUDGE0_API_KEY
ARG JUDGE0_API_HOST
ARG JUDGE0_API_URL

# Set runtime environment variables
ENV JUDGE0_API_KEY=$JUDGE0_API_KEY
ENV JUDGE0_API_HOST=$JUDGE0_API_HOST
ENV JUDGE0_API_URL=$JUDGE0_API_URL

COPY package*.json ./
RUN npm install --production

COPY --from=builder /usr/dist ./dist
COPY server.js ./

EXPOSE 3000
CMD ["node", "server.js"]