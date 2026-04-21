-- Add role column to profiles table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user';

-- Add check constraint to ensure only valid roles are allowed
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'profiles_role_check'
    ) THEN
        ALTER TABLE public.profiles ADD CONSTRAINT profiles_role_check CHECK (role IN ('user', 'admin'));
    END IF;
END
$$;

-- Update the is_algorithms_admin function to check the database role
CREATE OR REPLACE FUNCTION public.is_algorithms_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_role TEXT;
BEGIN
  -- Get the role from the profiles table for the current user
  SELECT role INTO user_role
  FROM public.profiles
  WHERE id = auth.uid();

  -- Return true if role is admin or if it matches hardcoded IDs (for backward compatibility during migration)
  RETURN user_role = 'admin' OR auth.uid() IN (
    '3551152b-b64b-4f56-bca7-1477b08249af', -- Original Admin
    '353dbdf5-32cc-40d3-b385-6f5c4dba04f4'  -- Current Admin User
  );
END;
$$;
