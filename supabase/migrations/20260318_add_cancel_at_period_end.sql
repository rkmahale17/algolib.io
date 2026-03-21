-- Add cancel_at_period_end to profiles table
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS cancel_at_period_end BOOLEAN DEFAULT false;
