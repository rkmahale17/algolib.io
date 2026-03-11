-- Create a new column "list_type" if it doesn't already exist
ALTER TABLE algorithms 
ADD COLUMN IF NOT EXISTS list_type TEXT;

-- Update the new column with data from the metadata JSONB column
-- Mapping 'coreAlgo' -> 'core'
-- Mapping 'blind75' -> 'blind75'
-- Default to keeping the value if it's neither (e.g., 'core+Blind75' or undefined)
UPDATE algorithms
SET list_type = CASE 
    WHEN metadata->>'listType' = 'coreAlgo' THEN 'core'
    WHEN metadata->>'listType' = 'blind75' THEN 'blind75'
    WHEN metadata->>'listType' = 'core+Blind75' THEN 'core+Blind75'
    ELSE metadata->>'listType'
END
WHERE list_type IS NULL;

-- Add an index for performance since we filter by this column frequently
CREATE INDEX IF NOT EXISTS algorithms_list_type_idx ON algorithms (list_type);