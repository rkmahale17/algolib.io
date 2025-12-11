-- Add serial_no column to algorithms table
ALTER TABLE algorithms 
ADD COLUMN IF NOT EXISTS serial_no INTEGER;

-- Set all existing rows to 150
UPDATE algorithms
SET serial_no = 150
WHERE serial_no IS NULL;