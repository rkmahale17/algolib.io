-- Add code and is_favorite columns to user_progress table
ALTER TABLE public.user_progress 
ADD COLUMN IF NOT EXISTS code TEXT,
ADD COLUMN IF NOT EXISTS is_favorite BOOLEAN DEFAULT FALSE;

-- Create index for is_favorite for faster queries
CREATE INDEX IF NOT EXISTS idx_user_progress_is_favorite ON public.user_progress(is_favorite);

-- Add missing DELETE policy for user_progress
DROP POLICY IF EXISTS "Users can delete own progress" ON public.user_progress;
CREATE POLICY "Users can delete own progress"
  ON public.user_progress FOR DELETE
  USING (auth.uid() = user_id);