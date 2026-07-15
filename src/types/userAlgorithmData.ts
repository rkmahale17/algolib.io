// TypeScript types for user_algorithm_data table

export interface UserAlgorithmData {
    id: string;
    user_id: string;
    algorithm_id: string;
    completed: boolean;
    completed_at: string | null;
    code: CodeStorage;
    submissions: Submission[];
    notes: string | null;
    whiteboard_data: WhiteboardData | null;
    is_favorite: boolean;
    user_vote: 'like' | 'dislike' | null;
    share_count: number;
    created_at: string;
    updated_at: string;
    last_viewed_at: string | null;
    time_spent_seconds: number;
    visualization_completed: boolean;
    drawing_completed: boolean;
    solution_completed: boolean;
    pattern_assessment_completed?: boolean;
    pattern_assessment_history?: any[];
}

// Code storage structure (multi-language support)
export interface CodeStorage {
    python?: string;
    typescript?: string;
    javascript?: string;
    cpp?: string;
    java?: string;
    default?: string; // For legacy single-language code
    [key: string]: string | undefined; // Allow any language key
}

// Submission structure
export interface Submission {
    id: string;
    timestamp: string;
    language: string;
    code: string;
    status: 'passed' | 'failed' | 'error';
    test_results?: {
        passed: number;
        failed: number;
        total: number;
        execution_time_ms?: number;
        memory_usage_kb?: number;
        errors?: string[];
    };
}

// Distribution bucket for performance charts
export interface DistributionBucket {
    range_start: number;
    range_end: number;
    count: number;
}

// Distribution data returned from RPC
export interface DistributionData {
    buckets: DistributionBucket[];
    percentile: number;
    total_submissions: number;
    user_value: number | null;
    /** 'relative' = normalized against reference solution; 'raw' = raw ms (legacy data) */
    mode?: 'relative' | 'raw';
}

// Full submission distribution response
export interface SubmissionDistribution {
    runtime: DistributionData;
    memory: DistributionData;
}

// Whiteboard data structure (flexible JSON)
export interface WhiteboardData {
    board_json?: any; // Tldraw format
    elements?: any[]; // Excalidraw format
    appState?: any;
    [key: string]: any; // Allow any structure
}

// Partial update types for specific operations
export interface UpdateProgressData {
    completed: boolean;
    completed_at?: string | null;
}

export interface UpdateVisualizationProgressData {
    visualization_completed: boolean;
}

export interface UpdateDrawingProgressData {
    drawing_completed: boolean;
}

export interface UpdateSolutionProgressData {
    solution_completed: boolean;
}

export interface UpdateCodeData {
    language: string;
    code: string;
}

export interface UpdateNotesData {
    notes: string;
}

export interface UpdateWhiteboardData {
    whiteboard_data: WhiteboardData;
}

export interface UpdateSocialData {
    is_favorite?: boolean;
    user_vote?: 'like' | 'dislike' | null;
    share_count?: number;
}

export interface UpdateTimeData {
    last_viewed_at?: string;
    time_spent_seconds?: number;
}

// Insert data type (for creating new records)
export interface InsertUserAlgorithmData {
    user_id: string;
    algorithm_id: string;
    completed?: boolean;
    completed_at?: string | null;
    code?: CodeStorage;
    submissions?: Submission[];
    notes?: string | null;
    whiteboard_data?: WhiteboardData | null;
    is_favorite?: boolean;
    user_vote?: 'like' | 'dislike' | null;
    share_count?: number;
    last_viewed_at?: string | null;
    time_spent_seconds?: number;
    visualization_completed?: boolean;
    drawing_completed?: boolean;
    solution_completed?: boolean;
    pattern_assessment_completed?: boolean;
    pattern_assessment_history?: any[];
}

// Distribution bucket for runtime/memory histogram charts
export interface DistributionBucket {
    range_start: number;
    range_end: number;
    count: number;
}
