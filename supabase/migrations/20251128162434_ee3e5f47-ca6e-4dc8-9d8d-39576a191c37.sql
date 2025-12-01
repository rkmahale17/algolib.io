-- Create algorithms table with auto-incrementing ID
CREATE TABLE public.algorithms (
  id SERIAL PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  description TEXT NOT NULL,
  time_complexity TEXT NOT NULL,
  space_complexity TEXT NOT NULL,
  youtube_url TEXT,
  problems JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.algorithms ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access (algorithms are public data)
CREATE POLICY "Anyone can view algorithms"
  ON public.algorithms
  FOR SELECT
  USING (true);

-- Create indexes for better query performance
CREATE INDEX idx_algorithms_category ON public.algorithms(category);
CREATE INDEX idx_algorithms_difficulty ON public.algorithms(difficulty);
CREATE INDEX idx_algorithms_slug ON public.algorithms(slug);

-- Create trigger for updated_at
CREATE TRIGGER update_algorithms_updated_at
  BEFORE UPDATE ON public.algorithms
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();