import { PenTool } from "lucide-react";
import React from "react";

export function ScratchpadSection() {
    return (
        <section className="py-32 bg-[#FAFAFA] dark:bg-[#050505] border-t border-gray-100 dark:border-zinc-900">
            <div className="w-full max-w-[1600px] mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
                    <div className="order-2 lg:order-1">
                        <h2 className="text-4xl md:text-5xl font-medium tracking-tight mb-8 text-gray-900 dark:text-white leading-[1.1]">
                            Stuck in thinking? Try our scratchpad
                        </h2>
                        <p className="text-gray-500 dark:text-gray-400 text-lg mb-10 leading-relaxed font-medium">
                            Sometimes code isn&apos;t enough. Our built-in scratchpad lets you draw, sketch, and map out complex algorithms before you start typing. It&apos;s the perfect tool for when you need to visualize logic that&apos;s hard to hold in your head.
                        </p>
                        <div className="space-y-4">
                            {[
                                "Infinite canvas for free-form sketching",
                                "Built-in aids for common data structures",
                                "Perfect for dry-running tree and graph traversals",
                                "Save and reference your logic while you code"
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-4 text-gray-700 dark:text-gray-300">
                                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20">
                                        <PenTool className="w-3.5 h-3.5 text-primary" />
                                    </div>
                                    <span className="font-medium text-lg tracking-tight">{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="order-1 lg:order-2 aspect-square bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-3xl p-8 shadow-2xl shadow-primary/5 flex flex-col border-dashed border-2 overflow-hidden relative group" role="img" aria-label="Scratchpad drawing canvas placeholder">
                        <div className="flex items-center justify-between mb-8 relative z-10">
                            <div className="flex gap-3">
                                <div className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-zinc-800 border border-gray-100 dark:border-zinc-700 flex items-center justify-center shadow-sm">
                                    <div className="w-4 h-4 rounded-full bg-red-400 opacity-40"></div>
                                </div>
                                <div className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-zinc-800 border border-gray-100 dark:border-zinc-700 flex items-center justify-center shadow-sm">
                                    <div className="w-4 h-4 rounded-full bg-blue-400 opacity-40"></div>
                                </div>
                                <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shadow-sm">
                                    <PenTool className="w-5 h-5 text-primary" />
                                </div>
                            </div>
                            <div className="px-4 py-1.5 bg-gray-100 dark:bg-zinc-800 rounded-full text-[10px] font-bold uppercase tracking-widest text-gray-400">
                                Scratchpad Mode
                            </div>
                        </div>
                        <div className="flex-1 bg-gray-50 dark:bg-zinc-900/50 rounded-2xl relative overflow-hidden p-12 border border-gray-100 dark:border-zinc-800/50">
                            <svg className="w-full h-full text-primary/20 dark:text-primary/10" viewBox="0 0 200 200">
                                <circle cx="100" cy="40" r="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeDasharray="4 2" />
                                <line x1="88" y1="55" x2="60" y2="85" stroke="currentColor" strokeWidth="2.5" />
                                <line x1="112" y1="55" x2="140" y2="85" stroke="currentColor" strokeWidth="2.5" />
                                <circle cx="60" cy="105" r="18" fill="none" stroke="currentColor" strokeWidth="2.5" />
                                <circle cx="140" cy="105" r="18" fill="none" stroke="currentColor" strokeWidth="2.5" />
                                <path d="M 60 123 Q 100 160 140 123" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" className="opacity-50" />
                            </svg>

                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="p-5 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-zinc-700/50 shadow-2xl group-hover:scale-105 transition-transform duration-500">
                                    <div className="flex items-center gap-3">
                                        <div className="w-3 h-3 rounded-full bg-primary animate-pulse"></div>
                                        <p className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                            Visualizing Logic...
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
                    </div>
                </div>
            </div>
        </section>
    );
}
