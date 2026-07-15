import React, { useState, useEffect } from 'react';
import { CATEGORY_ORDER } from '@/constants/categories';
import { Button } from '@/components/ui/button';
import { Check, Info, LayoutGrid, Sparkles, Folder, Loader2, Send } from 'lucide-react';
import { TOPIC_ICONS } from '@/components/ProblemFilterPopup';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface PatternGuessPanelProps {
  algorithm: any;
  onSubmit: (selected: string[]) => void;
  isSubmitting?: boolean;
  initialSelected?: string[];
  submittedState?: 'idle' | 'submitted';
}

const PATTERN_DESCRIPTIONS: Record<string, string> = {
  "Array": "Store sequential data to access elements efficiently by index.",
  "Hash Map": "Map keys to values for lightning-fast constant-time lookups.",
  "Arrays & Hashing": "Use arrays or hash maps to store and lookup data efficiently.",
  "Two Pointers": "Use two references to traverse collections from different ends or speeds.",
  "Prefix Sum": "Precompute cumulative sums to quickly query subarray sums.",
  "Sliding Window": "Maintain a dynamic window of elements to solve subarray problems.",
  "Binary Search": "Efficiently search sorted data by repeatedly dividing the search space.",
  "Stack": "LIFO data structure, often used for parsing or monotonic sequences.",
  "Linked List": "Sequential data structure composed of node pointers.",
  "Intervals": "Merge, insert, or find overlaps in ranges of numbers.",
  "Backtracking": "Explore all paths and revert choices when hitting dead ends.",
  "Trees": "Hierarchical structures often traversed recursively (DFS/BFS).",
  "Graphs": "Nodes and edges, explored via DFS, BFS, or advanced algorithms.",
  "Tries": "Prefix trees optimized for string and character-by-character searches.",
  "Greedy": "Make locally optimal choices at each step to find a global optimum.",
  "Dynamic Programming": "Store solutions to subproblems to avoid redundant work.",
  "Math & Geometry": "Mathematical formulas, primes, and geometric properties.",
  "Bit Manipulation": "Operate directly on binary representations of numbers.",
  "Heap / Priority Queue": "Dynamically retrieve the max or min element efficiently.",
  "Advanced Algorithms": "Complex topics like Union Find or Topological Sort.",
  "Design Pattern": "Implement custom data structures or architectural patterns.",
  "Sorting": "Arrange elements in a specific order to optimize searching or processing."
};

const GUESS_DISPLAY_ORDER = [
  "Array",
  "Hash Map",
  "Sorting",
  ...CATEGORY_ORDER.filter(c => c !== "Arrays & Hashing")
];

