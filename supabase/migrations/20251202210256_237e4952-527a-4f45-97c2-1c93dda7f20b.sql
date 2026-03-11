-- Create a security definer function to check if the user is an admin
CREATE OR REPLACE FUNCTION public.is_algorithms_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT auth.uid() = '3551152b-b64b-4f56-bca7-1477b08249af'::uuid
$$;

-- Policy: Admin can insert algorithms
CREATE POLICY "Admin can insert algorithms"
ON public.algorithms
FOR INSERT
TO authenticated
WITH CHECK (public.is_algorithms_admin());

-- Policy: Admin can update algorithms
CREATE POLICY "Admin can update algorithms"
ON public.algorithms
FOR UPDATE
TO authenticated
USING (public.is_algorithms_admin())
WITH CHECK (public.is_algorithms_admin());

-- Policy: Admin can delete algorithms
CREATE POLICY "Admin can delete algorithms"
ON public.algorithms
FOR DELETE
TO authenticated
USING (public.is_algorithms_admin());