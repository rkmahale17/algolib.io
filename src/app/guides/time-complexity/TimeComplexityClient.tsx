"use client";

import * as React from "react";
import { useState, useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Clock,
  Server,
  Eye,
  X,
  Check,
  Copy,
  ChevronRight,
  List,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import ComplexityCard from "@/components/complexity/ComplexityCard";
import {
  ConstantTimeAnim,
  LinearAnim,
  LogarithmicAnim,
  QuadraticAnim,
  LinearithmicAnim,
} from "@/components/complexity/animations";
import { Button } from "@/components/ui/button";
import { guidesData, GuideItem } from "@/data/guidesData";
import { renderVisualization } from "@/utils/visualizationMapping";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useApp } from "@/contexts/AppContext";
import {
  GuideHeader,
  GuideFooter,
  GuideHeading,
  GuideSubHeading,
  GuideParagraph,
  GuideTable,
} from "../GuideComponents";


const renderComplexityBadge = (complexity: string) => {
  let badgeStyles = "bg-muted/80 dark:bg-muted/25 text-muted-foreground border-muted/30";
  
  if (complexity.startsWith("O(1)")) {
    badgeStyles = "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 border-emerald-500/20";
  } else if (complexity.startsWith("O(log n)")) {
    badgeStyles = "bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400 border-blue-500/20";
  } else if (complexity.startsWith("O(n log n)")) {
    badgeStyles = "bg-orange-500/10 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400 border-orange-500/20";
  } else if (complexity.startsWith("O(n)")) {
    badgeStyles = "bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400 border-amber-500/20";
  } else if (complexity.startsWith("O(n^2)") || complexity.startsWith("O(n²)")) {
    badgeStyles = "bg-red-500/10 text-red-600 dark:bg-red-500/20 dark:text-red-400 border-red-500/20";
  } else if (complexity.startsWith("O(V + E)") || complexity.startsWith("O(R × C)")) {
    badgeStyles = "bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400 border-indigo-500/20";
  }

  return (
    <span className={cn(
      "inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-mono font-medium border transition-colors",
      badgeStyles
    )}>
      {complexity}
    </span>
  );
};

