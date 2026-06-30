import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { SubmissionDistribution } from '@/types/userAlgorithmData';

interface UseSubmissionStatsOptions {
    algorithmId: string;
    language: string;
    userTimeMs?: number | null;
    userMemoryKb?: number | null;
    enabled?: boolean;
}

export function useSubmissionStats({
    algorithmId,
    language,
    userTimeMs,
    userMemoryKb,
    enabled = true,
}: UseSubmissionStatsOptions) {
    return useQuery<SubmissionDistribution | null>({
        queryKey: ['submission-stats', algorithmId, language, userTimeMs, userMemoryKb],
        queryFn: async () => {
            // Fetch the user's most recent relative_score for this problem+language.
            // This is set asynchronously after submission (fire-and-forget), so it may
            // not be available immediately on first load — that's acceptable.
            const { data: { user } } = await supabase.auth.getUser();
            let userRelativeScore: number | null = null;

            if (user) {
                const { data: perfRow } = await supabase
                    .from('submission_performance')
                    .select('relative_score')
                    .eq('algorithm_id', algorithmId)
                    .eq('language', language)
                    .eq('user_id', user.id)
                    .eq('status', 'passed')
                    .not('relative_score', 'is', null)
                    .order('created_at', { ascending: false })
                    .limit(1)
                    .maybeSingle();

                userRelativeScore = perfRow?.relative_score ?? null;
            }

            const { data, error } = await supabase.rpc('get_submission_distribution', {
                p_algorithm_id: algorithmId,
                p_language: language,
                p_user_time_ms: userTimeMs ?? null,
                p_user_memory_kb: userMemoryKb ?? null,
                p_user_relative_score: userRelativeScore,
            });

            if (error) {
                console.error('Failed to fetch submission distribution:', error);
                return null;
            }

            // The RPC returns a JSON object directly
            return (typeof data === 'string' ? JSON.parse(data) : data) as SubmissionDistribution;
        },
        enabled: enabled && !!algorithmId && !!language,
        staleTime: 5 * 60 * 1000, // Cache for 5 minutes
        refetchOnWindowFocus: false,
    });
}
