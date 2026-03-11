-- Add is_public field to profiles table
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS is_public BOOLEAN DEFAULT true;

-- Create index for performance on public profile queries
CREATE INDEX IF NOT EXISTS idx_profiles_is_public ON public.profiles(is_public);
CREATE INDEX IF NOT EXISTS idx_profiles_username_public ON public.profiles(username, is_public) WHERE username IS NOT NULL;

-- Update RLS policies to allow public access to public profiles
-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Anyone can view profiles" ON public.profiles;

-- Create new policy that allows viewing public profiles
CREATE POLICY "Anyone can view public profiles"
  ON public.profiles FOR SELECT
  USING (is_public = true OR auth.uid() = id);

-- Drop existing update policy to avoid conflict
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

-- Users can still update their own profiles
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Insert profile_private feature flag
INSERT INTO public.feature_flags (key, description, is_enabled)
VALUES (
  'profile_private',
  'Enables users to make their profiles private. When disabled, all profiles are public.',
  false
)
ON CONFLICT (key) DO NOTHING;