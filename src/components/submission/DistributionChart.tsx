'use client';

import React, { useMemo } from 'react';
import { Timer, Cpu } from 'lucide-react';
import { DistributionBucket } from '@/types/userAlgorithmData';

interface DistributionChartProps {
    buckets: DistributionBucket[];
    userValue: number | null;
    percentile: number;
    label: string; // 'Runtime' or 'Memory'
    unit: string;  // 'ms' or 'MB'
    formatValue?: (value: number) => string;
    hideHeader?: boolean;
    /** When 'relative', userValue is a ratio (1.0 = same as reference). Default: 'raw' */
    mode?: 'relative' | 'raw';
}

const DEFAULT_FORMAT = (value: number, unit: string) => {
    if (unit === 'MB') {
        return `${(value / 1024).toFixed(1)}`;
    }
    return `${Math.round(value)}`;
};

export function DistributionChart({
    buckets,
    userValue,
    percentile,
    label,
    unit,
    formatValue,
    hideHeader,
    mode = 'raw',
}: DistributionChartProps) {
    const {
        bars,
        maxPercent,
        userBucketIndex,
        xLabels,
    } = useMemo(() => {
        if (!buckets || buckets.length === 0) {
            return { bars: [], maxPercent: 0, totalCount: 0, userBucketIndex: -1, xLabels: [] };
        }

        const total = buckets.reduce((sum, b) => sum + b.count, 0);
        
        const globalMin = Math.min(...buckets.map(b => b.range_start));
        const globalMax = Math.max(...buckets.map(b => b.range_end));
        const globalRange = Math.max(globalMax - globalMin, 0);

        const barsData = buckets.map((b, i) => ({
            ...b,
            percent: total > 0 ? (b.count / total) * 100 : 0,
            index: i,
            leftPercent: globalRange > 0 ? ((b.range_start - globalMin) / globalRange) * 100 : 50,
        }));

        const maxP = Math.max(...barsData.map(b => b.percent), 1);

        // Find which bucket the user's value falls in
        let userIdx = -1;
        if (userValue !== null && userValue !== undefined) {
            for (let i = 0; i < buckets.length; i++) {
                if (userValue >= buckets[i].range_start && userValue <= buckets[i].range_end) {
                    userIdx = i;
                    break;
                }
            }
            // If not found, find closest
            if (userIdx === -1 && buckets.length > 0) {
                let minDist = Infinity;
                buckets.forEach((b, i) => {
                    const mid = (b.range_start + b.range_end) / 2;
                    const dist = Math.abs(userValue - mid);
                    if (dist < minDist) {
                        minDist = dist;
                        userIdx = i;
                    }
                });
            }
        }

        // Generate exactly 5 x-axis labels spanning the min-max range evenly
        const labels: { value: string; percent: number }[] = [];
        for (let i = 0; i <= 4; i++) {
            const val = globalMin + (globalRange * i) / 4;
            labels.push({
                value: formatValue ? formatValue(val) : DEFAULT_FORMAT(val, unit),
                percent: i * 25
            });
        }

        return {
            bars: barsData,
            maxPercent: maxP,
            totalCount: total,
            userBucketIndex: userIdx,
            xLabels: labels,
        };
    }, [buckets, userValue, formatValue, unit]);

    if (bars.length === 0) {
        return (
            <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">
                No distribution data available yet
            </div>
        );
    }

    // Chart dimensions
    const chartHeight = 160;

    const displayValue = userValue !== null && userValue !== undefined
        ? (mode === 'relative'
            ? `${userValue.toFixed(2)}x`
            : (formatValue ? formatValue(userValue) : DEFAULT_FORMAT(userValue, unit)))
        : '-';

    const displayUnit = mode === 'relative' ? 'vs reference' : unit;

    const percentileColor = 'text-primary';
    const percentileEmoji = percentile >= 80 ? '🔥' : percentile >= 50 ? '👍' : '';

    return (
        <div className={hideHeader ? "space-y-3" : "rounded-xl border border-border/60 bg-card/80 backdrop-blur-sm p-4 space-y-3"}>
            {!hideHeader && (
                <>
                    {/* Header */}
                    <div className="flex items-baseline justify-between">
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-medium text-muted-foreground tracking-wider flex items-center gap-1.5">
                                {label === 'Runtime' ? <Timer className="w-3.5 h-3.5" /> : <Cpu className="w-3.5 h-3.5" />} {label}
                            </span>
                            {mode === 'relative' && (
                                <span
                                    className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20"
                                    title="Times are normalized against our reference solution so comparisons are fair across all users regardless of server load."
                                >
                                    normalized ✓
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Value + Percentile */}
                    <div className="flex items-baseline gap-3">
                        <span className="text-2xl font-bold text-foreground tabular-nums">
                            {displayValue}
                        </span>
                        <span className="text-sm text-muted-foreground">{displayUnit}</span>
                        <span className="text-xs text-muted-foreground">│</span>
                        <span className={`text-sm font-semibold ${percentileColor}`}>
                            Beats {percentile.toFixed(2)}% {percentileEmoji}
                        </span>
                    </div>
                </>
            )}

            {/* Flexbox Chart */}
            <div className="relative w-full flex flex-col justify-end mt-4" style={{ height: chartHeight }}>
                
                {/* Y-axis labels */}
                <div className="absolute inset-0 pointer-events-none flex flex-col justify-between text-[10px] text-muted-foreground z-0 pb-6">
                    <div className="flex items-center gap-2">
                        <span className="w-8 text-right">{Math.round(maxPercent)}%</span>
                        <div className="flex-1 border-t border-border/40 border-dashed" />
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-8 text-right">{Math.round(maxPercent / 2)}%</span>
                        <div className="flex-1 border-t border-border/40 border-dashed" />
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-8 text-right">0%</span>
                        <div className="flex-1 border-t border-border/40 border-dashed" />
                    </div>
                </div>

                {/* Bars */}
                <div className="relative z-10 h-full w-full pl-10 pb-6">
                    <div className="relative h-full w-full">
                        {bars.map((bar, i) => {
                            const barHeight = Math.max((bar.percent / maxPercent) * 100, 1);
                            const isUserBar = i === userBucketIndex;
                            return (
                                <div 
                                    key={i} 
                                    className="absolute bottom-0 flex flex-col justify-end h-full w-[2px] group"
                                    style={{ left: `${bar.leftPercent}%` }}
                                >
                                    <div
                                        className={`w-full rounded-t-sm transition-all duration-500 ease-out ${
                                            isUserBar ? 'bg-primary' : 'bg-blue-500/70'
                                        }`}
                                        style={{ 
                                            height: `${barHeight}%`,
                                            animation: `distBarGrow 0.6s ease-out ${i * 0.01}s both`,
                                            transformOrigin: 'bottom'
                                        }}
                                    >
                                        {isUserBar && (
                                            <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-primary ring-2 ring-background z-20" />
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* X-axis labels */}
                <div className="absolute bottom-0 left-10 right-0 h-6">
                    {xLabels.map((xLabel, i) => (
                        <div 
                            key={i} 
                            className={`absolute text-[10px] text-muted-foreground transform font-mono ${
                                i === 0 ? 'translate-x-0' : i === xLabels.length - 1 ? '-translate-x-full' : '-translate-x-1/2'
                            }`}
                            style={{ left: `${xLabel.percent}%` }}
                        >
                            {xLabel.value}
                            {i === xLabels.length - 1 && (
                                <span className="text-muted-foreground/60 ml-1">{unit}</span>
                            )}
                        </div>
                    ))}
                </div>
            </div>



            {/* CSS animation keyframes */}
            <style dangerouslySetInnerHTML={{ __html: `
                @keyframes distBarGrow {
                    from { transform: scaleY(0); }
                    to { transform: scaleY(1); }
                }
            `}} />
        </div>
    );
}
