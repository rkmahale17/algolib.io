-- Add subscription tiers and relevant fields to profiles table
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'pro', 'ultra')),
ADD COLUMN IF NOT EXISTS subscription_duration TEXT, -- '3_monthly', '6_monthly', 'yearly'
ADD COLUMN IF NOT EXISTS subscription_plan_id TEXT;  -- The Dodo Product ID

-- Update existing active subscriptions to 'pro' tier as a migration step if needed
-- This assumes previous active subscriptions were what we now call 'pro'
UPDATE public.profiles 
SET subscription_tier = 'pro' 
WHERE subscription_status = 'active' AND (subscription_tier IS NULL OR subscription_tier = 'free');
