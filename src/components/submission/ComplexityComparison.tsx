'use client';

import React from 'react';
import { Zap, Star, TrendingUp, ArrowRight } from 'lucide-react';

interface ComplexityComparisonProps {
    percentile: number;
    optimalTimeComplexity?: string;
    optimalSpaceComplexity?: string;
}

function getComplexityEstimate(percentile: number): {
    label: string;
    level: 'optimal' | 'good' | 'improvable';
    icon: typeof Star;
    color: string;
    tip?: string;
} {
    if (percentile >= 80) {
        return {
            label: 'Optimal',
            level: 'optimal',
            icon: Star,
            color: 'text-emerald-400',
        };
    }
    if (percentile >= 40) {
        return {
            label: 'Good',
            level: 'good',
            icon: TrendingUp,
            color: 'text-amber-400',
            tip: 'Your approach is correct but might have room for constant-factor optimization.',
        };
    }
    return {
        label: 'Can be improved',
        level: 'improvable',
        icon: ArrowRight,
        color: 'text-red-400',
        tip: 'Consider a different algorithmic approach for better performance.',
    };
}

export function ComplexityComparison({
    percentile,
    optimalTimeComplexity,
    optimalSpaceComplexity,
}: ComplexityComparisonProps) {
    const estimate = getComplexityEstimate(percentile);
    const EstimateIcon = estimate.icon;

    return (
        <div className="rounded-xl border border-border/60 bg-card/80 backdrop-blur-sm p-4 space-y-4">
            <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400" />
                <span className="text-sm font-semibold text-foreground">Complexity Analysis</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground font-medium">Estimated</span>
            </div>

            {/* Performance level indicator */}
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 border border-border/30">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${estimate.color} bg-current/10`}>
                    <EstimateIcon className={`w-4 h-4 ${estimate.color}`} />
                </div>
                <div>
                    <p className={`text-sm font-semibold ${estimate.color}`}>
                        {estimate.label}
                    </p>
                    <p className="text-xs text-muted-foreground">
                        Your solution beats {percentile.toFixed(1)}% of submissions
                    </p>
                </div>
            </div>

            {/* Optimal complexity info */}
            {(optimalTimeComplexity || optimalSpaceComplexity) && (
                <div className="space-y-2">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Optimal Solution</p>
                    <div className="grid grid-cols-2 gap-2">
                        {optimalTimeComplexity && (
                            <div className="p-2 rounded-lg bg-muted/20 border border-border/20">
                                <p className="text-[10px] text-muted-foreground mb-0.5">Time</p>
                                <p className="text-sm font-mono font-semibold text-foreground">{optimalTimeComplexity}</p>
                            </div>
                        )}
                        {optimalSpaceComplexity && (
                            <div className="p-2 rounded-lg bg-muted/20 border border-border/20">
                                <p className="text-[10px] text-muted-foreground mb-0.5">Space</p>
                                <p className="text-sm font-mono font-semibold text-foreground">{optimalSpaceComplexity}</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Tip */}
            {estimate.tip && (
                <p className="text-xs text-muted-foreground bg-muted/20 rounded-lg p-2.5 border border-border/20">
                    💡 {estimate.tip}
                </p>
            )}
        </div>
    );
}
