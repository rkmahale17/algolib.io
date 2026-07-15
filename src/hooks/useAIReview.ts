import { useState, useCallback } from 'react';
import { AIReviewResult } from '@/types/ai';
import { supabase } from '@/integrations/supabase/client';

export function useAIReview(algorithmId: string, submissionId: string) {
    const [review, setReview] = useState<AIReviewResult | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const loadReview = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data, error: dbError } = await supabase
                .from('ai_reviews')
                .select('review_content')
                .eq('user_id', user.id)
                .eq('algorithm_id', algorithmId)
                .eq('submission_id', submissionId)
                .maybeSingle();

            if (data && data.review_content) {
                setReview(data.review_content as unknown as AIReviewResult);
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }, [algorithmId, submissionId]);

    const generateReview = useCallback(async (
        code: string,
        language: string,
        problemDescription: string
    ) => {
        setIsLoading(true);
        setError(null);
        try {
            const res = await fetch('/api/ai/review', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    problemId: algorithmId,
                    problemDescription,
                    userCode: code,
                    language,
                    submissionId
                })
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Failed to generate review');
            }

            const data = await res.json();
            setReview(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }, [algorithmId, submissionId]);

    return {
        review,
        isLoading,
        error,
        loadReview,
        generateReview
    };
}
