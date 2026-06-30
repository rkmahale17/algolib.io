// Custom React hook for user_algorithm_data

import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { UserAlgorithmData } from '@/types/userAlgorithmData';
import { getUserAlgorithmData } from '@/utils/userAlgorithmDataHelpers';
import { useAppDispatch } from '@/store/hooks';
import { updateProgressItem, removeProgressItem } from '@/store/slices/userProgressSlice';

interface UseUserAlgorithmDataOptions {
    userId: string | undefined;
    algorithmId: string;
    numericAlgorithmId?: string;
    enabled?: boolean;
}

export function useUserAlgorithmData({
    userId,
    algorithmId,
    numericAlgorithmId,
    enabled = true,
}: UseUserAlgorithmDataOptions) {
    const [data, setData] = useState<UserAlgorithmData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const dispatch = useAppDispatch();

    // Fetch data
    useEffect(() => {
        if (!enabled || !userId) {
            setLoading(false);
            return;
        }

        let isMounted = true;

        const fetchData = async () => {
            try {
                setLoading(true);
                const result = await getUserAlgorithmData(userId, algorithmId, numericAlgorithmId);

                if (isMounted) {
                    setData(result);
                    setError(null);
                    // Sync into global Redux store
                    if (result) {
                        dispatch(updateProgressItem(result));
                    }
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
    }, [userId, algorithmId, numericAlgorithmId, enabled, dispatch]);

    // Set up real-time subscription
    useEffect(() => {
        if (!enabled || !userId || !supabase) {
            return;
        }

        const channelName = `user_algorithm_data_${userId}_${algorithmId}`;

        // If a channel with this name already exists, another component instance owns it.
        // Skip creating a duplicate — the existing subscription will handle realtime updates,
        // and this instance already fetched its initial data via the effect above.
        const alreadySubscribed = supabase.getChannels().some(ch => ch.topic === `realtime:${channelName}`);
        if (alreadySubscribed) {
            return;
        }

        const channel = supabase
            .channel(channelName)
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
                        const newData = payload.new as UserAlgorithmData;
                        
                        setData(prevData => {
                            if (!prevData) return newData;
                            
                            // Prevent split-brain wipe: if realtime pushes empty submissions 
                            // but we already merged old submissions, preserve them.
                            if ((!newData.submissions || newData.submissions.length === 0) && prevData.submissions?.length > 0) {
                                newData.submissions = prevData.submissions;
                            }
                            
                            // Also dispatch to Redux with the merged data
                            dispatch(updateProgressItem(newData));
                            
                            return newData;
                        });
                    } else if (payload.eventType === 'DELETE') {
                        setData(null);
                        dispatch(removeProgressItem(algorithmId));
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [userId, algorithmId, enabled, dispatch]);

    // Refetch function
    const refetch = useCallback(async () => {
        if (!userId) return;

        try {
            const result = await getUserAlgorithmData(userId, algorithmId, numericAlgorithmId);
            setData(result);
            setError(null);
            // Sync into global Redux store on manual refetch too
            if (result) {
                dispatch(updateProgressItem(result));
            }
        } catch (err) {
            setError(err as Error);
        }
    }, [userId, algorithmId, numericAlgorithmId, dispatch]);

    return {
        data,
        loading,
        error,
        refetch,
    };
}


