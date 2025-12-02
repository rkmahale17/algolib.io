# Judge0 API Deployment Options

## Problem
You need Judge0 API proxy (`/api/execute`) but your app is client-side React served by nginx.

## Solution Options

### Option 1: Separate Services (Recommended)
Deploy two separate services:

1. **Frontend (nginx)**: Your React app with Supabase
   - Uses the current Dockerfile with nginx
   - Serves static files
   - Handles all client-side routing

2. **API Service (Node.js)**: Judge0 proxy only
   - Separate lightweight Node.js service
   - Only handles `/api/execute` endpoint
   - Can be deployed as a separate Cloud Run service

#### Frontend Dockerfile (Current)
```dockerfile
# Already configured - uses nginx
```

#### API Dockerfile (New - create as `Dockerfile.api`)
```dockerfile
FROM node:18-alpine
WORKDIR /app

COPY package*.json ./
RUN npm install --production express cors dotenv axios

COPY server.js ./

EXPOSE 3001
CMD ["node", "server.js"]
```

#### Update vite.config.ts
Point API proxy to your deployed API service:
```typescript
proxy: {
  '/api': {
    target: 'https://your-api-service.run.app', // Your API Cloud Run URL
    changeOrigin: true,
    secure: true,
  }
}
```

### Option 2: Combined Service (Current Approach - Not Recommended)
Keep Node.js serving both static files and API.

**Issues:**
- Heavier runtime container
- Node.js is slower than nginx for static files
- More complex deployment

### Option 3: Use Cloud Functions for Judge0
Deploy Judge0 proxy as a Cloud Function instead of a full server.

**Benefits:**
- No server to maintain
- Auto-scaling
- Pay per use

## Recommended Approach

**Use Option 1** - Keep your nginx setup and deploy Judge0 as a separate service:

1. Keep current Dockerfile (nginx-based)
2. Create `Dockerfile.api` for Judge0 proxy
3. Deploy API as separate Cloud Run service
4. Update vite.config.ts proxy to point to API service URL
5. Add CORS configuration in server.js to allow your frontend domain

This gives you:
- ✅ Fast static file serving (nginx)
- ✅ Supabase working (build args)
- ✅ Judge0 API working (separate service)
- ✅ Easy to scale independently
- ✅ Lower costs (nginx uses less resources)
