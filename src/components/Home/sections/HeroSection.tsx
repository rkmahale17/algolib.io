"use client";

import { ArrowRight, PlaySquare, Star } from "lucide-react";
import React, { useMemo } from "react";

import { Button } from "@/components/ui/button";
import { HeroFlowDiagram } from "./HeroFlowDiagram";
import Link from "next/link";
import { motion } from "framer-motion";
import { trackEvent } from "@/lib/analytics";
import { useApp } from "@/contexts/AppContext";
import { useAppSelector } from "@/store/hooks";
import { usePostHog } from "@posthog/react";

export function HeroSection() {
  const posthog = usePostHog();
  const { user, hasPremiumAccess } = useApp();
  const { items: algorithms } = useAppSelector((state) => state.algorithms);
  const { data: userProgressData } = useAppSelector(
    (state) => state.userProgress,
  );

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

  const continueBlock =
    user && continueLearningAlgo ? (
      <Link
        href={
          continueLearningAlgo.slug
            ? `/problem/${continueLearningAlgo.slug}`
            : `/problem/${continueLearningAlgo.id}`
        }
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
    ) : null;

  return (
    <div className="relative pt-4 pb-16 lg:pt-8 lg:pb-24 overflow-hidden max-w-[1800px] m-auto">
      <div className="w-full mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_1.2fr] gap-12 items-center">
          {/* Left Column: Text Content */}
          <motion.div
            className="flex flex-col justify-center pl-4 lg:pl-12 "
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
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
                Understand the pattern before you write the{" "}
                <Link
                  href="/problem/kadanes-algorithm"
                  className="text-zinc-900 dark:text-white underline decoration-primary underline-offset-4 hover:opacity-80 transition-all"
                >
                  code
                </Link>{" "}
                — with{" "}
                <Link
                  href="#visualization"
                  className="text-zinc-900 dark:text-white underline decoration-primary underline-offset-4 hover:opacity-80 transition-all"
                >
                  visualizations
                </Link>
                , a{" "}
                <Link
                  href="#thinkpad"
                  className="text-zinc-900 dark:text-white underline decoration-primary underline-offset-4 hover:opacity-80 transition-all"
                >
                  thinkpad
                </Link>{" "}
                to sketch your logic, and 220+ problems.
              </p>

              <div className="pt-6 border-t border-zinc-200 dark:border-white/10">
                <Link href="#testimonials" className="group block">
                  <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-4 group-hover:text-zinc-800 dark:group-hover:text-zinc-200 transition-colors">
                    Join engineers from{" "}
                    <strong className="text-zinc-700 dark:text-zinc-300">
                      Google
                    </strong>
                    ,{" "}
                    <strong className="text-zinc-700 dark:text-zinc-300">
                      Meta
                    </strong>
                    ,{" "}
                    <strong className="text-zinc-700 dark:text-zinc-300">
                      OpenAI
                    </strong>
                    , and top tech companies cracking their coding interviews.
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-white/10 shadow-sm flex items-center justify-center transition-all duration-300 group-hover:shadow-md group-hover:border-zinc-300 dark:group-hover:border-white/20 group-hover:-translate-y-0.5">
                      <img
                        src="/icons/companies/google.svg"
                        alt="Google"
                        className="w-4 h-4 object-contain dark:invert opacity-90 group-hover:opacity-100 transition-opacity"
                      />
                    </div>
                    <div className="w-10 h-10 rounded-full bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-white/10 shadow-sm flex items-center justify-center transition-all duration-300 group-hover:shadow-md group-hover:border-zinc-300 dark:group-hover:border-white/20 group-hover:-translate-y-0.5 delay-[50ms]">
                      <img
                        src="/icons/companies/meta.svg"
                        alt="Meta"
                        className="w-4 h-4 object-contain dark:invert opacity-90 group-hover:opacity-100 transition-opacity"
                      />
                    </div>
                    <div className="w-10 h-10 rounded-full bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-white/10 shadow-sm flex items-center justify-center transition-all duration-300 group-hover:shadow-md group-hover:border-zinc-300 dark:group-hover:border-white/20 group-hover:-translate-y-0.5 delay-[100ms]">
                      <img
                        src="/icons/companies/amazon.svg"
                        alt="Amazon"
                        className="w-4 h-4 object-contain dark:invert opacity-90 group-hover:opacity-100 transition-opacity"
                      />
                    </div>
                    <div className="w-10 h-10 rounded-full bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-white/10 shadow-sm flex items-center justify-center transition-all duration-300 group-hover:shadow-md group-hover:border-zinc-300 dark:group-hover:border-white/20 group-hover:-translate-y-0.5 delay-[150ms]">
                      <img
                        src="/icons/companies/netflix.svg"
                        alt="Netflix"
                        className="w-4 h-4 object-contain dark:invert opacity-90 group-hover:opacity-100 transition-opacity"
                      />
                    </div>
                    <div className="w-10 h-10 rounded-full bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-white/10 shadow-sm flex items-center justify-center transition-all duration-300 group-hover:shadow-md group-hover:border-zinc-300 dark:group-hover:border-white/20 group-hover:-translate-y-0.5 delay-[200ms]">
                      <img
                        src="/icons/companies/microsoft.svg"
                        alt="Microsoft"
                        className="w-4 h-4 object-contain dark:invert opacity-90 group-hover:opacity-100 transition-opacity"
                      />
                    </div>
                  </div>
                </Link>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col items-start gap-4 mb-16 xl:mb-0">
              <div className="flex flex-wrap items-center gap-4">
                <Button
                  size="lg"
                  className="rounded-full px-8 py-6 text-base font-semibold bg-primary hover:bg-primary/90 text-black transition-all hover:scale-105 active:scale-95 shadow-[0_0_30px_hsl(var(--primary)/0.3)]"
                  asChild
                >
                  <Link
                    href="/problems"
                    onClick={() =>
                      trackEvent(posthog, "home_cta_clicked", {
                        cta_label: hasPremiumAccess
                          ? "Practice"
                          : "Practice free",
                        destination: "/problems",
                        section: "hero",
                      })
                    }
                  >
                    {hasPremiumAccess ? "Practice" : "Practice free"}{" "}
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                </Button>

                {!hasPremiumAccess && (
                  <Button
                    size="lg"
                    className="rounded-full px-8 py-6 text-base font-semibold bg-transparent border border-zinc-300 dark:border-white/30 text-zinc-800 dark:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-white/10 transition-all hover:scale-105 active:scale-95 shadow-none"
                    asChild
                  >
                    <Link
                      href="/pricing"
                      onClick={() =>
                        trackEvent(posthog, "home_cta_clicked", {
                          cta_label: "Go Pro",
                          destination: "/pricing",
                          section: "hero",
                        })
                      }
                    >
                      Go Pro
                    </Link>
                  </Button>
                )}

                {hasPremiumAccess && continueBlock}
              </div>

              {!hasPremiumAccess && continueBlock}
            </div>
          </motion.div>

          {/* Right Column: Interactive Diagram */}
          <div className="hidden lg:flex items-center justify-center relative w-full h-[800px] mt-10 xl:mt-0">
            <HeroFlowDiagram />
          </div>
        </div>
      </div>
    </div>
  );
}
