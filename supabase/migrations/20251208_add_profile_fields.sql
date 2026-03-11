-- Add new fields to profiles table
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS bio TEXT,
ADD COLUMN IF NOT EXISTS company TEXT,
ADD COLUMN IF NOT EXISTS location TEXT,
ADD COLUMN IF NOT EXISTS linkedin_url TEXT,
ADD COLUMN IF NOT EXISTS twitter_url TEXT,
ADD COLUMN IF NOT EXISTS github_url TEXT,
ADD COLUMN IF NOT EXISTS website_url TEXT,
ADD COLUMN IF NOT EXISTS username TEXT UNIQUE;

-- Create index for username
CREATE INDEX IF NOT EXISTS idx_profiles_username ON public.profiles(username);

-- Policy to allow anyone to view profiles (public profiles)
-- Existing policy "Users can view own profile" restricts to own profile. 
-- We probably want public profiles.
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;

CREATE POLICY "Anyone can view profiles"
  ON public.profiles FOR SELECT
  USING (true);
