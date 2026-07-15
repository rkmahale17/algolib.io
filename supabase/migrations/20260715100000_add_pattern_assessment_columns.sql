-- Migration for Guess the Pattern Assessment Feature
-- Adds tracking columns to user_algorithm_data

ALTER TABLE user_algorithm_data
ADD COLUMN IF NOT EXISTS pattern_assessment_completed BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS pattern_assessment_history JSONB DEFAULT '[]'::jsonb;
