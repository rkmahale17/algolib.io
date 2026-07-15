export interface AIChatMessage {
    id: string;
    role: 'user' | 'model';
    content: string;
    timestamp: string;
    feedback?: 'like' | 'dislike';
}

export interface AIReviewResult {
    score: number;
    strengths: string[];
    improvements: string[];
    complexityAnalysis: string;
    summary: string;
}

export interface AIProfileScanResult {
    overallScore: number;
    strengths: string[];
    weaknesses: string[];
    recommendations: string[];
    summary: string;
    skillDistribution: {
        topic: string;
        proficiency: number; // 0-100
    }[];
}
