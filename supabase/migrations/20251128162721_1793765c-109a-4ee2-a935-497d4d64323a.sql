-- Create blind75_problems table
CREATE TABLE public.blind75_problems (
  id INTEGER PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
  description TEXT NOT NULL,
  leetcode_search TEXT NOT NULL,
  time_complexity TEXT NOT NULL,
  space_complexity TEXT NOT NULL,
  companies JSONB DEFAULT '[]'::jsonb,
  tags JSONB DEFAULT '[]'::jsonb,
  algorithm_id TEXT,
  youtube_url TEXT,
  use_cases JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create algorithm_implementations table
CREATE TABLE public.algorithm_implementations (
  id TEXT PRIMARY KEY,
  code_typescript TEXT NOT NULL,
  code_python TEXT NOT NULL,
  code_cpp TEXT NOT NULL,
  code_java TEXT NOT NULL,
  explanation_overview TEXT NOT NULL,
  explanation_steps JSONB DEFAULT '[]'::jsonb,
  explanation_use_case TEXT NOT NULL,
  explanation_tips JSONB DEFAULT '[]'::jsonb,
  visualization_type TEXT NOT NULL CHECK (visualization_type IN ('array', 'linkedList', 'tree', 'graph', 'matrix', 'none')),
  practice_problems JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create blind75_implementations table
CREATE TABLE public.blind75_implementations (
  slug TEXT PRIMARY KEY,
  code_python TEXT NOT NULL,
  code_java TEXT NOT NULL,
  code_cpp TEXT NOT NULL,
  code_typescript TEXT NOT NULL,
  explanation TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.blind75_problems ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.algorithm_implementations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blind75_implementations ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (all data is public)
CREATE POLICY "Anyone can view blind75 problems"
  ON public.blind75_problems
  FOR SELECT
  USING (true);

CREATE POLICY "Anyone can view algorithm implementations"
  ON public.algorithm_implementations
  FOR SELECT
  USING (true);

CREATE POLICY "Anyone can view blind75 implementations"
  ON public.blind75_implementations
  FOR SELECT
  USING (true);

-- Create indexes for better query performance
CREATE INDEX idx_blind75_category ON public.blind75_problems(category);
CREATE INDEX idx_blind75_difficulty ON public.blind75_problems(difficulty);
CREATE INDEX idx_blind75_slug ON public.blind75_problems(slug);

-- Create triggers for updated_at
CREATE TRIGGER update_blind75_problems_updated_at
  BEFORE UPDATE ON public.blind75_problems
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_algorithm_implementations_updated_at
  BEFORE UPDATE ON public.algorithm_implementations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_blind75_implementations_updated_at
  BEFORE UPDATE ON public.blind75_implementations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();