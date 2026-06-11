"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { usePostHog } from "@posthog/react";
import { trackEvent } from "@/lib/analytics";
import {
  Calendar,
  Building2,
  Flame,
  ArrowRight,
  Check
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { CompanyIcon } from "@/components/CompanyIcon";
import { slugifyCompany } from "@/constants/companies";

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

export function SprintsAndTracksSection() {
  const posthog = usePostHog();

  const handleCtaClick = (label: string, destination: string, section: string) => {
    trackEvent(posthog, "home_cta_clicked", {
      cta_label: label,
      destination,
      section
    });
  };

  return (
    <section className="py-20 lg:py-28 bg-white dark:bg-black text-zinc-900 dark:text-white relative overflow-hidden">
      {/* Background glowing orb */}
      <div className="absolute bottom-1/4 right-10 w-[500px] h-[500px] rounded-full bg-primary/5 blur-[150px] pointer-events-none"></div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-[1500px] mx-auto px-6 relative z-10"
      >
        
        {/* SECTION HEADER - Sleek Typography - Left Aligned with inline icon */}
        <div className="max-w-4xl mx-auto mb-10 text-left">
          <h2 className="text-2xl sm:text-3xl font-medium tracking-tight mb-4 leading-[1.1] flex items-center gap-3">
            <Flame className="w-[1em] h-[1em] fill-primary text-primary shrink-0" />
            <span>Launch Your <span className="bg-gradient-to-r from-primary via-[#EAFF96] to-[#A3E635] bg-clip-text text-transparent">DSA Mastery</span></span>
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400 text-base md:text-lg font-medium leading-relaxed max-w-2xl">
            Experience high-octane interview sprints, targeted corporate practice maps, and connected roadmaps designed to wow modern developers.
          </p>
        </div>

        {/* 2-COLUMN PREMIUM CHALLENGES ROW */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          
          {/* CARD A: 7-DAY BLIND 75 SPRINT */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="group relative"
          >
            {/* Glowing active outline */}
            <div className="absolute -inset-[1.5px] bg-gradient-to-r from-primary/30 via-[#EAFF96]/20 to-transparent rounded-xl blur-[2px] opacity-10 dark:opacity-30 group-hover:opacity-100 transition-all duration-700"></div>
            
            <div className="relative h-full bg-zinc-50/50 dark:bg-[#080808]/90 backdrop-blur-xl border border-zinc-200 dark:border-zinc-800/80 rounded-xl p-6 sm:p-8 flex flex-col justify-between overflow-hidden">
              
              {/* Internal Halo */}
              <div className="absolute -top-24 -left-24 w-64 h-64 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-all duration-500 pointer-events-none"></div>

              <div>
                {/* Header elements */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-primary group-hover:scale-105 transition-transform duration-300">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[9px] text-zinc-400 dark:text-zinc-500 font-bold uppercase tracking-widest block">BOOTCAMP TRACK</span>
                      <h3 className="text-base font-extrabold tracking-tight text-zinc-800 dark:text-white">7-Day Bootcamp</h3>
                    </div>
                  </div>
                  
                  <span className="px-2.5 py-0.5 rounded-full bg-red-500/10 border border-red-500/20 text-[9px] font-bold text-red-400 uppercase tracking-wider flex items-center gap-1 shadow-[0_0_15px_rgba(239,68,68,0.05)]">
                    <Flame className="w-3.5 h-3.5 fill-red-400" /> High Yield
                  </span>
                </div>

                <h4 className="text-2xl sm:text-3xl font-medium tracking-tight text-zinc-900 dark:text-white mb-3">
                  7-Day Blind 75 Sprint
                </h4>
                
                <p className="text-zinc-600 dark:text-zinc-400 text-xs sm:text-sm mb-6 leading-relaxed font-medium">
                  Have an interview next week? Master the 75 most essential, high-frequency DSA questions in exactly 7 structured, gamified days. Complete 10-11 questions daily with active, step-by-step pointers.
                </p>

                {/* THE 7-DAY PROGRESS VISUAL MAP */}
                <div className="mb-6 bg-white dark:bg-zinc-950/80 border border-zinc-200 dark:border-zinc-900/60 p-4 rounded-2xl">
                  <span className="text-[9px] text-zinc-400 dark:text-zinc-500 font-bold uppercase tracking-wider block mb-3">
                    Weekly Syllabus Schedule
                  </span>
                  
                  <div className="flex items-center justify-between relative">
                    {/* Connecting line */}
                    <div className="absolute top-3.5 left-4 right-4 h-[2px] bg-zinc-100 dark:bg-zinc-800 z-0"></div>
                    {/* Active completed path progress line */}
                    <div className="absolute top-3.5 left-4 w-[33%] h-[2px] bg-primary z-0"></div>
                    
                    {BOOTCAMP_DAYS.map((day, idx) => {
                      const isActive = day.status === "active";
                      const isCompleted = day.status === "completed";
                      return (
                        <div key={idx} className="relative z-10 flex flex-col items-center group/day cursor-pointer">
                          <div className={`w-7.5 h-7.5 rounded-full flex items-center justify-center font-bold text-[11px] border transition-all duration-300 ${
                            isCompleted
                              ? "bg-primary border-primary text-black"
                              : isActive
                              ? "bg-black border-primary text-primary shadow-[0_0_15px_rgba(132,204,22,0.4)] animate-pulse scale-105"
                              : "bg-zinc-50 dark:bg-zinc-900 border-zinc-150 dark:border-zinc-800 text-zinc-450 dark:text-zinc-500"
                          }`}>
                            {isCompleted ? <Check className="w-3 stroke-[3px]" /> : isActive ? <Flame className="w-3 h-3 fill-primary" /> : day.day}
                          </div>
                          <span className={`text-[8px] mt-1.5 font-bold tracking-tight ${isActive ? "text-primary font-black" : "text-zinc-400 dark:text-zinc-500"} hidden sm:block truncate max-w-[64px]`}>
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
                  size="default"
                  className="rounded-lg py-5 text-sm bg-zinc-950 dark:bg-white hover:bg-zinc-900 dark:hover:bg-zinc-100 text-white dark:text-black font-medium tracking-tight transition-all duration-300 hover:scale-[1.01] active:scale-[0.98] shadow-xl flex items-center justify-center gap-1.5 group/btn w-full sm:w-fit px-6"
                  asChild
                >
                  <Link
                    href="/dsa/blind-75"
                    onClick={() => handleCtaClick("Start 7-Day Sprint", "/dsa/blind-75", "Bootcamp_Sprint_Card")}
                  >
                    Start 7-Day Challenge
                    <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
                  </Link>
                </Button>
              </div>
            </div>
          </motion.div>

          {/* CARD B: TARGET TOP COMPANIES */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.15 }}
            className="group relative"
          >
            <div className="absolute -inset-[1.5px] bg-gradient-to-r from-zinc-200 to-zinc-300 dark:from-zinc-800 dark:to-zinc-900 rounded-xl blur-[1px] opacity-10 dark:opacity-30 group-hover:opacity-80 transition-all duration-700"></div>
            
            <div className="relative h-full bg-zinc-50/50 dark:bg-[#080808]/90 backdrop-blur-xl border border-zinc-200 dark:border-zinc-800/80 rounded-xl p-6 sm:p-8 flex flex-col justify-between overflow-hidden">
              
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-zinc-900/30 rounded-full blur-3xl pointer-events-none"></div>

              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-zinc-400 group-hover:scale-105 transition-transform duration-300">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[9px] text-zinc-400 dark:text-zinc-500 font-bold uppercase tracking-widest block">TARGET PREPARATION</span>
                      <h3 className="text-base font-extrabold tracking-tight text-zinc-800 dark:text-white">Solve Company Wise</h3>
                    </div>
                  </div>
                </div>

                <h4 className="text-2xl sm:text-3xl font-medium tracking-tight text-zinc-900 dark:text-white mb-3">
                  Corporate Tracks
                </h4>
                
                <p className="text-zinc-600 dark:text-zinc-400 text-xs sm:text-sm mb-6 leading-relaxed font-medium">
                  Direct your practice straight towards the target firms. Access frequency-based algorithm problems sourced from real, verified developer interview feedback.
                </p>

                {/* Company pills grid - Glass buttons */}
                <div className="grid grid-cols-4 gap-2.5 mb-6">
                  {TOP_TRACK_COMPANIES.map((company, index) => (
                    <Link
                      key={index}
                      href={`/dsa/problems?company=${slugifyCompany(company.name)}`}
                      onClick={() => handleCtaClick(company.name, `/dsa/problems?company=${slugifyCompany(company.name)}`, "company_track_pills")}
                      className={`group/pill flex flex-col items-center justify-center p-2 rounded-lg border border-zinc-200 dark:border-zinc-900/80 bg-white dark:bg-zinc-950/50 hover:bg-zinc-50/45 dark:hover:bg-zinc-900/40 hover:border-zinc-300 dark:hover:border-zinc-800 transition-all duration-300 hover:-translate-y-0.5 ${company.color}`}
                    >
                      <CompanyIcon
                        company={company.slug}
                        className="w-5.5 h-5.5 mb-1.5 opacity-60 group-hover/pill:opacity-100 transition-all duration-300"
                        forceLoad={true}
                      />
                      <span className="text-[9px] font-bold text-zinc-600 dark:text-zinc-400 group-hover/pill:text-zinc-900 dark:group-hover/pill:text-white truncate max-w-full">
                        {company.name}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>

              <div className="mt-4">
                <Button
                  size="default"
                  className="rounded-lg py-5 text-sm bg-zinc-950 dark:bg-white hover:bg-zinc-900 dark:hover:bg-zinc-100 text-white dark:text-black font-medium tracking-tight transition-all duration-300 hover:scale-[1.01] active:scale-[0.98] shadow-xl flex items-center justify-center gap-1.5 group/btn w-full sm:w-fit px-6"
                  asChild
                >
                  <Link
                    href="/dsa/problems"
                    onClick={() => handleCtaClick("Explore Company Tracks", "/dsa/problems", "company_track_card")}
                  >
                    Explore Company Tracks
                    <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
                  </Link>
                </Button>
              </div>
            </div>
          </motion.div>
          
        </div>

      </motion.div>
    </section>
  );
}
