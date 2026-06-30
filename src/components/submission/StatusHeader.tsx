'use client';

import React from 'react';
import { Check, XCircle, AlertTriangle, ArrowLeft, Clock, HardDrive, Calendar, ShieldCheck } from 'lucide-react';
import { Submission } from '@/types/userAlgorithmData';
import { Button } from '@/components/ui/button';

interface StatusHeaderProps {
    submission: Submission;
    onBack: () => void;
}

const formatMemory = (kb: number): string => {
    if (kb >= 1024) return `${(kb / 1024).toFixed(2)} MB`;
    return `${kb.toFixed(1)} KB`;
};

export function StatusHeader({ submission, onBack }: StatusHeaderProps) {
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
            {/* Back button */}
            <Button
                variant="ghost"
                size="sm"
                onClick={onBack}
                className="gap-1.5 text-muted-foreground hover:text-foreground -ml-2 h-8 transition-colors duration-200"
            >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span className="text-xs">All Submissions</span>
            </Button>

            {/* Premium Status Card */}
            <div className="rounded-xl border border-border/60 bg-card/45 backdrop-blur-sm p-5 shadow-sm space-y-4">
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border/40">
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
                        <div className="flex items-center gap-2">
                            <h2 className={`text-lg font-bold tracking-tight ${
                                isPassed ? 'text-green-500 dark:text-green-400' : isError ? 'text-amber-500 dark:text-amber-400' : 'text-rose-500 dark:text-rose-400'
                            }`}>
                                {statusText}
                            </h2>
                            {isPassed && (
                                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wide border border-amber-400/30 bg-amber-400/10 text-amber-600 dark:text-amber-400 leading-none">
                                    Beta
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-muted-foreground self-start sm:self-auto">
                        <span className="flex items-center gap-1 bg-muted/40 px-2 py-1 rounded-md border border-border/45">
                            <Calendar className="w-3 h-3 text-muted-foreground/75" />
                            {new Date(submission.timestamp).toLocaleString(undefined, {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                            })}
                        </span>
                        <span className="capitalize px-2 py-1 rounded-md bg-muted border border-border/45 text-foreground font-mono text-[11px]">
                            {submission.language}
                        </span>
                    </div>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* Card 1: Test Cases */}
                    <div className="bg-muted/20 border border-border/30 rounded-lg p-3 flex flex-col justify-between space-y-2">
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>Test Cases</span>
                            <ShieldCheck className={`w-3.5 h-3.5 ${isPassed ? 'text-green-500' : isError ? 'text-amber-500' : 'text-rose-500'}`} />
                        </div>
                        <div>
                            <div className="text-xl font-bold font-mono tracking-tight text-foreground">
                                {passedTextCases} <span className="text-xs text-muted-foreground font-normal">/ {totalTestCases} passed</span>
                            </div>
                            {totalTestCases > 0 && (
                                <div className="w-full bg-muted/60 h-1.5 rounded-full overflow-hidden mt-1.5">
                                    <div 
                                        className={`h-full rounded-full transition-all duration-500 ${
                                            isPassed ? 'bg-green-500' : isError ? 'bg-amber-500' : 'bg-rose-500'
                                        }`} 
                                        style={{ width: `${passPercentage}%` }}
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Card 2: Runtime */}
                    <div className="bg-muted/20 border border-border/30 rounded-lg p-3 flex flex-col justify-between space-y-2">
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>Runtime</span>
                            <Clock className="w-3.5 h-3.5 text-blue-500" />
                        </div>
                        <div>
                            <div className="text-xl font-bold font-mono tracking-tight text-foreground">
                                {submission.test_results?.execution_time_ms != null ? (
                                    <>
                                        {submission.test_results.execution_time_ms} <span className="text-xs text-muted-foreground font-normal">ms</span>
                                    </>
                                ) : (
                                    <span className="text-muted-foreground">N/A</span>
                                )}
                            </div>
                            <span className="text-[10px] text-muted-foreground block mt-1">
                                Execution time
                            </span>
                        </div>
                    </div>

                    {/* Card 3: Memory */}
                    <div className="bg-muted/20 border border-border/30 rounded-lg p-3 flex flex-col justify-between space-y-2">
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>Memory</span>
                            <HardDrive className="w-3.5 h-3.5 text-indigo-500" />
                        </div>
                        <div>
                            <div className="text-xl font-bold font-mono tracking-tight text-foreground">
                                {submission.test_results?.memory_usage_kb != null ? (
                                    <>
                                        {formatMemory(submission.test_results.memory_usage_kb).split(' ')[0]}{' '}
                                        <span className="text-xs text-muted-foreground font-normal">
                                            {formatMemory(submission.test_results.memory_usage_kb).split(' ')[1]}
                                        </span>
                                    </>
                                ) : (
                                    <span className="text-muted-foreground">N/A</span>
                                )}
                            </div>
                            <span className="text-[10px] text-muted-foreground block mt-1">
                                Peak memory usage
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
