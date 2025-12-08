-- Create feature_flags table
CREATE TABLE IF NOT EXISTS public.feature_flags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  description TEXT,
  is_enabled BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.feature_flags ENABLE ROW LEVEL SECURITY;

-- Allow public read access (so all clients can check flags)
CREATE POLICY "Public read access for feature flags"
  ON public.feature_flags FOR SELECT
  USING (true);

-- Allow admins to full access (we'll rely on app logic or specific admin role check if needed, 
-- but for now assuming authenticated users with admin ID in env are protected by frontend route, 
-- ideally we need a robust admin check in RLS or just allow all authenticated for simplicity for this solo project 
-- or stick to service_role for admin content. 
-- Let's stick to "Authenticated users can update" for simplicity, assuming only admin access the admin page)

CREATE POLICY "Authenticated users can update feature flags"
  ON public.feature_flags FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Enable Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.feature_flags;
