-- Migration to update controls configuration with new fields

-- 1. Update existing rows with the new default structure
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
WHERE controls IS NULL OR controls = '{}'::jsonb OR controls->>'tabs' IS NOT NULL;

-- 2. Set the default value for future inserts
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