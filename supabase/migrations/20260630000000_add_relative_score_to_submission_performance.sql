-- Add relative_score to submission_performance for fair cross-user comparison.
-- relative_score = user_execution_time / reference_execution_time
-- A score of 1.0 means the user matched the reference (optimize) solution's speed.
-- Values < 1.0 are faster; > 1.0 are slower.
-- NULL means reference could not be run (e.g. reference code failed — excluded from comparison).

ALTER TABLE submission_performance
    ADD COLUMN IF NOT EXISTS relative_score NUMERIC,
    ADD COLUMN IF NOT EXISTS ref_execution_time_ms NUMERIC;

-- Index for fast relative_score percentile queries
CREATE INDEX IF NOT EXISTS idx_submission_perf_relative_score
    ON submission_performance(algorithm_id, language, status, relative_score)
    WHERE relative_score IS NOT NULL;

-- Allow users to update only relative_score and ref_execution_time_ms on their own rows.
-- This is needed for the fire-and-forget async update after the reference code runs.
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE tablename = 'submission_performance'
          AND policyname = 'Users update own relative_score'
    ) THEN
        CREATE POLICY "Users update own relative_score"
            ON submission_performance FOR UPDATE
            USING (auth.uid() = user_id)
            WITH CHECK (auth.uid() = user_id);
    END IF;
END
$$;

-- Update the distribution RPC to prefer relative_score when available,
-- falling back to raw execution_time_ms for older records.
CREATE OR REPLACE FUNCTION get_submission_distribution(
    p_algorithm_id TEXT,
    p_language TEXT,
    p_user_time_ms NUMERIC DEFAULT NULL,
    p_user_memory_kb NUMERIC DEFAULT NULL,
    p_user_relative_score NUMERIC DEFAULT NULL
) RETURNS JSON AS $$
DECLARE
    result JSON;

    -- Runtime (relative score) bounds
    min_rel NUMERIC;
    max_rel NUMERIC;
    total_rel_count BIGINT;

    -- Runtime (raw ms fallback) bounds
    min_time NUMERIC;
    max_time NUMERIC;
    total_time_count BIGINT;

    -- Memory bounds
    min_mem NUMERIC;
    max_mem NUMERIC;
    total_mem_count BIGINT;

    use_relative BOOLEAN;
BEGIN
    -- Check if we have enough relative_score data (>=5 records with relative score)
    SELECT count(*)
    INTO total_rel_count
    FROM submission_performance
    WHERE algorithm_id = p_algorithm_id
      AND language = p_language
      AND status = 'passed'
      AND relative_score IS NOT NULL;

    use_relative := (total_rel_count >= 5);

    -- -------------------------------------------------------
    -- RUNTIME SECTION
    -- -------------------------------------------------------
    IF use_relative THEN
        SELECT min(relative_score), max(relative_score)
        INTO min_rel, max_rel
        FROM submission_performance
        WHERE algorithm_id = p_algorithm_id
          AND language = p_language
          AND status = 'passed'
          AND relative_score IS NOT NULL;
    ELSE
        -- Fallback to raw ms
        SELECT min(execution_time_ms), max(execution_time_ms), count(*)
        INTO min_time, max_time, total_time_count
        FROM submission_performance
        WHERE algorithm_id = p_algorithm_id
          AND language = p_language
          AND status = 'passed'
          AND execution_time_ms IS NOT NULL;
    END IF;

    -- Memory bounds (always uses raw KB — memory is less affected by server load)
    SELECT min(memory_usage_kb), max(memory_usage_kb), count(*)
    INTO min_mem, max_mem, total_mem_count
    FROM submission_performance
    WHERE algorithm_id = p_algorithm_id
      AND language = p_language
      AND status = 'passed'
      AND memory_usage_kb IS NOT NULL;

    -- Return empty if no runtime data at all
    IF (use_relative AND total_rel_count = 0) OR (NOT use_relative AND (total_time_count = 0 OR total_time_count IS NULL)) THEN
        RETURN json_build_object(
            'runtime', json_build_object('buckets', '[]'::json, 'percentile', 0, 'total_submissions', 0, 'mode', 'raw'),
            'memory', json_build_object('buckets', '[]'::json, 'percentile', 0, 'total_submissions', 0)
        );
    END IF;

    SELECT json_build_object(
        'runtime', json_build_object(
            'mode', CASE WHEN use_relative THEN 'relative' ELSE 'raw' END,
            'buckets', COALESCE((
                SELECT json_agg(row_to_json(t) ORDER BY t.range_start)
                FROM (
                    SELECT
                        CASE WHEN use_relative THEN
                            round(min_rel + (b - 1) * ((max_rel - min_rel + 0.001) / 20.0), 4)
                        ELSE
                            round(min_time + (b - 1) * ((max_time - min_time + 1) / 20.0), 1)
                        END AS range_start,
                        CASE WHEN use_relative THEN
                            round(min_rel + b * ((max_rel - min_rel + 0.001) / 20.0), 4)
                        ELSE
                            round(min_time + b * ((max_time - min_time + 1) / 20.0), 1)
                        END AS range_end,
                        count(*) as count
                    FROM submission_performance,
                         generate_series(1, 20) as b
                    WHERE algorithm_id = p_algorithm_id
                      AND language = p_language
                      AND status = 'passed'
                      AND CASE WHEN use_relative THEN
                              relative_score IS NOT NULL
                              AND width_bucket(
                                  relative_score,
                                  min_rel,
                                  CASE WHEN max_rel = min_rel THEN max_rel + 0.001 ELSE max_rel + 0.0001 END,
                                  20
                              ) = b
                          ELSE
                              execution_time_ms IS NOT NULL
                              AND width_bucket(
                                  execution_time_ms,
                                  min_time,
                                  CASE WHEN max_time = min_time THEN max_time + 1 ELSE max_time + 0.001 END,
                                  20
                              ) = b
                          END
                    GROUP BY b
                    ORDER BY b
                ) t
            ), '[]'::json),
            'percentile', CASE
                WHEN use_relative AND p_user_relative_score IS NOT NULL THEN
                    -- Lower relative_score is better (faster), so count those >= user's score
                    round(
                        100.0 * (
                            SELECT count(*) FROM submission_performance
                            WHERE algorithm_id = p_algorithm_id
                              AND language = p_language
                              AND status = 'passed'
                              AND relative_score IS NOT NULL
                              AND relative_score >= p_user_relative_score
                        )::numeric / GREATEST(total_rel_count, 1)
                    , 2)
                WHEN NOT use_relative AND p_user_time_ms IS NOT NULL THEN
                    round(
                        100.0 * (
                            SELECT count(*) FROM submission_performance
                            WHERE algorithm_id = p_algorithm_id
                              AND language = p_language
                              AND status = 'passed'
                              AND execution_time_ms >= p_user_time_ms
                        )::numeric / GREATEST(total_time_count, 1)
                    , 2)
                ELSE 0
            END,
            'total_submissions', CASE WHEN use_relative THEN total_rel_count ELSE total_time_count END,
            'user_value', CASE WHEN use_relative THEN p_user_relative_score ELSE p_user_time_ms END
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
                    )::numeric / GREATEST(total_mem_count, 1)
                , 2)
            ELSE 0 END,
            'total_submissions', total_mem_count,
            'user_value', p_user_memory_kb
        )
    ) INTO result;

    RETURN result;
END;
$$ LANGUAGE plpgsql STABLE;