export default function TimeComplexityClient() {
  const router = useRouter();
  const { hasPremiumAccess } = useApp();

  // Find guide details in guidesData
  const guide = useMemo(() => {
    return guidesData.flatMap((c) => c.guides).find((g) => g.slug === "time-complexity")!;
  }, []);

  const [showVisualizer, setShowVisualizer] = useState(false);
  const [activeViz, setActiveViz] = useState<string>("");
  const [isCompleted, setIsCompleted] = useState(false);
  const [activeId, setActiveId] = useState<string>("");
  const [isExpanded, setIsExpanded] = useState(true);

  const isScrollingToRef = useRef<boolean>(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [nComplexity, setNComplexity] = useState<Record<string, number>>({
    'O(1)': 10,
    'O(log n)': 16,
    'O(n)': 20,
    'O(n log n)': 10,
    'O(n^2)': 5
  });

  const handleNComplexityChange = (type: string, val: number) => {
    setNComplexity(prev => ({ ...prev, [type]: val }));
  };

  const readerRef = useRef<HTMLDivElement>(null);

  // Sync completion state
  useEffect(() => {
    if (guide) {
      setIsCompleted(
        localStorage.getItem(`rulcode_guide_completed_${guide.slug}`) === "true"
      );
    }
  }, [guide]);

  // Setup active visualization
  useEffect(() => {
    if (guide && guide.visualizations && guide.visualizations.length > 0) {
      setActiveViz(guide.visualizations[0]);
    } else {
      setActiveViz("");
    }
    setShowVisualizer(false); // Reset simulator pane on guide change
  }, [guide]);

  // Helper to compute the correct guide URL based on category
  const getGuideUrl = (g: GuideItem): string => {
    const patternCategoryIds = [
      "arrays-hashing",
      "two-pointers",
      "frequency-counter",
      "sliding-window",
      "stack",
      "binary-search",
    ];
    if (g.category === "time-complexity") return `/guides/time-complexity`;
    if (g.category === "space-complexity") return `/guides/space-complexity`;
    if (g.category === "fundamentals") return `/guides/fundamentals/${g.slug}`;
    if (g.category === "database") return `/guides/database/${g.slug}`;
    if (patternCategoryIds.includes(g.category)) return `/guides/patterns/${g.slug}`;
    return `/guides/${g.slug}`;
  };

  // Category label for breadcrumb
  const categoryLabel = "Time Complexity";
  const categoryHref = "/guides/time-complexity";

  // Flat guides list for previous/next navigation
  const allGuides = useMemo(() => {
    return guidesData.flatMap((c) => c.guides);
  }, []);

  const currentIndex = useMemo(() => {
    return allGuides.findIndex((g) => g.slug === "time-complexity");
  }, [allGuides]);

  const prevGuide = currentIndex > 0 ? allGuides[currentIndex - 1] : null;
  const nextGuide = currentIndex < allGuides.length - 1 ? allGuides[currentIndex + 1] : null;

  // Toggle completion
  const toggleComplete = () => {
    const newState = !isCompleted;
    setIsCompleted(newState);
    localStorage.setItem(
      `rulcode_guide_completed_time-complexity`,
      newState ? "true" : "false"
    );

    if (newState) {
      toast.success("Guide marked as complete!");
      import("canvas-confetti").then((confetti) => {
        confetti.default({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.8 },
        });
      });
    } else {
      toast.success("Completion progress cleared.");
    }
  };

  // Static headings configuration for the TOC scrollspy
  const headings = useMemo(() => [
    { level: 3, text: "What is Time Complexity?", id: "what-is-time-complexity" },
    { level: 3, text: "O(1) - Constant Time", id: "o1---constant-time" },
    { level: 3, text: "O(log n) - Logarithmic Time", id: "olog-n---logarithmic-time" },
    { level: 3, text: "O(n) - Linear Time", id: "on---linear-time" },
    { level: 3, text: "O(n log n) - Linearithmic Time", id: "on-log-n---linearithmic-time" },
    { level: 3, text: "O(n^2) - Quadratic Time", id: "on2---quadratic-time" },
  ], []);

  // Keep activeId in a ref to avoid recreating the scroll listener on every scroll step
  const activeIdRef = useRef(activeId);
  useEffect(() => {
    activeIdRef.current = activeId;
  }, [activeId]);

  // TOC scrollspy — uses passive scroll listener for better reliability
  useEffect(() => {
    const handleScroll = () => {
      if (isScrollingToRef.current) return;
      
      const headingElements = headings
        .map((h) => document.getElementById(h.id))
        .filter((el): el is HTMLElement => el !== null);
        
      if (headingElements.length === 0) return;
      
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = document.documentElement.clientHeight;
      const scrollY = window.scrollY;
      
      // Page bottom check (standard, robust formula)
      if (scrollY + clientHeight >= scrollHeight - 20) {
        const lastHeadingId = headingElements[headingElements.length - 1].id;
        if (lastHeadingId !== activeIdRef.current) {
          setActiveId(lastHeadingId);
        }
        return;
      }
      
      let currentActiveId = "";
      const OFFSET = 120; // navbar height + breathing room
      
      for (const el of headingElements) {
        const rect = el.getBoundingClientRect();
        if (rect.top <= OFFSET) {
          currentActiveId = el.id;
        } else {
          break;
        }
      }
      
      if (!currentActiveId && headingElements.length > 0) {
        currentActiveId = headingElements[0].id;
      }
      
      if (currentActiveId && currentActiveId !== activeIdRef.current) {
        setActiveId(currentActiveId);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    // Run once on mount
    handleScroll();
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, [showVisualizer, headings]);

  // TOC smooth scroll click handler
  const handleTocClick = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      isScrollingToRef.current = true;
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);

      const top = element.getBoundingClientRect().top + window.scrollY - 68;
      window.scrollTo({ top, behavior: "smooth" });
      setActiveId(id);

      scrollTimeoutRef.current = setTimeout(() => {
        isScrollingToRef.current = false;
      }, 1000);
    }
  };

  return (
    <div className="flex flex-col bg-background">
      {/* Main content row: article + sticky right panel */}
      <div className="flex relative">
        {/* Left Side: Article Reader — scrolls with the page */}
        <div
          ref={readerRef}
          className={cn(
            "flex-1 min-w-0 px-4 sm:px-6 md:px-8 py-8 transition-all duration-300 relative",
            showVisualizer
              ? "lg:max-w-[50%] w-full"
              : "max-w-[850px] mx-auto w-full"
          )}
        >
          <div className="flex flex-col gap-6 mx-auto w-full max-w-[620px] pb-24">
            <GuideHeader
              guide={guide}
              categoryLabel={categoryLabel}
              categoryHref={categoryHref}
            />

            <hr className="border-neutral-200 dark:border-neutral-800" />

            {guide?.heroImage && (
              <div className="w-full mt-4 mb-2 flex justify-center">
                <img
                  src={`https://dkebbjneobjtmuzzrsdo.supabase.co/storage/v1/object/public/guides/${guide.heroImage}.webp`}
                  alt={`${guide.title} hero`}
                  className="w-full max-w-[600px] h-auto rounded-xl border border-border/50 shadow-sm object-cover"
                />
              </div>
            )}

            <div>
              <article className="flex flex-col">
                <div className="prose dark:prose-invert text-[15px] max-w-none prose-pre:p-0 prose-pre:bg-transparent">
                  <div className="flex flex-col mt-6">
                    {/* What is Time Complexity? Section */}
                    <section className="flex flex-col">
                      <GuideHeading id="what-is-time-complexity">What is Time Complexity?</GuideHeading>
                      <GuideParagraph>
                        Imagine you are cleaning up your bedroom. If you have <strong>1 toy</strong> on the floor, it takes a few seconds to put away. What if you have <strong>10 toys</strong>? It takes longer. What if you have <strong>1,000 toys</strong>? It takes a very long time! <strong>Time complexity</strong> is a cool way programmers measure how much longer a task takes when we add more "toys" (which programmers call the input size, or <code className="font-mono bg-muted/60 dark:bg-muted/20 px-1.5 py-0.5 rounded text-[13px]">N</code>) to solve!
                      </GuideParagraph>
                      <GuideParagraph>
                        Instead of using a stopwatch, programmers use a secret code called <strong>Big O notation</strong>. It's like a speedometer categories for computer instructions! We write it like <code className="font-mono bg-muted/60 dark:bg-muted/20 px-1.5 py-0.5 rounded text-[13px]">O(1)</code>, <code className="font-mono bg-muted/60 dark:bg-muted/20 px-1.5 py-0.5 rounded text-[13px]">O(n)</code>, or <code className="font-mono bg-muted/60 dark:bg-muted/20 px-1.5 py-0.5 rounded text-[13px]">O(log n)</code> to show how fast an <a href="https://en.wikipedia.org/wiki/Algorithm" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">algorithm</a> (which is just a step-by-step game plan) runs when things scale up.
                      </GuideParagraph>
                      <GuideParagraph>
                        Why does this matter? If your code is slow with just 10 items, it might freeze or crash when you try to use it with millions of items! Knowing the time complexity helps us pick the best <Link href="/guides/fundamentals/core-data-structures" className="text-primary hover:underline font-medium">data structures</Link> (our virtual toy organizers) so our programs run super fast and smooth, like a shiny race car!
                      </GuideParagraph>
 
                      <div className="mt-8 flex flex-col">
                        <GuideParagraph>
                          A <strong>data structure</strong> is like a cool toy organizer! Just like how you might put Legos in a big bin, action figures on a shelf, or books in a bookcase, computers put different kinds of information in different kinds of "organizers." Let's look at how fast we can find, add, or remove toys from our different organizers!
                        </GuideParagraph>
                        <h5 className="text-base font-medium text-foreground/80 tracking-tight mt-2 mb-3">
                          Common Data Structure Operations
                        </h5>
                        <GuideTable>
                          <thead className="bg-muted/40">
                            <tr>
                              <th className="px-4 py-2 text-left font-medium text-muted-foreground/80 text-[9.5px] uppercase tracking-widest leading-4">Data Structure</th>
                              <th className="px-4 py-2 text-left font-medium text-muted-foreground/80 text-[9.5px] uppercase tracking-widest leading-4">Access / Lookup</th>
                              <th className="px-4 py-2 text-left font-medium text-muted-foreground/80 text-[9.5px] uppercase tracking-widest leading-4">Search</th>
                              <th className="px-4 py-2 text-left font-medium text-muted-foreground/80 text-[9.5px] uppercase tracking-widest leading-4">Insertion</th>
                              <th className="px-4 py-2 text-left font-medium text-muted-foreground/80 text-[9.5px] uppercase tracking-widest leading-4">Deletion</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-border/20 bg-background/20">
                            <tr className="bg-transparent hover:bg-muted/15 dark:hover:bg-muted/5 transition-colors">
                              <td className="px-4 py-2.5 text-foreground font-medium text-[14px] leading-5">Array / Vector</td>
                              <td className="px-4 py-2.5 text-muted-foreground text-[14px] leading-5">{renderComplexityBadge("O(1)")}</td>
                              <td className="px-4 py-2.5 text-muted-foreground text-[14px] leading-5">{renderComplexityBadge("O(n)")}</td>
                              <td className="px-4 py-2.5 text-muted-foreground text-[14px] leading-5">{renderComplexityBadge("O(n)")} <span className="text-[12px] text-muted-foreground/80 ml-1.5">(O(1) at end)</span></td>
                              <td className="px-4 py-2.5 text-muted-foreground text-[14px] leading-5">{renderComplexityBadge("O(n)")} <span className="text-[12px] text-muted-foreground/80 ml-1.5">(O(1) at end)</span></td>
                            </tr>
                            <tr className="bg-muted/30 dark:bg-muted/10 hover:bg-muted/40 dark:hover:bg-muted/15 transition-colors">
                              <td className="px-4 py-2.5 text-foreground font-medium text-[14px] leading-5">Singly Linked List</td>
                              <td className="px-4 py-2.5 text-muted-foreground text-[14px] leading-5">{renderComplexityBadge("O(n)")}</td>
                              <td className="px-4 py-2.5 text-muted-foreground text-[14px] leading-5">{renderComplexityBadge("O(n)")}</td>
                              <td className="px-4 py-2.5 text-muted-foreground text-[14px] leading-5">{renderComplexityBadge("O(1)")} <span className="text-[12px] text-muted-foreground/80 ml-1.5">(with pointer)</span></td>
                              <td className="px-4 py-2.5 text-muted-foreground text-[14px] leading-5">{renderComplexityBadge("O(1)")} <span className="text-[12px] text-muted-foreground/80 ml-1.5">(with pointer)</span></td>
                            </tr>
                            <tr className="bg-transparent hover:bg-muted/15 dark:hover:bg-muted/5 transition-colors">
                              <td className="px-4 py-2.5 text-foreground font-medium text-[14px] leading-5">Doubly Linked List</td>
                              <td className="px-4 py-2.5 text-muted-foreground text-[14px] leading-5">{renderComplexityBadge("O(n)")}</td>
                              <td className="px-4 py-2.5 text-muted-foreground text-[14px] leading-5">{renderComplexityBadge("O(n)")}</td>
                              <td className="px-4 py-2.5 text-muted-foreground text-[14px] leading-5">{renderComplexityBadge("O(1)")}</td>
                              <td className="px-4 py-2.5 text-muted-foreground text-[14px] leading-5">{renderComplexityBadge("O(1)")}</td>
                            </tr>
                            <tr className="bg-muted/30 dark:bg-muted/10 hover:bg-muted/40 dark:hover:bg-muted/15 transition-colors">
                              <td className="px-4 py-2.5 text-foreground font-medium text-[14px] leading-5">Stack (LIFO)</td>
                              <td className="px-4 py-2.5 text-muted-foreground text-[14px] leading-5">{renderComplexityBadge("O(1)")} <span className="text-[12px] text-muted-foreground/80 ml-1.5">(top only)</span></td>
                              <td className="px-4 py-2.5 text-muted-foreground text-[14px] leading-5">{renderComplexityBadge("O(n)")}</td>
                              <td className="px-4 py-2.5 text-muted-foreground text-[14px] leading-5">{renderComplexityBadge("O(1)")} <span className="text-[12px] text-muted-foreground/80 ml-1.5">(push)</span></td>
                              <td className="px-4 py-2.5 text-muted-foreground text-[14px] leading-5">{renderComplexityBadge("O(1)")} <span className="text-[12px] text-muted-foreground/80 ml-1.5">(pop)</span></td>
                            </tr>
                            <tr className="bg-transparent hover:bg-muted/15 dark:hover:bg-muted/5 transition-colors">
                              <td className="px-4 py-2.5 text-foreground font-medium text-[14px] leading-5">Queue (FIFO)</td>
                              <td className="px-4 py-2.5 text-muted-foreground text-[14px] leading-5">{renderComplexityBadge("O(1)")} <span className="text-[12px] text-muted-foreground/80 ml-1.5">(front only)</span></td>
                              <td className="px-4 py-2.5 text-muted-foreground text-[14px] leading-5">{renderComplexityBadge("O(n)")}</td>
                              <td className="px-4 py-2.5 text-muted-foreground text-[14px] leading-5">{renderComplexityBadge("O(1)")} <span className="text-[12px] text-muted-foreground/80 ml-1.5">(enqueue)</span></td>
                              <td className="px-4 py-2.5 text-muted-foreground text-[14px] leading-5">{renderComplexityBadge("O(1)")} <span className="text-[12px] text-muted-foreground/80 ml-1.5">(dequeue)</span></td>
                            </tr>
                            <tr className="bg-muted/30 dark:bg-muted/10 hover:bg-muted/40 dark:hover:bg-muted/15 transition-colors">
                              <td className="px-4 py-2.5 text-foreground font-medium text-[14px] leading-5">Hash Table</td>
                              <td className="px-4 py-2.5 text-muted-foreground text-[14px] leading-5">{renderComplexityBadge("O(1)")} <span className="text-[12px] text-muted-foreground/80 ml-1.5">(avg)</span></td>
                              <td className="px-4 py-2.5 text-muted-foreground text-[14px] leading-5">{renderComplexityBadge("O(1)")} <span className="text-[12px] text-muted-foreground/80 ml-1.5">(avg)</span></td>
                              <td className="px-4 py-2.5 text-muted-foreground text-[14px] leading-5">{renderComplexityBadge("O(1)")} <span className="text-[12px] text-muted-foreground/80 ml-1.5">(avg)</span></td>
                              <td className="px-4 py-2.5 text-muted-foreground text-[14px] leading-5">{renderComplexityBadge("O(1)")} <span className="text-[12px] text-muted-foreground/80 ml-1.5">(avg)</span></td>
                            </tr>
                            <tr className="bg-transparent hover:bg-muted/15 dark:hover:bg-muted/5 transition-colors">
                              <td className="px-4 py-2.5 text-foreground font-medium text-[14px] leading-5">Binary Search Tree</td>
                              <td className="px-4 py-2.5 text-muted-foreground text-[14px] leading-5">{renderComplexityBadge("O(log n)")} <span className="text-[12px] text-muted-foreground/80 ml-1.5">(avg)</span></td>
                              <td className="px-4 py-2.5 text-muted-foreground text-[14px] leading-5">{renderComplexityBadge("O(log n)")} <span className="text-[12px] text-muted-foreground/80 ml-1.5">(avg)</span></td>
                              <td className="px-4 py-2.5 text-muted-foreground text-[14px] leading-5">{renderComplexityBadge("O(log n)")} <span className="text-[12px] text-muted-foreground/80 ml-1.5">(avg)</span></td>
                              <td className="px-4 py-2.5 text-muted-foreground text-[14px] leading-5">{renderComplexityBadge("O(log n)")} <span className="text-[12px] text-muted-foreground/80 ml-1.5">(avg)</span></td>
                            </tr>
                            <tr className="bg-muted/30 dark:bg-muted/10 hover:bg-muted/40 dark:hover:bg-muted/15 transition-colors">
                              <td className="px-4 py-2.5 text-foreground font-medium text-[14px] leading-5">Red-Black Tree / AVL</td>
                              <td className="px-4 py-2.5 text-muted-foreground text-[14px] leading-5">{renderComplexityBadge("O(log n)")}</td>
                              <td className="px-4 py-2.5 text-muted-foreground text-[14px] leading-5">{renderComplexityBadge("O(log n)")}</td>
                              <td className="px-4 py-2.5 text-muted-foreground text-[14px] leading-5">{renderComplexityBadge("O(log n)")}</td>
                              <td className="px-4 py-2.5 text-muted-foreground text-[14px] leading-5">{renderComplexityBadge("O(log n)")}</td>
                            </tr>
                          </tbody>
                        </GuideTable>
                      </div>
 
                      <div className="mt-8 flex flex-col">
                        <GuideParagraph>
                          An <strong>algorithm</strong> is just a step-by-step game plan or a recipe for solving a puzzle. If our data structure is a Lego box, the algorithm is the instruction manual telling us exactly how to build a cool spaceship! Let's see how many steps different game plans take to get the job done!
                        </GuideParagraph>
                        <h5 className="text-base font-medium text-foreground/80 tracking-tight mt-2 mb-3">
                          Common Algorithmic Operations
                        </h5>
                        <GuideTable>
                          <thead className="bg-muted/40">
                            <tr>
                              <th className="px-4 py-2 text-left font-medium text-muted-foreground/80 text-[9.5px] uppercase tracking-widest leading-4">Operation / Algorithm</th>
                              <th className="px-4 py-2 text-left font-medium text-muted-foreground/80 text-[9.5px] uppercase tracking-widest leading-4">Complexity</th>
                              <th className="px-4 py-2 text-left font-medium text-muted-foreground/80 text-[9.5px] uppercase tracking-widest leading-4">Why / Notes</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-border/20 bg-background/20">
                            <tr className="bg-transparent hover:bg-muted/15 dark:hover:bg-muted/5 transition-colors">
                              <td className="px-4 py-2.5 text-foreground font-medium text-[14px] leading-5">Binary Search</td>
                              <td className="px-4 py-2.5 text-muted-foreground text-[14px] leading-5">{renderComplexityBadge("O(log n)")}</td>
                              <td className="px-4 py-2.5 text-muted-foreground text-[14px] leading-5">Halves the search space at each iteration.</td>
                            </tr>
                            <tr className="bg-muted/30 dark:bg-muted/10 hover:bg-muted/40 dark:hover:bg-muted/15 transition-colors">
                              <td className="px-4 py-2.5 text-foreground font-medium text-[14px] leading-5">Heap Push / Pop</td>
                              <td className="px-4 py-2.5 text-muted-foreground text-[14px] leading-5">{renderComplexityBadge("O(log n)")}</td>
                              <td className="px-4 py-2.5 text-muted-foreground text-[14px] leading-5">Up-heaping or down-heaping requires traversing heap height.</td>
                            </tr>
                            <tr className="bg-transparent hover:bg-muted/15 dark:hover:bg-muted/5 transition-colors">
                              <td className="px-4 py-2.5 text-foreground font-medium text-[14px] leading-5">Sorting (Merge/Quick/Heap)</td>
                              <td className="px-4 py-2.5 text-muted-foreground text-[14px] leading-5">{renderComplexityBadge("O(n log n)")}</td>
                              <td className="px-4 py-2.5 text-muted-foreground text-[14px] leading-5">Optimal comparison-based sorting complexity.</td>
                            </tr>
                            <tr className="bg-muted/30 dark:bg-muted/10 hover:bg-muted/40 dark:hover:bg-muted/15 transition-colors">
                              <td className="px-4 py-2.5 text-foreground font-medium text-[14px] leading-5">Graph DFS / BFS</td>
                              <td className="px-4 py-2.5 text-muted-foreground text-[14px] leading-5">{renderComplexityBadge("O(V + E)")}</td>
                              <td className="px-4 py-2.5 text-muted-foreground text-[14px] leading-5">Visits every vertex V and checks every edge E.</td>
                            </tr>
                            <tr className="bg-transparent hover:bg-muted/15 dark:hover:bg-muted/5 transition-colors">
                              <td className="px-4 py-2.5 text-foreground font-medium text-[14px] leading-5">Tree Traversal (DFS/BFS)</td>
                              <td className="px-4 py-2.5 text-muted-foreground text-[14px] leading-5">{renderComplexityBadge("O(n)")}</td>
                              <td className="px-4 py-2.5 text-muted-foreground text-[14px] leading-5">Visits every node in the tree exactly once.</td>
                            </tr>
                            <tr className="bg-muted/30 dark:bg-muted/10 hover:bg-muted/40 dark:hover:bg-muted/15 transition-colors">
                              <td className="px-4 py-2.5 text-foreground font-medium text-[14px] leading-5">Matrix Traversal</td>
                              <td className="px-4 py-2.5 text-muted-foreground text-[14px] leading-5">{renderComplexityBadge("O(R × C)")}</td>
                              <td className="px-4 py-2.5 text-muted-foreground text-[14px] leading-5">Visits every cell in a grid of dimensions R by C.</td>
                            </tr>
                          </tbody>
                        </GuideTable>
                      </div>
 
                      <div className="my-[56px] not-prose">
                        <div className="grid md:grid-cols-2 gap-6">
                          <Card className="bg-card/50 backdrop-blur-sm border-t-4 border-t-blue-500">
                            <CardHeader>
                              <CardTitle className="flex items-center gap-2 text-lg">
                                <Clock className="w-5 h-5 text-blue-500" />
                                Time Speed (Time Complexity)
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="text-muted-foreground text-sm">
                              How many game-steps the computer takes as we add more toys! It's not about seconds, but about the number of moves.
                            </CardContent>
                          </Card>
                          <Card className="bg-card/50 backdrop-blur-sm border-t-4 border-t-blue-500">
                            <CardHeader>
                              <CardTitle className="flex items-center gap-2 text-lg">
                                <Server className="w-5 h-5 text-blue-500" />
                                Storage Room (Space Complexity)
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="text-muted-foreground text-sm">
                               How many extra storage boxes we need to borrow while playing. A good player leaves plenty of free space on the floor!
                            </CardContent>
                          </Card>
                        </div>
                      </div>
                    </section>

                    {/* Complexity Card Sections */}
                    <section className="my-[56px]">
                      <GuideHeading id="o1---constant-time">O(1) - Constant Time</GuideHeading>
                      <GuideParagraph>
                        Constant speed, written as <strong>O(1)</strong>, is like a magical shortcut! It means that no matter how many toys are in your toybox—whether you have 5 toys or 5,000 toys—it always takes exactly <strong>ONE quick grab</strong> to reach in and pick the top toy! The computer doesn't get slower at all.
                      </GuideParagraph>
                      <GuideParagraph>
                        In computer code, looking up a value in an array by its number position (like <code className="font-mono bg-muted/60 dark:bg-muted/20 px-1.5 py-0.5 rounded text-[13px]">arr[0]</code>) is a constant time operation. Looking up a word in a magic dictionary is also O(1). Using fast O(1) operations is the secret trick programmers use to solve difficult puzzles like <Link href="/problem/two-sum" className="text-primary hover:underline font-medium">Two Sum</Link> in the blink of an eye!
                      </GuideParagraph>
                      <div className="not-prose">
                        <ComplexityCard
                          type="O(1)"
                          n={nComplexity['O(1)']}
                          onNChange={(val) => handleNComplexityChange('O(1)', val)}
                          animationComponent={<ConstantTimeAnim n={nComplexity['O(1)']} />}
                          codes={{
                            python: `def get_first_element(arr):
    # Always takes O(1) time regardless of array size
    return arr[0] if arr else None`,
                            cpp: `#include <vector>

int getFirstElement(const std::vector<int>& arr) {
    // Always takes O(1) time regardless of array size
    if (arr.empty()) return -1;
    return arr[0];
}`,
                            java: `public class ConstantTime {
    public static int getFirstElement(int[] arr) {
        // Always takes O(1) time regardless of array size
        if (arr.length == 0) return -1;
        return arr[0];
    }
}`,
                            typescript: `function getFirstElement<T>(arr: T[]): T | undefined {
  // Always takes O(1) time regardless of array size
  return arr[0];
}`
                          }}
                        />
                      </div>
                    </section>

                    <section className="my-[56px]">
                      <GuideHeading id="olog-n---logarithmic-time">O(log n) - Logarithmic Time</GuideHeading>
                      <GuideParagraph>
                        Logarithmic speed, written as <strong>O(log n)</strong>, is incredibly smart and super fast! Imagine playing a number guessing game. I choose a secret number between 1 and 100, and each time you guess, I tell you if your guess is "too high" or "too low." If you always guess the number right in the middle, you chop your search area in half! That is called the <strong>divide-and-conquer</strong> superpower.
                      </GuideParagraph>
                      <GuideParagraph>
                        Even if the secret number is between 1 and a million, you can find it in just 20 guesses! You can try out this half-splitting trick in challenges like <Link href="/problem/search-in-rotated-sorted-array" className="text-primary hover:underline font-medium">Search in Rotated Sorted Array</Link> and <Link href="/problem/find-minimum-in-rotated-sorted-array" className="text-primary hover:underline font-medium">Find Minimum in Rotated Sorted Array</Link> which use Binary Search.
                      </GuideParagraph>
                      <div className="not-prose">
                        <ComplexityCard
                          type="O(log n)"
                          n={nComplexity['O(log n)']}
                          onNChange={(val) => handleNComplexityChange('O(log n)', val)}
                          animationComponent={<LogarithmicAnim n={nComplexity['O(log n)']} />}
                          codes={{
                            python: `def binary_search(arr, target):
    left, right = 0, len(arr) - 1
    while left <= right:
        mid = (left + right) // 2
        # Halves the search space each step
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return -1`,
                            cpp: `#include <vector>

int binarySearch(const std::vector<int>& arr, int target) {
    int left = 0, right = arr.size() - 1;
    while (left <= right) {
        int mid = left + (right - left) / 2;
        // Halves the search space each step
        if (arr[mid] == target) return mid;
        if (arr[mid] < target) left = mid + 1;
        else right = mid - 1;
    }
    return -1;
}`,
                            java: `public class BinarySearch {
    public static int search(int[] arr, int target) {
        int left = 0, right = arr.length - 1;
        while (left <= right) {
            int mid = left + (right - left) / 2;
            // Halves the search space each step
            if (arr[mid] == target) return mid;
            if (arr[mid] < target) left = mid + 1;
            else right = mid - 1;
        }
        return -1;
    }
}`,
                            typescript: `function binarySearch(arr: number[], target: number): number {
  let left = 0;
  let right = arr.length - 1;
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    // Halves the search space each step
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) left = mid + 1;
    else right = mid - 1;
  }
  return -1;
}`
                          }}
                        />
                      </div>
                    </section>

                    <section className="my-[56px]">
                      <GuideHeading id="on---linear-time">O(n) - Linear Time</GuideHeading>
                      <GuideParagraph>
                        Linear speed, written as <strong>O(n)</strong>, means the time goes up step-by-step with the number of toys. If you have 10 toys, you take 10 steps. If you have 1,000 toys, you take 1,000 steps! Imagine you dropped your favorite red Lego brick on a carpet covered in other Legos. To find it, you have to look at every single brick one by one. You can't skip any!
                      </GuideParagraph>
                      <GuideParagraph>
                        Programmers see O(n) speed all the time. It is totally fine for computers to do! You can practice looking at things one-by-one with problems like <Link href="/problem/contains-duplicate" className="text-primary hover:underline font-medium">Contains Duplicate</Link>, <Link href="/problem/best-time-to-buy-and-sell-stock" className="text-primary hover:underline font-medium">Best Time to Buy and Sell Stock</Link>, and the linear version of <Link href="/problem/two-sum" className="text-primary hover:underline font-medium">Two Sum</Link>!
                      </GuideParagraph>
                      <div className="not-prose">
                        <ComplexityCard
                          type="O(n)"
                          n={nComplexity['O(n)']}
                          onNChange={(val) => handleNComplexityChange('O(n)', val)}
                          animationComponent={<LinearAnim n={nComplexity['O(n)']} />}
                          codes={{
                            python: `def find_max(arr):
    if not arr:
        return None
    max_val = arr[0]
    # Must check every element once (N operations)
    for num in arr:
        if num > max_val:
            max_val = num
    return max_val`,
                            cpp: `#include <vector>
#include <limits>
#include <algorithm>

int findMax(const std::vector<int>& arr) {
    if (arr.empty()) return -1;
    int maxVal = arr[0];
    // Must check every element once (N operations)
    for (int num : arr) {
        if (num > maxVal) {
            maxVal = num;
        }
    }
    return maxVal;
}`,
                            java: `public class LinearTime {
    public static int findMax(int[] arr) {
        if (arr.length == 0) return -1;
        int maxVal = arr[0];
        // Must check every element once (N operations)
        for (int num : arr) {
            if (num > maxVal) {
                maxVal = num;
            }
        }
        return maxVal;
    }
}`,
                            typescript: `function findMax(arr: number[]): number {
  let max = -Infinity;
  // Must check every element once (N operations)
  for (const num of arr) {
    if (num > max) {
      max = num;
    }
  }
  return max;
}`
                          }}
                        />
                      </div>
                    </section>

                    <section className="my-[56px]">
                      <GuideHeading id="on-log-n---linearithmic-time">O(n log n) - Linearithmic Time</GuideHeading>
                      <GuideParagraph>
                        Linearithmic speed, written as <strong>O(n log n)</strong>, is a tiny bit slower than O(n) but still awesome! This happens when you split things in half (using your O(log n) split power) and do a little bit of O(n) scanning at each step. Think of sorting a messy pile of trading cards: you split the pile into two, sort them, and then zip/merge them back in a line.
                      </GuideParagraph>
                      <GuideParagraph>
                        This is the best speed we can achieve for sorting things in order. Sorting algorithms like Merge Sort, Quick Sort, and Heap Sort run at this speed. Sorting is very useful because once toys or numbers are in order, we can search them much faster later on!
                      </GuideParagraph>
                      <div className="not-prose">
                        <ComplexityCard
                          type="O(n log n)"
                          n={nComplexity['O(n log n)']}
                          onNChange={(val) => handleNComplexityChange('O(n log n)', val)}
                          animationComponent={<LinearithmicAnim n={nComplexity['O(n log n)']} />}
                          codes={{
                            python: `def merge_sort(arr):
    if len(arr) <= 1:
        return arr
    mid = len(arr) // 2
    # Divide step: splits the array (log n depth)
    left = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])
    # Conquer step: merge sublists (O(n) at each level)
    return merge(left, right)

def merge(left, right):
    result = []
    i = j = 0
    while i < len(left) and j < len(right):
        if left[i] < right[j]:
            result.append(left[i])
            i += 1
        else:
            result.append(right[j])
            j += 1
    result.extend(left[i:])
    result.extend(right[j:])
    return result`,
                            cpp: `#include <vector>

void merge(std::vector<int>& arr, int l, int m, int r) {
    int n1 = m - l + 1;
    int n2 = r - m;
    std::vector<int> L(n1), R(n2);
    for (int i = 0; i < n1; i++) L[i] = arr[l + i];
    for (int j = 0; j < n2; j++) R[j] = arr[m + 1 + j];
    
    int i = 0, j = 0, k = l;
    while (i < n1 && j < n2) {
        if (L[i] <= R[j]) arr[k++] = L[i++];
        else arr[k++] = R[j++];
    }
    while (i < n1) arr[k++] = L[i++];
    while (j < n2) arr[k++] = R[j++];
}

void mergeSort(std::vector<int>& arr, int l, int r) {
    if (l >= r) return;
    int m = l + (r - l) / 2;
    // Divide step: splits the array (log n depth)
    mergeSort(arr, l, m);
    mergeSort(arr, m + 1, r);
    // Conquer step: merge sublists (O(n) at each level)
    merge(arr, l, m, r);
}`,
                            java: `public class MergeSort {
    public static void sort(int[] arr, int l, int r) {
        if (l >= r) return;
        int m = l + (r - l) / 2;
        // Divide step: splits the array (log n depth)
        sort(arr, l, m);
        sort(arr, m + 1, r);
        // Conquer/Merge step: O(n) work per level
        merge(arr, l, m, r);
    }

    private static void merge(int[] arr, int l, int m, int r) {
        int n1 = m - l + 1, n2 = r - m;
        int[] L = new int[n1], R = new int[n2];
        System.arraycopy(arr, l, L, 0, n1);
        System.arraycopy(arr, m + 1, R, 0, n2);
        int i = 0, j = 0, k = l;
        while (i < n1 && j < n2) {
            if (L[i] <= R[j]) arr[k++] = L[i++];
            else arr[k++] = R[j++];
        }
        while (i < n1) arr[k++] = L[i++];
        while (j < n2) arr[k++] = R[j++];
    }
}`,
                            typescript: `function mergeSort(arr: number[]): number[] {
  if (arr.length <= 1) return arr;
  const mid = Math.floor(arr.length / 2);
  // Divide step: splits the array (log n depth)
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));
  // Conquer step: merge sublists (O(n) at each level)
  return merge(left, right);
}

function merge(left: number[], right: number[]): number[] {
  const result: number[] = [];
  let i = 0, j = 0;
  while (i < left.length && j < right.length) {
    if (left[i] < right[j]) {
      result.push(left[i++]);
    } else {
      result.push(right[j++]);
    }
  }
  return [...result, ...left.slice(i), ...right.slice(j)];
}`
                          }}
                        />
                      </div>
                    </section>

                    <section className="my-[56px]">
                      <GuideHeading id="on2---quadratic-time">O(n^2) - Quadratic Time</GuideHeading>
                      <GuideParagraph>
                        Quadratic speed, written as <strong>O(n²)</strong>, is super slow! If you double your toys, the time quadruples (goes up 4 times)! If you have 10 toys, it takes 100 steps. If you have 1,000 toys, it takes a massive 1,000,000 steps! This happens when you compare every single toy with every other toy, like a loop inside another loop (nested loops).
                      </GuideParagraph>
                      <GuideParagraph>
                        Imagine a room full of kids where every single kid wants to shake hands with every other kid. If there are a lot of kids, the handshakes will take forever! Try to see the difference between a slow quadratic solution and a fast linear one in problems like <Link href="/problem/contains-duplicate" className="text-primary hover:underline font-medium">Contains Duplicate</Link> and <Link href="/problem/3sum" className="text-primary hover:underline font-medium">3Sum</Link>.
                      </GuideParagraph>
                      <div className="not-prose">
                        <ComplexityCard
                          type="O(n^2)"
                          n={nComplexity['O(n^2)']}
                          onNChange={(val) => handleNComplexityChange('O(n^2)', val)}
                          animationComponent={<QuadraticAnim n={nComplexity['O(n^2)']} />}
                          codes={{
                            python: `def has_duplicate(arr):
    # Nested loops check every pair of elements
    # Total operations: N * N = O(N^2)
    n = len(arr)
    for i in range(n):
        for j in range(n):
            if i != j and arr[i] == arr[j]:
                return True
    return False`,
                            cpp: `#include <vector>

bool hasDuplicate(const std::vector<int>& arr) {
    // Nested loops check every pair of elements
    // Total operations: N * N = O(N^2)
    int n = arr.size();
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j++) {
            if (i != j && arr[i] == arr[j]) {
                return true;
            }
        }
    }
    return false;
}`,
                            java: `public class QuadraticTime {
    public static boolean hasDuplicate(int[] arr) {
        // Nested loops check every pair of elements
        // Total operations: N * N = O(N^2)
        int n = arr.length;
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < n; j++) {
                if (i != j && arr[i] == arr[j]) {
                    return true;
                }
            }
        }
        return false;
    }
}`,
                            typescript: `function hasDuplicate(arr: number[]): boolean {
  // Nested loops check every pair of elements
  // Total operations: N * N = O(N^2)
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr.length; j++) {
      if (i !== j && arr[i] === arr[j]) {
        return true;
      }
    }
  }
  return false;
}`
                          }}
                        />
                      </div>
                    </section>
                  </div>
                </div>

                <GuideFooter
                  currentIndex={currentIndex}
                  allGuidesCount={allGuides.length}
                  prevGuide={prevGuide}
                  nextGuide={nextGuide}
                  isCompleted={isCompleted}
                  toggleComplete={toggleComplete}
                  getGuideUrl={getGuideUrl}
                  allGuides={allGuides}
                />
              </article>
            </div>
          </div>
        </div>

        {/* Right Side: Visualizer — sticky panel alongside scrolling article */}
        {showVisualizer && (
          <div className="hidden lg:flex w-[50%] shrink-0 border-l border-border/50 bg-background flex-col animate-slideIn sticky top-[48px] h-[calc(100vh-48px)]">
            <div className="h-12 border-b border-border/40 bg-muted/30 flex items-center justify-between px-4 shrink-0 select-none">
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-primary" />
                Interactive Simulator
              </span>
              <div className="flex items-center gap-2">
                {guide.visualizations && guide.visualizations.length > 1 && (
                  <Select value={activeViz} onValueChange={setActiveViz}>
                    <SelectTrigger className="h-7 text-xs border border-border/40 bg-background text-foreground w-[160px] focus:ring-0">
                      <SelectValue placeholder="Select visualization" />
                    </SelectTrigger>
                    <SelectContent>
                      {guide.visualizations.map((vizId) => (
                        <SelectItem key={vizId} value={vizId} className="text-xs">
                          {vizId
                            .split("-")
                            .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                            .join(" ")}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-muted-foreground hover:text-foreground rounded-full"
                  onClick={() => setShowVisualizer(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div className="flex-1 overflow-auto no-scrollbar p-6 relative flex flex-col bg-background">
              <div className="flex-1 flex flex-col min-h-0 relative">
                {renderVisualization(activeViz)}
              </div>
            </div>
          </div>
        )}

        {/* Right Sidebar: TOC — sticky alongside scrolling article */}
        {!showVisualizer && headings.length > 0 && (
          <aside
            className={cn(
              "hidden xl:flex shrink-0 sticky top-[48px] h-[calc(100vh-48px)] overflow-y-auto no-scrollbar select-none flex-col transition-all duration-300 ease-in-out",
              isExpanded ? "w-64" : "w-12"
            )}
          >
            <div className={cn("py-10 transition-all duration-300", isExpanded ? "px-6" : "px-2 flex flex-col items-center")}>
              <div className={cn("flex items-center justify-between mb-4 w-full", !isExpanded && "justify-center")}>
                {isExpanded && (
                  <div className="flex items-center gap-2 text-muted-foreground/80 dark:text-muted-foreground/60 animate-fadeIn">
                    <List className="w-4 h-4" />
                    <span className="text-[10px] font-medium uppercase tracking-widest">
                      On this page
                    </span>
                  </div>
                )}
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="p-1 hover:bg-muted/60 dark:hover:bg-neutral-800/60 rounded text-muted-foreground/80 hover:text-foreground transition-all cursor-pointer"
                  aria-label={isExpanded ? "Collapse table of contents" : "Expand table of contents"}
                >
                  <ChevronRight
                    className={cn(
                      "w-4 h-4 transition-transform duration-200",
                      isExpanded ? "rotate-90" : "rotate-180"
                    )}
                  />
                </button>
              </div>

              <div
                className={cn(
                  "transition-all duration-300 ease-in-out overflow-hidden origin-top",
                  isExpanded
                    ? "max-h-[1000px] opacity-100 mt-2"
                    : "max-h-0 opacity-0 pointer-events-none"
                )}
              >
                <ul className="flex flex-col gap-2.5 text-[12.5px] border-l-2 border-neutral-200 dark:border-neutral-800/60 pl-0 relative">
                  {headings.map((h) => (
                    <li key={h.id} className="relative">
                      {activeId === h.id && (
                        <motion.div
                          layoutId="complexityActiveIndicator"
                          className="absolute -left-[2px] top-0 bottom-0 w-[2px] bg-neutral-900 dark:bg-neutral-100 rounded-full"
                          transition={{ type: "spring", stiffness: 380, damping: 30 }}
                        />
                      )}
                      <a
                        href={`#${h.id}`}
                        onClick={(e) => handleTocClick(e, h.id)}
                        style={{ paddingLeft: `${12 + (h.level - 3) * 12}px` }}
                        className={cn(
                          "block py-0.5 pr-3 transition-colors",
                          activeId === h.id
                            ? "text-neutral-900 dark:text-neutral-100 font-medium"
                            : "text-muted-foreground hover:text-foreground"
                        )}
                      >
                        {h.text}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </aside>
        )}
      </div>

      {/* Mobile Visualizer Overlay */}
      {showVisualizer && (
        <div className="flex lg:hidden fixed inset-0 z-50 bg-background flex-col select-none">
          <div className="h-12 border-b border-border flex items-center justify-between px-4 shrink-0 bg-muted/40">
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-primary" />
              Interactive Simulator
            </span>
            <div className="flex items-center gap-2">
              {guide.visualizations && guide.visualizations.length > 1 && (
                <Select value={activeViz} onValueChange={setActiveViz}>
                  <SelectTrigger className="h-7 text-xs border border-border/40 bg-background text-foreground w-[150px] focus:ring-0">
                    <SelectValue placeholder="Select visualization" />
                  </SelectTrigger>
                  <SelectContent>
                    {guide.visualizations.map((vizId) => (
                      <SelectItem key={vizId} value={vizId} className="text-xs">
                        {vizId
                          .split("-")
                          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                          .join(" ")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
                onClick={() => setShowVisualizer(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <div className="flex-1 overflow-auto no-scrollbar p-6 relative flex flex-col bg-background">
            <div className="flex-1 flex flex-col min-h-0 relative">
              {renderVisualization(activeViz)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
