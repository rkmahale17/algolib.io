-- Add subscription fields to profiles table
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT 'trialing',
ADD COLUMN IF NOT EXISTS subscription_id TEXT,
ADD COLUMN IF NOT EXISTS trial_end_date TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '10 days'),
ADD COLUMN IF NOT EXISTS current_period_end TIMESTAMPTZ;

-- Seed the paywall_enabled feature flag
INSERT INTO public.feature_flags (key, description, is_enabled)
VALUES ('paywall_enabled', 'Toggle the payment wall on/off', false)
ON CONFLICT (key) DO NOTHING;