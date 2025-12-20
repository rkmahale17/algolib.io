// Custom React hook for user_algorithm_data

import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { UserAlgorithmData } from '@/types/userAlgorithmData';
import { getUserAlgorithmData } from '@/utils/userAlgorithmDataHelpers';

interface UseUserAlgorithmDataOptions {
    userId: string | undefined;
    algorithmId: string;
    enabled?: boolean;
}

export function useUserAlgorithmData({
    userId,
    algorithmId,
    enabled = true,
}: UseUserAlgorithmDataOptions) {
    const [data, setData] = useState<UserAlgorithmData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    // Reset data when algorithmId changes to show loading state specifically for new algo
    useEffect(() => {
        setData(null);
    }, [algorithmId]);

    // Fetch data
    useEffect(() => {
        if (!enabled || !userId) {
            setLoading(false);
            return;
        }

        let isMounted = true;

        const fetchData = async () => {
            try {
                // Reset data to null immediately when re-fetching to avoid stale state
                // setData(null); 
                setLoading(true);
                // console.log(`[useUserAlgorithmData] Fetching data for algo: ${algorithmId} user: ${userId}`);
                const result = await getUserAlgorithmData(userId, algorithmId);

                if (isMounted) {
                    setData(result);
                    setError(null);
                }
            } catch (err) {
                if (isMounted) {
                    setError(err as Error);
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        fetchData();

        return () => {
            isMounted = false;
        };
    }, [userId, algorithmId, enabled]);

    // Set up real-time subscription
    useEffect(() => {
        if (!enabled || !userId || !supabase) {
            return;
        }

        const channel = supabase
            .channel(`user_algorithm_data_${userId}_${algorithmId}`)
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'user_algorithm_data',
                    filter: `user_id=eq.${userId},algorithm_id=eq.${algorithmId}`,
                },
                (payload) => {
                    if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
                        setData(payload.new as UserAlgorithmData);
                    } else if (payload.eventType === 'DELETE') {
                        setData(null);
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [userId, algorithmId, enabled]);

    // Refetch function
    const refetch = useCallback(async () => {
        if (!userId) return;

        try {
            // Don't set loading to true for background refetches to avoid UI flicker
            const result = await getUserAlgorithmData(userId, algorithmId);
            setData(result);
            setError(null);
        } catch (err) {
            setError(err as Error);
        }
    }, [userId, algorithmId]);

    return {
        data,
        loading,
        error,
        refetch,
    };
}
