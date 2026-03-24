import { useState, useMemo } from 'react';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { AnimatedCodeEditor } from '../shared/AnimatedCodeEditor';
import { VisualizationLayout } from '../shared/VisualizationLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';

interface Step {
  nums: number[];
  k: number;
  l: number;
  r: number;
  q: number[];
  output: number[];
  explanation: string;
  highlightedLines: number[];
  variables: Record<string, any>;
  phase: 'init' | 'pop' | 'push' | 'shift' | 'result' | 'done';
}

export const SlidingWindowMaxVisualization = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const nums = [1, 3, -1, -3, 5, 3, 6, 7, 2, 4, 1, 6];
  const k = 3;

  const steps: Step[] = useMemo(() => {
    const s: Step[] = [];
    const output: number[] = [];
    let q: number[] = [];
    let l = 0;
    let r = 0;

    s.push({
      nums, k, l, r, q: [], output: [],
      explanation: "Initialize output array and monotonic deque (stores indices of elements).",
      highlightedLines: [1, 2, 3],
      variables: { nums: `[${nums.join(',')}]`, k },
      phase: 'init'
    });

    s.push({
      nums, k, l, r, q: [], output: [],
      explanation: "Initialize pointers 'l' (left) and 'r' (right).",
      highlightedLines: [5, 6],
      variables: { l, r },
      phase: 'init'
    });

    while (r < nums.length) {
      s.push({
        nums, k, l, r, q: [...q], output: [...output],
        explanation: `Checking window ending at index ${r} (value = ${nums[r]}).`,
        highlightedLines: [8],
        variables: { l, r, currentVal: nums[r] },
        phase: 'init'
      });

      // Monotonic deque: remove indices of smaller values from back
      while (q.length && nums[q[q.length - 1]] < nums[r]) {
        const poppedIdx = q[q.length - 1];
        s.push({
          nums, k, l, r, q: [...q], output: [...output],
          explanation: `Value at back (${nums[poppedIdx]}) < current value (${nums[r]}). Popping smaller element.`,
          highlightedLines: [9, 10],
          variables: { backVal: nums[poppedIdx], currentVal: nums[r] },
          phase: 'pop'
        });
        q.pop();
      }

      q.push(r);
      s.push({
        nums, k, l, r, q: [...q], output: [...output],
        explanation: `Push index ${r} to deque. Deque always stores elements in decreasing order.`,
        highlightedLines: [13],
        variables: { q: `[${q.join(',')}]` },
        phase: 'push'
      });

      // Remove index if it's out of window bounds
      if (l > q[0]) {
        s.push({
          nums, k, l, r, q: [...q], output: [...output],
          explanation: `Index ${q[0]} is outside the current window window [${l}, ${r}]. Removing from front.`,
          highlightedLines: [15, 16],
          variables: { l, outOfWindow: q[0] },
          phase: 'shift'
        });
        q.shift();
      }

      // Check if window has reached size k
      if ((r + 1) >= k) {
        s.push({
          nums, k, l, r, q: [...q], output: [...output],
          explanation: `Window size is ${k}. Maximum element is at front of deque: nums[${q[0]}] = ${nums[q[0]]}.`,
          highlightedLines: [19, 20],
          variables: { max: nums[q[0]], window: `[${l}, ${r}]` },
          phase: 'result'
        });
        output.push(nums[q[0]]);

        l += 1;
        s.push({
          nums, k, l, r, q: [...q], output: [...output],
          explanation: `Record the max and slide 'l' forward to prepare for next window.`,
          highlightedLines: [21],
          variables: { l, output: `[${output.join(',')}]` },
          phase: 'result'
        });
      }

      r += 1;
      if (r < nums.length) {
        s.push({
          nums, k, l, r, q: [...q], output: [...output],
          explanation: `Slide 'r' forward.`,
          highlightedLines: [24],
          variables: { r },
          phase: 'init'
        });
      }
    }

    s.push({
      nums, k, l, r: nums.length - 1, q: [...q], output: [...output],
      explanation: "Process finished. Returning all window maximums.",
      highlightedLines: [27],
      variables: { result: `[${output.join(',')}]` },
      phase: 'done'
    });

    return s;
  }, []);

  const code = `function maxSlidingWindow(nums: number[], k: number): number[] {
    const output: number[] = [];
    const q: number[] = [];

    let l = 0;
    let r = 0;

    while (r < nums.length) {
        while (q.length && nums[q[q.length - 1]] < nums[r]) {
            q.pop();
        }

        q.push(r);

        if (l > q[0]) {
            q.shift();
        }

        if ((r + 1) >= k) {
            output.push(nums[q[0]]);
            l += 1;
        }

        r += 1;
    }

    return output;
}`;

  const step = steps[currentStep];

  return (
    <VisualizationLayout
      leftContent={
        <div className="space-y-6">
          <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20 relative">
            <h3 className="text-sm font-semibold mb-8 text-muted-foreground uppercase tracking-widest">Sliding Window</h3>

            <div className="flex flex-wrap justify-center mb-12 relative p-4 min-h-[140px] items-center gap-y-10">
              {nums.map((num, idx) => {
                const isInWindow = idx >= step.l && idx <= step.r;
                const isL = idx === step.l;
                const isR = idx === step.r;
                const isMax = step.q[0] === idx && (step.r + 1) >= k;
                const nextIsInWindow = (idx + 1) >= step.l && (idx + 1) <= step.r;

                return (
                  <div
                    key={idx}
                    className={`relative flex flex-col items-center z-10 w-10 shrink-0 mb-4
                      ${isInWindow && nextIsInWindow && !isR ? '' : 'mr-2'}
                    `}
                  >
                    {/* Window Label over L */}
                    {isL && (
                      <div className="absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap text-[8px] font-black text-primary uppercase tracking-[0.2em] bg-background px-2 py-0.5 rounded-full border-2 border-primary/20 shadow-sm z-30">
                        Window
                      </div>
                    )}

                    <motion.div
                      animate={{
                        scale: isMax ? 1.15 : 1,
                        backgroundColor: isMax
                          ? "var(--primary)"
                          : (isInWindow ? "rgba(var(--primary), 0.15)" : "rgba(var(--muted), 0.3)"),
                        borderColor: isMax
                          ? "var(--primary)"
                          : (isInWindow ? "var(--primary)" : "var(--border)"),
                        color: isMax ? "var(--primary-foreground)" : "var(--foreground)",
                        boxShadow: isMax ? "0 10px 25px -5px rgba(var(--primary), 0.4)" : "none",
                        borderRadius: isMax
                          ? "10px"
                          : (isL ? "10px 0 0 10px" : (isR ? "0 10px 10px 0" : (isInWindow ? "0px" : "10px")))
                      }}
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      className={`w-10 h-10 border-2 flex items-center justify-center text-sm font-black transition-all
                        ${isInWindow && !isL && !isR ? 'border-x-0' : ''}
                        ${isInWindow && isL && !isR ? 'border-r-0' : ''}
                        ${isInWindow && isR && !isL ? 'border-l-0' : ''}
                      `}
                    >
                      {num}
                    </motion.div>

                    <div className="absolute -bottom-8 flex flex-col items-center gap-0.5">
                      <AnimatePresence mode="wait">
                        {isL && (
                          <motion.span
                            key="l-ptr"
                            initial={{ y: 5, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -5, opacity: 0 }}
                            className="text-[10px] font-black text-primary uppercase"
                          >
                            L
                          </motion.span>
                        )}
                        {isR && (
                          <motion.span
                            key="r-ptr"
                            initial={{ y: 5, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -5, opacity: 0 }}
                            className="text-[10px] font-black text-blue-500 uppercase"
                          >
                            R
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </div>

                    <div className="absolute -top-6">
                      <span className="text-[10px] text-muted-foreground font-mono opacity-50">{idx}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-8">
              <h4 className="text-[10px] font-bold text-muted-foreground uppercase mb-4 tracking-tighter">Monotonic Deque (Indices/Values)</h4>
              <div className="flex flex-wrap gap-3 min-h-[60px] p-4 bg-muted/20 border-2 border-dashed border-border rounded-2xl items-center">
                <AnimatePresence>
                  {step.q.map((idx, qIdx) => (
                    <motion.div
                      key={idx}
                      initial={{ scale: 0, x: 20 }}
                      animate={{ scale: 1, x: 0 }}
                      exit={{ scale: 0, opacity: 0 }}
                      className={`w-10 h-10 border-2 rounded-lg flex flex-col items-center justify-center shrink-0
                        ${qIdx === 0 ? 'bg-primary/20 border-primary text-primary' : 'bg-muted border-border text-muted-foreground'}
                      `}
                    >
                      <span className="text-[8px] font-bold opacity-60 leading-none">i:{idx}</span>
                      <span className="text-xs font-black leading-none">{nums[idx]}</span>
                    </motion.div>
                  ))}
                </AnimatePresence>
                {step.q.length === 0 && <span className="text-xs text-muted-foreground italic">Deque is empty</span>}
              </div>
            </div>
          </Card>

          <Card className="p-6 border-primary/20">
            <h4 className="text-[10px] font-bold text-muted-foreground uppercase mb-4 tracking-tighter">Output Maximums</h4>
            <div className="flex flex-wrap gap-2 min-h-[48px]">
              {step.output.map((val, idx) => (
                <motion.div
                  key={idx}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-8 h-8 bg-primary/20 border-2 border-primary/40 rounded-lg flex items-center justify-center font-bold text-primary text-xs"
                >
                  {val}
                </motion.div>
              ))}
              {step.output.length === 0 && <span className="text-xs text-muted-foreground italic leading-10">Waiting for window size {k}...</span>}
            </div>
          </Card>

          <Card className="p-4 bg-primary/5 border-primary/20 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-primary mb-2">Algorithm Step</h4>
            <p className="text-sm font-medium leading-relaxed">{step.explanation}</p>
          </Card>

          <VariablePanel variables={step.variables} />
        </div>
      }
      rightContent={
        <AnimatedCodeEditor
          code={code}
          language="typescript"
          highlightedLines={step.highlightedLines}
        />
      }
      controls={
        <SimpleStepControls
          currentStep={currentStep}
          totalSteps={steps.length}
          onStepChange={setCurrentStep}
        />
      }
    />
  );
};
