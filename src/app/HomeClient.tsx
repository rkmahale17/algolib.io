'use client';

import {
  Terminal,
  ArrowRight,
  Globe,
  Trophy,
  Layers,
  Play,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import React from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useApp } from "@/contexts/AppContext";
import { usePostHog } from '@posthog/react';
import { trackEvent } from '@/lib/analytics';
import { motion } from 'framer-motion';

const PlatformPreview = dynamic(() => import("@/components/Home/PlatformPreview"), { ssr: false });

interface HomeClientProps {
  type?: 'platform-preview' | 'interviews' | 'all';
}

export default function HomeClient({ type = 'all' }: HomeClientProps) {
  const { user } = useApp();
  const posthog = usePostHog();

  const handleCtaClick = (label: string, destination: string, section?: string) => {
    trackEvent(posthog, 'home_cta_clicked', { cta_label: label, destination, section });
  };

  return (
    <>
      {(type === 'all' || type === 'platform-preview') && (
        <section className="py-36 lg:py-48 bg-white dark:bg-black text-zinc-900 dark:text-white relative overflow-hidden">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-full max-w-[1500px] mx-auto px-6 relative z-10"
          >
            {/* SECTION HEADER - Left Aligned with inline icon */}
            <div className="max-w-[1400px] mx-auto mb-14 text-left">
              <h2 className="text-2xl sm:text-3xl font-medium tracking-tight mb-4 leading-[1.1] flex items-center gap-3">
                <Terminal className="w-[0.85em] h-[0.85em] text-primary shrink-0" />
                <span>Interactive Code Playground</span>
              </h2>
              <p className="text-zinc-500 dark:text-zinc-400 text-base md:text-lg font-medium leading-relaxed max-w-2xl">
                Experiment with algorithmic structures and step-by-step visualizations in real time directly from your browser.
              </p>
            </div>
            
            <PlatformPreview />
          </motion.div>
        </section>
      )}

      {(type === 'all' || type === 'interviews') && (
        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 z-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none"
            style={{
              backgroundImage: 'linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)',
              backgroundSize: '40px 40px'
            }}></div>

          <div className="w-full max-w-[1600px] mx-auto px-4 relative z-10">
            <Tabs defaultValue="interviews" className="w-full">
              <div className="flex justify-center mb-12">
                <TabsList className="bg-gray-100/50 dark:bg-zinc-900/50 border border-gray-200 dark:border-zinc-800 p-1 rounded-full h-12">
                  <TabsTrigger value="interviews" className="rounded-full px-8 text-base font-medium data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-800 data-[state=active]:shadow-md transition-all">
                    Interviews
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="interviews" className="mt-0 focus-visible:ring-0">
                <div className="max-w-[1400px] mx-auto">
                  <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-medium tracking-tight mb-4 text-gray-900 dark:text-white">
                      DSA
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 text-base md:text-lg max-w-2xl mx-auto font-medium">
                      Master Data Structures & Algorithms with our curated learning paths designed for modern technical interviews.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                    <Link href="/dsa/core" className="group" onClick={() => handleCtaClick('Core Problems', '/dsa/core', 'dsa_grid')}>
                      <Card className="h-full bg-white dark:bg-zinc-900/50 border-gray-100 dark:border-zinc-800 hover:border-primary/30 transition-all duration-300 group-hover:shadow-2xl group-hover:shadow-primary/5 group-hover:-translate-y-1 overflow-hidden">
                        <CardHeader className="pb-4">
                          <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center mb-4 border border-orange-500/20 group-hover:bg-orange-500 group-hover:text-white transition-colors duration-300">
                            <Layers className="w-6 h-6" />
                          </div>
                          <CardTitle className="text-2xl font-medium group-hover:text-orange-500 transition-colors">Core Problems</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <CardDescription className="text-base text-gray-500 dark:text-gray-400 leading-relaxed">
                            Master the 15 essential patterns that form the foundation of almost every technical interview.
                          </CardDescription>
                        </CardContent>
                      </Card>
                    </Link>

                    <Link href="/dsa/blind-75" className="group" onClick={() => handleCtaClick('Blind 75', '/dsa/blind-75', 'dsa_grid')}>
                      <Card className="h-full bg-white dark:bg-zinc-900/50 border-gray-100 dark:border-zinc-800 hover:border-primary/30 transition-all duration-300 group-hover:shadow-2xl group-hover:shadow-primary/5 group-hover:-translate-y-1 overflow-hidden">
                        <CardHeader className="pb-4">
                          <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center mb-4 border border-blue-500/20 group-hover:bg-blue-500 group-hover:text-white transition-colors duration-300">
                            <Trophy className="w-6 h-6" />
                          </div>
                          <CardTitle className="text-2xl font-medium group-hover:text-blue-500 transition-colors">Blind 75</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <CardDescription className="text-base text-gray-500 dark:text-gray-400 leading-relaxed">
                            The definitive list of 75 most essential problems curated for top-tier FAANG preparation.
                          </CardDescription>
                        </CardContent>
                      </Card>
                    </Link>

                    <Link href="/dsa/problems" className="group" onClick={() => handleCtaClick('All Problems', '/dsa/problems', 'dsa_grid')}>
                      <Card className="h-full bg-white dark:bg-zinc-900/50 border-gray-100 dark:border-zinc-800 hover:border-primary/30 transition-all duration-300 group-hover:shadow-2xl group-hover:shadow-primary/5 group-hover:-translate-y-1 overflow-hidden">
                        <CardHeader className="pb-4">
                          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 border border-primary/20 group-hover:bg-primary group-hover:text-black transition-colors duration-300">
                            <Globe className="w-6 h-6" />
                          </div>
                          <CardTitle className="text-2xl font-medium group-hover:text-primary transition-colors">All Problems</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <CardDescription className="text-base text-gray-500 dark:text-gray-400 leading-relaxed">
                            Explore our comprehensive library of 140+ algorithmic challenges with multi-language support.
                          </CardDescription>
                        </CardContent>
                      </Card>
                    </Link>
                  </div>

                  <div className="flex justify-center">
                    <Button size="lg" className="rounded-full px-8 py-6 text-base bg-primary hover:bg-primary/90 text-black transition-all hover:scale-105 active:scale-95 shadow-xl shadow-primary/20" asChild>
                      <Link href="/problems" onClick={() => handleCtaClick('Get Started', '/problems', 'hero_cta')}>
                        Get Started <ArrowRight className="ml-2 w-5 h-5" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>
      )}
    </>
  );
}
