-- Create enum for game types
CREATE TYPE public.game_type AS ENUM ('sort_hero');

-- Create game_sessions table to track all game plays
CREATE TABLE public.game_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  game_type game_type NOT NULL,
  score INTEGER NOT NULL CHECK (score >= 0 AND score <= 1000),
  level INTEGER NOT NULL,
  moves INTEGER NOT NULL DEFAULT 0,
  errors INTEGER NOT NULL DEFAULT 0,
  hints_used INTEGER NOT NULL DEFAULT 0,
  grade TEXT,
  duration_seconds INTEGER,
  completed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.game_sessions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for game_sessions
CREATE POLICY "Users can insert own game sessions"
ON public.game_sessions
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own game sessions"
ON public.game_sessions
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Public can view leaderboard data"
ON public.game_sessions
FOR SELECT
TO authenticated
USING (true);

-- Create indexes for performance
CREATE INDEX idx_game_sessions_user_id ON public.game_sessions(user_id);
CREATE INDEX idx_game_sessions_game_type ON public.game_sessions(game_type);
CREATE INDEX idx_game_sessions_completed_at ON public.game_sessions(completed_at DESC);
CREATE INDEX idx_game_sessions_score ON public.game_sessions(score DESC);

-- Enable realtime for live leaderboard updates
ALTER PUBLICATION supabase_realtime ADD TABLE public.game_sessions;