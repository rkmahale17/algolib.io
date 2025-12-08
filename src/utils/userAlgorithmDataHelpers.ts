// Helper functions for user_algorithm_data table operations

import { supabase } from '@/integrations/supabase/client';
import type {
    UserAlgorithmData,
    InsertUserAlgorithmData,
    UpdateProgressData,
    UpdateCodeData,
    UpdateNotesData,
    UpdateWhiteboardData,
    UpdateSocialData,
    UpdateTimeData,
    Submission,
    CodeStorage,
} from '@/types/userAlgorithmData';

/**
 * Fetch user algorithm data for a specific algorithm
 */
export async function getUserAlgorithmData(
    userId: string,
    algorithmId: string
): Promise<UserAlgorithmData | null> {
    if (!supabase) {
        console.warn('Supabase not available');
        return null;
    }

    const { data, error } = await supabase
        .from('user_algorithm_data')
        .select('*')
        .eq('user_id', userId)
        .eq('algorithm_id', algorithmId)
        .single();

    if (error) {
        if (error.code === 'PGRST116') {
            // No rows returned - this is expected for new algorithms
            return null;
        }
        console.error('Error fetching user algorithm data:', error);
        return null;
    }

    return data as unknown as UserAlgorithmData;
}

/**
 * Upsert (insert or update) user algorithm data
 */
export async function upsertUserAlgorithmData(
    insertData: InsertUserAlgorithmData
): Promise<UserAlgorithmData | null> {
    if (!supabase) {
        console.warn('Supabase not available');
        return null;
    }

    const { data: result, error } = await supabase
        .from('user_algorithm_data')
        .upsert(insertData as any, {
            onConflict: 'user_id,algorithm_id',
        })
        .select()
        .single();

    if (error) {
        console.error('Error upserting user algorithm data:', error);
        return null;
    }

    return result as unknown as UserAlgorithmData;
}

/**
 * Update progress (completion status)
 */
export async function updateProgress(
    userId: string,
    algorithmId: string,
    progressData: UpdateProgressData
): Promise<boolean> {
    if (!supabase) {
        console.warn('Supabase not available');
        return false;
    }

    const { error } = await supabase
        .from('user_algorithm_data')
        .upsert(
            {
                user_id: userId,
                algorithm_id: algorithmId,
                ...progressData,
            } as any,
            {
                onConflict: 'user_id,algorithm_id',
            }
        );

    if (error) {
        console.error('Error updating progress:', error);
        return false;
    }

    return true;
}

/**
 * Update code for a specific language
 */
export async function updateCode(
    userId: string,
    algorithmId: string,
    codeData: UpdateCodeData
): Promise<boolean> {
    if (!supabase) {
        console.warn('Supabase not available');
        return false;
    }

    // First, get existing data
    const existing = await getUserAlgorithmData(userId, algorithmId);

    const currentCode: CodeStorage = existing?.code || {};
    const updatedCode: CodeStorage = {
        ...currentCode,
        [codeData.language]: codeData.code,
    };

    const { error } = await supabase
        .from('user_algorithm_data')
        .upsert(
            {
                user_id: userId,
                algorithm_id: algorithmId,
                code: updatedCode,
            } as any,
            {
                onConflict: 'user_id,algorithm_id',
            }
        );

    if (error) {
        console.error('Error updating code:', error);
        return false;
    }

    return true;
}

/**
 * Add a new submission to the submissions array
 */
export async function addSubmission(
    userId: string,
    algorithmId: string,
    submission: Submission
): Promise<boolean> {
    if (!supabase) {
        console.warn('Supabase not available');
        return false;
    }

    // First, get existing data
    const existing = await getUserAlgorithmData(userId, algorithmId);

    const currentSubmissions: Submission[] = existing?.submissions || [];
    const updatedSubmissions = [...currentSubmissions, submission];

    const { error } = await supabase
        .from('user_algorithm_data')
        .upsert(
            {
                user_id: userId,
                algorithm_id: algorithmId,
                submissions: updatedSubmissions,
            } as any,
            {
                onConflict: 'user_id,algorithm_id',
            }
        );

    if (error) {
        console.error('Error adding submission:', error);
        return false;
    }

    return true;
}

/**
 * Update notes
 */
export async function updateNotes(
    userId: string,
    algorithmId: string,
    notesData: UpdateNotesData
): Promise<boolean> {
    if (!supabase) {
        console.warn('Supabase not available');
        return false;
    }

    const { error } = await supabase
        .from('user_algorithm_data')
        .upsert(
            {
                user_id: userId,
                algorithm_id: algorithmId,
                ...notesData,
            } as any,
            {
                onConflict: 'user_id,algorithm_id',
            }
        );

    if (error) {
        console.error('Error updating notes:', error);
        return false;
    }

    return true;
}

/**
 * Update whiteboard data
 */
export async function updateWhiteboard(
    userId: string,
    algorithmId: string,
    whiteboardData: UpdateWhiteboardData
): Promise<boolean> {
    if (!supabase) {
        console.warn('Supabase not available');
        return false;
    }

    const { error } = await supabase
        .from('user_algorithm_data')
        .upsert(
            {
                user_id: userId,
                algorithm_id: algorithmId,
                ...whiteboardData,
            } as any,
            {
                onConflict: 'user_id,algorithm_id',
            }
        );

    if (error) {
        console.error('Error updating whiteboard:', error);
        return false;
    }

    return true;
}

/**
 * Update social data (favorites, likes, shares)
 */
export async function updateSocial(
    userId: string,
    algorithmId: string,
    socialData: UpdateSocialData
): Promise<boolean> {
    if (!supabase) {
        console.warn('Supabase not available');
        return false;
    }

    const { error } = await supabase
        .from('user_algorithm_data')
        .upsert(
            {
                user_id: userId,
                algorithm_id: algorithmId,
                ...socialData,
            } as any,
            {
                onConflict: 'user_id,algorithm_id',
            }
        );

    if (error) {
        console.error('Error updating social data:', error);
        return false;
    }

    return true;
}

/**
 * Update time tracking data
 */
export async function updateTimeTracking(
    userId: string,
    algorithmId: string,
    timeData: UpdateTimeData
): Promise<boolean> {
    if (!supabase) {
        console.warn('Supabase not available');
        return false;
    }

    const { error } = await supabase
        .from('user_algorithm_data')
        .upsert(
            {
                user_id: userId,
                algorithm_id: algorithmId,
                ...timeData,
            } as any,
            {
                onConflict: 'user_id,algorithm_id',
            }
        );

    if (error) {
        console.error('Error updating time tracking:', error);
        return false;
    }

    return true;
}

/**
 * Get all user algorithm data for a user (for progress tracking)
 */
export async function getAllUserAlgorithmData(
    userId: string
): Promise<UserAlgorithmData[]> {
    if (!supabase) {
        console.warn('Supabase not available');
        return [];
    }

    const { data, error } = await supabase
        .from('user_algorithm_data')
        .select('*')
        .eq('user_id', userId);

    if (error) {
        console.error('Error fetching all user algorithm data:', error);
        return [];
    }

    return (data as unknown as UserAlgorithmData[]) || [];
}

/**
 * Get completed algorithms count
 */
export async function getCompletedCount(userId: string): Promise<number> {
    if (!supabase) {
        console.warn('Supabase not available');
        return 0;
    }

    const { count, error } = await supabase
        .from('user_algorithm_data')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('completed', true);

    if (error) {
        console.error('Error fetching completed count:', error);
        return 0;
    }

    return count || 0;
}
