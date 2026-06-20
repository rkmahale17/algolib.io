"use client";

import * as React from "react";
import { useState, useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  HardDrive,
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
  GuideVisualizationsSection,
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
  } else if (complexity.startsWith("O(V)") || complexity.startsWith("O(V + E)")) {
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

export default function SpaceComplexityClient() {
  const router = useRouter();
  const { hasPremiumAccess } = useApp();

  // Find guide details in guidesData
  const guide = useMemo(() => {
    return guidesData.flatMap((c) => c.guides).find((g) => g.slug === "space-complexity")!;
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
  const categoryLabel = "Space Complexity";
  const categoryHref = "/guides/space-complexity";

  // Flat guides list for previous/next navigation
  const allGuides = useMemo(() => {
    return guidesData.flatMap((c) => c.guides);
  }, []);

  const currentIndex = useMemo(() => {
    return allGuides.findIndex((g) => g.slug === "space-complexity");
  }, [allGuides]);

  const prevGuide = currentIndex > 0 ? allGuides[currentIndex - 1] : null;
  const nextGuide = currentIndex < allGuides.length - 1 ? allGuides[currentIndex + 1] : null;

  // Toggle completion
  const toggleComplete = () => {
    const newState = !isCompleted;
    setIsCompleted(newState);
    localStorage.setItem(
      `rulcode_guide_completed_space-complexity`,
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
    { level: 3, text: "What is Space Complexity?", id: "what-is-space-complexity" },
    { level: 3, text: "O(1) - Constant Space", id: "o1---constant-space" },
    { level: 3, text: "O(log n) - Logarithmic Space", id: "olog-n---logarithmic-space" },
    { level: 3, text: "O(n) - Linear Space", id: "on---linear-space" },
    { level: 3, text: "O(n log n) - Linearithmic Space", id: "on-log-n---linearithmic-space" },
    { level: 3, text: "O(n^2) - Quadratic Space", id: "on2---quadratic-space" },
    { level: 3, text: "Interactive Visualizations", id: "interactive-visualizations" },
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
                    {/* What is Space Complexity? Section */}
                    <section className="flex flex-col">
                      <GuideHeading id="what-is-space-complexity">What is Space Complexity?</GuideHeading>
                      <GuideParagraph>
                        Imagine you are playing a game in your bedroom. <strong>Space complexity</strong> is all about how much <strong>room</strong> your toys and boxes take up on your floor while you are playing! In a computer, "room" is called memory. If you are sorting your toys, do you need to borrow a lot of extra, empty boxes to lay them out, or can you do it all inside one single box?
                      </GuideParagraph>
                      <GuideParagraph>
                        Programmers care a lot about <strong>auxiliary space</strong>. This is just a fancy name for the <em>extra</em> helper boxes you need to bring into the room *just* to help you sort or play. The toys you started with don't count—only the extra boxes you borrow count!
                      </GuideParagraph>
                      <GuideParagraph>
                        Computer room is divided into two areas: the <strong>Stack</strong> (like a stack of sticky notes to remember quick chores) and the <strong>Heap</strong> (like giant shelves to store larger toyboxes). If you run out of floor space, the game crashes, so we always try to keep our rooms tidy!
                      </GuideParagraph>
 
                      <div className="mt-8 flex flex-col">
                        <GuideParagraph>
                          A <strong>data structure</strong> is like a set of fancy storage boxes! Some storage boxes use very little extra room, while others take up a whole shelf. Let's see how much storage room different toy organizers take up on our floor!
                        </GuideParagraph>
                        <h5 className="text-base font-medium text-foreground/80 tracking-tight mt-2 mb-3">
                          Common Data Structure Space Complexity
                        </h5>
                        <GuideTable>
                          <thead className="bg-muted/40">
                            <tr>
                              <th className="px-4 py-2 text-left font-medium text-muted-foreground/80 text-[9.5px] uppercase tracking-widest leading-4">Data Structure</th>
                              <th className="px-4 py-2 text-left font-medium text-muted-foreground/80 text-[9.5px] uppercase tracking-widest leading-4">Space Complexity</th>
                              <th className="px-4 py-2 text-left font-medium text-muted-foreground/80 text-[9.5px] uppercase tracking-widest leading-4">Why / Notes</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-border/20 bg-background/20">
                            <tr className="bg-transparent hover:bg-muted/15 dark:hover:bg-muted/5 transition-colors">
                              <td className="px-4 py-2.5 text-foreground font-medium text-[14px] leading-5">Array / Vector</td>
                              <td className="px-4 py-2.5 text-muted-foreground text-[14px] leading-5">{renderComplexityBadge("O(n)")}</td>
                              <td className="px-4 py-2.5 text-muted-foreground text-[14px] leading-5">Allocates a contiguous block of memory to store N elements.</td>
                            </tr>
                            <tr className="bg-muted/30 dark:bg-muted/10 hover:bg-muted/40 dark:hover:bg-muted/15 transition-colors">
                              <td className="px-4 py-2.5 text-foreground font-medium text-[14px] leading-5">Singly Linked List</td>
                              <td className="px-4 py-2.5 text-muted-foreground text-[14px] leading-5">{renderComplexityBadge("O(n)")}</td>
                              <td className="px-4 py-2.5 text-muted-foreground text-[14px] leading-5">Allocates N separate nodes, each with a value and a next pointer.</td>
                            </tr>
                            <tr className="bg-transparent hover:bg-muted/15 dark:hover:bg-muted/5 transition-colors">
                              <td className="px-4 py-2.5 text-foreground font-medium text-[14px] leading-5">Doubly Linked List</td>
                              <td className="px-4 py-2.5 text-muted-foreground text-[14px] leading-5">{renderComplexityBadge("O(n)")}</td>
                              <td className="px-4 py-2.5 text-muted-foreground text-[14px] leading-5">Allocates N separate nodes, each containing previous and next pointers.</td>
                            </tr>
                            <tr className="bg-muted/30 dark:bg-muted/10 hover:bg-muted/40 dark:hover:bg-muted/15 transition-colors">
                              <td className="px-4 py-2.5 text-foreground font-medium text-[14px] leading-5">Stack (LIFO)</td>
                              <td className="px-4 py-2.5 text-muted-foreground text-[14px] leading-5">{renderComplexityBadge("O(n)")}</td>
                              <td className="px-4 py-2.5 text-muted-foreground text-[14px] leading-5">Grows linearly with the maximum number of items pushed onto the stack.</td>
                            </tr>
                            <tr className="bg-transparent hover:bg-muted/15 dark:hover:bg-muted/5 transition-colors">
                              <td className="px-4 py-2.5 text-foreground font-medium text-[14px] leading-5">Queue (FIFO)</td>
                              <td className="px-4 py-2.5 text-muted-foreground text-[14px] leading-5">{renderComplexityBadge("O(n)")}</td>
                              <td className="px-4 py-2.5 text-muted-foreground text-[14px] leading-5">Grows linearly with the maximum number of items stored in the queue.</td>
                            </tr>
                            <tr className="bg-muted/30 dark:bg-muted/10 hover:bg-muted/40 dark:hover:bg-muted/15 transition-colors">
                              <td className="px-4 py-2.5 text-foreground font-medium text-[14px] leading-5">Hash Table</td>
                              <td className="px-4 py-2.5 text-muted-foreground text-[14px] leading-5">{renderComplexityBadge("O(n)")}</td>
                              <td className="px-4 py-2.5 text-muted-foreground text-[14px] leading-5">Scales linearly with the number of key-value pairs stored in buckets.</td>
                            </tr>
                            <tr className="bg-transparent hover:bg-muted/15 dark:hover:bg-muted/5 transition-colors">
                              <td className="px-4 py-2.5 text-foreground font-medium text-[14px] leading-5">Binary Search Tree</td>
                              <td className="px-4 py-2.5 text-muted-foreground text-[14px] leading-5">{renderComplexityBadge("O(n)")}</td>
                              <td className="px-4 py-2.5 text-muted-foreground text-[14px] leading-5">Requires memory proportional to the N nodes in the tree structure.</td>
                            </tr>
                            <tr className="bg-muted/30 dark:bg-muted/10 hover:bg-muted/40 dark:hover:bg-muted/15 transition-colors">
                              <td className="px-4 py-2.5 text-foreground font-medium text-[14px] leading-5">Red-Black Tree / AVL</td>
                              <td className="px-4 py-2.5 text-muted-foreground text-[14px] leading-5">{renderComplexityBadge("O(n)")}</td>
                              <td className="px-4 py-2.5 text-muted-foreground text-[14px] leading-5">Allocates space for N nodes with additional balancing color/height fields.</td>
                            </tr>
                          </tbody>
                        </GuideTable>
                      </div>
 
                      <div className="mt-8 flex flex-col">
                        <GuideParagraph>
                          An <strong>algorithm</strong> (our step-by-step game plan) often needs to borrow extra storage while it works. If we split a puzzle into tiny pieces, we need extra space to hold those pieces while we put them back together. Let's look at how much extra room different game plans need!
                        </GuideParagraph>
                        <h5 className="text-base font-medium text-foreground/80 tracking-tight mt-2 mb-3">
                          Common Algorithmic Space Complexity
                        </h5>
                        <GuideTable>
                          <thead className="bg-muted/40">
                            <tr>
                              <th className="px-4 py-2 text-left font-medium text-muted-foreground/80 text-[9.5px] uppercase tracking-widest leading-4">Operation / Algorithm</th>
                              <th className="px-4 py-2 text-left font-medium text-muted-foreground/80 text-[9.5px] uppercase tracking-widest leading-4">Auxiliary Space</th>
                              <th className="px-4 py-2 text-left font-medium text-muted-foreground/80 text-[9.5px] uppercase tracking-widest leading-4">Why / Notes</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-border/20 bg-background/20">
                            <tr className="bg-transparent hover:bg-muted/15 dark:hover:bg-muted/5 transition-colors">
                              <td className="px-4 py-2.5 text-foreground font-medium text-[14px] leading-5">Binary Search (Iterative)</td>
                              <td className="px-4 py-2.5 text-muted-foreground text-[14px] leading-5">{renderComplexityBadge("O(1)")}</td>
                              <td className="px-4 py-2.5 text-muted-foreground text-[14px] leading-5">Uses a constant number of pointers and variables.</td>
                            </tr>
                            <tr className="bg-muted/30 dark:bg-muted/10 hover:bg-muted/40 dark:hover:bg-muted/15 transition-colors">
                              <td className="px-4 py-2.5 text-foreground font-medium text-[14px] leading-5">Binary Search (Recursive)</td>
                              <td className="px-4 py-2.5 text-muted-foreground text-[14px] leading-5">{renderComplexityBadge("O(log n)")}</td>
                              <td className="px-4 py-2.5 text-muted-foreground text-[14px] leading-5">Requires recursive call stack space proportional to log N.</td>
                            </tr>
                            <tr className="bg-transparent hover:bg-muted/15 dark:hover:bg-muted/5 transition-colors">
                              <td className="px-4 py-2.5 text-foreground font-medium text-[14px] leading-5">Merge Sort</td>
                              <td className="px-4 py-2.5 text-muted-foreground text-[14px] leading-5">{renderComplexityBadge("O(n)")}</td>
                              <td className="px-4 py-2.5 text-muted-foreground text-[14px] leading-5">Requires auxiliary arrays of size N to merge split subarrays.</td>
                            </tr>
                            <tr className="bg-muted/30 dark:bg-muted/10 hover:bg-muted/40 dark:hover:bg-muted/15 transition-colors">
                              <td className="px-4 py-2.5 text-foreground font-medium text-[14px] leading-5">Quick Sort</td>
                              <td className="px-4 py-2.5 text-muted-foreground text-[14px] leading-5">{renderComplexityBadge("O(log n)")}</td>
                              <td className="px-4 py-2.5 text-muted-foreground text-[14px] leading-5">Average-case recursion stack space for partition branches.</td>
                            </tr>
                            <tr className="bg-transparent hover:bg-muted/15 dark:hover:bg-muted/5 transition-colors">
                              <td className="px-4 py-2.5 text-foreground font-medium text-[14px] leading-5">Graph DFS</td>
                              <td className="px-4 py-2.5 text-muted-foreground text-[14px] leading-5">{renderComplexityBadge("O(V)")}</td>
                              <td className="px-4 py-2.5 text-muted-foreground text-[14px] leading-5">Recursion stack tracks the path depth (vertices count in worst case).</td>
                            </tr>
                            <tr className="bg-muted/30 dark:bg-muted/10 hover:bg-muted/40 dark:hover:bg-muted/15 transition-colors">
                              <td className="px-4 py-2.5 text-foreground font-medium text-[14px] leading-5">Graph BFS</td>
                              <td className="px-4 py-2.5 text-muted-foreground text-[14px] leading-5">{renderComplexityBadge("O(V)")}</td>
                              <td className="px-4 py-2.5 text-muted-foreground text-[14px] leading-5">Queue stores adjacent vertices at the maximum layer width.</td>
                            </tr>
                          </tbody>
                        </GuideTable>
                      </div>
 
                      <div className="my-[56px] not-prose">
                        <div className="grid md:grid-cols-2 gap-6">
                          <Card className="bg-card/50 backdrop-blur-sm border-t-4 border-t-indigo-500">
                            <CardHeader>
                              <CardTitle className="flex items-center gap-2 text-lg">
                                <Server className="w-5 h-5 text-indigo-500" />
                                Extra Room (Auxiliary Space)
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="text-muted-foreground text-sm">
                              The temporary extra boxes you borrow while sorting your toys. This shows the true cleanliness of your sorting logic!
                            </CardContent>
                          </Card>
                          <Card className="bg-card/50 backdrop-blur-sm border-t-4 border-t-indigo-500">
                            <CardHeader>
                              <CardTitle className="flex items-center gap-2 text-lg">
                                <HardDrive className="w-5 h-5 text-indigo-500" />
                                Total Room (Total Space Complexity)
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="text-muted-foreground text-sm">
                               The whole space taken up by your original toys AND the extra boxes together. Helpful for knowing the total mess on the floor!
                            </CardContent>
                          </Card>
                        </div>
                      </div>
                    </section>

                    {/* Complexity Card Sections */}
                    <section className="my-[56px]">
                      <GuideHeading id="o1---constant-space">O(1) - Constant Space</GuideHeading>
                      <GuideParagraph>
                        Constant storage room, written as <strong>O(1)</strong>, means you don't need any new helper boxes at all! No matter if you have 10 toys or 10,000 toys, you can sort them and play with them in the exact same spot on the floor.
                      </GuideParagraph>
                      <GuideParagraph>
                        For example, if you want to reverse a line of toy cars, you can just swap the cars in-place (first with last, second with second-to-last) without bringing any new, empty boxes into your room. Striving for O(1) space is the ultimate way to keep your room clean!
                      </GuideParagraph>
                      <div className="not-prose">
                        <ComplexityCard
                          type="O(1)"
                          n={nComplexity['O(1)']}
                          onNChange={(val) => handleNComplexityChange('O(1)', val)}
                          animationComponent={<ConstantTimeAnim n={nComplexity['O(1)']} />}
                          codes={{
                            python: `def reverse_in_place(arr):
    # Reverses the array using constant O(1) auxiliary space
    left, right = 0, len(arr) - 1
    while left < right:
        arr[left], arr[right] = arr[right], arr[left]
        left += 1
        right -= 1
    return arr`,
                            cpp: `#include <vector>
#include <utility>

void reverseInPlace(std::vector<int>& arr) {
    // Reverses the array using constant O(1) auxiliary space
    int left = 0, right = arr.size() - 1;
    while (left < right) {
        std::swap(arr[left], arr[right]);
        left++;
        right--;
    }
}`,
                            java: `public class ConstantSpace {
    public static void reverseInPlace(int[] arr) {
        // Reverses the array using constant O(1) auxiliary space
        int left = 0, right = arr.length - 1;
        while (left < right) {
            int temp = arr[left];
            arr[left] = arr[right];
            arr[right] = temp;
            left++;
            right--;
        }
    }
}`,
                            typescript: `function reverseInPlace<T>(arr: T[]): T[] {
  // Reverses the array using constant O(1) auxiliary space
  let left = 0;
  let right = arr.length - 1;
  while (left < right) {
    const temp = arr[left];
    arr[left] = arr[right];
    arr[right] = temp;
    left++;
    right--;
  }
  return arr;
}`
                          }}
                        />
                      </div>
                    </section>

                    <section className="my-[56px]">
                      <GuideHeading id="olog-n---logarithmic-space">O(log n) - Logarithmic Space</GuideHeading>
                      <GuideParagraph>
                        Logarithmic storage room, written as <strong>O(log n)</strong>, grows very slowly, which is awesome! Think of it like sorting books on a shelf recursively. Each time you split the bookshelf in half, you write a tiny mental note. Because you chop the bookcase in half every time, you only need a few notes!
                      </GuideParagraph>
                      <GuideParagraph>
                        Even if you have 1 billion books, your mental notes stack will only grow to 30 lines! This keeps the extra storage space super small and tidy, like a single tiny piece of paper on your desk.
                      </GuideParagraph>
                      <div className="not-prose">
                        <ComplexityCard
                          type="O(log n)"
                          n={nComplexity['O(log n)']}
                          onNChange={(val) => handleNComplexityChange('O(log n)', val)}
                          animationComponent={<LogarithmicAnim n={nComplexity['O(log n)']} />}
                          codes={{
                            python: `def recursive_binary_search(arr, target, left, right):
    # Call stack grows logarithmically: O(log n) space
    if left > right:
        return -1
    mid = (left + right) // 2
    if arr[mid] == target:
        return mid
    elif arr[mid] < target:
        return recursive_binary_search(arr, target, mid + 1, right)
    else:
        return recursive_binary_search(arr, target, left, mid - 1)`,
                            cpp: `#include <vector>

int recursiveBinarySearch(const std::vector<int>& arr, int target, int left, int right) {
    // Call stack grows logarithmically: O(log n) space
    if (left > right) return -1;
    int mid = left + (right - left) / 2;
    if (arr[mid] == target) return mid;
    if (arr[mid] < target) return recursiveBinarySearch(arr, target, mid + 1, right);
    return recursiveBinarySearch(arr, target, left, mid - 1);
}`,
                            java: `public class LogarithmicSpace {
    public static int binarySearch(int[] arr, int target, int left, int right) {
        // Call stack grows logarithmically: O(log n) space
        if (left > right) return -1;
        int mid = left + (right - left) / 2;
        if (arr[mid] == target) return mid;
        if (arr[mid] < target) return binarySearch(arr, target, mid + 1, right);
        return binarySearch(arr, target, left, mid - 1);
    }
}`,
                            typescript: `function recursiveBinarySearch(
  arr: number[],
  target: number,
  left: number,
  right: number
): number {
  // Call stack grows logarithmically: O(log n) space
  if (left > right) return -1;
  const mid = Math.floor((left + right) / 2);
  if (arr[mid] === target) return mid;
  if (arr[mid] < target) return recursiveBinarySearch(arr, target, mid + 1, right);
  return recursiveBinarySearch(arr, target, left, mid - 1);
}`
                          }}
                        />
                      </div>
                    </section>

                    <section className="my-[56px]">
                      <GuideHeading id="on---linear-space">O(n) - Linear Space</GuideHeading>
                      <GuideParagraph>
                        Linear storage room, written as <strong>O(n)</strong>, means your extra helper boxes grow one-by-one with your toys. If you double your toys, you need double the boxes! Imagine sorting your toy cars by color and putting each one in its own separate plastic cup.
                      </GuideParagraph>
                      <GuideParagraph>
                        If you have 10 cars, you need 10 cups. If you have 1,000 cars, you need 1,000 cups! This takes up more space, but it is often the trade-off we make to make our game run much faster. Creating duplicates of lists or using frequency hash maps takes O(n) space.
                      </GuideParagraph>
                      <div className="not-prose">
                        <ComplexityCard
                          type="O(n)"
                          n={nComplexity['O(n)']}
                          onNChange={(val) => handleNComplexityChange('O(n)', val)}
                          animationComponent={<LinearAnim n={nComplexity['O(n)']} />}
                          codes={{
                            python: `def get_frequencies(arr):
    # Hash map uses O(n) space to store frequencies of N items
    freq = {}
    for num in arr:
        freq[num] = freq.get(num, 0) + 1
    return freq`,
                            cpp: `#include <vector>
#include <unordered_map>

std::unordered_map<int, int> getFrequencies(const std::vector<int>& arr) {
    // Hash map uses O(n) space to store frequencies of N items
    std::unordered_map<int, int> freq;
    for (int num : arr) {
        freq[num]++;
    }
    return freq;
}`,
                            java: `import java.util.HashMap;
import java.util.Map;

public class LinearSpace {
    public static Map<Integer, Integer> getFrequencies(int[] arr) {
        // Hash map uses O(n) space to store frequencies of N items
        Map<Integer, Integer> freq = new HashMap<>();
        for (int num : arr) {
            freq.put(num, freq.getOrDefault(num, 0) + 1);
        }
        return freq;
    }
}`,
                            typescript: `function getFrequencies(arr: number[]): Map<number, number> {
  // Hash map uses O(n) space to store frequencies of N items
  const freq = new Map<number, number>();
  for (const num of arr) {
    freq.set(num, (freq.get(num) || 0) + 1);
  }
  return freq;
}`
                          }}
                        />
                      </div>
                    </section>

                    <section className="my-[56px]">
                      <GuideHeading id="on-log-n---linearithmic-space">O(n log n) - Linearithmic Space</GuideHeading>
                      <GuideParagraph>
                        Linearithmic storage room, written as <strong>O(n log n)</strong>, is a bit messy and takes up a lot of room. This happens when you split things in half recursively, but at *every single level* you decide to make full copies of all your toys on different shelves!
                      </GuideParagraph>
                      <GuideParagraph>
                        Because you have many levels of splitting and you keep copies at each level, the shelves start filling up quickly! Programmers try to optimize their code to avoid O(n log n) space so they don't run out of room.
                      </GuideParagraph>
                      <div className="not-prose">
                        <ComplexityCard
                          type="O(n log n)"
                          n={nComplexity['O(n log n)']}
                          onNChange={(val) => handleNComplexityChange('O(n log n)', val)}
                          animationComponent={<LinearithmicAnim n={nComplexity['O(n log n)']} />}
                          codes={{
                            python: `def unoptimized_merge_sort_space(arr):
    # Retaining full slices across O(log n) recursion levels
    # leads to O(n log n) total allocated space
    if len(arr) <= 1:
        return arr
    mid = len(arr) // 2
    left = unoptimized_merge_sort_space(arr[:mid])
    right = unoptimized_merge_sort_space(arr[mid:])
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

std::vector<int> merge(const std::vector<int>& left, const std::vector<int>& right) {
    std::vector<int> result;
    int i = 0, j = 0;
    while (i < left.size() && j < right.size()) {
        if (left[i] < right[j]) result.push_back(left[i++]);
        else result.push_back(right[j++]);
    }
    while (i < left.size()) result.push_back(left[i++]);
    while (j < right.size()) result.push_back(right[j++]);
    return result;
}

std::vector<int> unoptimizedMergeSort(std::vector<int> arr) {
    // Retaining full slices across O(log n) recursion levels
    // leads to O(n log n) total allocated space
    if (arr.size() <= 1) return arr;
    int mid = arr.size() / 2;
    std::vector<int> left(arr.begin(), arr.begin() + mid);
    std::vector<int> right(arr.begin() + mid, arr.end());
    
    return merge(unoptimizedMergeSort(left), unoptimizedMergeSort(right));
}`,
                            java: `import java.util.Arrays;

public class LinearithmicSpace {
    public static int[] unoptimizedMergeSort(int[] arr) {
        // Retaining full slices across O(log n) recursion levels
        // leads to O(n log n) total allocated space
        if (arr.length <= 1) return arr;
        int mid = arr.length / 2;
        int[] left = unoptimizedMergeSort(Arrays.copyOfRange(arr, 0, mid));
        int[] right = unoptimizedMergeSort(Arrays.copyOfRange(arr, mid, arr.length));
        return merge(left, right);
    }

    private static int[] merge(int[] left, int[] right) {
        int[] result = new int[left.length + right.length];
        int i = 0, j = 0, k = 0;
        while (i < left.length && j < right.length) {
            if (left[i] < right[j]) result[k++] = left[i++];
            else result[k++] = right[j++];
        }
        while (i < left.length) result[k++] = left[i++];
        while (j < right.length) result[k++] = right[j++];
        return result;
    }
}`,
                            typescript: `function unoptimizedMergeSort(arr: number[]): number[] {
  // Retaining full slices across O(log n) recursion levels
  // leads to O(n log n) total allocated space
  if (arr.length <= 1) return arr;
  const mid = Math.floor(arr.length / 2);
  const left = unoptimizedMergeSort(arr.slice(0, mid));
  const right = unoptimizedMergeSort(arr.slice(mid));
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
                      <GuideHeading id="on2---quadratic-space">O(n^2) - Quadratic Space</GuideHeading>
                      <GuideParagraph>
                        Quadratic storage room, written as <strong>O(n²)</strong>, takes up a MASSIVE amount of space! If you double your toys, the space goes up 4 times. If you have 10 toys, you need 100 squares of space. If you have 1,000 toys, you need a giant grid of 1,000,000 squares!
                      </GuideParagraph>
                      <GuideParagraph>
                        Imagine drawing a massive square grid on your bedroom floor to see which toy looks best next to every other toy. Even with just a few toys, the grid will take up your entire room floor! In coding, dynamic programming tables that use 2D matrices often take up O(n²) space.
                      </GuideParagraph>
                      <div className="not-prose">
                        <ComplexityCard
                          type="O(n^2)"
                          n={nComplexity['O(n^2)']}
                          onNChange={(val) => handleNComplexityChange('O(n^2)', val)}
                          animationComponent={<QuadraticAnim n={nComplexity['O(n^2)']} />}
                          codes={{
                            python: `def create_matrix(n):
    # Creating an N x N matrix uses O(n^2) space
    matrix = [[0] * n for _ in range(n)]
    return matrix`,
                            cpp: `#include <vector>

std::vector<std::vector<int>> createMatrix(int n) {
    // Creating an N x N matrix uses O(n^2) space
    return std::vector<std::vector<int>>(n, std::vector<int>(n, 0));
}`,
                            java: `public class QuadraticSpace {
    public static int[][] createMatrix(int n) {
        // Creating an N x N matrix uses O(n^2) space
        int[][] matrix = new int[n][n];
        return matrix;
    }
}`,
                            typescript: `function createMatrix(n: number): number[][] {
  // Creating an N x N matrix uses O(n^2) space
  const matrix: number[][] = [];
  for (let i = 0; i < n; i++) {
    matrix.push(new Array(n).fill(0));
  }
  return matrix;
}`
                          }}
                        />
                      </div>
                    </section>
                  </div>
                </div>

                {guide && guide.visualizations && guide.visualizations.length > 0 && (
                  <GuideVisualizationsSection
                    visualizations={guide.visualizations}
                    activeViz={activeViz}
                    setActiveViz={setActiveViz}
                    showVisualizer={showVisualizer}
                    setShowVisualizer={setShowVisualizer}
                  />
                )}

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
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
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
                          layoutId="spaceComplexityActiveIndicator"
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
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
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
