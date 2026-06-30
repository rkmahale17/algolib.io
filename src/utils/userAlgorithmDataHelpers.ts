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
    algorithmId: string,
    numericAlgorithmId?: string
): Promise<UserAlgorithmData | null> {
    if (!supabase) {
        console.warn('Supabase not available');
        return null;
    }

    const idsToFetch = numericAlgorithmId && numericAlgorithmId !== algorithmId 
        ? [algorithmId, numericAlgorithmId] 
        : [algorithmId];

    const { data, error } = await supabase
        .from('user_algorithm_data')
        .select('id, user_id, algorithm_id, completed, code, submissions, notes, whiteboard_data, updated_at, visualization_completed, drawing_completed, solution_completed')
        .eq('user_id', userId)
        .in('algorithm_id', idsToFetch);

    if (error) {
        if (error.code === 'PGRST116') {
            return null;
        }
        console.error('Error fetching user algorithm data:', error);
        return null;
    }

    if (!data || data.length === 0) {
        return null;
    }

    // If only one row found, return it
    if (data.length === 1) {
        return data[0] as unknown as UserAlgorithmData;
    }

    // If multiple rows found (split-brain between slug and numeric ID), merge them
    // Primary row is the one matching the slug (algorithmId), or fallback to the first
    const primaryRow = data.find(row => row.algorithm_id === algorithmId) || data[0];
    const secondaryRow = data.find(row => row.algorithm_id !== primaryRow.algorithm_id);

    if (secondaryRow) {
        // Merge submissions from both rows, avoiding duplicates by ID
        const allSubmissionsMap = new Map();
        
        // Add secondary row submissions
        const secondarySubs = secondaryRow.submissions || [];
        (Array.isArray(secondarySubs) ? secondarySubs : []).forEach((sub: any) => {
            if (sub?.id) allSubmissionsMap.set(sub.id, sub);
        });

        // Add primary row submissions (overwrites secondary if same ID)
        const primarySubs = primaryRow.submissions || [];
        (Array.isArray(primarySubs) ? primarySubs : []).forEach((sub: any) => {
            if (sub?.id) allSubmissionsMap.set(sub.id, sub);
        });

        // Sort descending by timestamp
        const mergedSubmissions = Array.from(allSubmissionsMap.values()).sort((a, b) => 
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );

        primaryRow.submissions = mergedSubmissions;
    }

    return primaryRow as unknown as UserAlgorithmData;
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
        .maybeSingle();

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
    codeData: UpdateCodeData,
    existingCode?: CodeStorage
): Promise<boolean> {
    if (!supabase) {
        console.warn('Supabase not available');
        return false;
    }

    // Use provided code or fetch existing data
    let currentCode: CodeStorage = {};
    if (existingCode) {
        currentCode = existingCode;
    } else {
        const existing = await getUserAlgorithmData(userId, algorithmId);
        currentCode = existing?.code || {};
    }

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
 * Update visualization progress status
 */
export async function updateVisualizationProgress(
    userId: string,
    algorithmId: string,
    completed: boolean
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
                visualization_completed: completed,
            } as any,
            {
                onConflict: 'user_id,algorithm_id',
            }
        );

    if (error) {
        console.error('Error updating visualization progress:', error);
        return false;
    }

    return true;
}

/**
 * Update drawing progress status
 */
export async function updateDrawingProgress(
    userId: string,
    algorithmId: string,
    completed: boolean
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
                drawing_completed: completed,
            } as any,
            {
                onConflict: 'user_id,algorithm_id',
            }
        );

    if (error) {
        console.error('Error updating drawing progress:', error);
        return false;
    }

    return true;
}

/**
 * Update solution progress status
 */
export async function updateSolutionProgress(
    userId: string,
    algorithmId: string,
    completed: boolean
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
                solution_completed: completed,
            } as any,
            {
                onConflict: 'user_id,algorithm_id',
            }
        );

    if (error) {
        console.error('Error updating solution progress:', error);
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
        .select('id, algorithm_id, completed, submissions, visualization_completed, drawing_completed, solution_completed, updated_at, last_viewed_at')
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
