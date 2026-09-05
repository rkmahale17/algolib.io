import { AlgorithmListItem, DIFFICULTY_MAP } from "@/types/algorithm";
import {
  ArrowUpDown,
  Check,
  ChevronRight,
  ListFilter,
  Lock,
  Search,
} from "lucide-react";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { ProblemFilterPopup } from "./ProblemFilterPopup";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { useParams } from "next/navigation";
import { getProblemUrl } from "@/utils/url";

interface ProblemSidebarProps {
  algorithms: AlgorithmListItem[];
  progressMap: Record<string, string>;
  isPaywallEnabled: boolean;
  hasPremiumAccess: boolean;
  className?: string;
  onItemClick?: () => void;
}

export const ProblemSidebar = ({
  algorithms,
  progressMap,
  isPaywallEnabled,
  hasPremiumAccess,
  className,
  onItemClick,
}: ProblemSidebarProps) => {
  const params = useParams();
  const id = params?.id as string;
  const slug = params?.slug as string;
  const currentIdOrSlug = id || slug;

  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [filters, setFilters] = useState({
    status: "all",
    difficulty: [] as string[],
    topics: [] as string[],
    language: "all",
  });

  const categories = useMemo(() => {
    const cats = new Set(
      algorithms
        .flatMap((a) =>
          a.category ? a.category.split(",").map((c: string) => c.trim()) : [],
        )
        .filter(Boolean),
    );
    return Array.from(cats).sort();
  }, [algorithms]);

  const filteredAlgorithms = useMemo(() => {
    const result = algorithms.filter((algo) => {
      const matchesSearch =
        algo.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        algo.name?.toLowerCase().includes(searchQuery.toLowerCase());

      const status = progressMap[algo.id] || "none";
      const matchesStatus =
        filters.status === "all" || status === filters.status;

      const rawAlgoDiff = (algo.difficulty || "").toLowerCase();
      const normalizedAlgoDiff = (
        DIFFICULTY_MAP[rawAlgoDiff] || "Medium"
      ).toLowerCase();
      const matchesDifficulty =
        filters.difficulty.length === 0 ||
        filters.difficulty.includes(normalizedAlgoDiff);

      const lowerTopics = filters.topics.map(t => t.toLowerCase());
      const matchesTopic =
        lowerTopics.length === 0 ||
        lowerTopics.includes("all") ||
        (algo.category &&
          algo.category
            .split(",")
            .some((c: string) =>
              lowerTopics.includes(c.trim().toLowerCase()),
            ));

      return (
        matchesSearch && matchesStatus && matchesDifficulty && matchesTopic
      );
    });

    result.sort((a, b) => {
      const valA = a.serial_no || 0;
      const valB = b.serial_no || 0;
      return sortOrder === "asc" ? valA - valB : valB - valA;
    });

    return result;
  }, [algorithms, searchQuery, filters, progressMap, sortOrder]);

  const totalCount = algorithms.length;
  const completedCount = useMemo(() => {
    if (!progressMap) return 0;
    return algorithms.filter((algo) => progressMap[algo.id] === "solved")
      .length;
  }, [algorithms, progressMap]);
  const progressPercentage =
    totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

  return (
    <div
      className={cn(
        "flex flex-col h-full bg-background text-foreground",
        className,
      )}
    >
      {/* Header Section with Search, Sort, Filter */}
      <div className="bg-card border-b border-border px-4 py-3">
          {/* Search & Filters */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            <div className="relative flex-1 min-w-[100px]">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
              <Input
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 h-8 text-xs bg-muted/20 border-border focus-visible:ring-1 focus-visible:ring-foreground"
              />
            </div>

            <div className="flex items-center gap-1 shrink-0">
              {["easy", "medium", "hard"].map((diff) => (
                <Button
                  key={diff}
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "h-8 px-2 text-[10px] font-semibold uppercase tracking-wider rounded-md border transition-colors",
                    filters.difficulty.includes(diff)
                      ? diff === "easy"
                        ? "bg-green-500/10 text-green-500 border-green-500/30"
                        : diff === "medium"
                          ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/30"
                          : "bg-red-500/10 text-red-500 border-red-500/30"
                      : "border-border/50 text-muted-foreground hover:bg-muted",
                  )}
                  onClick={() =>
                    setFilters((prev) => {
                      const alreadySelected = prev.difficulty.includes(diff);
                      const nextDiffs = alreadySelected
                        ? prev.difficulty.filter((d) => d !== diff)
                        : [...prev.difficulty, diff];
                      return { ...prev, difficulty: nextDiffs };
                    })
                  }
                >
                  {diff === "medium" ? "Med" : diff}
                </Button>
              ))}
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 border border-border rounded-md hover:bg-muted/50 shrink-0"
              onClick={() =>
                setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))
              }
            >
              <ArrowUpDown className="w-3.5 h-3.5" />
            </Button>

            <ProblemFilterPopup
              filters={filters}
              setFilters={setFilters}
              topics={categories}
              trigger={
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 border border-border rounded-md hover:bg-muted/50 shrink-0 relative"
                >
                  <ListFilter className="w-3.5 h-3.5" />
                </Button>
              }
            />
          </div>
      </div>

      {/* Problem List */}
      <div className="flex-1 overflow-y-auto no-scrollbar">
        {filteredAlgorithms.map((algo, index) => {
          const status = progressMap[algo.id] || "none";
          const isSolved = status === "solved";
          const isActive =
            algo.id === currentIdOrSlug || algo.slug === currentIdOrSlug;
          const isPremium =
            isPaywallEnabled &&
            (algo.is_premium || algo.is_pro || algo.metadata?.is_pro) &&
            !hasPremiumAccess;

          // Properly format difficulty for display
          const rawDiff = (algo.difficulty || "").toLowerCase();
          const normalizedDiff = DIFFICULTY_MAP[rawDiff] || "Medium";
          const displayDifficulty =
            normalizedDiff === "Medium" ? "Med." : normalizedDiff;

          return (
            <Link
              key={algo.id}
              href={getProblemUrl(algo)}
              onClick={onItemClick}
              className={cn(
                "group flex items-center gap-3 px-4 py-3 border-l-2 transition-all duration-200",
                isActive
                  ? "bg-primary/20 dark:bg-primary/30 border-primary text-foreground font-semibold"
                  : cn(
                      "border-transparent hover:bg-muted/40 dark:hover:bg-muted/10 hover:border-primary/30",
                      index % 2 !== 0 ? "bg-muted/5" : "bg-transparent",
                    ),
              )}
            >
              {/* Solve Status Icon (Tick) */}
              <div
                className={cn(
                  "flex-shrink-0 w-5 h-5 flex items-center justify-center rounded-full border transition-all duration-200",
                  isSolved
                    ? isActive
                      ? "border-primary text-primary bg-primary/10"
                      : "border-primary text-primary"
                    : isActive
                      ? "border-primary/30 text-transparent"
                      : "border-border text-transparent group-hover:border-muted-foreground/50",
                )}
              >
                {isSolved && <Check className="w-3.5 h-3.5 stroke-[3] " />}
              </div>

              {/* Problem Info */}
              <div className="flex-1 min-w-0 flex items-center gap-2">
                <span
                  className={cn(
                    "text-xs font-mono flex-shrink-0 transition-opacity",
                    isActive ? "opacity-90 font-medium" : "opacity-50 group-hover:opacity-75",
                  )}
                >
                  {algo.serial_no || index + 1}.
                </span>
                <span
                  className={cn(
                    "text-sm font-medium truncate transition-colors duration-200",
                    isActive ? "text-foreground" : "group-hover:text-primary",
                  )}
                >
                  {algo.title || algo.name}
                </span>
              </div>

              {/* Right Side Info - Aligned Right, Full Text */}
              <div className="flex items-center justify-end gap-2 px-1 min-w-[70px] relative overflow-hidden">
                {isPremium && (
                  <Lock
                    className={cn(
                      "w-3 h-3 transition-colors",
                      isActive
                        ? "text-primary/70"
                        : "text-muted-foreground group-hover:text-primary/60",
                    )}
                  />
                )}
                <span
                  className={cn(
                    "text-[10px] font-semibold uppercase tracking-wider w-[35px] text-left transition-colors duration-200",
                    normalizedDiff.toLowerCase() === "easy"
                      ? "text-green-500"
                      : normalizedDiff.toLowerCase() === "hard"
                        ? "text-red-500"
                        : "text-yellow-500",
                  )}
                >
                  {displayDifficulty}
                </span>
                <ChevronRight className="w-3 h-3 text-primary opacity-0 group-hover:opacity-100 absolute right-0 transition-opacity duration-200" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
