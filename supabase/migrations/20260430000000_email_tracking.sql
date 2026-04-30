-- Create email_status enum
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'email_status') THEN
        CREATE TYPE email_status AS ENUM (
            'pending', 'sent', 'failed', 'skipped', 'duplicate'
        );
    END IF;
END
$$;

-- Create mailed_events table to track and debounce auth emails
CREATE TABLE IF NOT EXISTS public.mailed_events (
  id                  uuid         PRIMARY KEY DEFAULT gen_random_uuid(),
  user_email          text         NOT NULL,
  action_type         text         NOT NULL,
  sub_action_type     text,        -- e.g. 'cancelled' for subscriptions
  status              email_status NOT NULL DEFAULT 'pending',
  error               text,
  token_hash          text,        -- The Supabase token hash for the link
  redirect_to         text,        -- Where the user goes after clicking
  payload             jsonb,
  created_at          timestamptz  NOT NULL DEFAULT now(),
  sent_at             timestamptz,
  -- This helps us debounce. Example: signup:user@example.com
  idempotency_key     text         NOT NULL
);

-- Index for debouncing (look for same key in last minute)
CREATE INDEX IF NOT EXISTS idx_mailed_events_idempotency 
ON public.mailed_events (idempotency_key, created_at DESC);

-- Enable RLS
ALTER TABLE public.mailed_events ENABLE ROW LEVEL SECURITY;

-- Only service role can access this
CREATE POLICY "Service role can do everything on mailed_events"
ON public.mailed_events
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);
