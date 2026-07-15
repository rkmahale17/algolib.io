import React, { useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAIReview } from '@/hooks/useAIReview';
import { Bot, CheckCircle, ChevronRight, Loader2, Sparkles, AlertTriangle, Lightbulb } from 'lucide-react';
import { AIReviewResult } from '@/types/ai';

interface AIReviewCardProps {
    algorithmId: string;
    submissionId: string;
    code: string;
    language: string;
    problemDescription: string;
    hasPremiumAccess: boolean;
}

export const AIReviewCard: React.FC<AIReviewCardProps> = ({
    algorithmId,
    submissionId,
    code,
    language,
    problemDescription,
    hasPremiumAccess
}) => {
    const { review, isLoading, error, loadReview, generateReview } = useAIReview(algorithmId, submissionId);

    useEffect(() => {
        if (hasPremiumAccess) {
            loadReview();
        }
    }, [hasPremiumAccess, loadReview]);

    if (!hasPremiumAccess) {
        return (
            <Card className="mt-6 p-6 border-amber-500/30 bg-amber-500/5 relative overflow-hidden">
                <div className="flex flex-col sm:flex-row items-center gap-4 relative z-10">
                    <div className="w-12 h-12 rounded-full bg-amber-500/20 flex items-center justify-center shrink-0">
                        <Bot className="w-6 h-6 text-amber-500" />
                    </div>
                    <div className="flex-1 text-center sm:text-left">
                        <h4 className="text-lg font-semibold text-foreground flex items-center justify-center sm:justify-start gap-2">
                            RULCO AI Review <Sparkles className="w-4 h-4 text-amber-500" />
                        </h4>
                        <p className="text-sm text-muted-foreground mt-1">
                            Get instant, personalized feedback on your code quality, time complexity, and how to improve.
                        </p>
                    </div>
                    <Button className="bg-amber-500 hover:bg-amber-600 text-white shrink-0">
                        Upgrade to Pro
                    </Button>
                </div>
            </Card>
        );
    }

    if (!review && !isLoading) {
        return (
            <Card className="mt-6 p-6 border-primary/30 bg-primary/5">
                <div className="flex flex-col sm:flex-row items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                        <Bot className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1 text-center sm:text-left">
                        <h4 className="text-lg font-semibold text-foreground">RULCO AI Review</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                            Analyze this submission for code quality and improvements.
                        </p>
                    </div>
                    <Button 
                        onClick={() => generateReview(code, language, problemDescription)}
                        className="shrink-0 gap-2"
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
                <p className="text-sm text-muted-foreground animate-pulse">RULCO is reviewing your code...</p>
            </Card>
        );
    }

    if (!review) return null;

    const scoreColor = review.score >= 80 ? 'text-green-500' : review.score >= 50 ? 'text-amber-500' : 'text-red-500';

    return (
        <Card className="mt-6 border-primary/20 overflow-hidden">
            <div className="p-4 border-b border-border/50 bg-muted/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                        <Bot className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                        <h4 className="font-semibold flex items-center gap-2">
                            RULCO AI Review
                            <Sparkles className="w-3.5 h-3.5 text-primary" />
                        </h4>
                        <p className="text-xs text-muted-foreground">{review.summary}</p>
                    </div>
                </div>
                <div className="flex flex-col items-end">
                    <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Quality Score</span>
                    <span className={`text-2xl font-bold ${scoreColor}`}>{review.score}/100</span>
                </div>
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
            
            <div className="p-5 bg-muted/10 border-t border-border/50">
                <h5 className="flex items-center gap-2 font-medium text-blue-500 mb-2">
                    <Lightbulb className="w-4 h-4" /> Complexity Analysis
                </h5>
                <p className="text-sm text-muted-foreground">{review.complexityAnalysis}</p>
            </div>
        </Card>
    );
};
