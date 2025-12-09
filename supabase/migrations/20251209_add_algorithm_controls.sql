-- Migration to add logic for controls configuration to algorithms table

-- 1. Add the column if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'algorithms' AND column_name = 'controls') THEN
        ALTER TABLE algorithms ADD COLUMN controls JSONB DEFAULT '{}'::jsonb;
    END IF;
END $$;

-- 2. Update existing rows with the new default structure if they are null or empty
-- This ensures all existing algorithms have the full set of controls enabled by default
UPDATE algorithms
SET controls = '{
  "tabs": {
    "visualization": true,
    "description": true,
    "solutions": true,
    "brainstorm": true,
    "history": true,
    "code": true
  },
  "description": {
    "problem_statement": true,
    "overview": true,
    "guides": true
  },
  "header": {
    "random_problem": true,
    "next_problem": true,
    "interview_mode": true,
    "timer": true,
    "bug_report": true
  },
  "metadata": {
     "difficulty": true,
     "companies": true,
     "attempted_badge": true
  },
  "social": {
     "voting": true,
     "favorite": true,
     "share": true
  },
  "brainstorm": {
    "notes": true,
    "whiteboard": true
  },
  "content": {
    "youtube_tutorial": true,
    "practice_problems": true
  },
  "code_runner": {
    "run_code": true,
    "submit": true,
    "add_test_case": true,
    "languages": {
        "typescript": true,
        "python": true,
        "java": true,
        "cpp": true
    }
  },
  "solutions": {
      "approaches": true,
      "languages": true
  }
}'::jsonb
WHERE controls IS NULL OR controls = '{}'::jsonb;

-- 3. Set the default value for future inserts
ALTER TABLE algorithms 
ALTER COLUMN controls SET DEFAULT '{
  "tabs": {
    "visualization": true,
    "description": true,
    "solutions": true,
    "brainstorm": true,
    "history": true,
    "code": true
  },
  "description": {
    "problem_statement": true,
    "overview": true,
    "guides": true
  },
  "header": {
    "random_problem": true,
    "next_problem": true,
    "interview_mode": true,
    "timer": true,
    "bug_report": true
  },
  "metadata": {
     "difficulty": true,
     "companies": true,
     "attempted_badge": true
  },
  "social": {
     "voting": true,
     "favorite": true,
     "share": true
  },
  "brainstorm": {
    "notes": true,
    "whiteboard": true
  },
  "content": {
    "youtube_tutorial": true,
    "practice_problems": true
  },
  "code_runner": {
    "run_code": true,
    "submit": true,
    "add_test_case": true,
    "languages": {
        "typescript": true,
        "python": true,
        "java": true,
        "cpp": true
    }
  },
  "solutions": {
      "approaches": true,
      "languages": true
  }
}'::jsonb;
