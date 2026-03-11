-- Create user_algorithm_data table to consolidate all user-specific algorithm data
-- This replaces and extends the user_progress table

CREATE TABLE IF NOT EXISTS public.user_algorithm_data (
  -- Primary Keys
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  algorithm_id TEXT NOT NULL,
  
  -- Progress Tracking
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMPTZ,
  
  -- Code Storage (JSON for multi-language support)
  code JSONB DEFAULT '{}'::jsonb,
  
  -- Submission History (Array of submission objects)
  submissions JSONB DEFAULT '[]'::jsonb,
  
  -- Notes & Whiteboard
  notes TEXT,
  whiteboard_data JSONB,
  
  -- Social Interactions
  is_favorite BOOLEAN DEFAULT FALSE,
  user_vote TEXT CHECK (user_vote IN ('like', 'dislike', NULL)),
  share_count INTEGER DEFAULT 0,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_viewed_at TIMESTAMPTZ,
  time_spent_seconds INTEGER DEFAULT 0,
  
  -- Constraints
  UNIQUE(user_id, algorithm_id)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_algorithm_data_user_id ON public.user_algorithm_data(user_id);
CREATE INDEX IF NOT EXISTS idx_user_algorithm_data_algorithm_id ON public.user_algorithm_data(algorithm_id);
CREATE INDEX IF NOT EXISTS idx_user_algorithm_data_completed ON public.user_algorithm_data(completed);
CREATE INDEX IF NOT EXISTS idx_user_algorithm_data_is_favorite ON public.user_algorithm_data(is_favorite);
CREATE INDEX IF NOT EXISTS idx_user_algorithm_data_user_vote ON public.user_algorithm_data(user_vote);
CREATE INDEX IF NOT EXISTS idx_user_algorithm_data_user_algo ON public.user_algorithm_data(user_id, algorithm_id);

-- Enable Row Level Security
ALTER TABLE public.user_algorithm_data ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Users can only access their own data
CREATE POLICY "Users can view own algorithm data"
  ON public.user_algorithm_data FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own algorithm data"
  ON public.user_algorithm_data FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own algorithm data"
  ON public.user_algorithm_data FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own algorithm data"
  ON public.user_algorithm_data FOR DELETE
  USING (auth.uid() = user_id);

-- Migrate existing data from user_progress table
INSERT INTO public.user_algorithm_data (
  user_id,
  algorithm_id,
  completed,
  completed_at,
  code,
  is_favorite,
  created_at,
  updated_at
)
SELECT 
  user_id,
  algorithm_id,
  completed,
  completed_at,
  CASE 
    WHEN code IS NOT NULL THEN jsonb_build_object('default', code)
    ELSE '{}'::jsonb
  END as code,
  COALESCE(is_favorite, FALSE) as is_favorite,
  created_at,
  COALESCE(updated_at, created_at) as updated_at
FROM public.user_progress
ON CONFLICT (user_id, algorithm_id) DO NOTHING;

-- Create trigger to auto-update updated_at (using existing function)
DROP TRIGGER IF EXISTS update_user_algorithm_data_updated_at ON public.user_algorithm_data;
CREATE TRIGGER update_user_algorithm_data_updated_at
  BEFORE UPDATE ON public.user_algorithm_data
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

-- Add comment to table for documentation
COMMENT ON TABLE public.user_algorithm_data IS 'Stores all user-specific algorithm data including progress, code, notes, whiteboard, and social interactions';