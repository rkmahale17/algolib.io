import React from 'react';
import { Sparkles, Brain, Lightbulb, Code2, Activity, CheckCircle, FileCode2 } from 'lucide-react';

export const AIWelcomeScreen = () => {
    return (
        <div className="flex flex-col space-y-8 max-w-2xl mx-auto py-8 px-2 md:px-4">
            <div className="flex flex-col items-center text-center space-y-3 mb-2">
                <div className="bg-primary/10 p-3 rounded-full">
                    <Sparkles className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-foreground">Ask Buddy AI</h2>
                <p className="text-sm text-muted-foreground max-w-md">
                    I understand your current problem automatically. No need to paste the question, constraints, or your code! ⭐⭐⭐⭐⭐
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                {/* 1. Explains Problem */}
                <div className="bg-muted/30 p-4 rounded-xl border border-border/50 flex flex-col gap-2 hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-2 mb-1">
                        <Brain className="w-4 h-4 text-primary" />
                        <h3 className="font-semibold text-sm">Explains the Problem</h3>
                    </div>
                    <p className="text-[13px] text-muted-foreground leading-relaxed">
                        Breaks down the <span className="bg-primary/10 text-primary px-1.5 py-0.5 rounded font-medium">problem statement</span>, <span className="bg-primary/10 text-primary px-1.5 py-0.5 rounded font-medium">constraints</span>, and <span className="bg-primary/10 text-primary px-1.5 py-0.5 rounded font-medium">examples</span>. Great for beginners to understand hidden meanings and tricky parts.
                    </p>
                </div>

                {/* 2. Gives Hints */}
                <div className="bg-muted/30 p-4 rounded-xl border border-border/50 flex flex-col gap-2 hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-2 mb-1">
                        <Lightbulb className="w-4 h-4 text-amber-500" />
                        <h3 className="font-semibold text-sm">Progressive Hints</h3>
                    </div>
                    <p className="text-[13px] text-muted-foreground leading-relaxed">
                        Instead of giving the answer immediately, it provides <span className="bg-amber-500/10 text-amber-500 px-1.5 py-0.5 rounded font-medium">Hint 1</span>, <span className="bg-amber-500/10 text-amber-500 px-1.5 py-0.5 rounded font-medium">Hint 2</span>, etc., guiding you step-by-step.
                    </p>
                </div>

                {/* 3. Code Review & Fixes */}
                <div className="bg-muted/30 p-4 rounded-xl border border-border/50 flex flex-col gap-2 hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-2 mb-1">
                        <Code2 className="w-4 h-4 text-emerald-500" />
                        <h3 className="font-semibold text-sm">Code Review & Quick Fix</h3>
                    </div>
                    <p className="text-[13px] text-muted-foreground leading-relaxed">
                        Analyzes <code className="bg-muted px-1.5 py-0.5 rounded font-mono text-[12px]">bugs</code>, <code className="bg-muted px-1.5 py-0.5 rounded font-mono text-[12px]">logic</code>, and <code className="bg-muted px-1.5 py-0.5 rounded font-mono text-[12px]">syntax</code>. Directly inspects your editor to suggest fixes for compilation errors.
                    </p>
                    <div className="mt-auto pt-2">
                        <span className="text-[12px] text-muted-foreground">Try asking: </span>
                        <code className="text-[12px] bg-primary/5 text-primary border border-primary/20 px-1.5 py-0.5 rounded font-mono">Why am I getting TLE?</code>
                    </div>
                </div>

                {/* 4. Complexity Analysis */}
                <div className="bg-muted/30 p-4 rounded-xl border border-border/50 flex flex-col gap-2 hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-2 mb-1">
                        <Activity className="w-4 h-4 text-blue-500" />
                        <h3 className="font-semibold text-sm">Complexity Analysis</h3>
                    </div>
                    <p className="text-[13px] text-muted-foreground leading-relaxed">
                        Explains <span className="bg-blue-500/10 text-blue-500 px-1.5 py-0.5 rounded font-medium">Time Complexity</span> and <span className="bg-blue-500/10 text-blue-500 px-1.5 py-0.5 rounded font-medium">Space Complexity</span>, comparing against better solutions.
                    </p>
                    <div className="mt-auto pt-2">
                        <span className="text-[12px] text-muted-foreground">Try asking: </span>
                        <code className="text-[12px] bg-primary/5 text-primary border border-primary/20 px-1.5 py-0.5 rounded font-mono">Why is my approach O(n²)?</code>
                    </div>
                </div>

                {/* 5. Submission Analysis */}
                <div className="bg-muted/30 p-4 rounded-xl border border-border/50 flex flex-col gap-2 hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-2 mb-1">
                        <CheckCircle className="w-4 h-4 text-purple-500" />
                        <h3 className="font-semibold text-sm">Submission Analysis</h3>
                    </div>
                    <p className="text-[13px] text-muted-foreground leading-relaxed">
                        After submitting, get detailed feedback on <span className="bg-purple-500/10 text-purple-500 px-1.5 py-0.5 rounded font-medium">performance</span>, <span className="bg-purple-500/10 text-purple-500 px-1.5 py-0.5 rounded font-medium">algorithm used</span>, and <span className="bg-purple-500/10 text-purple-500 px-1.5 py-0.5 rounded font-medium">optimization ideas</span>.
                    </p>
                </div>

                {/* 6. Finds Solutions & Quality */}
                <div className="bg-muted/30 p-4 rounded-xl border border-border/50 flex flex-col gap-2 hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-2 mb-1">
                        <FileCode2 className="w-4 h-4 text-orange-500" />
                        <h3 className="font-semibold text-sm">Solutions & Code Quality</h3>
                    </div>
                    <p className="text-[13px] text-muted-foreground leading-relaxed">
                        Summarizes the best community solutions and provides suggestions on <code className="bg-muted px-1.5 py-0.5 rounded font-mono text-[12px]">naming</code>, <code className="bg-muted px-1.5 py-0.5 rounded font-mono text-[12px]">readability</code>, and <code className="bg-muted px-1.5 py-0.5 rounded font-mono text-[12px]">maintainability</code>.
                    </p>
                </div>
            </div>
        </div>
    );
};
