import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface GlobalRankData {
  rank: number;
  total_users: number;
  percentile: number;
}

export const useGlobalRank = (userId?: string) => {
  const [data, setData] = useState<GlobalRankData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRank = useCallback(async () => {
    if (!userId) {
      setIsLoading(false);
      return;
    }

    try {
      // Call the RPC defined in the latest migration
      const { data, error } = await supabase.rpc('get_user_global_rank', {
        p_user_id: userId,
      });

      if (error) {
        console.error('Error fetching global rank:', error);
        setError(error.message);
        return;
      }

      if (data && data.length > 0) {
        setData({
          rank: Number(data[0].rank),
          total_users: Number(data[0].total_users),
          percentile: Number(data[0].percentile),
        });
      }
    } catch (err: any) {
      console.error('Unexpected error in useGlobalRank:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    setIsLoading(true);
    fetchRank();
  }, [fetchRank]);

  return { data, isLoading, error, refreshRank: fetchRank };
};
