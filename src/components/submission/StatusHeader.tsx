'use client';

import React from 'react';
import { Check, XCircle, AlertTriangle, ArrowLeft, Clock, HardDrive, Calendar, ShieldCheck, Sparkles, Loader2 } from 'lucide-react';
import { Submission } from '@/types/userAlgorithmData';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from '@/components/ui/dialog';
import { ReactNode } from 'react';

interface StatusHeaderProps {
    submission: Submission;
    algorithmId?: string;
    hasPremiumAccess?: boolean;
    onBack: () => void;
    hideAnalyseButton?: boolean;
    onAnalyseClick?: () => void;
    isGeneratingReview?: boolean;
}

const formatMemory = (kb: number): string => {
    if (kb >= 1024) return `${(kb / 1024).toFixed(2)} MB`;
    return `${kb.toFixed(1)} KB`;
};

export function StatusHeader({ submission, algorithmId, hasPremiumAccess, onBack, hideAnalyseButton, onAnalyseClick, isGeneratingReview }: StatusHeaderProps) {
    const isPassed = submission.status === 'passed';
    const isError = submission.status === 'error';
    
    // Status text mapping
    const statusText = isPassed ? 'Accepted' : isError ? 'Runtime Error' : 'Wrong Answer';
    
    // Progress calculation
    const passedTextCases = submission.test_results?.passed ?? 0;
    const totalTestCases = submission.test_results?.total ?? 0;
    const passPercentage = totalTestCases > 0 ? (passedTextCases / totalTestCases) * 100 : 0;

    return (
        <div className="space-y-4">
            {/* Top Row: Back button and Metadata */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={onBack}
                    className="gap-1.5 text-muted-foreground hover:text-foreground -ml-2 h-8 transition-colors duration-200 self-start sm:self-auto"
                >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span className="text-xs">All Submissions</span>
                </Button>

                <div className="flex items-center gap-2 text-xs text-muted-foreground self-end sm:self-auto flex-wrap justify-end">
                    <span className="flex items-center gap-1 bg-muted/40 px-2 py-1.5 rounded-md border border-border/45">
                        <Calendar className="w-3 h-3 text-muted-foreground/75" />
                        {new Date(submission.timestamp).toLocaleString(undefined, {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                        })}
                    </span>
                    <span className="capitalize px-2 py-1.5 rounded-md bg-muted border border-border/45 text-foreground font-mono text-[11px]">
                        {submission.language}
                    </span>
                </div>
            </div>

            {/* Premium Status Card */}
            <div className="rounded-xl border border-border/60 bg-card/45 backdrop-blur-sm p-3 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4 flex-wrap">
                    <div className="flex items-center gap-3">
                        {isPassed ? (
                            <div className="w-8 h-8 rounded-full bg-green-500/10 dark:bg-green-500/20 border border-green-500/30 flex items-center justify-center shadow-[0_0_12px_rgba(34,197,94,0.15)] shrink-0">
                                <Check className="w-4 h-4 text-green-500 dark:text-green-400 stroke-[3]" />
                            </div>
                        ) : isError ? (
                            <div className="w-8 h-8 rounded-full bg-amber-500/10 dark:bg-amber-500/20 border border-amber-500/30 flex items-center justify-center shadow-[0_0_12px_rgba(245,158,11,0.15)] shrink-0">
                                <AlertTriangle className="w-4 h-4 text-amber-500 dark:text-amber-400" />
                            </div>
                        ) : (
                            <div className="w-8 h-8 rounded-full bg-rose-500/10 dark:bg-rose-500/20 border border-rose-500/30 flex items-center justify-center shadow-[0_0_12px_rgba(244,63,94,0.15)] shrink-0">
                                <XCircle className="w-4 h-4 text-rose-500 dark:text-rose-400" />
                            </div>
                        )}
                        <h2 className={`text-lg font-bold tracking-tight ${
                            isPassed ? 'text-green-500 dark:text-green-400' : isError ? 'text-amber-500 dark:text-amber-400' : 'text-rose-500 dark:text-rose-400'
                        }`}>
                            {statusText}
                        </h2>
                    </div>

                    <div className="w-px h-5 bg-border/60 hidden sm:block" />

                    <div className="flex items-center gap-2">
                        <ShieldCheck className={`w-4 h-4 ${isPassed ? 'text-green-500' : isError ? 'text-amber-500' : 'text-rose-500'}`} />
                        <span className="text-sm font-medium text-foreground">
                            {passedTextCases} <span className="text-muted-foreground font-normal">/ {totalTestCases} testcases passed</span>
                        </span>
                    </div>
                </div>

                {!hideAnalyseButton && algorithmId && hasPremiumAccess !== undefined && (
                    <Button 
                        size="sm" 
                        onClick={onAnalyseClick}
                        disabled={isGeneratingReview}
                        className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2 font-semibold shrink-0 shadow-sm shadow-primary/25 rounded-full px-5 h-9 self-start sm:self-auto transition-all hover:scale-105 active:scale-95"
                    >
                        {isGeneratingReview ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4 fill-primary-foreground/20" />}
                        {isGeneratingReview ? 'Analysing...' : 'Analyse solution'}
                    </Button>
                )}
            </div>
        </div>
    );
}
