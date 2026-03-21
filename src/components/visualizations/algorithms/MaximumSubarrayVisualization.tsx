import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AnimatedCodeEditor } from "../shared/AnimatedCodeEditor";
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { VisualizationLayout } from '../shared/VisualizationLayout';
import { Card } from '@/components/ui/card';

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

  return (
    <VisualizationLayout
      leftContent={
        <div className="space-y-6">
          <Card className="p-8 bg-card/50 backdrop-blur-sm border-primary/20 relative overflow-hidden min-h-[400px]">
            <h3 className="text-xs font-semibold mb-8 text-muted-foreground uppercase tracking-widest">
              Visualizing Subarray Sum Growth
            </h3>

            <div className="flex justify-center items-end gap-3 h-48 mb-16 relative">
              <AnimatePresence mode="popLayout">
                {currentStep.array.map((value, index) => {
                  const isCurrent = index === currentStep.i;
                  const isInCurRange = index >= currentStep.curRange[0] && index <= currentStep.curRange[1];
                  const isInBestRange = index >= currentStep.bestRange[0] && index <= currentStep.bestRange[1];

                  return (
                    <div key={index} className="flex flex-col items-center gap-2 relative">
                      {/* Bar visualization */}
                      <motion.div
                        className={`w-12 rounded-t-lg transition-all duration-300 ${value < 0 ? 'bg-red-500/30' : 'bg-blue-500/30'
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
                        className={`w-12 h-12 rounded-lg flex items-center justify-center font-bold text-lg border-2 transition-all duration-300 ${isCurrent
                            ? 'bg-primary text-primary-foreground border-primary scale-110 shadow-xl shadow-primary/30'
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
                      <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-tighter">idx {index}</span>

                      {/* Best Range Marker (Bottom) */}
                      {isInBestRange && (
                        <motion.div
                          layoutId="best-marker"
                          className="absolute -bottom-8 w-full h-1.5 bg-primary rounded-full"
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
                <motion.div
                  layoutId="current-subarray-frame"
                  className="absolute bottom-[66px] h-16 border-2 border-dashed border-indigo-500 bg-indigo-500/5 rounded-xl pointer-events-none"
                  initial={false}
                  animate={{
                    left: `${currentStep.curRange[0] * 60 + (currentStep.array.length === 5 ? -2 : 0)}px`,
                    width: `${(currentStep.curRange[1] - currentStep.curRange[0] + 1) * 60 - 8}px`,
                  }}
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

          <Card className="p-6 bg-accent border-primary/20 relative overflow-hidden transition-all duration-300 shadow-sm">
            <div className="absolute top-0 left-0 w-2 h-full bg-primary" />
            <div className="flex items-start gap-4">
              <div className="p-2 bg-primary/20 rounded-lg text-primary">
                <motion.div
                  animate={currentStep.isMaxUpdate ? { rotate: [0, 20, -20, 0] } : {}}
                >
                  {currentStep.isMaxUpdate ? '🚀' : '💡'}
                </motion.div>
              </div>
              <div className="space-y-1">
                <h4 className="text-[11px] font-bold uppercase tracking-widest text-primary/70">Algorithm commentary</h4>
                <p className="text-[15px] font-medium leading-[1.6] text-foreground/90">
                  {currentStep.message}
                </p>
              </div>
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
