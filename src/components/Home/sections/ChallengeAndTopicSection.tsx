"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { usePostHog } from "@posthog/react";
import { trackEvent } from "@/lib/analytics";
import {
  Brain,
  Trophy,
  Target,
  Layers,
  ArrowRight,
  Sparkles,
  Zap,
  Compass,
  Award,
  Globe,
  TrendingUp,
  Activity,
  Shield,
  CheckCircle2,
  Calendar,
  Building2,
  Flame,
  LayoutGrid,
  Check,
  Lock,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CompanyIcon } from "@/components/CompanyIcon";

// Top companies metadata
const TOP_TRACK_COMPANIES = [
  { name: "Google", slug: "google", count: 42, color: "hover:shadow-[0_0_20px_rgba(66,133,244,0.15)] hover:border-blue-500/30" },
  { name: "Meta", slug: "meta", count: 38, color: "hover:shadow-[0_0_20px_rgba(24,119,242,0.15)] hover:border-[#1877F2]/30" },
  { name: "Amazon", slug: "amazon", count: 45, color: "hover:shadow-[0_0_20px_rgba(255,153,0,0.15)] hover:border-amber-500/30" },
  { name: "Microsoft", slug: "microsoft", count: 32, color: "hover:shadow-[0_0_20px_rgba(0,164,239,0.15)] hover:border-teal-500/30" },
  { name: "Netflix", slug: "netflix", count: 18, color: "hover:shadow-[0_0_20px_rgba(229,9,20,0.15)] hover:border-red-500/30" },
  { name: "Apple", slug: "apple", count: 24, color: "hover:shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:border-zinc-500/30" },
  { name: "Uber", slug: "uber", count: 22, color: "hover:shadow-[0_0_20px_rgba(0,0,0,0.3)] hover:border-black/30" },
  { name: "Spotify", slug: "spotify", count: 15, color: "hover:shadow-[0_0_20px_rgba(30,215,96,0.15)] hover:border-green-500/30" }
];

// Interactive 7-Day Bootcamp Timeline Days
const BOOTCAMP_DAYS = [
  { day: 1, title: "Arrays & Hashing", status: "completed" },
  { day: 2, title: "Two Pointers", status: "completed" },
  { day: 3, title: "Sliding Window", status: "active" },
  { day: 4, title: "Trees & Graphs", status: "locked" },
  { day: 5, title: "Heap & Stack", status: "locked" },
  { day: 6, title: "Dynamic Prog.", status: "locked" },
  { day: 7, title: "Mock Assessment", status: "locked" }
];

interface TopicNode {
  name: string;
  count: number;
  icon: any;
  colorClass: string;
  bgClass: string;
  glowColor: string;
}

