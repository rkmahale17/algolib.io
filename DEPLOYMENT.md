# Deployment Instructions for QA/Production

## Problem
The Dockerfile builds the app without Supabase environment variables, causing the production bundle to have `undefined` values baked in.

## Solution

### Step 1: Add Supabase Credentials to Azure DevOps

1. Go to **Azure DevOps** → **Pipelines** → **Library**
2. Create or edit your Variable Group
3. Add these secret variables:
   - `VITE_SUPABASE_URL` = `https://your-project.supabase.co`
   - `VITE_SUPABASE_PUBLISHABLE_KEY` = `your-anon-key-here`

### Step 2: Update azure-pipelines.yml

Replace the Cloud Build step (line 67-69) with this:

```yaml
# Build once and tag with BuildId for promotion to PROD
- script: |
    gcloud builds submit \
      --tag gcr.io/$(projectId)/$(imageName):$(Build.BuildId) \
      --build-arg VITE_SUPABASE_URL=$(VITE_SUPABASE_URL) \
      --build-arg VITE_SUPABASE_PUBLISHABLE_KEY=$(VITE_SUPABASE_PUBLISHABLE_KEY)
  displayName: "Cloud Build -> GCR (with Supabase credentials)"
```

### Step 3: Verify the Dockerfile

The Dockerfile has been updated to accept these build arguments. Make sure it contains:

```dockerfile
# Accept build arguments for Supabase credentials
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_PUBLISHABLE_KEY

# Set them as environment variables so Vite can access them during build
ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL
ENV VITE_SUPABASE_PUBLISHABLE_KEY=$VITE_SUPABASE_PUBLISHABLE_KEY
```

### Step 4: Deploy

After making these changes:
1. Commit and push to your repository
2. The Azure pipeline will trigger
3. The Docker build will now have access to Supabase credentials
4. The production bundle will work correctly

## Alternative: Use Google Cloud Build Config

If `gcloud builds submit` doesn't support `--build-arg`, create a `cloudbuild.yaml`:

```yaml
steps:
  - name: 'gcr.io/cloud-builders/docker'
    args:
      - 'build'
      - '--build-arg'
      - 'VITE_SUPABASE_URL=${_VITE_SUPABASE_URL}'
      - '--build-arg'
      - 'VITE_SUPABASE_PUBLISHABLE_KEY=${_VITE_SUPABASE_PUBLISHABLE_KEY}'
      - '-t'
      - 'gcr.io/$PROJECT_ID/algo-image:$BUILD_ID'
      - '.'
images:
  - 'gcr.io/$PROJECT_ID/algo-image:$BUILD_ID'
substitutions:
  _VITE_SUPABASE_URL: 'your-supabase-url'
  _VITE_SUPABASE_PUBLISHABLE_KEY: 'your-supabase-key'
```

Then update the pipeline to use:
```yaml
- script: |
    gcloud builds submit --config=cloudbuild.yaml \
      --substitutions=_VITE_SUPABASE_URL=$(VITE_SUPABASE_URL),_VITE_SUPABASE_PUBLISHABLE_KEY=$(VITE_SUPABASE_PUBLISHABLE_KEY)
  displayName: "Cloud Build -> GCR (with config)"
```
