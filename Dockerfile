# Build container
FROM node:18-alpine AS builder

# Make sure we got brotli
RUN apk update
RUN apk add --upgrade brotli
WORKDIR /usr
COPY package*.json ./
COPY src ./src
COPY public ./public
ADD  . .
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