-- Add algorithm_id to user_whiteboards and user_notes for linking to specific problems
ALTER TABLE public.user_whiteboards
ADD COLUMN algorithm_id TEXT;

ALTER TABLE public.user_notes
ADD COLUMN algorithm_id TEXT;

-- Add indexes for efficient querying at scale (critical for millions of users)
CREATE INDEX idx_user_whiteboards_user_algorithm ON public.user_whiteboards(user_id, algorithm_id);
CREATE INDEX idx_user_whiteboards_updated ON public.user_whiteboards(updated_at DESC);

CREATE INDEX idx_user_notes_user_algorithm ON public.user_notes(user_id, algorithm_id);
CREATE INDEX idx_user_notes_updated ON public.user_notes(updated_at DESC);

-- Add composite index for efficient history queries
CREATE INDEX idx_whiteboards_user_algo_updated ON public.user_whiteboards(user_id, algorithm_id, updated_at DESC);
CREATE INDEX idx_notes_user_algo_updated ON public.user_notes(user_id, algorithm_id, updated_at DESC);
