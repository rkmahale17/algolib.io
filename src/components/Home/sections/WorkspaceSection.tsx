import React from "react";

export function WorkspaceSection() {
    return (
        <section className="py-24 bg-white dark:bg-black">
            <div className="w-full max-w-[1600px] mx-auto px-4">
                <div className="mb-16">
                    <h2 className="text-4xl md:text-5xl font-medium tracking-tight mb-6 text-gray-900 dark:text-white max-w-2xl">
                        Interactive Coding Workspace
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 text-lg max-w-2xl font-medium">
                        A seamless environment to write, debug, and visualize your code in real-time, built for the modern developer.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="border border-gray-100 dark:border-zinc-800 rounded-xl p-8 transition-all hover:border-primary/30">
                        <div className="aspect-video bg-gray-50 dark:bg-zinc-800/50 rounded-lg mb-8 flex flex-col items-center justify-center border border-dashed border-gray-200 dark:border-zinc-700" role="img" aria-label="Code runner interface placeholder">
                            <div className="w-32 h-20 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-md shadow-sm p-2 flex flex-col justify-between">
                                <div>
                                    <div className="w-full h-1 bg-gray-100 dark:bg-zinc-800 mb-1 rounded"></div>
                                    <div className="w-3/4 h-1 bg-gray-100 dark:bg-zinc-800 mb-1 rounded"></div>
                                    <div className="w-1/2 h-1 bg-primary/20 mb-3 rounded"></div>
                                </div>
                                <div className="w-8 h-2 bg-primary rounded-sm self-end"></div>
                            </div>
                        </div>
                        <p className="text-gray-900 dark:text-white font-medium text-lg leading-snug">
                            Integrated code runner with instant feedback and test previews
                        </p>
                    </div>

                    <div className="border border-gray-100 dark:border-zinc-800 rounded-xl p-8 transition-all hover:border-primary/30">
                        <div className="aspect-video bg-gray-50 dark:bg-zinc-800/50 rounded-lg mb-8 flex items-end justify-center gap-1 border border-dashed border-gray-200 dark:border-zinc-700 pb-4" role="img" aria-label="Interactive visualizer placeholder">
                            <div className="w-2 h-8 bg-primary rounded-t-sm opacity-60"></div>
                            <div className="w-2 h-12 bg-primary rounded-t-sm"></div>
                            <div className="w-2 h-6 bg-primary rounded-t-sm opacity-80"></div>
                            <div className="w-2 h-10 bg-primary rounded-t-sm opacity-40"></div>
                        </div>
                        <p className="text-gray-900 dark:text-white font-medium text-lg leading-snug">
                            Interactive visualizations that sync with your code execution
                        </p>
                    </div>

                    <div className="border border-gray-100 dark:border-zinc-800 rounded-xl p-8 transition-all hover:border-primary/30">
                        <div className="aspect-video bg-gray-50 dark:bg-zinc-800/50 rounded-lg mb-8 flex items-center justify-center border border-dashed border-gray-200 dark:border-zinc-700" role="img" aria-label="Pro-grade editor placeholder">
                            <div className="flex flex-col gap-1 w-24">
                                <div className="h-1 w-full bg-gray-300 dark:bg-zinc-600 rounded-full opacity-50"></div>
                                <div className="h-1 w-3/4 bg-gray-300 dark:bg-zinc-600 rounded-full opacity-50"></div>
                                <div className="h-1 w-5/6 bg-primary/40 rounded-full"></div>
                            </div>
                        </div>
                        <p className="text-gray-900 dark:text-white font-medium text-lg leading-snug">
                            Pro-grade editor with syntax highlighting and custom shortcuts
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
