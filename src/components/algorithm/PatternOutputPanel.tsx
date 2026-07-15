import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, XCircle, ChevronDown, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { RichText } from '@/components/RichText';

export interface PatternOutputPanelProps {
  isOpen: boolean;
  onClose: () => void;
  result: 'pass' | 'fail' | null;
  selectedPatterns: string[];
  correctPatterns: string[];
  explanations?: Record<string, string>;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
}

export const PatternOutputPanel: React.FC<PatternOutputPanelProps> = ({
  isOpen,
  onClose,
  result,
  selectedPatterns,
  correctPatterns,
  explanations = {},
  isExpanded = false,
  onToggleExpand
}) => {
  if (!isOpen || !result) return null;

  const isPass = result === 'pass';
  
  // Combine selected and correct to get all unique patterns involved in this evaluation
  const allInvolvedPatterns = Array.from(new Set([...selectedPatterns, ...correctPatterns]));

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: "100%", opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: "100%", opacity: 0 }}
        transition={{ type: "spring", bounce: 0, duration: 0.4 }}
        className={cn(
            "absolute bottom-0 left-0 right-0 z-50 bg-background border-t shadow-2xl flex flex-col",
            isPass ? "border-green-500/30" : "border-red-500/30",
            isExpanded ? "h-full" : "h-[45vh]"
        )}
      >
        {/* Header */}
        <div className={cn(
            "flex-none flex items-center justify-between px-4 py-2 border-b",
            isPass ? "bg-green-500/10 border-green-500/20" : "bg-red-500/10 border-red-500/20"
        )}>
          <div className="flex items-center gap-3">
            {isPass ? (
              <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
            ) : (
              <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
            )}
            <h3 className={cn(
                "font-semibold text-lg",
                isPass ? "text-green-700 dark:text-green-400" : "text-red-700 dark:text-red-400"
            )}>
              {isPass ? "Correct! You've identified the patterns." : "Not quite right. Review the feedback below."}
            </h3>
          </div>
          
          <div className="flex items-center gap-1">
            {onToggleExpand && (
              <Button variant="ghost" size="icon" onClick={onToggleExpand} className="h-8 w-8 hover:bg-background/50">
                <ChevronDown className={cn("w-4 h-4 transition-transform", isExpanded ? "rotate-180" : "")} />
              </Button>
            )}
            <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 hover:bg-background/50">
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <ScrollArea className="flex-1 p-4 bg-muted/10">
          <div className="max-w-4xl mx-auto space-y-6 pb-8">
            
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                Pattern Analysis
              </h4>
              
              <div className="grid gap-3">
                {allInvolvedPatterns.map(pattern => {
                  const wasSelected = selectedPatterns.includes(pattern);
                  const isCorrect = correctPatterns.includes(pattern);
                  const explanation = explanations[pattern] 
                    || explanations[pattern.toLowerCase()]
                    || ((pattern === 'Array' || pattern === 'Hash Map') ? (explanations['Arrays & Hashing'] || explanations['arrays & hashing']) : null);
                  
                  let statusCardClass = "";
                  let icon = null;
                  let statusText = "";
                  
                  if (wasSelected && isCorrect) {
                    statusCardClass = "bg-green-500/5 border-green-500/20 ring-1 ring-green-500/10";
                    icon = <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />;
                    statusText = "Correctly Identified";
                  } else if (wasSelected && !isCorrect) {
                    statusCardClass = "bg-red-500/5 border-red-500/20 ring-1 ring-red-500/10";
                    icon = <XCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />;
                    statusText = "Incorrectly Selected";
                  } else if (!wasSelected && isCorrect) {
                    statusCardClass = "bg-amber-500/5 border-amber-500/20 ring-1 ring-amber-500/10";
                    icon = <XCircle className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />;
                    statusText = "Missed Pattern";
                  }

                  return (
                    <div key={pattern} className={cn("p-4 rounded-xl border flex gap-3", statusCardClass)}>
                      {icon}
                      <div className="space-y-1.5 flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-semibold text-sm">{pattern}</span>
                          <span className={cn(
                            "text-xs px-2 py-0.5 rounded-full font-medium border",
                            wasSelected && isCorrect ? "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20" :
                            wasSelected && !isCorrect ? "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20" :
                            "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20"
                          )}>
                            {statusText}
                          </span>
                        </div>
                        
                        {explanation ? (
                          <div className="text-sm text-muted-foreground leading-relaxed mt-2 prose prose-sm dark:prose-invert max-w-none">
                              <RichText content={explanation} />
                          </div>
                        ) : (
                          <p className="text-sm text-muted-foreground italic mt-2">
                            {isCorrect 
                                ? "This pattern is part of the optimal solution for this problem." 
                                : "This pattern is not typically used to solve this problem optimally."}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* General explanation if available (can be stored in a special key like 'General' or 'Intuition') */}
            {(explanations['General'] || explanations['Intuition']) && (
               <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 mt-6">
                 <h4 className="font-semibold text-sm mb-2 text-primary flex items-center gap-2">
                   <BookOpen className="w-4 h-4" />
                   Problem Intuition
                 </h4>
                 <div className="text-sm text-muted-foreground leading-relaxed prose prose-sm dark:prose-invert max-w-none">
                    <RichText content={explanations['General'] || explanations['Intuition']} />
                 </div>
               </div>
            )}
            
          </div>
        </ScrollArea>
      </motion.div>
    </AnimatePresence>
  );
};
