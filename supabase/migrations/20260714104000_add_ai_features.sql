-- AI Queen Chats (QWEEN)
CREATE TABLE IF NOT EXISTS ai_chats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    algorithm_id TEXT NOT NULL,
    messages JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE UNIQUE INDEX idx_ai_chats_user_algo ON ai_chats(user_id, algorithm_id);

ALTER TABLE ai_chats ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own ai_chats" ON ai_chats FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own ai_chats" ON ai_chats FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own ai_chats" ON ai_chats FOR UPDATE USING (auth.uid() = user_id);

-- AI Reviews (RULCO)
CREATE TABLE IF NOT EXISTS ai_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    algorithm_id TEXT NOT NULL,
    submission_id TEXT NOT NULL,
    language TEXT NOT NULL,
    review_content JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE UNIQUE INDEX idx_ai_reviews_submission ON ai_reviews(user_id, algorithm_id, submission_id);

ALTER TABLE ai_reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own ai_reviews" ON ai_reviews FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own ai_reviews" ON ai_reviews FOR INSERT WITH CHECK (auth.uid() = user_id);

-- AI Profile Scans
CREATE TABLE IF NOT EXISTS ai_profile_scans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    scan_content JSONB NOT NULL,
    stats_snapshot JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_ai_profile_scans_user ON ai_profile_scans(user_id);

ALTER TABLE ai_profile_scans ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own scans" ON ai_profile_scans FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own scans" ON ai_profile_scans FOR INSERT WITH CHECK (auth.uid() = user_id);
