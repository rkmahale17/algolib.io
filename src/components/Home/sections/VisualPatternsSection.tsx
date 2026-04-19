import { Github, Globe } from "lucide-react";
import React from "react";

export function VisualPatternsSection() {
    return (
        <section className="py-24 bg-[#FAFAFA] dark:bg-[#050505]">
            <div className="w-full max-w-[1600px] mx-auto px-4">
                <div className="mb-16">
                    <h2 className="text-4xl md:text-5xl font-medium tracking-tight mb-6 text-gray-900 dark:text-white max-w-2xl">
                        Master algorithms with visual patterns
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 text-lg max-w-2xl font-medium">
                        Our platform is designed to take you from basic data structures to advanced algorithmic patterns, with every step visualized for maximum clarity.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white dark:bg-zinc-900/50 border border-gray-100 dark:border-zinc-800 rounded-xl p-8 transition-all hover:border-primary/30">
                        <div className="aspect-video bg-gray-50 dark:bg-zinc-800/50 rounded-lg mb-8 flex items-center justify-center border border-dashed border-gray-200 dark:border-zinc-700" role="img" aria-label="Expert badges placeholder">
                            <div className="flex gap-4">
                                <div className="w-12 h-12 rounded-full border border-gray-200 dark:border-zinc-700 flex items-center justify-center text-xl font-bold bg-white dark:bg-zinc-900">G</div>
                                <div className="w-12 h-12 rounded-full border border-gray-200 dark:border-zinc-700 flex items-center justify-center text-xl font-bold bg-white dark:bg-zinc-900">∞</div>
                                <div className="w-12 h-12 rounded-full border border-gray-200 dark:border-zinc-700 flex items-center justify-center text-xl font-bold bg-white dark:bg-zinc-900">a</div>
                            </div>
                        </div>
                        <p className="text-gray-900 dark:text-white font-medium text-lg leading-snug">
                            Designed for deep understanding of algorithmic complexities
                        </p>
                    </div>

                    <div className="bg-white dark:bg-zinc-900/50 border border-gray-100 dark:border-zinc-800 rounded-xl p-8 transition-all hover:border-primary/30">
                        <div className="aspect-video bg-gray-50 dark:bg-zinc-800/50 rounded-lg mb-8 flex items-center justify-center border border-dashed border-gray-200 dark:border-zinc-700" role="img" aria-label="Algorithm playbook placeholder">
                            <div className="w-24 h-12 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded flex items-center justify-center text-xs font-bold uppercase tracking-widest text-primary">Blind 75</div>
                        </div>
                        <p className="text-gray-900 dark:text-white font-medium text-lg leading-snug">
                            Comprehensive coverage of top-tier interview patterns
                        </p>
                    </div>

                    <div className="bg-white dark:bg-zinc-900/50 border border-gray-100 dark:border-zinc-800 rounded-xl p-8 transition-all hover:border-primary/30">
                        <div className="aspect-video bg-gray-50 dark:bg-zinc-800/50 rounded-lg mb-8 flex items-center justify-center border border-dashed border-gray-200 dark:border-zinc-700" role="img" aria-label="Open source contributions placeholder">
                            <div className="flex gap-2 text-gray-400">
                                <Github className="w-8 h-8 opacity-40" />
                                <Globe className="w-8 h-8 opacity-40" />
                            </div>
                        </div>
                        <p className="text-gray-900 dark:text-white font-medium text-lg leading-snug">
                            Active contributors to the open-source competitive coding community
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
