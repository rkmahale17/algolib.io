"use client";

import { ArrowRight, PlaySquare, Star } from "lucide-react";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";
import { trackEvent } from "@/lib/analytics";
import { usePostHog } from "@posthog/react";

import { HeroFlowDiagram } from "./HeroFlowDiagram";

export function HeroSection() {
  const posthog = usePostHog();

  return (
    <div className="relative pt-16 pb-16 lg:pt-24 lg:pb-24 overflow-hidden">
      <div className="w-full max-w-[1700px] mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_1.2fr] gap-12 items-center animate-in fade-in slide-in-from-bottom duration-1000">
          
          {/* Left Column: Text Content */}
          <div className="flex flex-col justify-center pl-4 lg:pl-12">
            {/* Pill Tag */}
            <div className="mb-8 inline-flex w-max">
              <div className="px-4 py-1.5 rounded-full border border-primary/30 text-primary text-sm font-medium tracking-wide bg-black/50 backdrop-blur-sm">
                Learn-First Platform
              </div>
            </div>

            {/* Headline */}
            <h1 className="text-5xl lg:text5xl font-medium tracking-tight mb-8 leading-[1.1] text-zinc-900 dark:text-white">
              Don't Just Memorize Code.
              <span className="block text-3xl lg:text-5xl text-gray-500 mt-4 font-semibold">
                See How It Works.
              </span>
            </h1>

            {/* Subheadline with styled links */}
            <div className="text-[17px] text-zinc-600 dark:text-gray-400 mb-12 max-w-xl leading-relaxed">
              <p className="mb-6">
                A learn-first platform for coding interviews.
              </p>
              <p>
                Read the problem,{" "}
                <Link
                  href="#visualization"
                  className="text-zinc-900 dark:text-white underline decoration-primary underline-offset-4 hover:opacity-80 transition-all"
                >
                  Visualize
                </Link>{" "}
                the solution, think through the approach, sketch your ideas in{" "}
                <Link
                  href="#thinkpad"
                  className="text-zinc-900 dark:text-white underline decoration-primary underline-offset-4 hover:opacity-80 transition-all"
                >
                  Thinkpad
                </Link>
                , write{" "}
                <Link
                  href="/problem/kadanes-algorithm"
                  className="text-zinc-900 dark:text-white underline decoration-primary underline-offset-4 hover:opacity-80 transition-all"
                >
                  code
                </Link>
                , and{" "}
                <Link
                  href="/problem/kadanes-algorithm?tab=solution"
                  className="text-zinc-900 dark:text-white underline decoration-primary underline-offset-4 hover:opacity-80 transition-all"
                >
                  review
                </Link>{" "}
                expert solutions.
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
