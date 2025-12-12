-- Add indexes for scaling optimization on selected tables

-- Algorithms table indexes
CREATE INDEX IF NOT EXISTS idx_algorithms_category ON public.algorithms(category);
CREATE INDEX IF NOT EXISTS idx_algorithms_difficulty ON public.algorithms(difficulty);
CREATE INDEX IF NOT EXISTS idx_algorithms_list_type ON public.algorithms(list_type);
CREATE INDEX IF NOT EXISTS idx_algorithms_serial_no ON public.algorithms(serial_no);

-- User algorithm data indexes
CREATE INDEX IF NOT EXISTS idx_user_algorithm_data_user_id ON public.user_algorithm_data(user_id);
CREATE INDEX IF NOT EXISTS idx_user_algorithm_data_algorithm_id ON public.user_algorithm_data(algorithm_id);
CREATE INDEX IF NOT EXISTS idx_user_algorithm_data_user_algorithm ON public.user_algorithm_data(user_id, algorithm_id);
CREATE INDEX IF NOT EXISTS idx_user_algorithm_data_completed ON public.user_algorithm_data(user_id, completed);
CREATE INDEX IF NOT EXISTS idx_user_algorithm_data_favorite ON public.user_algorithm_data(user_id, is_favorite);

-- Game sessions indexes
CREATE INDEX IF NOT EXISTS idx_game_sessions_user_id ON public.game_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_game_sessions_game_type ON public.game_sessions(game_type);
CREATE INDEX IF NOT EXISTS idx_game_sessions_score ON public.game_sessions(score DESC);
CREATE INDEX IF NOT EXISTS idx_game_sessions_leaderboard ON public.game_sessions(game_type, score DESC);