'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Submission } from '@/types/userAlgorithmData';
import { useSubmissionStats } from '@/hooks/useSubmissionStats';
import { StatusHeader } from './StatusHeader';
import { DistributionChart } from './DistributionChart';
import { ComplexityComparison } from './ComplexityComparison';
import { FailureDetails } from './FailureDetails';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Loader2, Code2, Timer, Cpu, Check, Copy, X } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { useAIReview } from '@/hooks/useAIReview';
import { AIReviewCard } from '../ai/AIReviewCard';

interface SubmissionDetailViewProps {
    submission: Submission;
    algorithmId: string;
    onBack: () => void;
    optimalTimeComplexity?: string;
    optimalSpaceComplexity?: string;
}

export function SubmissionDetailView({
    submission,
    algorithmId,
    onBack,
    optimalTimeComplexity,
    optimalSpaceComplexity,
}: SubmissionDetailViewProps) {
    const isPassed = submission.status === 'passed';
    const [isCopied, setIsCopied] = useState(false);
    const reviewContainerRef = useRef<HTMLDivElement>(null);

    const handleCopy = () => {
        navigator.clipboard.writeText(submission.code);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    const { hasPremiumAccess } = useApp();

    const { data: stats, isLoading: statsLoading } = useSubmissionStats({
        algorithmId,
        language: submission.language,
        userTimeMs: submission.test_results?.execution_time_ms,
        userMemoryKb: submission.test_results?.memory_usage_kb,
        enabled: isPassed,
    });

    const aiReview = useAIReview(algorithmId, submission.id);
    const [showReviewCard, setShowReviewCard] = useState(false);

    useEffect(() => {
        if (hasPremiumAccess) {
            aiReview.loadReview();
        }
    }, [hasPremiumAccess, aiReview.loadReview]);

    useEffect(() => {
        if ((aiReview.isLoading || showReviewCard) && reviewContainerRef.current) {
            setTimeout(() => {
                reviewContainerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 100); // small delay to allow DOM to render the loading card
        }
    }, [aiReview.isLoading, showReviewCard]);

    const reviewCard = (
        <AIReviewCard
            algorithmId={algorithmId}
            submissionId={submission.id}
            code={submission.code}
            language={submission.language}
            problemDescription={`Problem ID: ${algorithmId}`}
            hasPremiumAccess={hasPremiumAccess}
            review={aiReview.review}
            isLoading={aiReview.isLoading}
            error={aiReview.error}
            onGenerateReview={() => aiReview.generateReview(submission.code, submission.language, `Problem ID: ${algorithmId}`)}
        />
    );

    return (
        <ScrollArea className="h-full">
            <div className="p-4 space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                <StatusHeader 
                    submission={submission} 
                    algorithmId={algorithmId}
                    hasPremiumAccess={hasPremiumAccess}
                    onBack={onBack} 
                    hideAnalyseButton={!!aiReview.review || aiReview.isLoading || showReviewCard}
                    onAnalyseClick={() => {
                        if (hasPremiumAccess) {
                            aiReview.generateReview(submission.code, submission.language, `Problem ID: ${algorithmId}`);
                        } else {
                            setShowReviewCard(true);
                        }
                    }}
                    isGeneratingReview={aiReview.isLoading}
                />

                {/* Performance Charts (only for passed) */}
                {isPassed && (
                    <div className="space-y-3">
                        {statsLoading ? (
                            <div className="flex items-center justify-center h-48 rounded-xl border border-border/60 bg-card/80">
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span className="text-sm">Loading performance data...</span>
                                </div>
                            </div>
                        ) : stats ? (
                            <>
                                {/* Tabs for Runtime / Memory Distribution */}
                                <Tabs defaultValue="runtime" className="w-full rounded-xl border border-border/60 bg-card/80 backdrop-blur-sm overflow-hidden shadow-sm">
                                    <TabsList className="w-full h-auto flex flex-row bg-muted/20 p-0 rounded-none border-b border-border/40">
                                        <TabsTrigger 
                                            value="runtime" 
                                            className="group relative flex-1 flex flex-col items-start gap-1 p-4 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-background transition-all hover:bg-muted/30 outline-none focus:outline-none"
                                        >
                                            <div className="flex items-center gap-2 text-muted-foreground group-data-[state=active]:text-foreground w-full mb-1 transition-colors">
                                                <Timer className="w-4 h-4" />
                                                <span className="font-medium text-sm">Runtime</span>
                                            </div>
                                            <div className="flex items-baseline gap-2">
                                                <span className="text-xl font-bold text-muted-foreground group-data-[state=active]:text-foreground transition-colors">
                                                    {stats.runtime.mode === 'relative'
                                                        ? (stats.runtime.user_value != null ? `${stats.runtime.user_value.toFixed(2)}x` : '--')
                                                        : (stats.runtime.user_value ?? '--')}
                                                </span>
                                                <span className="text-xs text-muted-foreground">
                                                    {stats.runtime.mode === 'relative' ? 'vs ref' : 'ms'}
                                                </span>
                                                <span className="text-muted-foreground/40 text-xs px-1">│</span>
                                                <span className="text-sm font-semibold text-muted-foreground group-data-[state=active]:text-green-500 transition-colors">
                                                    Beats {stats.runtime.percentile.toFixed(2)}%
                                                </span>
                                                {stats.runtime.percentile >= 80 && <span className="text-sm">🔥</span>}
                                            </div>
                                        </TabsTrigger>

                                        <div className="w-[1px] bg-border/40 shrink-0" />

                                        <TabsTrigger 
                                            value="memory" 
                                            className="group relative flex-1 flex flex-col items-start gap-1 p-4 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-background transition-all hover:bg-muted/30 outline-none focus:outline-none"
                                        >
                                            <div className="flex items-center gap-2 text-muted-foreground group-data-[state=active]:text-foreground w-full mb-1 transition-colors">
                                                <Cpu className="w-4 h-4" />
                                                <span className="font-medium text-sm">Memory</span>
                                            </div>
                                            <div className="flex items-baseline gap-2">
                                                <span className="text-xl font-bold text-muted-foreground group-data-[state=active]:text-foreground transition-colors">
                                                    {stats.memory.user_value ? (stats.memory.user_value / 1024).toFixed(1) : '--'}
                                                </span>
                                                <span className="text-xs text-muted-foreground">MB</span>
                                                <span className="text-muted-foreground/40 text-xs px-1">│</span>
                                                <span className="text-sm font-semibold text-muted-foreground group-data-[state=active]:text-green-500 transition-colors">
                                                    Beats {stats.memory.percentile.toFixed(2)}%
                                                </span>
                                                {stats.memory.percentile >= 80 && <span className="text-sm">🔥</span>}
                                            </div>
                                        </TabsTrigger>
                                    </TabsList>
                                    
                                    <TabsContent value="runtime" className="p-4 m-0 outline-none focus:outline-none">
                                        <DistributionChart
                                            buckets={stats.runtime.buckets}
                                            userValue={stats.runtime.user_value}
                                            percentile={stats.runtime.percentile}
                                            label="Runtime"
                                            unit="ms"
                                            hideHeader={true}
                                            mode={stats.runtime.mode ?? 'raw'}
                                        />
                                    </TabsContent>
                                    
                                    <TabsContent value="memory" className="p-4 m-0 outline-none focus:outline-none">
                                        <DistributionChart
                                            buckets={stats.memory.buckets}
                                            userValue={stats.memory.user_value}
                                            percentile={stats.memory.percentile}
                                            label="Memory"
                                            unit="MB"
                                            formatValue={(kb) => `${(kb / 1024).toFixed(1)}`}
                                            hideHeader={true}
                                        />
                                    </TabsContent>
                                </Tabs>

                                {/* Complexity Comparison */}
                                <ComplexityComparison
                                    percentile={stats.runtime.percentile}
                                    optimalTimeComplexity={optimalTimeComplexity}
                                    optimalSpaceComplexity={optimalSpaceComplexity}
                                />

                                {/* Inline AI Review if generated, loading, or requested by non-pro */}
                                {(aiReview.review || aiReview.isLoading || showReviewCard) && (
                                    <div className="mt-4" ref={reviewContainerRef}>
                                        {reviewCard}
                                    </div>
                                )}
                            </>
                        ) : null}
                    </div>
                )}

                {/* Failure Details (only for failed/error) */}
                {!isPassed && (
                    <FailureDetails submission={submission} />
                )}

                {/* Code Viewer */}
                <div className="rounded-xl border border-border/60 bg-card/80 backdrop-blur-sm overflow-hidden">
                    <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border/40 bg-muted/20">
                        <Code2 className="w-3.5 h-3.5 text-muted-foreground" />
                        <span className="text-xs font-medium text-muted-foreground">Code</span>
                        <span className="text-[10px] text-muted-foreground/60">│</span>
                        <span className="text-xs capitalize text-muted-foreground">{submission.language}</span>
                        <button
                            onClick={handleCopy}
                            className="ml-auto flex items-center justify-center w-6 h-6 rounded-md hover:bg-muted/50 transition-colors"
                            title="Copy code"
                        >
                            {isCopied ? (
                                <Check className="w-3.5 h-3.5 text-green-500" />
                            ) : (
                                <Copy className="w-3.5 h-3.5 text-muted-foreground hover:text-foreground transition-colors" />
                            )}
                        </button>
                    </div>
                    <div className="p-4 max-h-80 overflow-auto">
                        <pre className="text-xs font-mono text-foreground/90 leading-relaxed whitespace-pre-wrap break-words">
                            {submission.code}
                        </pre>
                    </div>
                </div>
            </div>
        </ScrollArea>
    );
}
