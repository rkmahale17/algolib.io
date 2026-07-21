"use client";

import { Check, Code2, ArrowRight, Play, Sparkles, Activity, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { usePostHog } from "@posthog/react";
import { trackEvent } from "@/lib/analytics";

export function FeedbackSection() {
    const posthog = usePostHog();
    const [activeTab, setActiveTab] = useState<"tests" | "complexity">("tests");
    const [isRunning, setIsRunning] = useState(false);
    const [isCompleted, setIsCompleted] = useState(false);
    const [language, setLanguage] = useState("Python");

    const runTestsSimulated = () => {
        if (isRunning) return;
        setIsRunning(true);
        setIsCompleted(false);
        trackEvent(posthog, "home_demo_run_clicked", { language });

        setTimeout(() => {
            setIsRunning(false);
            setIsCompleted(true);
        }, 1200);
    };

    return (
        <section className="py-36 lg:py-48 bg-[#FAFAFA] dark:bg-[#050505]">
            <div className="w-full max-w-[1200px] mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
                    {/* Left Column: Description & Features */}
                    <div>
                        <h2 className="text-3xl md:text-5xl font-medium tracking-tight mb-8 text-gray-900 dark:text-white leading-[1.1]">
                            Instant Feedback & Complexity Analysis
                        </h2>
                        <p className="text-zinc-600 dark:text-zinc-400 text-base md:text-lg mb-10 leading-relaxed">
                            Go beyond simple correctness. RulCode analyzes your implementation in real-time, helping you optimize for both time and space complexity as you write.
                        </p>
                        <div className="space-y-4 mb-10">
                            {[
                                "Automated test suites for every problem",
                                "Real-time complexity estimations",
                                "Detailed edge-case diagnostics",
                                "Multi-language support for all solutions"
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-4 text-gray-700 dark:text-gray-300">
                                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20">
                                        <Check className="w-3.5 h-3.5 text-primary" />
                                    </div>
                                    <span className="font-medium text-base md:text-lg tracking-tight">{item}</span>
                                </div>
                            ))}
                        </div>
                        <Button
                            size="lg"
                            className="rounded-lg py-6 text-base bg-zinc-950 dark:bg-white hover:bg-zinc-900 dark:hover:bg-zinc-100 text-white dark:text-black font-medium tracking-tight transition-all duration-300 hover:scale-[1.01] active:scale-[0.98] shadow-xl flex items-center gap-2 group/btn w-full sm:w-fit px-8"
                            asChild
                        >
                            <Link
                                href="/problem/kadanes-algorithm"
                                onClick={() => trackEvent(posthog, "home_cta_clicked", {
                                    cta_label: "Try Now – Code Runner",
                                    destination: "/problem/kadanes-algorithm",
                                    section: "feedback_coderunner"
                                })}
                            >
                                <Code2 className="w-5 h-5" />
                                Try Code Runner
                                <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover/btn:translate-x-1" />
                            </Link>
                        </Button>
                    </div>

                    {/* Right Column: Premium Interactive Mock Panel */}
                    <div className="w-full aspect-[4/3] min-h-[440px] bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-900 rounded-3xl p-5 sm:p-6 shadow-2xl shadow-primary/5 flex flex-col overflow-hidden relative group">
                        
                        {/* Upper Header Control Row */}
                        <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-zinc-900">
                            <div className="flex gap-1.5">
                                <span className="w-3 h-3 rounded-full bg-[#FF5F56]"></span>
                                <span className="w-3 h-3 rounded-full bg-[#FFBD2E]"></span>
                                <span className="w-3 h-3 rounded-full bg-[#27C93F]"></span>
                            </div>
                            
                            {/* Toggle Tabs */}
                            <div className="flex bg-gray-100 dark:bg-zinc-900 rounded-lg p-0.5 text-xs font-semibold">
                                <button
                                    onClick={() => setActiveTab("tests")}
                                    className={`px-4 py-1.5 rounded-md transition-all ${
                                        activeTab === "tests"
                                            ? "bg-white dark:bg-zinc-800 text-zinc-950 dark:text-white shadow-sm"
                                            : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200"
                                    }`}
                                >
                                    Test Cases
                                </button>
                                <button
                                    onClick={() => setActiveTab("complexity")}
                                    className={`px-4 py-1.5 rounded-md transition-all ${
                                        activeTab === "complexity"
                                            ? "bg-white dark:bg-zinc-800 text-zinc-950 dark:text-white shadow-sm"
                                            : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200"
                                    }`}
                                >
                                    Complexity
                                </button>
                            </div>

                            <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-400 dark:text-zinc-500">
                                <Activity className="w-3.5 h-3.5 text-primary opacity-70" />
                                TELEMETRY
                            </div>
                        </div>

                        {/* Middle Display Area */}
                        <div className="flex-1 py-6 flex flex-col justify-between overflow-y-auto">
                            {isRunning ? (
                                /* Running / Loading Simulation */
                                <div className="flex-1 flex flex-col justify-center items-center py-8">
                                    <RefreshCw className="w-8 h-8 text-primary animate-spin mb-4" />
                                    <p className="text-sm font-semibold tracking-wide text-zinc-500 dark:text-zinc-400 animate-pulse">
                                        Compiling & executing test suite...
                                    </p>
                                </div>
                            ) : activeTab === "tests" ? (
                                /* Test Cases tab content */
                                <div className="space-y-4 flex-1">
                                    {[
                                        {
                                            id: 1,
                                            input: "nums = [-2,1,-3,4,-1,2,1,-5,4]",
                                            expected: "6",
                                            got: isCompleted ? "6" : "?",
                                            time: "0.12ms",
                                        },
                                        {
                                            id: 2,
                                            input: "nums = [5,4,-1,7,8]",
                                            expected: "23",
                                            got: isCompleted ? "23" : "?",
                                            time: "0.08ms",
                                        },
                                        {
                                            id: 3,
                                            input: "nums = [1]",
                                            expected: "1",
                                            got: isCompleted ? "1" : "?",
                                            time: "0.05ms",
                                        },
                                    ].map((test) => (
                                        <div
                                            key={test.id}
                                            className={`p-3.5 rounded-xl border transition-all duration-300 flex items-center justify-between ${
                                                isCompleted
                                                    ? "bg-emerald-500/5 dark:bg-emerald-500/10 border-emerald-500/20"
                                                    : "bg-gray-50 dark:bg-zinc-900/40 border-gray-100 dark:border-zinc-900/60"
                                            }`}
                                        >
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
                                                        Case {test.id}
                                                    </span>
                                                    <code className="text-xs text-zinc-600 dark:text-zinc-300 bg-gray-100 dark:bg-zinc-800/80 px-2 py-0.5 rounded font-mono">
                                                        {test.input}
                                                    </code>
                                                </div>
                                                <div className="flex items-center gap-4 text-xs font-semibold">
                                                    <span className="text-zinc-500">Expected: <strong className="text-zinc-700 dark:text-zinc-300">{test.expected}</strong></span>
                                                    <span className="text-zinc-500">Got: <strong className={isCompleted ? "text-emerald-600 dark:text-emerald-400 font-bold animate-fade-in" : "text-zinc-400"}>{test.got}</strong></span>
                                                </div>
                                            </div>
                                            
                                            {/* Status Badge */}
                                            {isCompleted ? (
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-mono">{test.time}</span>
                                                    <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30 text-emerald-600 dark:text-emerald-400">
                                                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                                                    </div>
                                                </div>
                                            ) : (
                                                <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">Pending</span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                /* Complexity tab content */
                                <div className="space-y-6 flex-1 px-1">
                                    {/* Time Complexity Card */}
                                    <div className="bg-gray-50 dark:bg-zinc-900/30 border border-gray-100 dark:border-zinc-900 p-4 rounded-2xl flex flex-col gap-2">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Time Complexity</span>
                                            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">Optimal</span>
                                        </div>
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-3xl font-extrabold text-zinc-900 dark:text-white font-mono tracking-tight">O(N)</span>
                                            <span className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">Linear Scan</span>
                                        </div>
                                        <div className="space-y-1 mt-2">
                                            <div className="flex justify-between text-xs font-semibold text-zinc-600 dark:text-zinc-400">
                                                <span>Runtime Efficiency</span>
                                                <span className="text-emerald-600 dark:text-emerald-400">{isCompleted ? "Beats 98.6%" : "Beats --%"}</span>
                                            </div>
                                            <div className="w-full h-2 rounded-full bg-gray-200 dark:bg-zinc-800 overflow-hidden">
                                                <div 
                                                    className="h-full bg-emerald-500 rounded-full transition-all duration-1000 ease-out" 
                                                    style={{ width: isCompleted ? "98.6%" : "0%" }}
                                                ></div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Space Complexity Card */}
                                    <div className="bg-gray-50 dark:bg-zinc-900/30 border border-gray-100 dark:border-zinc-900 p-4 rounded-2xl flex flex-col gap-2">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Space Complexity</span>
                                            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">Constant</span>
                                        </div>
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-3xl font-extrabold text-zinc-900 dark:text-white font-mono tracking-tight">O(1)</span>
                                            <span className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">Constant Space</span>
                                        </div>
                                        <div className="space-y-1 mt-2">
                                            <div className="flex justify-between text-xs font-semibold text-zinc-600 dark:text-zinc-400">
                                                <span>Memory Usage</span>
                                                <span className="text-emerald-600 dark:text-emerald-400">{isCompleted ? "Beats 95.4%" : "Beats --%"}</span>
                                            </div>
                                            <div className="w-full h-2 rounded-full bg-gray-200 dark:bg-zinc-800 overflow-hidden">
                                                <div 
                                                    className="h-full bg-emerald-500 rounded-full transition-all duration-1000 ease-out" 
                                                    style={{ width: isCompleted ? "95.4%" : "0%" }}
                                                ></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Bottom Actions Bar */}
                        <div className="pt-4 border-t border-gray-100 dark:border-zinc-900 flex items-center justify-between">
                            {/* Language selector mock */}
                            <div className="flex items-center gap-1">
                                <code className="text-xs text-zinc-500 dark:text-zinc-400 bg-gray-100 dark:bg-zinc-900 px-2 py-1 rounded font-semibold">
                                    {language}
                                </code>
                                <select 
                                    value={language}
                                    onChange={(e) => setLanguage(e.target.value)}
                                    className="opacity-0 w-4 h-4 absolute cursor-pointer"
                                    title="Choose language"
                                >
                                    <option value="Python">Python</option>
                                    <option value="TypeScript">TypeScript</option>
                                    <option value="C++">C++</option>
                                    <option value="Java">Java</option>
                                </select>
                                <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-semibold cursor-pointer">▾</span>
                            </div>

                            {/* Run Code Button */}
                            <button
                                onClick={runTestsSimulated}
                                disabled={isRunning}
                                className={`px-5 py-2.5 rounded-xl text-xs font-bold tracking-tight shadow-md flex items-center gap-2 transition-all duration-300 active:scale-[0.98] ${
                                    isCompleted 
                                        ? "bg-emerald-600 hover:bg-emerald-700 text-white" 
                                        : "bg-primary hover:bg-primary/95 text-primary-foreground"
                                }`}
                            >
                                <Play className={`w-3.5 h-3.5 ${isRunning ? "animate-spin" : ""}`} />
                                {isRunning ? "Running..." : isCompleted ? "Re-run Tests" : "Run Tests"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
