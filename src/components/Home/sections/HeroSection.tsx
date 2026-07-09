"use client";

import { ArrowRight, PlaySquare, Star } from "lucide-react";

import { Button } from "@/components/ui/button";
import { HeroFlowDiagram } from "./HeroFlowDiagram";
import Link from "next/link";
import React, { useMemo } from "react";
import { trackEvent } from "@/lib/analytics";
import { usePostHog } from "@posthog/react";
import { useApp } from "@/contexts/AppContext";
import { useAppSelector } from "@/store/hooks";

export function HeroSection() {
  const posthog = usePostHog();
  const { user } = useApp();
  const { items: algorithms } = useAppSelector((state) => state.algorithms);
  const { data: userProgressData } = useAppSelector((state) => state.userProgress);

  const continueLearningAlgo = useMemo(() => {
    if (!userProgressData || userProgressData.length === 0) return null;
    const sorted = [...userProgressData].sort((a, b) => {
      const timeA = new Date(a.last_viewed_at || a.updated_at).getTime();
      const timeB = new Date(b.last_viewed_at || b.updated_at).getTime();
      return timeB - timeA;
    });
    const incomplete = sorted.find((p) => !p.completed);
    const target = incomplete || sorted[0];
    if (!target) return null;
    return algorithms.find((a) => a.id === target.algorithm_id) || null;
  }, [userProgressData, algorithms]);

  return (
    <div className="relative pt-16 pb-16 lg:pt-24 lg:pb-24 overflow-hidden">
      <div className="w-full max-w-[1700px] mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_1.2fr] gap-12 items-center animate-in fade-in slide-in-from-bottom duration-1000">
          {/* Left Column: Text Content */}
          <div className="flex flex-col justify-center pl-4 lg:pl-12 ">
            {/* Top Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 w-[200px] rounded-full bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 mb-8 backdrop-blur-md">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-sm font-medium text-primary">
                Learn-First Platform
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-5xl lg:text5xl font-medium tracking-tight mb-8 leading-[1.1] text-zinc-900 dark:text-white">
              Don't practice solutions.
              <span className="block text-3xl lg:text-5xl text-primary mt-4 font-semibold">
                Practice thinking.
              </span>
            </h1>

            {/* Subheadline with styled links */}
            <div className="text-[17px] text-zinc-600 dark:text-gray-400 mb-12 max-w-xl leading-relaxed">
              <p className="mb-6">
                <strong>A learn-first platform for coding interviews.</strong> The ultimate <strong>Data Structures</strong> and <strong>Algorithms</strong> platform for your next <strong>Coding Interview</strong>. Master <strong>LeetCode</strong> patterns with our <strong>Interactive Visualizations</strong>.
              </p>
              <p className="mb-6">
                Conquer <strong>Blind 75</strong> and <strong>Rulcode 150</strong>. From basic arrays to advanced <strong>Dynamic Programming</strong> and <strong>Graph Algorithms</strong>, prepare effectively for tech interviews and <strong>Competitive Programming</strong>.
              </p>
              <p>
                Read the problem,{" "}
                <Link
                  href="#visualization"
                  className="text-zinc-900 dark:text-white underline decoration-primary underline-offset-4 hover:opacity-80 transition-all"
                >
                  Visualize
                </Link>{" "}
                the solution, sketch your ideas in{" "}
                <Link
                  href="#thinkpad"
                  className="text-zinc-900 dark:text-white underline decoration-primary underline-offset-4 hover:opacity-80 transition-all"
                >
                  Thinkpad
                </Link>
                , and{" "}
                <Link
                  href="/problem/kadanes-algorithm"
                  className="text-zinc-900 dark:text-white underline decoration-primary underline-offset-4 hover:opacity-80 transition-all"
                >
                  code
                </Link>
                .
              </p>
            </div>

            {/* Buttons */}
            <div className="flex flex-wrap items-center gap-4 mb-16 xl:mb-0">
              <Button
                size="lg"
                className="rounded-full px-8 py-6 text-base font-semibold bg-primary hover:bg-primary/90 text-black transition-all hover:scale-105 active:scale-95 shadow-[0_0_30px_hsl(var(--primary)/0.3)]"
                asChild
              >
                <Link
                  href="/dsa/get-started"
                  onClick={() =>
                    trackEvent(posthog, "home_cta_clicked", {
                      cta_label: "Start Learning",
                      destination: "/dsa/get-started",
                      section: "hero",
                    })
                  }
                >
                  Start Learning <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>

              {user && continueLearningAlgo && (
                <Link
                  href={continueLearningAlgo.slug ? `/problem/${continueLearningAlgo.slug}` : `/problem/${continueLearningAlgo.id}`}
                  onClick={() =>
                    trackEvent(posthog, "home_cta_clicked", {
                      cta_label: "Continue Learning Box",
                      destination: continueLearningAlgo.slug || continueLearningAlgo.id,
                      section: "hero",
                    })
                  }
                  className="flex items-center gap-4 px-5 py-3 rounded-xl bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800/80 hover:border-primary/40 transition-all hover:shadow-[0_0_20px_rgba(var(--primary-rgb),0.1)] group max-w-[280px]"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-bold text-primary tracking-wider mb-0.5">
                      Continue
                    </p>
                    <p className="text-sm font-semibold text-zinc-900 dark:text-white truncate">
                      {continueLearningAlgo.title || continueLearningAlgo.name}
                    </p>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-black transition-all shrink-0">
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </Link>
              )}
            </div>
          </div>

          {/* Right Column: Interactive Diagram */}
          <div className="hidden lg:flex items-center justify-center relative w-full h-[800px] mt-10 xl:mt-0">
            <HeroFlowDiagram />
          </div>
        </div>
      </div>
    </div>
  );
}
