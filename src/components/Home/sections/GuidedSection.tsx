"use client";

import React from "react";
import { ArrowRight, Clock, HardDrive, Layers, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { usePostHog } from "@posthog/react";
import { trackEvent } from "@/lib/analytics";

export function GuidedSection() {
    const posthog = usePostHog();

    const handleCtaClick = (label: string, destination: string, section?: string) => {
        trackEvent(posthog, 'home_cta_clicked', { cta_label: label, destination, section });
    };

    return (
        <section className="py-24 relative overflow-hidden bg-white dark:bg-black text-[#1A1A1A] dark:text-white border-t border-gray-100 dark:border-zinc-900">
            {/* faint grid pattern background */}
            <div className="absolute inset-0 z-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none"
                style={{
                    backgroundImage: 'linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)',
                    backgroundSize: '40px 40px'
                }}></div>

            <div className="w-full max-w-[1600px] mx-auto px-4 relative z-10">
                <div className="max-w-[1400px] mx-auto">
                    {/* Badge Pill */}
                    <div className="flex justify-center mb-12">
                        <div className="bg-gray-100/50 dark:bg-zinc-900/50 border border-gray-200 dark:border-zinc-800 px-8 py-2 rounded-full text-base font-medium shadow-sm text-gray-900 dark:text-white transition-all hover:border-gray-300 dark:hover:border-zinc-700">
                            Guidebook
                        </div>
                    </div>

                    {/* Section Header */}
                    <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom duration-700">
                        <h2 className="text-3xl md:text-5xl font-medium tracking-tight mb-4 text-gray-900 dark:text-white">
                            Learn
                        </h2>
                        <p className="text-gray-500 dark:text-gray-400 text-base md:text-lg max-w-2xl mx-auto font-medium leading-relaxed">
                            Step-by-step visual guides and blueprints to master algorithmic theory, fundamentals, and runtime optimization.
                        </p>
                    </div>

                    {/* Visual Library Showcase Card */}
                    <div className="grid grid-cols-1 mb-8">
                        <Link href="/dsa/visual-library" className="group block" onClick={() => handleCtaClick('Visual Library', '/dsa/visual-library', 'guided_section')}>
                            <Card className="h-full bg-white dark:bg-zinc-900/50 border-gray-100 dark:border-zinc-800 hover:border-primary/30 transition-all duration-300 group-hover:shadow-2xl group-hover:shadow-primary/5 group-hover:-translate-y-1 overflow-hidden p-8 flex flex-col md:flex-row items-center gap-8">
                                <div className="w-20 h-20 shrink-0 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 group-hover:bg-primary group-hover:text-black transition-colors duration-300">
                                    <Target className="w-10 h-10" />
                                </div>
                                <div className="flex-1 text-center md:text-left">
                                    <CardTitle className="text-3xl font-medium group-hover:text-primary transition-colors mb-3">Visual Library</CardTitle>
                                    <CardDescription className="text-lg text-gray-500 dark:text-gray-400 leading-relaxed font-medium">
                                        Explore our comprehensive library of interactive visualizations. Master complex algorithms by watching data structures animate in real-time as the code executes.
                                    </CardDescription>
                                </div>
                                <div className="shrink-0">
                                    <Button size="lg" className="rounded-full px-8 py-6 text-base bg-zinc-900 text-white dark:bg-white dark:text-black group-hover:bg-primary group-hover:text-black transition-all">
                                        Open Library <ArrowRight className="ml-2 w-5 h-5" />
                                    </Button>
                                </div>
                            </Card>
                        </Link>
                    </div>

                    {/* Cards Grid (4 columns on desktop, 2 on tablet, 1 on mobile) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
                        <Link href="/guides/time-complexity" className="group" onClick={() => handleCtaClick('Time Complexity', '/guides/time-complexity', 'guided_section')}>
                            <Card className="h-full bg-white dark:bg-zinc-900/50 border-gray-100 dark:border-zinc-800 hover:border-purple-500/30 transition-all duration-300 group-hover:shadow-2xl group-hover:shadow-purple-500/5 group-hover:-translate-y-1 overflow-hidden">
                                <CardHeader className="pb-4">
                                    <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center mb-4 border border-purple-500/20 group-hover:bg-purple-500 group-hover:text-white transition-colors duration-300">
                                        <Clock className="w-6 h-6" />
                                    </div>
                                    <CardTitle className="text-2xl font-medium group-hover:text-purple-500 transition-colors">Time Complexity</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <CardDescription className="text-base text-gray-500 dark:text-gray-400 leading-relaxed font-medium">
                                        Big O runtime analysis and operation budgets cheat sheet.
                                    </CardDescription>
                                </CardContent>
                            </Card>
                        </Link>

                        <Link href="/guides/space-complexity" className="group" onClick={() => handleCtaClick('Space Complexity', '/guides/space-complexity', 'guided_section')}>
                            <Card className="h-full bg-white dark:bg-zinc-900/50 border-gray-100 dark:border-zinc-800 hover:border-cyan-500/30 transition-all duration-300 group-hover:shadow-2xl group-hover:shadow-cyan-500/5 group-hover:-translate-y-1 overflow-hidden">
                                <CardHeader className="pb-4">
                                    <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center mb-4 border border-cyan-500/20 group-hover:bg-cyan-500 group-hover:text-white transition-colors duration-300">
                                        <HardDrive className="w-6 h-6" />
                                    </div>
                                    <CardTitle className="text-2xl font-medium group-hover:text-cyan-500 transition-colors">Space Complexity</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <CardDescription className="text-base text-gray-500 dark:text-gray-400 leading-relaxed font-medium">
                                        Recursion stack, memory bounds, and allocations cheat sheet.
                                    </CardDescription>
                                </CardContent>
                            </Card>
                        </Link>

                        <Link href="/guides/fundamentals/core-data-structures" className="group" onClick={() => handleCtaClick('DSA Fundamentals', '/guides/fundamentals/core-data-structures', 'guided_section')}>
                            <Card className="h-full bg-white dark:bg-zinc-900/50 border-gray-100 dark:border-zinc-800 hover:border-rose-500/30 transition-all duration-300 group-hover:shadow-2xl group-hover:shadow-rose-500/5 group-hover:-translate-y-1 overflow-hidden">
                                <CardHeader className="pb-4">
                                    <div className="w-12 h-12 rounded-xl bg-rose-500/10 flex items-center justify-center mb-4 border border-rose-500/20 group-hover:bg-rose-500 group-hover:text-white transition-colors duration-300">
                                        <Layers className="w-6 h-6" />
                                    </div>
                                    <CardTitle className="text-2xl font-medium group-hover:text-rose-500 transition-colors">DSA Fundamentals</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <CardDescription className="text-base text-gray-500 dark:text-gray-400 leading-relaxed font-medium">
                                        Core structures like Lists, Trees, Graphs, and Tries.
                                    </CardDescription>
                                </CardContent>
                            </Card>
                        </Link>

                        <Link href="/guides/patterns/arrays-hashing" className="group" onClick={() => handleCtaClick('Coding Patterns', '/guides/patterns/arrays-hashing', 'guided_section')}>
                            <Card className="h-full bg-white dark:bg-zinc-900/50 border-gray-100 dark:border-zinc-800 hover:border-amber-500/30 transition-all duration-300 group-hover:shadow-2xl group-hover:shadow-amber-500/5 group-hover:-translate-y-1 overflow-hidden">
                                <CardHeader className="pb-4">
                                    <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center mb-4 border border-amber-500/20 group-hover:bg-amber-500 group-hover:text-white transition-colors duration-300">
                                        <Target className="w-6 h-6" />
                                    </div>
                                    <CardTitle className="text-2xl font-medium group-hover:text-amber-500 transition-colors">Coding Patterns</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <CardDescription className="text-base text-gray-500 dark:text-gray-400 leading-relaxed font-medium">
                                        High-impact blueprints like Pointers and Sliding Windows.
                                    </CardDescription>
                                </CardContent>
                            </Card>
                        </Link>
                    </div>

                    {/* Bottom CTA Button */}
                    <div className="flex justify-center">
                        <Button size="lg" className="rounded-full px-8 py-6 text-base bg-primary hover:bg-primary/90 text-black transition-all hover:scale-105 active:scale-95 shadow-xl shadow-primary/20" asChild>
                            <Link href="/dsa/visual-library" onClick={() => handleCtaClick('Explore Visual Library', '/dsa/visual-library', 'guided_section_cta')}>
                                Explore Visual Library <ArrowRight className="ml-2 w-5 h-5" />
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
}
