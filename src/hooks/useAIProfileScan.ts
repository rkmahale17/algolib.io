import { useState, useCallback } from 'react';
import { AIProfileScanResult } from '@/types/ai';
import { supabase } from '@/integrations/supabase/client';

export function useAIProfileScan(userId: string) {
    const [scan, setScan] = useState<AIProfileScanResult | null>(null);
    const [lastScanDate, setLastScanDate] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const loadScan = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const { data, error: dbError } = await supabase
                .from('ai_profile_scans')
                .select('scan_content, created_at')
                .eq('user_id', userId)
                .order('created_at', { ascending: false })
                .limit(1)
                .maybeSingle();

            if (data && data.scan_content) {
                setScan(data.scan_content as unknown as AIProfileScanResult);
                setLastScanDate(data.created_at);
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }, [userId]);

    const generateScan = useCallback(async (stats: any) => {
        setIsLoading(true);
        setError(null);
        try {
            const res = await fetch('/api/ai/profile-scan', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ stats })
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Failed to generate scan');
            }

            const data = await res.json();
            setScan(data);
            setLastScanDate(new Date().toISOString());
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }, []);

    return {
        scan,
        lastScanDate,
        isLoading,
        error,
        loadScan,
        generateScan
    };
}
