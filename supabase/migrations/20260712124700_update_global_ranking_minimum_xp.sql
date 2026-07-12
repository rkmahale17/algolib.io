CREATE OR REPLACE FUNCTION get_user_global_rank(p_user_id UUID)
RETURNS TABLE (
  rank BIGINT,
  total_users BIGINT,
  percentile NUMERIC
) LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_user_xp BIGINT;
  v_total_users BIGINT;
  v_rank BIGINT;
BEGIN
  -- Get total users with XP >= 500
  SELECT count(*) INTO v_total_users FROM user_xp_summary WHERE total_xp >= 500;
  
  -- Get user's XP
  SELECT total_xp INTO v_user_xp FROM user_xp_summary WHERE user_id = p_user_id;
  
  -- If user has < 500 XP, they are unranked. 
  -- We return the total valid ranked users + 1 as their hypothetical rank and 100th percentile.
  IF v_user_xp IS NULL OR v_user_xp < 500 THEN
    RETURN QUERY SELECT v_total_users + 1, v_total_users, 100.0::NUMERIC;
    RETURN;
  END IF;
  
  -- Calculate rank (number of users with strictly more XP + 1)
  SELECT count(*) + 1 INTO v_rank FROM user_xp_summary WHERE total_xp > v_user_xp;
  
  RETURN QUERY SELECT 
    v_rank, 
    v_total_users, 
    ROUND((v_rank::NUMERIC / NULLIF(v_total_users, 0)) * 100, 1);
END;
$$;
