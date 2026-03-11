-- Add subscription fields to profiles table
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT 'none',
ADD COLUMN IF NOT EXISTS subscription_id TEXT,
ADD COLUMN IF NOT EXISTS trial_end_date TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS current_period_end TIMESTAMPTZ;

-- Seed the paywall_enabled and pricing_page_enabled feature flags
INSERT INTO public.feature_flags (key, description, is_enabled)
VALUES 
  ('paywall_enabled', 'Toggle the payment wall on/off', false),
  ('pricing_page_enabled', 'Toggle the pricing page visibility', false)
ON CONFLICT (key) DO UPDATE SET description = EXCLUDED.description;
