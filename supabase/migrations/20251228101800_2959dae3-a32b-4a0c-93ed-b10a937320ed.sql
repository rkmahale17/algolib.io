-- Update subscription_status default to 'none' and remove trial_end_date default
ALTER TABLE public.profiles
ALTER COLUMN subscription_status SET DEFAULT 'none',
ALTER COLUMN trial_end_date DROP DEFAULT;

-- Seed the paywall_enabled and pricing_page_enabled feature flags
INSERT INTO public.feature_flags (key, description, is_enabled)
VALUES 
  ('paywall_enabled', 'Toggle the payment wall on/off', false),
  ('pricing_page_enabled', 'Toggle the pricing page visibility', false)
ON CONFLICT (key) DO UPDATE SET description = EXCLUDED.description;