export const PatternGuessPanel: React.FC<PatternGuessPanelProps> = ({
  algorithm,
  onSubmit,
  isSubmitting = false,
  initialSelected = [],
  submittedState = 'idle'
}) => {
  const [selected, setSelected] = useState<Set<string>>(new Set(initialSelected));

  // Reset selected if initialSelected changes (e.g. from loaded history)
  useEffect(() => {
    setSelected(new Set(initialSelected));
  }, [initialSelected]);

  const togglePattern = (pattern: string) => {
    if (submittedState === 'submitted') return; // Lock if submitted (optional)
    
    const newSelected = new Set(selected);
    if (newSelected.has(pattern)) {
      newSelected.delete(pattern);
    } else {
      newSelected.add(pattern);
    }
    setSelected(newSelected);
  };

  const handleSubmit = () => {
    onSubmit(Array.from(selected));
  };

  return (
    <div className="h-full flex flex-col bg-background relative overflow-hidden">
      {/* Tab-like header matching the left panel */}
      <div className="px-0 shrink-0 border-b bg-background/50 relative flex items-center justify-between h-9">
        <div className="flex-1 min-w-0 relative h-9 flex items-center">
          <div className="flex p-0 bg-transparent gap-0 rounded-none h-9 w-max">
            <div className="h-9 px-4 rounded-none border-b-2 border-primary bg-background text-foreground flex items-center justify-center gap-2 relative z-10 font-medium text-[13px]">
              <LayoutGrid className="w-4 h-4 text-primary" />
              <span>Pattern Assessment</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2 pr-3">
          <span className="text-[11px] font-medium text-muted-foreground bg-muted/50 px-2 py-0.5 rounded-full border border-border">
              {selected.size} selected
          </span>
        </div>
      </div>

      <ScrollArea className="flex-1 p-4 sm:p-5">
        <div className="max-w-4xl mx-auto mb-5">
            <p className="text-sm text-muted-foreground leading-relaxed">
            Select all the algorithmic patterns and topics that apply to <strong className="text-foreground font-medium">{algorithm?.title || 'this problem'}</strong>. 
            Identifying the core pattern is the first step to mastering the solution.
            </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-24 max-w-4xl mx-auto">
          {GUESS_DISPLAY_ORDER.map((pattern, index) => {
            const isSelected = selected.has(pattern);
            const Icon = TOPIC_ICONS[pattern] || (pattern === 'Array' ? TOPIC_ICONS['Arrays & Hashing'] : pattern === 'Hash Map' ? TOPIC_ICONS['Arrays & Hashing'] : pattern === 'Sorting' ? TOPIC_ICONS['Math & Geometry'] : Folder);
            
            return (
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: index * 0.02 }}
                key={pattern}
                onClick={() => togglePattern(pattern)}
                className={cn(
                  "relative flex items-start gap-3.5 p-4 text-left transition-all duration-200 overflow-hidden group",
                  "border rounded-lg",
                  isSelected 
                    ? "border-primary bg-primary/10 shadow-[0_4px_15px_rgba(var(--primary),0.1)] ring-1 ring-primary/20" 
                    : "border-border bg-card/60 hover:bg-accent/40 hover:border-primary/40 shadow-sm hover:shadow-md"
                )}
              >
                {/* Active gradient background */}
                {isSelected && (
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-80" />
                )}

                <div className={cn(
                  "flex items-center justify-center w-5 h-5 rounded-[6px] flex-shrink-0 mt-0.5 border transition-all duration-200 relative z-10",
                  isSelected 
                    ? "bg-primary border-primary text-primary-foreground scale-105 shadow-sm" 
                    : "bg-background border-border/80 text-transparent group-hover:border-primary/50 group-hover:bg-primary/5"
                )}>
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
                
                <div className="flex-1 min-w-0 relative z-10">
                  <span className={cn(
                    "font-semibold text-[15px] transition-colors duration-200 flex items-center gap-2",
                    isSelected ? "text-foreground" : "text-foreground/90"
                  )}>
                    <Icon className="w-4 h-4 opacity-70" />
                    {pattern}
                  </span>
                  <p className={cn(
                    "text-[12px] mt-1.5 line-clamp-2 leading-relaxed transition-colors duration-200",
                    isSelected ? "text-foreground/80 font-medium" : "text-muted-foreground/80"
                  )}>
                    {PATTERN_DESCRIPTIONS[pattern] || "Identify this pattern in the algorithm."}
                  </p>
                </div>
              </motion.button>
            );
          })}
        </div>
      </ScrollArea>

      <div className="absolute bottom-0 left-0 right-0 py-2 px-4 bg-background border-t shadow-[0_-8px_30px_rgba(0,0,0,0.12)] z-20 flex items-center justify-center">
        <Button 
            size="sm" 
            onClick={handleSubmit}
            disabled={isSubmitting || selected.size === 0}
            className={cn(
                "h-9 px-5 text-xs rounded-md border relative overflow-hidden transition-all duration-300 font-bold shrink-0 shadow-sm",
                selected.size > 0
                    ? "bg-primary text-black hover:text-black border-primary/20 hover:bg-primary/90 hover:shadow-[0_0_20px_rgba(var(--primary),0.4)]"
                    : "bg-zinc-400 text-black border-border opacity-60"
            )}
        >
            <div className="relative z-10 flex items-center gap-2">
                {isSubmitting ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                    <Send className="w-3.5 h-3.5" />
                )}
                <span>Submit</span>
            </div>
        </Button>
      </div>
    </div>
  );
};
