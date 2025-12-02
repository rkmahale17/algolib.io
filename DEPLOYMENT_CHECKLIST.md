# Deployment Checklist

## ✅ Files Ready for Deployment

### 1. Dockerfile ✅
- Uses nginx (original working setup)
- Accepts Supabase credentials as build arguments
- Brotli compression enabled
- Two-stage build (builder + runtime)

### 2. nginx/nginx.conf ✅
- Configured for Cloud Run (port 8080)
- SPA routing enabled (fallback to index.html)
- Brotli compression enabled
- Security headers added
- Static asset caching configured

### 3. Code Changes ✅
- Null checks added to prevent crashes when Supabase is unavailable
- `client.ts` returns null if credentials missing
- All hooks and pages handle null Supabase gracefully

## 📋 Deployment Steps

### Step 1: Add Supabase Credentials to Azure DevOps
1. Go to Azure DevOps → Pipelines → Library
2. Add these variables (get from your Supabase dashboard):
   ```
   VITE_SUPABASE_URL=https://xxxxx.supabase.co
   VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

### Step 2: Update azure-pipelines.yml
Find line 67-69 and replace with:
```yaml
- script: |
    gcloud builds submit \
      --tag gcr.io/$(projectId)/$(imageName):$(Build.BuildId) \
      --build-arg VITE_SUPABASE_URL=$(VITE_SUPABASE_URL) \
      --build-arg VITE_SUPABASE_PUBLISHABLE_KEY=$(VITE_SUPABASE_PUBLISHABLE_KEY)
  displayName: "Cloud Build -> GCR (with Supabase credentials)"
```

### Step 3: Commit and Push
```bash
git add Dockerfile DEPLOYMENT.md .env.example
git commit -m "fix: Update Dockerfile with Supabase build args for production"
git push origin main
```

### Step 4: Monitor Deployment
1. Watch Azure DevOps pipeline
2. Verify build completes successfully
3. Check QA deployment
4. Test Supabase functionality

## 🧪 Testing After Deployment

### Test Supabase Connection
1. Open browser console on deployed app
2. Should see: `⚠️ Supabase credentials not found...` (if build args not configured yet)
3. After configuring: No Supabase warnings, auth should work

### Test App Functionality
- ✅ Homepage loads
- ✅ Algorithm pages load
- ✅ Visualizations work
- ✅ Authentication works (if Supabase configured)
- ✅ Progress tracking works (if Supabase configured)

## 🔍 Troubleshooting

### If Supabase still shows "credentials not found":
1. Verify Azure DevOps variables are set correctly
2. Check pipeline logs to confirm build args were passed
3. Verify variable names match exactly: `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY`

### If build fails:
1. Check Docker build logs in Azure DevOps
2. Verify all files are committed (especially nginx/nginx.conf)
3. Check that gcloud supports --build-arg flag

## 📝 What Changed

### Before (Broken)
- Node.js server serving static files
- No Supabase credentials during build
- App crashed with "supabaseUrl is required"

### After (Fixed)
- nginx serving static files (faster, lighter)
- Supabase credentials passed as build arguments
- Credentials baked into bundle during build
- Null checks prevent crashes if credentials missing

## 🎯 Expected Outcome

After deployment with Supabase credentials configured:
- ✅ App loads without errors
- ✅ Supabase authentication works
- ✅ User progress tracking works
- ✅ Admin features work
- ✅ Fast page loads (nginx)
- ✅ Brotli compression active

## 📚 Additional Resources

- [DEPLOYMENT.md](./DEPLOYMENT.md) - Detailed deployment instructions
- [JUDGE0_DEPLOYMENT.md](./JUDGE0_DEPLOYMENT.md) - Options for Judge0 API
- [.env.example](./.env.example) - Environment variables reference
