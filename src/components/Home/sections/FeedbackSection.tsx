import { Check, Code2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

export function FeedbackSection() {
    return (
        <section className="py-24 bg-[#FAFAFA] dark:bg-[#050505] border-y border-gray-100 dark:border-zinc-900">
            <div className="w-full max-w-[1600px] mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div>
                        <h2 className="text-4xl md:text-5xl font-medium tracking-tight mb-8 text-gray-900 dark:text-white">
                            Instant Feedback & Complexity Analysis
                        </h2>
                        <p className="text-gray-500 dark:text-gray-400 text-lg mb-10 leading-relaxed font-medium">
                            Go beyond simple correctness. RulCode analyzes your implementation in real-time, helping you optimize for both time and space complexity.
                        </p>
                        <div className="space-y-4">
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
                                    <span className="font-medium text-lg tracking-tight">{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="aspect-square bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl p-6 shadow-2xl shadow-primary/5 flex items-center justify-center border-dashed border-2" role="img" aria-label="Automated testing interface placeholder">
                        <div className="w-full h-full bg-gray-50 dark:bg-zinc-800/50 rounded-xl flex flex-col p-8 border border-gray-100 dark:border-zinc-800">
                            <div className="w-2/3 h-5 bg-gray-200 dark:bg-zinc-700 rounded mb-10"></div>
                            <div className="space-y-5">
                                <div className="flex items-center gap-4">
                                    <div className="w-5 h-5 rounded-full bg-green-500/20 border border-green-500/30"></div>
                                    <div className="w-full h-3 bg-gray-200/50 dark:bg-zinc-800 rounded"></div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="w-5 h-5 rounded-full bg-green-500/20 border border-green-500/30"></div>
                                    <div className="w-5/6 h-3 bg-gray-200/50 dark:bg-zinc-800 rounded"></div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="w-5 h-5 rounded-full bg-primary/20 border border-primary/30"></div>
                                    <div className="w-4/6 h-3 bg-gray-200/50 dark:bg-zinc-800 rounded"></div>
                                </div>
                            </div>
                            <div className="mt-auto flex justify-end">
                                <div className="w-20 h-8 bg-primary/20 rounded-md border border-primary/30"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
