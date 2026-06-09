"use client";

import React from "react";
import { ArrowRight, Layers, Trophy, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { usePostHog } from "@posthog/react";
import { trackEvent } from "@/lib/analytics";
import { motion } from "framer-motion";

export function ProblemsSection() {
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
                            Practice
                        </div>
                    </div>

                    {/* Section Header */}
                    <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom duration-700">
                        <h2 className="text-3xl md:text-5xl font-medium tracking-tight mb-4 text-gray-900 dark:text-white">
                            Practice
                        </h2>
                        <p className="text-gray-500 dark:text-gray-400 text-base md:text-lg max-w-2xl mx-auto font-medium leading-relaxed">
                            Master Data Structures & Algorithms with our curated learning paths designed for modern technical interviews.
                        </p>
                    </div>

                    {/* Cards Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
                        <Link href="/dsa/problems" className="group" onClick={() => handleCtaClick('All Problems', '/dsa/problems', 'problems_section')}>
                            <Card className="h-full bg-white dark:bg-zinc-900/50 border-gray-100 dark:border-zinc-800 hover:border-primary/30 transition-all duration-300 group-hover:shadow-2xl group-hover:shadow-primary/5 group-hover:-translate-y-1 overflow-hidden">
                                <CardHeader className="pb-4">
                                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 border border-primary/20 group-hover:bg-primary group-hover:text-black dark:group-hover:text-black transition-colors duration-300">
                                        <Globe className="w-6 h-6" />
                                    </div>
                                    <CardTitle className="text-2xl font-medium group-hover:text-primary transition-colors">Problems</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <CardDescription className="text-base text-gray-500 dark:text-gray-400 leading-relaxed font-medium">
                                        Explore our comprehensive library of 150+ algorithmic challenges with multi-language support.
                                    </CardDescription>
                                </CardContent>
                            </Card>
                        </Link>

                        <Link href="/dsa/problems" className="group" onClick={() => handleCtaClick('Company Wise', '/dsa/problems', 'problems_section')}>
                            <Card className="h-full bg-white dark:bg-zinc-900/50 border-gray-100 dark:border-zinc-800 hover:border-blue-500/30 transition-all duration-300 group-hover:shadow-2xl group-hover:shadow-blue-500/5 group-hover:-translate-y-1 overflow-hidden">
                                <CardHeader className="pb-4">
                                    <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center mb-4 border border-blue-500/20 group-hover:bg-blue-500 group-hover:text-white transition-colors duration-300">
                                        <Trophy className="w-6 h-6" />
                                    </div>
                                    <CardTitle className="text-2xl font-medium group-hover:text-blue-500 transition-colors">Company Wise</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <CardDescription className="text-base text-gray-500 dark:text-gray-400 leading-relaxed font-medium">
                                        Target your practice by solving questions asked by top tech companies.
                                    </CardDescription>
                                </CardContent>
                            </Card>
                        </Link>

                        <Link href="/dsa/problems" className="group" onClick={() => handleCtaClick('Topic Wise', '/dsa/problems', 'problems_section')}>
                            <Card className="h-full bg-white dark:bg-zinc-900/50 border-gray-100 dark:border-zinc-800 hover:border-amber-500/30 transition-all duration-300 group-hover:shadow-2xl group-hover:shadow-amber-500/5 group-hover:-translate-y-1 overflow-hidden">
                                <CardHeader className="pb-4">
                                    <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center mb-4 border border-amber-500/20 group-hover:bg-amber-500 group-hover:text-white transition-colors duration-300">
                                        <Layers className="w-6 h-6" />
                                    </div>
                                    <CardTitle className="text-2xl font-medium group-hover:text-amber-500 transition-colors">Topic Wise</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <CardDescription className="text-base text-gray-500 dark:text-gray-400 leading-relaxed font-medium">
                                        Filter and master specific Data Structures and Algorithms categories.
                                    </CardDescription>
                                </CardContent>
                            </Card>
                        </Link>

                        <Link href="/dsa/core" className="group" onClick={() => handleCtaClick('Guides Patterns', '/dsa/core', 'problems_section')}>
                            <Card className="h-full bg-white dark:bg-zinc-900/50 border-gray-100 dark:border-zinc-800 hover:border-orange-500/30 transition-all duration-300 group-hover:shadow-2xl group-hover:shadow-orange-500/5 group-hover:-translate-y-1 overflow-hidden">
                                <CardHeader className="pb-4">
                                    <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center mb-4 border border-orange-500/20 group-hover:bg-orange-500 group-hover:text-white transition-colors duration-300">
                                        <ArrowRight className="w-6 h-6" />
                                    </div>
                                    <CardTitle className="text-2xl font-medium group-hover:text-orange-500 transition-colors">Guides Patterns</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <CardDescription className="text-base text-gray-500 dark:text-gray-400 leading-relaxed font-medium">
                                        Master the essential patterns that form the foundation of technical interviews.
                                    </CardDescription>
                                </CardContent>
                            </Card>
                        </Link>
                    </div>

                    {/* Bottom CTA Button */}
                    <div className="flex justify-center">
                        <Button size="lg" className="rounded-full px-8 py-6 text-base bg-primary hover:bg-primary/90 text-black transition-all hover:scale-105 active:scale-95 shadow-xl shadow-primary/20" asChild>
                            <Link href="/dsa/get-started" onClick={() => handleCtaClick('Explore Practice', '/dsa/get-started', 'problems_section_cta')}>
                                Explore Practice <ArrowRight className="ml-2 w-5 h-5" />
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
}
