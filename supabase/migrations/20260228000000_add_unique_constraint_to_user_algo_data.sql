-- Add unique constraint to user_algorithm_data 
-- This is required for upsert operations to work correctly
ALTER TABLE public.user_algorithm_data 
ADD CONSTRAINT user_algorithm_data_user_id_algorithm_id_key 
UNIQUE (user_id, algorithm_id);
