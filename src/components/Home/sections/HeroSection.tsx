import { ArrowRight, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

export function HeroSection() {
    return (
        <div className="relative pt-20 pb-4 lg:pt-32 lg:pb-8 overflow-hidden">
            <div className="w-full max-w-[1600px] mx-auto px-4 relative z-10">
                <div className="md:max-w-[80%] mx-auto animate-in fade-in slide-in-from-bottom duration-1000">
                    <h1 className="hero-title mb-8 text-[#1A1A1A] dark:text-white">
                        Everything you need to prepare, practice, and succeed in technical interviews — all in one place.
                    </h1>

                    <div className="hero-subtitle mb-12 max-w-2xl font-medium text-gray-600 dark:text-gray-400">
                        Experience the <span className="text-black dark:text-white underline decoration-[#EAFF96] underline-offset-4">preparation platform</span> engineered to streamline your path to top-tier engineering roles. Built by industry veterans from
                        <div className="flex flex-wrap items-center gap-x-8 gap-y-4 mt-8 opacity-60 grayscale hover:grayscale-0 transition-all duration-500 font- text-xl tracking-tight">
                            <span>Google</span>
                            <span>Amazon</span>
                            <span>Meta</span>
                            <span className="uppercase">Netflix</span>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-6 mb-8">
                        <div className="flex flex-col gap-4">
                            <Button className=" text-black rounded-full bg-primary hover:bg-primary/80 transition-colors " asChild>
                                <Link href="/dsa/get-started">
                                    Get started now <ArrowRight className="ml-2 w-6 h-6" />
                                </Link>
                            </Button>
                            <span className="text-[10px] text-gray-500 font- uppercase tracking-wider opacity-60 text-center">
                                Try the free questions
                            </span>
                        </div>

                        <div className="flex items-center gap-4 border-l border-gray-100 dark:border-zinc-800 pl-8">
                            <div className="text-sm">
                                <div className="font-black text-black dark:text-white text-lg leading-tight tracking-tight font-medium">1k+ users</div>
                                <div className="text-gray-500 flex items-center gap-1 font-">
                                    <BarChart3 className="w-4 h-4 text-orange-500 fill-orange-500" />
                                    Google Analytics verified
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
