# Deployment Instructions for QA/Production

## Overview

Your app is a **client-side React application** served by **nginx**. The Supabase credentials need to be available during the **build step** so Vite can bake them into the JavaScript bundle.

## The Solution

The Dockerfile has been updated to accept Supabase credentials as **build arguments**. These are passed from Azure DevOps during the Docker build process.

### Step 1: Add Supabase Credentials to Azure DevOps

1. Go to **Azure DevOps** → **Pipelines** → **Library**
2. Create or edit your Variable Group (or add to pipeline variables)
3. Add these variables:
   - `VITE_SUPABASE_URL` = `https://your-project.supabase.co`
   - `VITE_SUPABASE_PUBLISHABLE_KEY` = `your-anon-key-here`

> **Note:** These should be the SAME values you have in your local `.env` file

### Step 2: Update azure-pipelines.yml

Find the Cloud Build step (around line 67-69) and update it to pass build arguments:

```yaml
# Build once and tag with BuildId for promotion to PROD
- script: |
    gcloud builds submit \
      --tag gcr.io/$(projectId)/$(imageName):$(Build.BuildId) \
      --build-arg VITE_SUPABASE_URL=$(VITE_SUPABASE_URL) \
      --build-arg VITE_SUPABASE_PUBLISHABLE_KEY=$(VITE_SUPABASE_PUBLISHABLE_KEY)
  displayName: "Cloud Build -> GCR (with Supabase credentials)"
```

### Step 3: Verify Dockerfile

The Dockerfile now includes (already updated):

```dockerfile
# Accept build arguments for Supabase credentials
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_PUBLISHABLE_KEY

# Set them as environment variables so Vite can access them during build
ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL
ENV VITE_SUPABASE_PUBLISHABLE_KEY=$VITE_SUPABASE_PUBLISHABLE_KEY
```

These lines ensure that when `npm run build` executes, Vite has access to the Supabase credentials and bakes them into the production bundle.

### Step 4: Deploy

1. Commit the updated Dockerfile
2. Push to your repository
3. Azure pipeline will trigger
4. Docker build will receive Supabase credentials
5. Production bundle will have working Supabase connection

## How It Works

1. **Build Time**: Azure DevOps passes `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` as build arguments
2. **Docker Build**: Dockerfile receives these as `ARG` and sets them as `ENV` variables
3. **Vite Build**: `npm run build` runs with these environment variables available
4. **Bundle**: Vite replaces `import.meta.env.VITE_SUPABASE_URL` with the actual URL in the JavaScript bundle
5. **Runtime**: nginx serves the static files with Supabase credentials baked in
