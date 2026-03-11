-- Update the is_algorithms_admin function to be more flexible
-- This fixes the issue where only a hardcoded UUID could update algorithm data
CREATE OR REPLACE FUNCTION public.is_algorithms_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  -- Allow multiple hardcoded UUIDs or check for a specific metadata flag
  SELECT auth.uid() IN (
    '3551152b-b64b-4f56-bca7-1477b08249af', -- Original Admin
    '353dbdf5-32cc-40d3-b385-6f5c4dba04f4'  -- Current Admin User
  ) OR (auth.jwt() -> 'user_metadata' ->> 'role' = 'admin');
$$;