const TOPIC_NODES: TopicNode[] = [
  {
    name: "Arrays & Hashing",
    count: 12,
    icon: Layers,
    colorClass: "text-orange-500 dark:text-orange-400",
    bgClass: "from-orange-500/10 to-amber-500/10 dark:from-orange-500/5 dark:to-amber-500/5",
    glowColor: "rgba(249,115,22,0.1)"
  },
  {
    name: "Two Pointers",
    count: 8,
    icon: Compass,
    colorClass: "text-blue-500 dark:text-blue-400",
    bgClass: "from-blue-500/10 to-indigo-500/10 dark:from-blue-500/5 dark:to-indigo-500/5",
    glowColor: "rgba(59,130,246,0.1)"
  },
  {
    name: "Sliding Window",
    count: 6,
    icon: Zap,
    colorClass: "text-yellow-600 dark:text-yellow-400",
    bgClass: "from-yellow-500/10 to-amber-500/10 dark:from-yellow-500/5 dark:to-amber-500/5",
    glowColor: "rgba(234,179,8,0.1)"
  },
  {
    name: "Stack",
    count: 7,
    icon: Layers,
    colorClass: "text-purple-500 dark:text-purple-400",
    bgClass: "from-purple-500/10 to-pink-500/10 dark:from-purple-500/5 dark:to-pink-500/5",
    glowColor: "rgba(168,85,247,0.1)"
  },
  {
    name: "Binary Search",
    count: 9,
    icon: Target,
    colorClass: "text-emerald-500 dark:text-emerald-400",
    bgClass: "from-emerald-500/10 to-teal-500/10 dark:from-emerald-500/5 dark:to-teal-500/5",
    glowColor: "rgba(16,185,129,0.1)"
  },
  {
    name: "Linked List",
    count: 8,
    icon: Activity,
    colorClass: "text-cyan-500 dark:text-cyan-400",
    bgClass: "from-cyan-500/10 to-blue-500/10 dark:from-cyan-500/5 dark:to-blue-500/5",
    glowColor: "rgba(6,182,212,0.1)"
  },
  {
    name: "Trees",
    count: 15,
    icon: Globe,
    colorClass: "text-rose-500 dark:text-rose-400",
    bgClass: "from-rose-500/10 to-red-500/10 dark:from-rose-500/5 dark:to-red-500/5",
    glowColor: "rgba(244,63,94,0.1)"
  },
  {
    name: "Heap / Priority Queue",
    count: 6,
    icon: Trophy,
    colorClass: "text-violet-500 dark:text-violet-400",
    bgClass: "from-violet-500/10 to-indigo-500/10 dark:from-violet-500/5 dark:to-indigo-500/5",
    glowColor: "rgba(139,92,246,0.1)"
  },
  {
    name: "Backtracking",
    count: 9,
    icon: Sparkles,
    colorClass: "text-fuchsia-500 dark:text-fuchsia-400",
    bgClass: "from-fuchsia-500/10 to-pink-500/10 dark:from-fuchsia-500/5 dark:to-pink-500/5",
    glowColor: "rgba(217,70,239,0.1)"
  },
  {
    name: "Tries",
    count: 4,
    icon: Award,
    colorClass: "text-sky-500 dark:text-sky-400",
    bgClass: "from-sky-500/10 to-blue-500/10 dark:from-sky-500/5 dark:to-blue-500/5",
    glowColor: "rgba(14,165,233,0.1)"
  },
  {
    name: "Graphs",
    count: 14,
    icon: Globe,
    colorClass: "text-indigo-500 dark:text-indigo-400",
    bgClass: "from-indigo-500/10 to-purple-500/10 dark:from-indigo-500/5 dark:to-purple-500/5",
    glowColor: "rgba(99,102,241,0.1)"
  },
  {
    name: "Advanced Graphs",
    count: 6,
    icon: Brain,
    colorClass: "text-red-500 dark:text-red-400",
    bgClass: "from-red-500/10 to-orange-500/10 dark:from-red-500/5 dark:to-orange-500/5",
    glowColor: "rgba(239,68,68,0.1)"
  },
  {
    name: "1-D Dynamic Programming",
    count: 13,
    icon: TrendingUp,
    colorClass: "text-green-500 dark:text-green-400",
    bgClass: "from-green-500/10 to-emerald-500/10 dark:from-green-500/5 dark:to-emerald-500/5",
    glowColor: "rgba(34,197,94,0.1)"
  },
  {
    name: "2-D Dynamic Programming",
    count: 9,
    icon: Layers,
    colorClass: "text-blue-500 dark:text-blue-400",
    bgClass: "from-blue-500/10 to-cyan-500/10 dark:from-blue-500/5 dark:to-cyan-500/5",
    glowColor: "rgba(59,130,246,0.1)"
  },
  {
    name: "Greedy",
    count: 8,
    icon: Sparkles,
    colorClass: "text-amber-500 dark:text-amber-400",
    bgClass: "from-amber-500/10 to-yellow-500/10 dark:from-amber-500/5 dark:to-yellow-500/5",
    glowColor: "rgba(245,158,11,0.1)"
  },
  {
    name: "Intervals",
    count: 6,
    icon: Activity,
    colorClass: "text-violet-500 dark:text-violet-400",
    bgClass: "from-violet-500/10 to-purple-500/10 dark:from-violet-500/5 dark:to-purple-500/5",
    glowColor: "rgba(139,92,246,0.1)"
  },
  {
    name: "Math & Geometry",
    count: 8,
    icon: Shield,
    colorClass: "text-orange-500 dark:text-orange-400",
    bgClass: "from-orange-500/10 to-red-500/10 dark:from-orange-500/5 dark:to-red-500/5",
    glowColor: "rgba(249,115,22,0.1)"
  },
  {
    name: "Bit Manipulation",
    count: 7,
    icon: Zap,
    colorClass: "text-teal-500 dark:text-teal-400",
    bgClass: "from-teal-500/10 to-cyan-500/10 dark:from-teal-500/5 dark:to-cyan-500/5",
    glowColor: "rgba(20,184,166,0.1)"
  }
];

