-- Add feature completion columns to user_algorithm_data
ALTER TABLE public.user_algorithm_data
ADD COLUMN IF NOT EXISTS visualization_completed BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS drawing_completed BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS solution_completed BOOLEAN DEFAULT FALSE;
