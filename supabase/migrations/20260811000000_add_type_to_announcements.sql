ALTER TABLE public.announcements ADD COLUMN IF NOT EXISTS type text DEFAULT 'toast' NOT NULL;