export function ChallengeAndTopicSection() {
  const posthog = usePostHog();
  const [hoveredNode, setHoveredNode] = useState<number | null>(null);

  const handleCtaClick = (label: string, destination: string, section: string) => {
    trackEvent(posthog, "home_cta_clicked", {
      cta_label: label,
      destination,
      section
    });
  };

  return (
    <section className="py-28 relative overflow-hidden bg-black text-white">
      {/* Dynamic Background Glowing Orbs */}
      <div className="absolute top-1/4 left-10 w-[400px] h-[400px] rounded-full bg-[#EAFF96]/5 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-10 w-[500px] h-[500px] rounded-full bg-primary/5 blur-[150px] pointer-events-none"></div>

      {/* Grid Canvas Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#111_1px,transparent_1px),linear-gradient(to_bottom,#111_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none opacity-40"></div>

      <div className="w-full max-w-[1500px] mx-auto px-6 relative z-10">

        {/* SECTION HEADER - Sleek Typography */}
        <div className="max-w-[1400px] mx-auto mb-24 text-left">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#EAFF96]/10 border border-[#EAFF96]/20 text-xs font-bold text-[#EAFF96] mb-6 tracking-wide uppercase"
          >
            <Flame className="w-3.5 h-3.5 fill-[#EAFF96] animate-pulse" /> Sprints & Categories
          </motion.div>

          <h2 className="text-2xl sm:text-3xl font-medium tracking-tight mb-6 leading-[1.1]">
            Launch Your <span className="bg-gradient-to-r from-primary via-[#EAFF96] to-[#A3E635] bg-clip-text text-transparent">DSA Mastery</span>
          </h2>

          <p className="text-zinc-400 text-base md:text-xl font-medium leading-relaxed max-w-2xl">
            Experience high-octane interview sprints, targeted corporate practice maps, and connected roadmaps designed to wow modern developers.
          </p>
        </div>

        {/* 2-COLUMN PREMIUM CHALLENGES ROW */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-32 max-w-[1400px] mx-auto">

          {/* CARD A: 7-DAY BLIND 75 SPRINT (HIGH VISUAL DASHBOARD) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="lg:col-span-6 group relative"
          >
            {/* Glowing active outline */}
            <div className="absolute -inset-[1.5px] bg-gradient-to-r from-primary/30 via-[#EAFF96]/20 to-transparent rounded-[32px] blur-[2px] opacity-30 group-hover:opacity-100 transition-all duration-700"></div>

            <div className="relative h-full bg-[#080808]/90 backdrop-blur-xl border border-zinc-800/80 rounded-[30px] p-8 sm:p-10 flex flex-col justify-between overflow-hidden">

              {/* Internal Halo */}
              <div className="absolute -top-24 -left-24 w-64 h-64 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-all duration-500 pointer-events-none"></div>

              <div>
                {/* Header elements */}
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-300">
                      <Calendar className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-[10px] text-primary font-bold uppercase tracking-widest block">BOOTCAMP TRACK</span>
                      <h3 className="text-lg font-extrabold tracking-tight">7-Day Bootcamp</h3>
                    </div>
                  </div>

                  <span className="px-3.5 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-[10px] font-bold text-red-400 uppercase tracking-wider flex items-center gap-1.5 shadow-[0_0_15px_rgba(239,68,68,0.05)]">
                    <Flame className="w-3 h-3 fill-red-400" /> High Yield
                  </span>
                </div>

                <h4 className="text-2xl sm:text-3xl font-medium tracking-tight text-white mb-4">
                  7-Day Blind 75 Sprint
                </h4>

                <p className="text-zinc-400 text-sm sm:text-base mb-10 leading-relaxed font-medium">
                  Have an interview next week? Master the 75 most essential, high-frequency DSA questions in exactly 7 structured, gamified days. Complete 10-11 questions daily with active, step-by-step pointers.
                </p>

                {/* THE 7-DAY PROGRESS VISUAL MAP - ABSOLUTE WOW ELEMENT */}
                <div className="mb-10 bg-zinc-950/80 border border-zinc-900/60 p-5 rounded-2xl">
                  <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block mb-4">
                    Weekly Syllabus Schedule
                  </span>

                  <div className="flex items-center justify-between relative">
                    {/* Connecting line */}
                    <div className="absolute top-4 left-4 right-4 h-[2px] bg-zinc-800 z-0"></div>
                    {/* Active completed path progress line */}
                    <div className="absolute top-4 left-4 w-[33%] h-[2px] bg-primary z-0"></div>

                    {BOOTCAMP_DAYS.map((day, idx) => {
                      const isActive = day.status === "active";
                      const isCompleted = day.status === "completed";
                      return (
                        <div key={idx} className="relative z-10 flex flex-col items-center group/day cursor-pointer">
                          <div className={`w-8.5 h-8.5 rounded-full flex items-center justify-center font-bold text-xs border transition-all duration-300 ${isCompleted
                              ? "bg-primary border-primary text-black"
                              : isActive
                                ? "bg-black border-primary text-primary shadow-[0_0_15px_rgba(132,204,22,0.4)] animate-pulse scale-110"
                                : "bg-zinc-900 border-zinc-800 text-zinc-500"
                            }`}>
                            {isCompleted ? <Check className="w-3.5 h-3.5 stroke-[3px]" /> : isActive ? <Flame className="w-3.5 h-3.5 fill-primary" /> : day.day}
                          </div>
                          <span className={`text-[9px] mt-2 font-bold tracking-tight ${isActive ? "text-primary font-black" : "text-zinc-500"} hidden sm:block truncate max-w-[64px]`}>
                            Day {day.day}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <Button
                  size="lg"
                  className="w-full rounded-lg py-6 text-base bg-zinc-950 dark:bg-white hover:bg-zinc-900 dark:hover:bg-zinc-100 text-white dark:text-black font-medium tracking-tight transition-all duration-300 hover:scale-[1.01] active:scale-[0.98] shadow-xl flex items-center justify-center gap-2 group/btn w-full sm:w-fit px-8"
                  asChild
                >
                  <Link
                    href="/dsa/blind-75"
                    onClick={() => handleCtaClick("Start 7-Day Sprint", "/dsa/blind-75", "Bootcamp_Sprint_Card")}
                  >
                    Start 7-Day Challenge
                    <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover/btn:translate-x-1" />
                  </Link>
                </Button>
              </div>
            </div>
          </motion.div>

          {/* CARD B: TARGET TOP COMPANIES (GLASS SELECTOR IDE) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.15 }}
            className="lg:col-span-6 group relative"
          >
            <div className="absolute -inset-[1.5px] bg-gradient-to-r from-zinc-800 to-zinc-900 rounded-[32px] blur-[1px] opacity-30 group-hover:opacity-80 transition-all duration-700"></div>

            <div className="relative h-full bg-[#080808]/90 backdrop-blur-xl border border-zinc-800/80 rounded-[30px] p-8 sm:p-10 flex flex-col justify-between overflow-hidden">

              <div className="absolute -top-24 -right-24 w-64 h-64 bg-zinc-900/30 rounded-full blur-3xl pointer-events-none"></div>

              <div>
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 group-hover:scale-110 transition-transform duration-300">
                      <Building2 className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest block">TARGET PREPARATION</span>
                      <h3 className="text-lg font-extrabold tracking-tight">Solve Company Wise</h3>
                    </div>
                  </div>
                </div>

                <h4 className="text-2xl sm:text-3xl font-medium tracking-tight mb-4">
                  Corporate Tracks
                </h4>

                <p className="text-zinc-400 text-sm sm:text-base mb-10 leading-relaxed font-medium">
                  Direct your practice straight towards the target firms. Access frequency-based algorithm problems sourced from real, verified developer interview feedback.
                </p>

                {/* Company pills grid - Glass buttons with custom branding shadows */}
                <div className="grid grid-cols-4 gap-3.5 mb-10">
                  {TOP_TRACK_COMPANIES.map((company, index) => (
                    <Link
                      key={index}
                      href={`/dsa/problems?company=${encodeURIComponent(company.name)}`}
                      onClick={() => handleCtaClick(company.name, `/dsa/problems?company=${encodeURIComponent(company.name)}`, "company_track_pills")}
                      className={`group/pill flex flex-col items-center justify-center p-3 rounded-2xl border border-zinc-900/80 bg-zinc-950/50 hover:bg-zinc-900/40 hover:border-zinc-800 transition-all duration-300 hover:-translate-y-1 ${company.color}`}
                    >
                      <CompanyIcon
                        company={company.slug}
                        className="w-7 h-7 mb-2 opacity-60 group-hover/pill:opacity-100 transition-all duration-300"
                        forceLoad={true}
                      />
                      <span className="text-[10px] font-bold text-zinc-400 group-hover/pill:text-white truncate max-w-full">
                        {company.name}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>

              <div className="mt-4">
                <Button
                  size="lg"
                  className="w-full rounded-lg py-6 text-base bg-zinc-950 dark:bg-white hover:bg-zinc-900 dark:hover:bg-zinc-100 text-white dark:text-black font-medium tracking-tight transition-all duration-300 hover:scale-[1.01] active:scale-[0.98] shadow-xl flex items-center justify-center gap-2 group/btn w-full sm:w-fit px-8"
                  asChild
                >
                  <Link
                    href="/dsa/problems"
                    onClick={() => handleCtaClick("Explore Company Tracks", "/dsa/problems", "company_track_card")}
                  >
                    Explore Company Tracks
                    <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover/btn:translate-x-1" />
                  </Link>
                </Button>
              </div>
            </div>
          </motion.div>

        </div>

        {/* INTERACTIVE DSA TOPIC CANVAS (Visual learning roadmap graph) */}
        <div className="max-w-[1400px] mx-auto border border-zinc-900 bg-[#060606]/80 backdrop-blur-xl rounded-[36px] p-8 sm:p-14 relative overflow-hidden shadow-2xl">

          {/* Subtle dotted canvas style overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(#1c1c1c_1px,transparent_1px)] bg-[size:1.5rem_1.5rem] pointer-events-none opacity-45"></div>

          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[500px] h-[500px] bg-[#EAFF96]/5 rounded-full blur-3xl pointer-events-none"></div>

          {/* Heading with navigation actions */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-16 relative z-10 border-b border-zinc-900 pb-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-bold text-primary mb-4 tracking-wide uppercase">
                <LayoutGrid className="w-3.5 h-3.5" /> Interactive Roadmap Canvas
              </div>

              <h3 className="text-2xl sm:text-3xl font-medium tracking-tight text-white mb-4">
                Start Your Journey Topic-Wise
              </h3>

              <p className="text-zinc-400 text-sm sm:text-base max-w-2xl font-medium leading-relaxed">
                Click on any category cell inside our visual learning map to load high-impact problem nodes. Master arrays, pointers, trees, and dynamic graphs connected dynamically.
              </p>
            </div>

            {/* Quick paths selector */}
            <div className="flex flex-wrap items-center gap-3.5 shrink-0">
              <Button variant="outline" size="sm" className="rounded-xl font-bold border-zinc-800 text-xs h-10 hover:bg-zinc-900" asChild>
                <Link href="/dsa/problems" onClick={() => handleCtaClick("Canvas - All Problems", "/dsa/problems", "canvas_header_quicklinks")}>
                  DSA Library
                </Link>
              </Button>
              <Button variant="outline" size="sm" className="rounded-xl font-bold border-zinc-800 text-xs h-10 hover:bg-zinc-900" asChild>
                <Link href="/dsa/core" onClick={() => handleCtaClick("Canvas - Core Patterns", "/dsa/core", "canvas_header_quicklinks")}>
                  Core Patterns
                </Link>
              </Button>
              <Button variant="outline" size="sm" className="rounded-xl font-bold border-zinc-800 text-xs h-10 hover:bg-zinc-900" asChild>
                <Link href="/dsa/blind-75" onClick={() => handleCtaClick("Canvas - Blind 75", "/dsa/blind-75", "canvas_header_quicklinks")}>
                  Blind 75
                </Link>
              </Button>
            </div>
          </div>

          {/* Grid Canvas cells with custom neon gradients and border lifts */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 relative z-10">
            {TOPIC_NODES.map((topic, index) => {
              const Icon = topic.icon;
              const isHovered = hoveredNode === index;

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.02 }}
                  onMouseEnter={() => setHoveredNode(index)}
                  onMouseLeave={() => setHoveredNode(null)}
                >
                  <Link
                    href={`/dsa/query?topic=${encodeURIComponent(topic.name)}`}
                    onClick={() => handleCtaClick(topic.name, `/dsa/query?topic=${encodeURIComponent(topic.name)}`, "learning_canvas_node")}
                    className="group block h-full"
                  >
                    <Card
                      className="h-full bg-[#080808]/90 backdrop-blur-xl border border-zinc-800/80 hover:border-primary/30 transition-all duration-300 group-hover:shadow-2xl group-hover:shadow-primary/5 group-hover:-translate-y-1 p-5 rounded-2xl overflow-hidden relative"
                      style={{
                        boxShadow: isHovered ? `0 10px 30px -10px ${topic.glowColor}` : "none"
                      }}
                    >
                      {/* Background hover light effect */}
                      <div
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-gradient-to-br from-transparent via-transparent"
                        style={{
                          backgroundImage: `radial-gradient(circle at 80% 20%, ${topic.glowColor}, transparent 45%)`
                        }}
                      ></div>

                      <div className="relative z-10 flex flex-col h-full justify-between">
                        <div>
                          {/* Modern stylized icon box */}
                          <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-4 transition-all duration-300 group-hover:bg-primary group-hover:text-black">
                            <Icon className="w-6 h-6 transition-colors duration-300" />
                          </div>

                          <h4 className="text-base font-medium text-zinc-300 group-hover:text-primary transition-colors line-clamp-2 leading-snug mb-2">
                            {topic.name}
                          </h4>
                        </div>

                        <span className="text-xs text-zinc-500 group-hover:text-zinc-400 transition-colors mt-4">
                          {topic.count} Questions
                        </span>
                      </div>
                    </Card>
                  </Link>
                </motion.div>
              );
            })}
          </div>

          {/* Connected banner guide at bottom */}
          <div className="mt-14 text-center border-t border-zinc-900 pt-8 relative z-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <span className="text-sm font-semibold text-zinc-500">
              Not sure where to begin? We recommend starting with our
            </span>

            <Link
              href="/dsa/core"
              onClick={() => handleCtaClick("Banner bottom - Core Patterns", "/dsa/core", "canvas_bottom_banner")}
              className="inline-flex items-center gap-1 text-sm font-bold text-primary hover:underline underline-offset-4 group/bottom"
            >
              15 Core Patterns Track
              <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover/bottom:translate-x-1" />
            </Link>
          </div>

        </div>

      </div>
    </section>
  );
}
