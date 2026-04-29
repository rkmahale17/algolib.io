-- Create webhook_status enum
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'webhook_status') THEN
        CREATE TYPE webhook_status AS ENUM (
            'received', 'processing', 'processed',
            'failed', 'dead_lettered', 'skipped'
        );
    END IF;
END
$$;

-- Drop existing table if it exists to ensure clean schema update
-- WARNING: This clears old webhook logs
DROP TABLE IF EXISTS public.webhook_events cascade;

-- Create webhook_events table
CREATE TABLE public.webhook_events (
  id                  uuid         PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id            text         NOT NULL UNIQUE, -- LS dedup key (SHA-256 of body)
  event_name          text         NOT NULL,
  resource_id         text         NOT NULL,
  resource_type       text         NOT NULL,
  status              webhook_status NOT NULL DEFAULT 'received',
  skip_reason         text,        -- duplicate|stale|terminal|ignored
  attempt_count       int          NOT NULL DEFAULT 0,
  last_error          text,
  payload             jsonb        NOT NULL,
  resource_updated_at timestamptz  NOT NULL,
  idempotency_key     text         NOT NULL, -- event_name||':'||resource_id
  received_at         timestamptz  NOT NULL DEFAULT now(),
  processed_at        timestamptz
);

-- Enable RLS
ALTER TABLE public.webhook_events ENABLE ROW LEVEL SECURITY;

-- Only service role can access this
CREATE POLICY "Service role can do everything on webhook_events"
ON public.webhook_events
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_webhook_events_event_id ON public.webhook_events (event_id);
CREATE INDEX IF NOT EXISTS idx_webhook_events_idempotency_stale ON public.webhook_events (idempotency_key, resource_updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_webhook_events_retry ON public.webhook_events (status) WHERE status IN ('failed','processing');
