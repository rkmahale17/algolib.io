import React, { useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAIReview } from '@/hooks/useAIReview';
import { Bot, CheckCircle, ChevronRight, Loader2, Sparkles, AlertTriangle, Lightbulb } from 'lucide-react';
import { AIReviewResult } from '@/types/ai';

import { ProOverlay } from '@/components/ProOverlay';

interface AIReviewCardProps {
    algorithmId: string;
    submissionId: string;
    code: string;
    language: string;
    problemDescription: string;
    hasPremiumAccess: boolean;
    review?: AIReviewResult | null;
    isLoading?: boolean;
    error?: string | null;
    onGenerateReview?: () => void;
}

export const AIReviewCard: React.FC<AIReviewCardProps> = ({
    code,
    language,
    problemDescription,
    hasPremiumAccess,
    review = null,
    isLoading = false,
    error = null,
    onGenerateReview
}) => {

    if (!hasPremiumAccess) {
        return (
            <Card className="mt-6 border-primary/20 overflow-hidden relative">
                {/* Dummy Content - Blurred */}
                <div className="blur-sm opacity-50 pointer-events-none select-none">
                    <div className="p-4 border-b border-border/50 bg-muted/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                                <Sparkles className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <h4 className="font-semibold flex items-center gap-2">Rulo Review</h4>
                                <p className="text-xs text-muted-foreground">Detailed analysis of your solution.</p>
                            </div>
                        </div>
                        <div className="flex flex-col items-end">
                            <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Quality Score</span>
                            <span className="text-2xl font-bold text-green-500">95/100</span>
                        </div>
                    </div>
                    
                    <div className="p-5 bg-muted/10 border-b border-border/50">
                        <h5 className="flex items-center gap-2 font-medium text-blue-500 mb-2">
                            <Lightbulb className="w-4 h-4" /> Complexity Analysis
                        </h5>
                        <p className="text-sm text-muted-foreground">The time complexity is O(N) because we iterate through the array once. Space complexity is O(1) as we only use a few variables.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-border/50">
                        <div className="bg-card p-5">
                            <h5 className="flex items-center gap-2 font-medium text-green-500 mb-3">
                                <CheckCircle className="w-4 h-4" /> Strengths
                            </h5>
                            <ul className="space-y-2">
                                <li className="text-sm text-muted-foreground flex items-start gap-2">
                                    <ChevronRight className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                                    <span>Clean and readable code structure.</span>
                                </li>
                                <li className="text-sm text-muted-foreground flex items-start gap-2">
                                    <ChevronRight className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                                    <span>Optimal time complexity achieved.</span>
                                </li>
                            </ul>
                        </div>
                        <div className="bg-card p-5">
                            <h5 className="flex items-center gap-2 font-medium text-amber-500 mb-3">
                                <AlertTriangle className="w-4 h-4" /> Areas for Improvement
                            </h5>
                            <ul className="space-y-2">
                                <li className="text-sm text-muted-foreground flex items-start gap-2">
                                    <ChevronRight className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                                    <span>Consider adding edge case handling for empty inputs.</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Overlay */}
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-background/40">
                    <ProOverlay 
                        variant="transparent"
                        title={
                            <span className="flex items-center justify-center gap-2">
                                <Sparkles className="w-6 h-6 text-primary" /> 
                                Rulo Review
                            </span>
                        }
                        description="Purchase premium to unlock instant, personalized feedback on your code quality, time complexity, and how to improve."
                        buttonText="View subscription plan"
                        hideBadges={true}
                    />
                </div>
            </Card>
        );
    }

    if (!review && !isLoading) {
        return (
            <Card className="mt-6 p-6 border-primary/30 bg-primary/5">
                <div className="flex flex-col sm:flex-row items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                        <Sparkles className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1 text-center sm:text-left">
                        <h4 className="text-lg font-semibold text-foreground">Rulo Review</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                            Analyze this submission for code quality and improvements.
                        </p>
                    </div>
                    <Button 
                        onClick={onGenerateReview}
                        className="shrink-0 gap-2"
                        disabled={isLoading}
                    >
                        <Sparkles className="w-4 h-4" />
                        Generate Review
                    </Button>
                </div>
                {error && (
                    <p className="text-red-500 text-sm mt-4 text-center">Error: {error}</p>
                )}
            </Card>
        );
    }

    if (isLoading) {
        return (
            <Card className="mt-6 p-6 border-border/50 flex flex-col items-center justify-center min-h-[200px] gap-4">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
                <p className="text-sm text-muted-foreground animate-pulse">Rulo is reviewing your code...</p>
            </Card>
        );
    }

    if (!review) return null;

    const scoreColor = review.score >= 80 ? 'text-green-500' : review.score >= 50 ? 'text-amber-500' : 'text-red-500';

    return (
        <Card className="mt-6 border-primary/20 overflow-hidden">
            <div className="p-4 border-b border-border/50 bg-muted/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                        <Sparkles className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                        <h4 className="font-semibold flex items-center gap-2">
                            Rulo Review
                        </h4>
                        <p className="text-xs text-muted-foreground">{review.summary}</p>
                    </div>
                </div>
                <div className="flex flex-col items-end">
                    <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Quality Score</span>
                    <span className={`text-2xl font-bold ${scoreColor}`}>{review.score}/100</span>
                </div>
            </div>

            <div className="p-5 bg-muted/10 border-b border-border/50">
                <h5 className="flex items-center gap-2 font-medium text-blue-500 mb-2">
                    <Lightbulb className="w-4 h-4" /> Complexity Analysis
                </h5>
                <p className="text-sm text-muted-foreground">{review.complexityAnalysis}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-border/50">
                <div className="bg-card p-5">
                    <h5 className="flex items-center gap-2 font-medium text-green-500 mb-3">
                        <CheckCircle className="w-4 h-4" /> Strengths
                    </h5>
                    <ul className="space-y-2">
                        {review.strengths.map((str, i) => (
                            <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                                <ChevronRight className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                                <span>{str}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="bg-card p-5">
                    <h5 className="flex items-center gap-2 font-medium text-amber-500 mb-3">
                        <AlertTriangle className="w-4 h-4" /> Areas for Improvement
                    </h5>
                    <ul className="space-y-2">
                        {review.improvements.map((imp, i) => (
                            <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                                <ChevronRight className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                                <span>{imp}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </Card>
    );
};
