import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AnimatedCodeEditor } from "../shared/AnimatedCodeEditor";
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { VisualizationLayout } from '../shared/VisualizationLayout';
import { Card } from '@/components/ui/card';
import { Flame, Play, Search, RefreshCcw, PlusCircle, CheckCircle2, ArrowRight, Sparkles } from 'lucide-react';

interface Step {
  array: number[];
  i: number;
  maxSub: number;
  curSum: number;
  message: string;
  lineNumber: number;
  curRange: [number, number]; // [start, end]
  bestRange: [number, number]; // [start, end]
  phase: 'init' | 'loop' | 'check' | 'update' | 'done';
  isMaxUpdate: boolean;
}

export const MaximumSubarrayVisualization = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const code = `function maxSubArray(nums: number[]): number {
  let maxSub = nums[0];
  let curSum = 0;

  for (let i = 0; i < nums.length; i++) {
    const n = nums[i];
    
    // If current sum becomes negative, reset it
    if (curSum < 0) {
      curSum = 0;
    }

    curSum += n;
    maxSub = Math.max(maxSub, curSum);
  }

  return maxSub;
}`;

  const steps: Step[] = useMemo(() => {
    const nums = [2, -1, 3, -4, 2];
    const s: Step[] = [];

    let maxSub = nums[0];
    let curSum = 0;
    let curStart = 0;
    let bestStart = 0;
    let bestEnd = 0;

    // Phase: Initialization
    s.push({
      array: [...nums],
      i: -1,
      maxSub,
      curSum,
      message: `Step 1: Initialization. We set maxSub to the first element (${nums[0]}) and initialize curSum to 0. The goal is to find a contiguous range with the highest sum.`,
      lineNumber: 1,
      curRange: [-1, -1],
      bestRange: [0, 0],
      phase: 'init',
      isMaxUpdate: false
    });

    for (let i = 0; i < nums.length; i++) {
      const n = nums[i];

      // Phase: Loop Start
      s.push({
        array: [...nums],
        i,
        maxSub,
        curSum,
        message: `Iteration i = ${i}: Examining the element ${n}. We need to decide whether to include this element in our current subarray or start a new one.`,
        lineNumber: 5,
        curRange: curSum < 0 ? [-1, -1] : [curStart, i - 1],
        bestRange: [bestStart, bestEnd],
        phase: 'loop',
        isMaxUpdate: false
      });

      // Phase: Check curSum
      if (curSum < 0) {
        const oldStart = curStart;
        curSum = 0;
        curStart = i;
        s.push({
          array: [...nums],
          i,
          maxSub,
          curSum,
          message: `Decision Point: The previous curSum was negative. Since any sum plus a negative value is worse than the sum itself, we "reset" the current subarray and start fresh from index ${i}.`,
          lineNumber: 10,
          curRange: [curStart, i - 1],
          bestRange: [bestStart, bestEnd],
          phase: 'check',
          isMaxUpdate: false
        });
      }

      // Phase: Add n
      curSum += n;
      s.push({
        array: [...nums],
        i,
        maxSub,
        curSum,
        message: `Action: We add the current number ${n} to our running sum. curSum becomes ${curSum}. This range [${curStart}...${i}] is now our "candidate" for the maximum sum.`,
        lineNumber: 13,
        curRange: [curStart, i],
        bestRange: [bestStart, bestEnd],
        phase: 'update',
        isMaxUpdate: false
      });

      // Phase: Update maxSub
      if (curSum > maxSub) {
        const oldMax = maxSub;
        maxSub = curSum;
        bestStart = curStart;
        bestEnd = i;
        s.push({
          array: [...nums],
          i,
          maxSub,
          curSum,
          message: `🔥 Breakthrough! The current sum (${curSum}) is greater than our previous maxSub (${oldMax}). We update the "Best So Far" record and store this range: [${bestStart}...${bestEnd}].`,
          lineNumber: 14,
          curRange: [curStart, i],
          bestRange: [bestStart, bestEnd],
          phase: 'update',
          isMaxUpdate: true
        });
      } else {
        s.push({
          array: [...nums],
          i,
          maxSub,
          curSum,
          message: `Note: The current sum (${curSum}) did not exceed our record (${maxSub}). We keep searching but remember that ${maxSub} is the highest sum we've seen so far.`,
          lineNumber: 14,
          curRange: [curStart, i],
          bestRange: [bestStart, bestEnd],
          phase: 'update',
          isMaxUpdate: false
        });
      }
    }

    // Phase: Done
    s.push({
      array: [...nums],
      i: nums.length,
      maxSub,
      curSum,
      message: `Final Conclusion: We've scanned the entire array. The algorithm guarantees that the subsegment from index ${bestStart} to ${bestEnd} yields the maximum possible sum of ${maxSub}.`,
      lineNumber: 17,
      curRange: [-1, -1],
      bestRange: [bestStart, bestEnd],
      phase: 'done',
      isMaxUpdate: false
    });

    return s;
  }, []);

  const currentStep = steps[currentStepIndex] || steps[0];

  // Determine phase-specific styles and labels
  const phaseDetails = useMemo(() => {
    if (currentStep.isMaxUpdate) {
      return {
        label: 'New Max Subarray!',
        icon: Flame,
        color: 'text-amber-400',
        bgColor: 'bg-amber-500/10',
        borderColor: 'border-amber-500/40 shadow-[0_0_15px_rgba(245,158,11,0.15)]',
        glowColor: 'from-amber-500/15 via-orange-500/5 to-transparent',
        accentBg: 'bg-gradient-to-b from-amber-400 via-orange-500 to-amber-600 shadow-[0_0_12px_rgba(245,158,11,0.4)]',
        dotColor: 'bg-amber-400'
      };
    }
    switch (currentStep.phase) {
      case 'init':
        return {
          label: 'System Initialization',
          icon: Play,
          color: 'text-blue-400',
          bgColor: 'bg-blue-500/10',
          borderColor: 'border-blue-500/20',
          glowColor: 'from-blue-500/10 via-transparent to-transparent',
          accentBg: 'bg-blue-500',
          dotColor: 'bg-blue-400'
        };
      case 'loop':
        return {
          label: 'Scanning Element',
          icon: Search,
          color: 'text-indigo-400',
          bgColor: 'bg-indigo-500/10',
          borderColor: 'border-indigo-500/20',
          glowColor: 'from-indigo-500/10 via-transparent to-transparent',
          accentBg: 'bg-indigo-500',
          dotColor: 'bg-indigo-400'
        };
      case 'check':
        return {
          label: 'Reset Check',
          icon: RefreshCcw,
          color: 'text-rose-400',
          bgColor: 'bg-rose-500/10',
          borderColor: 'border-rose-500/20',
          glowColor: 'from-rose-500/10 via-transparent to-transparent',
          accentBg: 'bg-rose-500',
          dotColor: 'bg-rose-400'
        };
      case 'update':
        return {
          label: 'Running Sum Update',
          icon: PlusCircle,
          color: 'text-violet-400',
          bgColor: 'bg-violet-500/10',
          borderColor: 'border-violet-500/20',
          glowColor: 'from-violet-500/10 via-transparent to-transparent',
          accentBg: 'bg-violet-500',
          dotColor: 'bg-violet-400'
        };
      case 'done':
        return {
          label: 'Search Complete',
          icon: CheckCircle2,
          color: 'text-emerald-400',
          bgColor: 'bg-emerald-500/10',
          borderColor: 'border-emerald-500/20',
          glowColor: 'from-emerald-500/10 via-transparent to-transparent',
          accentBg: 'bg-emerald-500',
          dotColor: 'bg-emerald-400'
        };
      default:
        return {
          label: 'Algorithm Steps',
          icon: Sparkles,
          color: 'text-zinc-400',
          bgColor: 'bg-zinc-500/10',
          borderColor: 'border-zinc-500/20',
          glowColor: 'from-zinc-500/10 via-transparent to-transparent',
          accentBg: 'bg-zinc-500',
          dotColor: 'bg-zinc-400'
        };
    }
  }, [currentStep.phase, currentStep.isMaxUpdate]);

  const IconComponent = phaseDetails.icon;

  // Track state changes
  const stateMutations = useMemo(() => {
    if (currentStepIndex === 0) return null;
    const prev = steps[currentStepIndex - 1];
    const mutations = [];
    
    if (prev.curSum !== currentStep.curSum) {
      mutations.push({
        name: 'curSum',
        old: prev.curSum,
        new: currentStep.curSum,
        color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20'
      });
    }
    if (prev.maxSub !== currentStep.maxSub) {
      mutations.push({
        name: 'maxSub',
        old: prev.maxSub,
        new: currentStep.maxSub,
        color: 'text-amber-400 bg-amber-500/10 border-amber-500/20'
      });
    }
    if (prev.i !== currentStep.i) {
      mutations.push({
        name: 'i (index)',
        old: prev.i === -1 ? 'init' : prev.i,
        new: currentStep.i === currentStep.array.length ? 'done' : currentStep.i,
        color: 'text-sky-400 bg-sky-500/10 border-sky-500/20'
      });
    }
    return mutations;
  }, [currentStepIndex, steps, currentStep]);

  const formatMessageText = (msg: string) => {
    const parts = msg.split(/(\bcurSum\b|\bmaxSub\b|\[\d+\.\.\.\d+\]|index \d+|idx \d+)/g);
    return parts.map((part, idx) => {
      if (part === 'curSum') {
        return (
          <code key={idx} className="mx-1 px-1.5 py-0.5 rounded bg-indigo-500/15 text-indigo-400 font-mono text-[13px] font-semibold border border-indigo-500/20 animate-pulse">
            curSum
          </code>
        );
      }
      if (part === 'maxSub') {
        return (
          <code key={idx} className="mx-1 px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-400 font-mono text-[13px] font-semibold border border-amber-500/20 animate-pulse">
            maxSub
          </code>
        );
      }
      if (part.startsWith('[') && part.endsWith(']')) {
        return (
          <span key={idx} className="mx-1 font-mono text-xs bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded border border-slate-700/50">
            {part}
          </span>
        );
      }
      if (part.startsWith('index') || part.startsWith('idx')) {
        return (
          <span key={idx} className="font-semibold text-primary">
            {part}
          </span>
        );
      }
      return part;
    });
  };

  return (
    <VisualizationLayout
      leftContent={
        <div className="space-y-6">
          <Card className="p-8 bg-card/50 backdrop-blur-sm border-primary/20 relative overflow-hidden min-h-[400px]">
            <h3 className="text-xs font-semibold mb-8 text-muted-foreground uppercase tracking-widest">
              Visualizing Subarray Sum Growth
            </h3>

            <div className="grid grid-cols-5 gap-2 sm:gap-3 h-48 mb-16 relative w-full max-w-md mx-auto items-end">
              <AnimatePresence mode="popLayout">
                {currentStep.array.map((value, index) => {
                  const isCurrent = index === currentStep.i;
                  const isInCurRange = index >= currentStep.curRange[0] && index <= currentStep.curRange[1];
                  const isInBestRange = index >= currentStep.bestRange[0] && index <= currentStep.bestRange[1];

                  return (
                    <div key={index} className="flex flex-col items-center gap-2 relative w-full">
                      {/* Bar visualization */}
                      <motion.div
                        className={`w-full max-w-[3rem] rounded-t-lg transition-all duration-300 ${value < 0 ? 'bg-red-500/30' : 'bg-blue-500/30'
                          } ${isCurrent ? 'ring-4 ring-primary/40 ring-offset-2 ring-offset-background' : ''}`}
                        initial={{ height: 0 }}
                        animate={{
                          height: Math.abs(value) * 20 + 30,
                          backgroundColor: isCurrent
                            ? 'var(--primary)'
                            : (value < 0 ? 'rgba(239, 68, 68, 0.3)' : 'rgba(59, 130, 246, 0.3)')
                        }}
                        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                      />

                      {/* Value Box */}
                      <motion.div
                        className={`w-full max-w-[3rem] h-10 sm:h-12 rounded-lg flex items-center justify-center font-bold text-sm sm:text-lg border-2 transition-all duration-300 ${isCurrent
                            ? 'bg-primary text-primary-foreground border-primary scale-110 shadow-xl shadow-primary/30 z-10'
                            : 'bg-muted/50 border-border text-foreground hover:bg-muted'
                          }`}
                        animate={{
                          scale: isCurrent ? 1.15 : 1,
                          borderColor: isInBestRange ? 'var(--primary)' : 'rgba(148, 163, 184, 0.3)'
                        }}
                      >
                        {value}
                      </motion.div>

                      {/* Index Label */}
                      <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-tighter hidden sm:inline">idx {index}</span>
                      <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-tighter sm:hidden">{index}</span>

                      {/* Best Range Marker (Bottom) */}
                      {isInBestRange && (
                        <motion.div
                          layoutId="best-marker"
                          className="absolute -bottom-6 sm:-bottom-8 w-full max-w-[3rem] h-1.5 bg-primary rounded-full"
                          initial={{ opacity: 0, scaleX: 0 }}
                          animate={{ opacity: 1, scaleX: 1 }}
                        />
                      )}
                    </div>
                  );
                })}
              </AnimatePresence>

              {/* Current Subarray Overlay with more visible colors */}
              {currentStep.curRange[0] !== -1 && (
                <div className="absolute bottom-[56px] sm:bottom-[66px] pointer-events-none grid grid-cols-5 gap-2 sm:gap-3 w-full left-0 right-0 h-14 sm:h-16">
                  <motion.div
                    layout
                    className="border-2 border-dashed border-indigo-500 bg-indigo-500/5 rounded-xl relative w-full h-full"
                    style={{
                      gridColumnStart: currentStep.curRange[0] + 1,
                      gridColumnEnd: currentStep.curRange[1] + 2,
                    }}
                    initial={false}
                    transition={{ type: 'spring', stiffness: 150, damping: 20 }}
                  >
                    <motion.div
                      className="absolute -top-7 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-indigo-500 text-[10px] font-bold text-white shadow-sm whitespace-nowrap"
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                    >
                      Sum: {currentStep.curSum}
                    </motion.div>
                  </motion.div>
                </div>
              )}
            </div>

            {/* Legend and Stats */}
            <div className="grid grid-cols-2 gap-4 mt-8 pt-6 border-t border-border/50">
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-xs">
                  <div className="w-4 h-4 bg-primary rounded-sm" />
                  <span className="text-muted-foreground font-medium">Best Subarray Found (Overall Max)</span>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <div className="w-4 h-4 border-2 border-dashed border-indigo-500 bg-indigo-500/10 rounded-sm" />
                  <span className="text-muted-foreground font-medium">Current Subarray (Running Total)</span>
                </div>
              </div>

              <div className="flex flex-col justify-center items-end gap-2">
                <motion.div
                  className={`px-4 py-2 rounded-xl border-2 flex flex-col items-end transition-colors ${currentStep.isMaxUpdate
                      ? 'border-primary bg-primary/10'
                      : 'border-border bg-muted/30'
                    }`}
                  animate={currentStep.isMaxUpdate ? { scale: [1, 1.1, 1] } : {}}
                >
                  <span className="text-[10px] font-bold text-muted-foreground uppercase">Record Max SubSum</span>
                  <span className={`text-2xl font-black ${currentStep.isMaxUpdate ? 'text-primary' : 'text-foreground'}`}>
                    {currentStep.maxSub}
                  </span>
                </motion.div>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20 relative overflow-hidden transition-all duration-300 shadow-sm">
            <div className="space-y-4">
              {/* Header: Phase Title, Pulsing Indicator, and Step Progress */}
              <div className="flex items-center justify-between pb-3 border-b border-border/40">
                <div className="flex items-center gap-2">
                  {/* Status Indicator Dot */}
                  <span className="relative flex h-2 w-2">
                    <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${phaseDetails.dotColor}`} />
                    <span className={`relative inline-flex rounded-full h-2 w-2 ${phaseDetails.dotColor}`} />
                  </span>
                  <span className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground">
                    {phaseDetails.label}
                  </span>
                </div>
                
                {/* Step counter */}
                <div className="font-mono text-[10px] tracking-tight bg-muted/60 text-muted-foreground px-2 py-0.5 rounded-full border border-border/40">
                  Step {currentStepIndex + 1} of {steps.length}
                </div>
              </div>

              {/* Main Content Layout */}
              <div className="flex items-start gap-4">
                {/* Left Side: Icon Container */}
                <motion.div 
                  key={currentStepIndex}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  className={`p-3 rounded-xl ${phaseDetails.bgColor} border border-border/20 flex items-center justify-center shrink-0 shadow-sm`}
                >
                  <IconComponent className={`w-5 h-5 ${phaseDetails.color}`} />
                </motion.div>

                {/* Right Side: Title & Commentary Text */}
                <div className="space-y-2 flex-1 min-w-0">
                  <h4 className="text-[11px] font-bold uppercase tracking-widest text-primary/70">
                    Algorithm commentary
                  </h4>
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentStepIndex}
                      initial={{ y: 5, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -5, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="text-[14px] font-medium leading-[1.6] text-foreground/90 select-none animate-in fade-in duration-200"
                    >
                      {formatMessageText(currentStep.message)}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>

              {/* State Mutations Sub-Panel */}
              {stateMutations && stateMutations.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.3 }}
                  className="mt-4 pt-3 border-t border-border/40 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 animate-in slide-in-from-bottom-2 duration-300"
                >
                  {stateMutations.map((mutation, idx) => (
                    <div 
                      key={idx} 
                      className={`flex items-center justify-between px-3 py-1.5 rounded-lg border text-xs font-mono font-medium ${mutation.color}`}
                    >
                      <span className="opacity-75">{mutation.name}</span>
                      <div className="flex items-center gap-1.5">
                        <span className="line-through opacity-50">{mutation.old}</span>
                        <ArrowRight className="w-3.5 h-3.5 opacity-60" />
                        <span className="font-bold">{mutation.new}</span>
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}
            </div>
          </Card>
        </div>
      }
      rightContent={
        <div className="space-y-4">
          <AnimatedCodeEditor
            code={code}
            language="typescript"
            highlightedLines={[currentStep.lineNumber]}
          />
          <VariablePanel
            variables={{
              index_i: currentStep.i === -1 || currentStep.i >= currentStep.array.length ? 'N/A' : currentStep.i,
              value_n: currentStep.i === -1 || currentStep.i >= currentStep.array.length ? 'N/A' : currentStep.array[currentStep.i],
              curSum: currentStep.curSum,
              bestMax: currentStep.maxSub,
              bestRange: `[${currentStep.bestRange[0]}, ${currentStep.bestRange[1]}]`
            }}
          />
        </div>
      }
      controls={
        <SimpleStepControls
          currentStep={currentStepIndex}
          totalSteps={steps.length}
          onStepChange={setCurrentStepIndex}
        />
      }
    />
  );
};
