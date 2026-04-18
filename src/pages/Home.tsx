"use client";
import {
  Sparkles,
  Zap,
  Terminal,
  Play,
  ArrowRight,
  Github,
  Globe,
  Eye,
  Lightbulb,
  Trophy,
  Keyboard,
  ExternalLink,
  Layers,
  Check,
  MessageCircle,
  BarChart3,
  Star,
  Users,
  Layout,
  Globe2,
  Lock,
  MessageSquare,
  Mail,
  Linkedin,
  Twitter,
  PenTool,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import React, { lazy, Suspense, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FAQ } from "@/components/FAQ";
import { FeaturedSection } from "@/components/FeaturedSection";
import { Footer } from "@/components/Footer";
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
import { Helmet } from "react-helmet-async";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useApp } from "@/contexts/AppContext";
import { Loader2 } from "lucide-react";
import Script from "next/script";

const PlatformPreview = lazy(() => import("@/components/Home/PlatformPreview"));

const Home = () => {
  const { user } = useApp();

  return (
    <>
      <Helmet>
        <title>
          RulCode - Master Competitive Programming & Technical Interviews |
          Free & Open Source
        </title>
        <meta
          name="description"
          content="Accelerate your FAANG preparation with interactive visualizations, code execution in 4+ languages, and multi-approach solutions. Master Blind 75 and 200+ algorithms visually."
        />
        <meta
          name="keywords"
          content="competitive programming, leetcode, coding interviews, faang preparation, algorithm visualization, code runner, open source coding"
        />
        <link rel="canonical" href="https://rulcode.com/" />

        {/* Open Graph */}
        <meta
          property="og:title"
          content="RulCode - Master Competitive Programming & Technical Interviews"
        />
        <meta
          property="og:description"
          content="Interactive visualizations, integrated code runner, and multi-approach solutions in 4+ languages. Master Blind 75 and 200+ algorithms visually."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://rulcode.com/" />
        <meta property="og:image" content="https://rulcode.com/og-image.png" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="RulCode - Master Algorithms & Solve Visually"
        />
        <meta
          name="twitter:description"
          content="Free interactive algorithm visualizations and integrated code runner for FAANG interview preparation."
        />
        <meta name="twitter:image" content="https://rulcode.com/og-image.png" />
      </Helmet>

      <Script
        id="legacy-home-json-ld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "RulCode",
            url: "https://rulcode.com",
            description: "Interactive competitive coding and algorithm visualization platform",
          })
        }}
      />

      <div className="min-h-screen bg-white dark:bg-black text-[#1A1A1A] dark:text-white">
        {/* Hero Section */}
        <div className="relative pt-20 pb-4 lg:pt-32 lg:pb-8 overflow-hidden">
          <div className="container mx-auto px-4 relative z-10">
            <div className="md:max-w-[80%] mx-auto animate-in fade-in slide-in-from-bottom duration-1000">
              {/* Removed pill-badge as requested */}

              <h1 className="hero-title mb-8">
                Everything you need to prepare, practice, and succeed in technical interviews — all in one place.
              </h1>

              <div className="hero-subtitle mb-12 max-w-2xl font-medium">
                Experience the <span className="font- text-black dark:text-white underline decoration-[#EAFF96] underline-offset-4">preparation platform</span> engineered to streamline your path to top-tier engineering roles. Built by industry veterans from
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
                    <Link to="/dsa/get-started">
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

        {/* Hero Graphic Section */}
        {/* Platform Preview Section */}
        <section className="mb-16 overflow-hidden">
          <Suspense
            fallback={
              <div className="container mx-auto px-4">
                <div className="w-full md:w-[80%] mx-auto h-[600px] bg-gray-50 dark:bg-[#0A0A0A] border border-gray-100 dark:border-zinc-800 flex items-center justify-center">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              </div>
            }
          >
            <PlatformPreview />
          </Suspense>
        </section>

        {/* Interviews Section */}
        <section className="py-24 relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 z-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none" 
               style={{ 
                 backgroundImage: 'linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)', 
                 backgroundSize: '40px 40px' 
               }}></div>
          
          <div className="container mx-auto px-4 relative z-10">
            <Tabs defaultValue="interviews" className="w-full">
              <div className="flex justify-center mb-12">
                <TabsList className="bg-gray-100/50 dark:bg-zinc-900/50 border border-gray-200 dark:border-zinc-800 p-1 rounded-full h-12">
                  <TabsTrigger value="interviews" className="rounded-full px-8 text-base font-medium data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-800 data-[state=active]:shadow-md transition-all">
                    Interviews
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="interviews" className="mt-0 focus-visible:ring-0">
                <div className="max-w-6xl mx-auto">
                  <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-medium tracking-tight mb-4 text-gray-900 dark:text-white">
                      DSA
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 text-lg max-w-2xl mx-auto font-medium">
                      Master Data Structures & Algorithms with our curated learning paths designed for modern technical interviews.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                    {/* Core Problems Card */}
                    <Link to="/dsa/core" className="group">
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

                    {/* Blind 75 Card */}
                    <Link to="/dsa/blind75" className="group">
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

                    {/* All Problems Card */}
                    <Link to="/dsa/problems" className="group">
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
                      <Link to="/dsa/get-started">
                        Get Started <ArrowRight className="ml-2 w-5 h-5" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* Crafting Section */}
        <div className="py-32 bg-white dark:bg-black border-y border-gray-100 dark:border-zinc-900">
          <div className="container mx-auto px-4 text-center max-w-5xl">
            <h2 className="text-3xl md:text-3xl font-medium font-black mb-20 text-gray-900 dark:text-white leading-[1.1] tracking-tight">
              We're crafting <span className="inline-block px-4 py-1 bg-[#EAFF96] text-black">rulcode.com</span> with<br />passion, precision and quality.
            </h2>

            <div className="bg-white dark:bg-zinc-900 p-12 md:p-20 border-[1px] border-gray-100 dark:border-zinc-800 text-left max-w-4xl mx-auto relative overflow-hidden group">
              <div className="relative z-10">
                <div className="text-gray-800 dark:text-gray-200 mb-16 text-xl md:text-xl leading-relaxed font- tracking-tight">
                  <span className="text-[#EAFF96] text-xl block mb-6">"</span>
                  Over my career, I have conducted hundreds of technical interviews and have personally received multiple offers from leading technology companies. Through these experiences, I have gained a deep understanding of the challenges engineers face when preparing for technical interviews.                  <br /><br />
                  Rulcode.com is the culmination of this experience and knowledge, created to help fellow engineers prepare efficiently and confidently for technical interviews.

                </div>


              </div>
            </div>
          </div>
        </div>







        {/* Block 1: Expert Authors */}
        <section className="py-24 bg-[#FAFAFA] dark:bg-[#050505]">
          <div className="container mx-auto px-4 max-w-6xl">
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

        {/* Block 2: Interactive Playground */}
        <section className="py-24 bg-white dark:bg-black">
          <div className="container mx-auto px-4 max-w-6xl">
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

        {/* Block 5: Scratchpad Visualization */}
        <section className="py-32 bg-[#FAFAFA] dark:bg-[#050505] border-t border-gray-100 dark:border-zinc-900">
          <div className="container mx-auto px-4 max-w-6xl">
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
                  {/* Drawing Simulation */}
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

                {/* Decorative dots for scratchpad feel */}
                <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
              </div>
            </div>
          </div>
        </section>


        {/* Block 3: Confidence through Testing */}
        <section className="py-24 bg-[#FAFAFA] dark:bg-[#050505] border-y border-gray-100 dark:border-zinc-900">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-4xl md:text-5xl font-medium tracking-tight mb-8 text-gray-900 dark:text-white">
                  Instant Feedback & Complexity Analysis
                </h2>
                <p className="text-gray-500 dark:text-gray-400 text-lg mb-10 leading-relaxed font-medium">
                  Go beyond simple correctness. RulCode analyzes your implementation in real-time, helping you optimize for both time and space complexity.
                </p>
                <div className="space-y-4">
                  {[
                    "Automated test suites for every problem",
                    "Real-time complexity estimations",
                    "Detailed edge-case diagnostics",
                    "Multi-language support for all solutions"
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-4 text-gray-700 dark:text-gray-300">
                      <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20">
                        <Check className="w-3.5 h-3.5 text-primary" />
                      </div>
                      <span className="font-medium text-lg tracking-tight">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="aspect-square bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl p-6 shadow-2xl shadow-primary/5 flex items-center justify-center border-dashed border-2" role="img" aria-label="Automated testing interface placeholder">
                <div className="w-full h-full bg-gray-50 dark:bg-zinc-800/50 rounded-xl flex flex-col p-8 border border-gray-100 dark:border-zinc-800">
                  <div className="w-2/3 h-5 bg-gray-200 dark:bg-zinc-700 rounded mb-10"></div>
                  <div className="space-y-5">
                    <div className="flex items-center gap-4">
                      <div className="w-5 h-5 rounded-full bg-green-500/20 border border-green-500/30"></div>
                      <div className="w-full h-3 bg-gray-200/50 dark:bg-zinc-800 rounded"></div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-5 h-5 rounded-full bg-green-500/20 border border-green-500/30"></div>
                      <div className="w-5/6 h-3 bg-gray-200/50 dark:bg-zinc-800 rounded"></div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-5 h-5 rounded-full bg-primary/20 border border-primary/30"></div>
                      <div className="w-4/6 h-3 bg-gray-200/50 dark:bg-zinc-800 rounded"></div>
                    </div>
                  </div>
                  <div className="mt-auto flex justify-end">
                    <div className="w-20 h-8 bg-primary/20 rounded-md border border-primary/30"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Block 4: Community & Support */}
        <section className="py-24 bg-white dark:bg-black">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-32">
              <div>
                <h2 className="text-4xl md:text-5xl font-medium tracking-tight mb-8 text-gray-900 dark:text-white leading-[1.1]">
                  Join our growing community
                </h2>
                <p className="text-gray-500 dark:text-gray-400 text-xl font-medium leading-relaxed">
                  Have questions or feedback? We&apos;re building RulCode for you. Join our social platforms and help us shape the future of tech prep.
                </p>
              </div>

              <div className="divide-y divide-gray-100 dark:divide-zinc-900 border-t border-gray-100 dark:border-zinc-900">
                {[
                  { name: "Email us", icon: Mail, link: "mailto:support@rulcode.com" },
                  { name: "Join Discord", icon: MessageCircle, link: "https://discord.gg/DKvKSc7T" },
                  { name: "Follow our LinkedIn", icon: Linkedin, link: "https://www.linkedin.com/company/rulcode" },
                  { name: "Follow us on X", icon: Twitter, link: "https://x.com/YutiloInc" },
                  { name: "GitHub Repository", icon: Github, link: "https://github.com/rkmahale17/learn-algo-animate" },
                ].map((item, i) => (
                  <a key={i} href={item.link} className="group flex items-center justify-between py-8 transition-all hover:pl-2">
                    <div className="flex items-center gap-6">
                      <div className="w-12 h-12 rounded-xl bg-gray-50 dark:bg-zinc-900 flex items-center justify-center border border-gray-100 dark:border-zinc-800 group-hover:border-primary/30 group-hover:bg-primary/5 transition-all">
                        <item.icon className="w-6 h-6 text-gray-400 group-hover:text-primary transition-colors" />
                      </div>
                      <span className="text-xl font-medium text-gray-900 dark:text-white group-hover:text-primary transition-colors tracking-tight">{item.name}</span>
                    </div>
                    <ArrowRight className="w-6 h-6 text-gray-300 group-hover:text-primary transition-all group-hover:translate-x-2" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Final Tagline */}


        <div className="py-24 bg-white dark:bg-black text-center border-t border-gray-100 dark:border-zinc-900">
          <div className="container mx-auto px-4">
            <h3 className="text-3xl">
              Your dream job is <span className="text-primary">absolute worth it !</span>
            </h3>
          </div>
        </div>

        {/* FAQ Section */}
        <FAQ />

        <Footer />
      </div>
    </>
  );
};

export default Home;
