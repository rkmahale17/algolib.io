-- Submission Performance Table for cross-user comparison and distribution charts
CREATE TABLE IF NOT EXISTS submission_performance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    algorithm_id TEXT NOT NULL,
    language TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('passed', 'failed', 'error')),
    execution_time_ms NUMERIC,
    memory_usage_kb NUMERIC,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes for fast aggregation queries
CREATE INDEX IF NOT EXISTS idx_submission_perf_algo_lang 
    ON submission_performance(algorithm_id, language, status);
CREATE INDEX IF NOT EXISTS idx_submission_perf_user 
    ON submission_performance(user_id, algorithm_id);

-- RLS: users can read all (for distribution), insert own
ALTER TABLE submission_performance ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read submission_performance" 
    ON submission_performance FOR SELECT USING (true);
CREATE POLICY "Users insert own submission_performance" 
    ON submission_performance FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RPC function for distribution chart data
CREATE OR REPLACE FUNCTION get_submission_distribution(
    p_algorithm_id TEXT,
    p_language TEXT,
    p_user_time_ms NUMERIC DEFAULT NULL,
    p_user_memory_kb NUMERIC DEFAULT NULL
) RETURNS JSON AS $$
DECLARE
    result JSON;
    min_time NUMERIC;
    max_time NUMERIC;
    min_mem NUMERIC;
    max_mem NUMERIC;
    total_count BIGINT;
BEGIN
    -- Get bounds for passed submissions
    SELECT min(execution_time_ms), max(execution_time_ms), 
           min(memory_usage_kb), max(memory_usage_kb),
           count(*)
    INTO min_time, max_time, min_mem, max_mem, total_count
    FROM submission_performance
    WHERE algorithm_id = p_algorithm_id 
      AND language = p_language 
      AND status = 'passed'
      AND execution_time_ms IS NOT NULL
      AND memory_usage_kb IS NOT NULL;

    -- Return null if no data
    IF total_count = 0 OR total_count IS NULL THEN
        RETURN json_build_object(
            'runtime', json_build_object('buckets', '[]'::json, 'percentile', 0, 'total_submissions', 0),
            'memory', json_build_object('buckets', '[]'::json, 'percentile', 0, 'total_submissions', 0)
        );
    END IF;

    SELECT json_build_object(
        'runtime', json_build_object(
            'buckets', COALESCE((
                SELECT json_agg(row_to_json(t) ORDER BY t.range_start)
                FROM (
                    SELECT 
                        round(min_time + (b - 1) * ((max_time - min_time + 1) / 20.0), 1) as range_start,
                        round(min_time + b * ((max_time - min_time + 1) / 20.0), 1) as range_end,
                        count(*) as count
                    FROM submission_performance,
                         generate_series(1, 20) as b
                    WHERE algorithm_id = p_algorithm_id 
                      AND language = p_language 
                      AND status = 'passed'
                      AND execution_time_ms IS NOT NULL
                      AND width_bucket(
                            execution_time_ms, 
                            min_time, 
                            CASE WHEN max_time = min_time THEN max_time + 1 ELSE max_time + 0.001 END, 
                            20
                          ) = b
                    GROUP BY b
                    ORDER BY b
                ) t
            ), '[]'::json),
            'percentile', CASE WHEN p_user_time_ms IS NOT NULL THEN
                round(
                    100.0 * (
                        SELECT count(*) FROM submission_performance
                        WHERE algorithm_id = p_algorithm_id 
                          AND language = p_language 
                          AND status = 'passed'
                          AND execution_time_ms >= p_user_time_ms
                    )::numeric / GREATEST(total_count, 1)
                , 2)
            ELSE 0 END,
            'total_submissions', total_count,
            'user_value', p_user_time_ms
        ),
        'memory', json_build_object(
            'buckets', COALESCE((
                SELECT json_agg(row_to_json(t) ORDER BY t.range_start)
                FROM (
                    SELECT 
                        round(min_mem + (b - 1) * ((max_mem - min_mem + 1) / 20.0), 1) as range_start,
                        round(min_mem + b * ((max_mem - min_mem + 1) / 20.0), 1) as range_end,
                        count(*) as count
                    FROM submission_performance,
                         generate_series(1, 20) as b
                    WHERE algorithm_id = p_algorithm_id 
                      AND language = p_language 
                      AND status = 'passed'
                      AND memory_usage_kb IS NOT NULL
                      AND width_bucket(
                            memory_usage_kb, 
                            min_mem, 
                            CASE WHEN max_mem = min_mem THEN max_mem + 1 ELSE max_mem + 0.001 END, 
                            20
                          ) = b
                    GROUP BY b
                    ORDER BY b
                ) t
            ), '[]'::json),
            'percentile', CASE WHEN p_user_memory_kb IS NOT NULL THEN
                round(
                    100.0 * (
                        SELECT count(*) FROM submission_performance
                        WHERE algorithm_id = p_algorithm_id 
                          AND language = p_language 
                          AND status = 'passed'
                          AND memory_usage_kb >= p_user_memory_kb
                    )::numeric / GREATEST(total_count, 1)
                , 2)
            ELSE 0 END,
            'total_submissions', total_count,
            'user_value', p_user_memory_kb
        )
    ) INTO result;

    RETURN result;
END;
$$ LANGUAGE plpgsql STABLE;
