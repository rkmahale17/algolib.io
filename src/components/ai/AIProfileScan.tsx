import React, { useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAIProfileScan } from '@/hooks/useAIProfileScan';
import { Bot, Loader2, Sparkles, TrendingUp, AlertTriangle, ArrowRight, Activity, Crosshair } from 'lucide-react';

import { ProOverlay } from '@/components/ProOverlay';

interface AIProfileScanProps {
    userId: string;
    stats: any;
    hasPremiumAccess: boolean;
}

export const AIProfileScan: React.FC<AIProfileScanProps> = ({ userId, stats, hasPremiumAccess }) => {
    const { scan, lastScanDate, isLoading, error, loadScan, generateScan } = useAIProfileScan(userId);

    useEffect(() => {
        if (hasPremiumAccess) {
            loadScan();
        }
    }, [userId, hasPremiumAccess, loadScan]);

    if (!hasPremiumAccess) {
        return (
            <Card className="border-border/50 overflow-hidden bg-card/60 backdrop-blur-sm shadow-xl relative mt-6 group">
                {/* Dummy Content - Blurred */}
                <div className="blur-sm opacity-50 pointer-events-none select-none">
                    <div className="p-6 border-b border-border/50 bg-muted/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center shadow-inner shrink-0">
                                <Sparkles className="w-7 h-7 text-primary" />
                            </div>
                            <div>
                                <h4 className="text-xl font-bold flex items-center gap-2">Buddy Profile Scan</h4>
                                <p className="text-sm text-muted-foreground mt-1 max-w-lg leading-relaxed">Great progress! You are showing strong consistency in problem-solving.</p>
                            </div>
                        </div>
                        <div className="flex flex-row md:flex-col items-center md:items-end justify-between w-full md:w-auto gap-4 md:gap-1 bg-background/50 md:bg-transparent p-4 md:p-0 rounded-xl border md:border-0 border-border/50">
                            <div className="flex flex-col items-start md:items-end">
                                <span className="text-xs text-muted-foreground uppercase tracking-widest font-semibold mb-1">Overall Score</span>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-4xl font-black text-green-500 tracking-tighter">85</span>
                                    <span className="text-muted-foreground font-medium">/100</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-border/50">
                        <div className="bg-card/80 p-6 flex flex-col h-48">
                            <h5 className="flex items-center gap-2 font-bold text-green-500 mb-4 text-lg"><TrendingUp className="w-5 h-5" /> Superpowers</h5>
                            <div className="space-y-3"><div className="h-4 bg-green-500/20 rounded w-3/4"></div><div className="h-4 bg-green-500/20 rounded w-full"></div></div>
                        </div>
                        <div className="bg-card/80 p-6 flex flex-col h-48">
                            <h5 className="flex items-center gap-2 font-bold text-amber-500 mb-4 text-lg"><AlertTriangle className="w-5 h-5" /> Skill Gaps</h5>
                            <div className="space-y-3"><div className="h-4 bg-amber-500/20 rounded w-5/6"></div><div className="h-4 bg-amber-500/20 rounded w-2/3"></div></div>
                        </div>
                        <div className="bg-card/80 p-6 flex flex-col h-48 md:col-span-2 lg:col-span-1">
                            <h5 className="flex items-center gap-2 font-bold text-primary mb-4 text-lg"><Crosshair className="w-5 h-5" /> Action Plan</h5>
                            <div className="space-y-3"><div className="h-4 bg-primary/20 rounded w-full"></div><div className="h-4 bg-primary/20 rounded w-4/5"></div></div>
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
                                Buddy Profile Scan
                            </span>
                        }
                        description="Purchase premium to unlock personalized AI insights about your solving patterns, strengths, weaknesses, and a custom learning roadmap."
                        buttonText="View subscription plans"
                        hideBadges={true}
                    />
                </div>
            </Card>
        );
    }

    if (!scan && !isLoading) {
        return (
            <Card className="p-6 border-primary/30 bg-primary/5">
                <div className="flex flex-col sm:flex-row items-center gap-6">
                    <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                        <Sparkles className="w-8 h-8 text-primary" />
                    </div>
                    <div className="flex-1 text-center sm:text-left">
                        <h4 className="text-xl font-bold text-foreground flex items-center justify-center sm:justify-start gap-2">
                            AI Profile Scan
                        </h4>
                        <p className="text-muted-foreground mt-1 max-w-xl">
                            Run a deep dive analysis on your profile to identify skill gaps and get actionable recommendations.
                        </p>
                    </div>
                    <Button 
                        onClick={() => generateScan(stats)}
                        className="shrink-0 gap-2 shadow-lg shadow-primary/20"
                        size="lg"
                    >
                        <Sparkles className="w-5 h-5" />
                        Scan Profile
                    </Button>
                </div>
                {error && <p className="text-red-500 text-sm mt-4 text-center">Error: {error}</p>}
            </Card>
        );
    }

    if (isLoading) {
        return (
            <Card className="p-12 border-border/50 flex flex-col items-center justify-center gap-6">
                <div className="relative">
                    <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse"></div>
                    <Sparkles className="w-12 h-12 text-primary relative z-10 animate-bounce" />
                </div>
                <div className="text-center">
                    <h4 className="text-lg font-semibold mb-2 flex items-center justify-center gap-2">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Analyzing Profile...
                    </h4>
                    <p className="text-sm text-muted-foreground">Evaluating strengths, weaknesses, and patterns.</p>
                </div>
            </Card>
        );
    }

    if (!scan) return null;

    const scoreColor = scan.overallScore >= 80 ? 'text-green-500' : scan.overallScore >= 50 ? 'text-primary' : 'text-amber-500';

    return (
        <Card className="border-border/50 overflow-hidden bg-card/60 backdrop-blur-sm shadow-xl">
            {/* Header */}
            <div className="p-6 border-b border-border/50 bg-muted/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center shadow-inner shrink-0">
                        <Sparkles className="w-7 h-7 text-primary" />
                    </div>
                    <div>
                        <h4 className="text-xl font-bold flex items-center gap-2">
                            Profile Scan Analysis
                        </h4>
                        <p className="text-sm text-muted-foreground mt-1 max-w-lg leading-relaxed">{scan.summary}</p>
                    </div>
                </div>
                
                <div className="flex flex-row md:flex-col items-center md:items-end justify-between w-full md:w-auto gap-4 md:gap-1 bg-background/50 md:bg-transparent p-4 md:p-0 rounded-xl border md:border-0 border-border/50">
                    <div className="flex flex-col items-start md:items-end">
                        <span className="text-xs text-muted-foreground uppercase tracking-widest font-semibold mb-1">Overall Score</span>
                        <div className="flex items-baseline gap-1">
                            <span className={`text-4xl font-black ${scoreColor} tracking-tighter`}>{scan.overallScore}</span>
                            <span className="text-muted-foreground font-medium">/100</span>
                        </div>
                    </div>
                    {lastScanDate && (
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                                Updated {new Date(lastScanDate).toLocaleDateString()}
                            </span>
                            <Button variant="ghost" size="sm" className="h-6 text-[10px] px-2 h-auto py-1" onClick={() => generateScan(stats)}>
                                Rescan
                            </Button>
                        </div>
                    )}
                </div>
            </div>

            {/* Analysis Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-border/50">
                {/* Strengths */}
                <div className="bg-card/80 p-6 flex flex-col h-full">
                    <h5 className="flex items-center gap-2 font-bold text-green-500 mb-4 text-lg">
                        <TrendingUp className="w-5 h-5" /> Superpowers
                    </h5>
                    <ul className="space-y-3 flex-1">
                        {scan.strengths.map((str, i) => (
                            <li key={i} className="text-sm text-foreground/90 flex items-start gap-3 bg-green-500/5 p-3 rounded-lg border border-green-500/10 shadow-sm">
                                <div className="w-1.5 h-1.5 rounded-full bg-green-500 shrink-0 mt-1.5" />
                                <span className="leading-relaxed">{str}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Weaknesses */}
                <div className="bg-card/80 p-6 flex flex-col h-full">
                    <h5 className="flex items-center gap-2 font-bold text-amber-500 mb-4 text-lg">
                        <AlertTriangle className="w-5 h-5" /> Skill Gaps
                    </h5>
                    <ul className="space-y-3 flex-1">
                        {scan.weaknesses.map((weak, i) => (
                            <li key={i} className="text-sm text-foreground/90 flex items-start gap-3 bg-amber-500/5 p-3 rounded-lg border border-amber-500/10 shadow-sm">
                                <div className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0 mt-1.5" />
                                <span className="leading-relaxed">{weak}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Recommendations */}
                <div className="bg-card/80 p-6 flex flex-col h-full md:col-span-2 lg:col-span-1">
                    <h5 className="flex items-center gap-2 font-bold text-primary mb-4 text-lg">
                        <Crosshair className="w-5 h-5" /> Action Plan
                    </h5>
                    <ul className="space-y-3 flex-1">
                        {scan.recommendations.map((rec, i) => (
                            <li key={i} className="text-sm text-foreground/90 flex items-start gap-3 bg-primary/5 p-3 rounded-lg border border-primary/10 shadow-sm">
                                <ArrowRight className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                                <span className="leading-relaxed">{rec}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Radar/Skill Distribution summary if available */}
            {scan.skillDistribution && scan.skillDistribution.length > 0 && (
                <div className="p-6 bg-muted/10 border-t border-border/50">
                    <h5 className="flex items-center gap-2 font-bold text-foreground mb-4">
                        <Activity className="w-4 h-4 text-muted-foreground" /> Topic Mastery Focus
                    </h5>
                    <div className="flex flex-wrap gap-2">
                        {scan.skillDistribution.map((skill, i) => (
                            <div key={i} className="flex items-center gap-2 bg-background border border-border/60 px-3 py-1.5 rounded-full shadow-sm hover:border-primary/50 transition-colors">
                                <span className="text-xs font-medium text-foreground">{skill.topic}</span>
                                <div className="w-12 h-1.5 bg-muted rounded-full overflow-hidden">
                                    <div 
                                        className={`h-full rounded-full ${skill.proficiency > 70 ? 'bg-green-500' : skill.proficiency > 40 ? 'bg-primary' : 'bg-amber-500'}`}
                                        style={{ width: `${skill.proficiency}%` }}
                                    />
                                </div>
                                <span className="text-[10px] text-muted-foreground w-6 text-right">{skill.proficiency}%</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </Card>
    );
};
