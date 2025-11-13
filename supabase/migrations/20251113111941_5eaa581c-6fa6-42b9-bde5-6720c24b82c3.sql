-- Add display_name column to profiles table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS display_name TEXT;

-- Update existing profiles to have a default display name based on email
UPDATE public.profiles 
SET display_name = COALESCE(full_name, SPLIT_PART(email, '@', 1))
WHERE display_name IS NULL;