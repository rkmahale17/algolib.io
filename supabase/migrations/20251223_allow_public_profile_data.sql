-- Update RLS policies to allow viewing public profile data

-- Drop existing restrictive policy on user_algorithm_data
DROP POLICY IF EXISTS "Users can view own data" ON public.user_algorithm_data;

-- Create new policy that allows:
-- 1. Users can view their own data
-- 2. Users can view data of users with public profiles
CREATE POLICY "Users can view own data or public profile data"
  ON public.user_algorithm_data FOR SELECT
  USING (
    auth.uid() = user_id 
    OR 
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = user_algorithm_data.user_id 
      AND profiles.is_public = true
    )
  );

-- Also update profiles policy to allow viewing public profiles
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;

CREATE POLICY "Users can view own or public profiles"
  ON public.profiles FOR SELECT
  USING (
    auth.uid() = id 
    OR 
    is_public = true
  );
