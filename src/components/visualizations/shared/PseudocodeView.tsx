import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GitBranch } from 'lucide-react';

interface PseudocodeViewProps {
  /**
   * All pseudo-statements for this visualization, one per step.
   * e.g. ["SET seen = empty map", "FOR i = 0 to n-1", ...]
   */
  steps: string[];
  /** Index of the currently active step to highlight */
  activeIndex: number;
  className?: string;
  hideHeader?: boolean;
}

/**
 * PseudocodeView renders a vertical list of language-agnostic pseudo-statements
 * and highlights the currently active one. It is used as the "Pseudocode" view
 * mode inside VisualizationCodePanel, as an alternative to the code editor.
 */
export const PseudocodeView = ({
  steps,
  activeIndex,
  className = '',
  hideHeader = false,
}: PseudocodeViewProps) => {
  const activeRef = React.useRef<HTMLDivElement>(null);

  // Auto-scroll the active step into view
  React.useEffect(() => {
    activeRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [activeIndex]);

  return (
    <div
      className={`rounded-lg border border-border overflow-hidden bg-card flex flex-col ${className}`}
    >
      {/* Header */}
      {!hideHeader && (
        <div className="bg-muted pl-4 pr-3 border-b border-border flex items-center gap-2 h-10 shrink-0">
          <GitBranch className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="text-xs font-semibold text-foreground">Pseudocode</span>
          <span className="ml-auto text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
            Step {activeIndex + 1} / {steps.length}
          </span>
        </div>
      )}

      {/* Steps list */}
      <div className="flex-1 overflow-y-auto p-3 space-y-1 min-h-0">
        {steps.map((step, idx) => {
          const isActive = idx === activeIndex;
          const isPast = idx < activeIndex;

          return (
            <div
              key={idx}
              ref={isActive ? activeRef : undefined}
            >
              <motion.div
                layout
                className={`flex items-start gap-3 px-3 py-2.5 rounded-lg text-sm font-mono transition-colors duration-200 ${
                  isActive
                    ? 'bg-primary/10 border border-primary/40 shadow-sm'
                    : isPast
                    ? 'bg-muted/30 border border-transparent opacity-60'
                    : 'bg-muted/10 border border-transparent opacity-40'
                }`}
              >
                {/* Step number / indicator */}
                <div
                  className={`flex-shrink-0 w-5 h-5 mt-0.5 rounded-full flex items-center justify-center text-[10px] font-bold transition-colors duration-200 ${
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : isPast
                      ? 'bg-muted-foreground/30 text-muted-foreground'
                      : 'bg-muted/50 text-muted-foreground/50'
                  }`}
                >
                  {isPast ? '✓' : idx + 1}
                </div>

                {/* Statement text */}
                <span
                  className={`leading-relaxed transition-colors duration-200 ${
                    isActive
                      ? 'text-foreground font-semibold'
                      : isPast
                      ? 'text-muted-foreground'
                      : 'text-muted-foreground/60'
                  }`}
                >
                  {step}
                </span>

                {/* Active pulse dot */}
                {isActive && (
                  <AnimatePresence>
                    <motion.div
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="ml-auto flex-shrink-0 mt-1"
                    >
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
                      </span>
                    </motion.div>
                  </AnimatePresence>
                )}
              </motion.div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
