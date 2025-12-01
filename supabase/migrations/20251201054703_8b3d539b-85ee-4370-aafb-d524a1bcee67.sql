-- Drop existing algorithms table if it exists
DROP TABLE IF EXISTS public.algorithms CASCADE;

-- Create algorithms table with comprehensive structure
CREATE TABLE public.algorithms (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  difficulty TEXT NOT NULL,
  description TEXT NOT NULL,
  explanation JSONB NOT NULL DEFAULT '{}'::jsonb,
  implementations JSONB NOT NULL DEFAULT '{}'::jsonb,
  problems_to_solve JSONB DEFAULT '[]'::jsonb,
  test_cases JSONB DEFAULT '[]'::jsonb,
  input_schema JSONB DEFAULT '[]'::jsonb,
  tutorials JSONB DEFAULT '[]'::jsonb,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.algorithms ENABLE ROW LEVEL SECURITY;

-- Allow anyone to view algorithms
CREATE POLICY "Anyone can view algorithms"
ON public.algorithms
FOR SELECT
USING (true);

-- Create index on category and difficulty for faster queries
CREATE INDEX idx_algorithms_category ON public.algorithms(category);
CREATE INDEX idx_algorithms_difficulty ON public.algorithms(difficulty);
CREATE INDEX idx_algorithms_id ON public.algorithms(id);

-- Add trigger for updated_at
CREATE TRIGGER update_algorithms_updated_at
  BEFORE UPDATE ON public.algorithms
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();