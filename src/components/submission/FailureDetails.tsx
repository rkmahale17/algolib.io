'use client';

import React from 'react';
import { AlertCircle, ChevronDown, ChevronRight } from 'lucide-react';
import { Submission } from '@/types/userAlgorithmData';

interface FailureDetailsProps {
    submission: Submission;
}

export function FailureDetails({ submission }: FailureDetailsProps) {
    const [expanded, setExpanded] = React.useState(true);
    const errors = submission.test_results?.errors || [];
    const failedCount = submission.test_results?.failed || 0;
    const totalCount = submission.test_results?.total || 0;

    return (
        <div className="rounded-xl border border-red-500/20 bg-red-500/5 backdrop-blur-sm overflow-hidden">
            {/* Header */}
            <button
                onClick={() => setExpanded(!expanded)}
                className="w-full flex items-center gap-3 p-4 hover:bg-red-500/5 transition-colors"
            >
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span className="text-sm font-semibold text-red-400 flex-1 text-left">
                    {failedCount} of {totalCount} test cases failed
                </span>
                {expanded ? (
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                ) : (
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                )}
            </button>

            {/* Error details */}
            {expanded && errors.length > 0 && (
                <div className="px-4 pb-4 space-y-2">
                    {errors.map((error, i) => (
                        <div
                            key={i}
                            className="p-3 rounded-lg bg-red-500/5 border border-red-500/10"
                        >
                            <pre className="text-xs text-red-300 font-mono whitespace-pre-wrap break-words">
                                {error}
                            </pre>
                        </div>
                    ))}
                </div>
            )}

            {/* Encouragement */}
            {expanded && (
                <div className="px-4 pb-4">
                    <p className="text-xs text-muted-foreground bg-muted/20 rounded-lg p-2.5 border border-border/20">
                        🔍 Review the failed test cases in the "Test Result" tab for detailed input/output comparison.
                    </p>
                </div>
            )}
        </div>
    );
}
