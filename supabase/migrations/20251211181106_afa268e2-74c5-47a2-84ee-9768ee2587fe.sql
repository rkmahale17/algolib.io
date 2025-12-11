-- Add new columns
ALTER TABLE algorithms ADD COLUMN IF NOT EXISTS time_complexity text;
ALTER TABLE algorithms ADD COLUMN IF NOT EXISTS space_complexity text;

-- Copy data from metadata JSONB column
UPDATE algorithms 
SET 
  time_complexity = metadata->>'timeComplexity',
  space_complexity = metadata->>'spaceComplexity'
WHERE metadata->>'timeComplexity' IS NOT NULL 
   OR metadata->>'spaceComplexity' IS NOT NULL;