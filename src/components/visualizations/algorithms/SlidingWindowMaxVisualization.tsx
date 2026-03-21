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
      explanation: "Initialize output array and double-ended queue (deque).",
      highlightedLines: [1, 2, 3],
      variables: { nums: `[${nums.join(',')}]`, k },
      phase: 'init'
    });

    s.push({
      nums, k, l, r, q: [], output: [],
      explanation: "Initialize left and right pointers to 0.",
      highlightedLines: [5, 6],
      variables: { l, r },
      phase: 'init'
    });

    while (r < nums.length) {
      s.push({
        nums, k, l, r, q: [...q], output: [...output],
        explanation: `Start iteration for r = ${r} (val = ${nums[r]}).`,
        highlightedLines: [8],
        variables: { l, r, val: nums[r], q: `[${q.join(',')}]` },
        phase: 'init'
      });

      // Monotonic deque: remove smaller values from back
      while (q.length && nums[q[q.length - 1]] < nums[r]) {
        const poppedIdx = q[q.length - 1];
        s.push({
          nums, k, l, r, q: [...q], output: [...output],
          explanation: `nums[${poppedIdx}] (${nums[poppedIdx]}) < nums[${r}] (${nums[r]}). Removing index from back of deque.`,
          highlightedLines: [10, 11],
          variables: { backVal: nums[poppedIdx], currentVal: nums[r] },
          phase: 'pop'
        });
        q.pop();
      }

      q.push(r);
      s.push({
        nums, k, l, r, q: [...q], output: [...output],
        explanation: `Pushed current index ${r} to deque.`,
        highlightedLines: [13],
        variables: { q: `[${q.join(',')}]` },
        phase: 'push'
      });

      // Remove left value from window if it's out of current window
      if (l > q[0]) {
        s.push({
          nums, k, l, r, q: [...q], output: [...output],
          explanation: `Index ${q[0]} is outside the current window [${l}, ${r}]. Shifting deque.`,
          highlightedLines: [16, 17],
          variables: { l, outOfWindow: q[0] },
          phase: 'shift'
        });
        q.shift();
      } else if (r >= 0) {
        s.push({
          nums, k, l, r, q: [...q], output: [...output],
          explanation: `Check if front index ${q[0]} is out of window bounds. It is valid.`,
          highlightedLines: [15],
          variables: { l, windowStart: l, frontIdx: q[0] },
          phase: 'init'
        });
      }

      // Check if window has reached size k
      if ((r + 1) >= k) {
        s.push({
          nums, k, l, r, q: [...q], output: [...output],
          explanation: `Window size is ${k}. Front of deque (${nums[q[0]]}) is the maximum.`,
          highlightedLines: [20, 21],
          variables: { max: nums[q[0]], window: `[${l}, ${r}]` },
          phase: 'result'
        });
        output.push(nums[q[0]]);

        l += 1;
        s.push({
          nums, k, l, r, q: [...q], output: [...output],
          explanation: `Moving left pointer to ${l}.`,
          highlightedLines: [22],
          variables: { l },
          phase: 'result'
        });
      }

      r += 1;
      if (r < nums.length) {
        s.push({
          nums, k, l, r, q: [...q], output: [...output],
          explanation: `Moving right pointer to ${r}.`,
          highlightedLines: [25],
          variables: { r },
          phase: 'init'
        });
      }
    }

    s.push({
      nums, k, l, r: nums.length - 1, q: [...q], output: [...output],
      explanation: "Process complete. Returning all window maximums.",
      highlightedLines: [28],
      variables: { output: `[${output.join(',')}]` },
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

            <div className="flex flex-wrap gap-4 gap-y-12 justify-center mb-12">
              {nums.map((num, idx) => {
                const isInWindow = idx >= step.l && idx <= step.r;
                const isL = idx === step.l;
                const isR = idx === step.r;
                const isMax = step.q[0] === idx && (step.r + 1) >= k;

                return (
                  <div key={idx} className="relative flex flex-col items-center">
                    <motion.div
                      animate={{
                        scale: isMax ? 1.1 : 1,
                        backgroundColor: isMax ? "var(--primary)" : (isInWindow ? "rgba(var(--primary), 0.1)" : "transparent"),
                        borderColor: isMax ? "var(--primary)" : (isInWindow ? "var(--primary)" : "var(--border)")
                      }}
                      className={`w-12 h-12 border-2 rounded-xl flex items-center justify-center text-sm font-bold transition-all
                        ${isMax ? '  shadow-[0_0_15px_rgba(var(--primary),0.4)] bg-primary text-primary' : ''}
                      `}
                    >
                      {num}
                    </motion.div>

                    <div className="absolute -bottom-6 flex gap-1">
                      {isL && <span className="text-[10px] font-black text-primary uppercase">L</span>}
                      {isR && <span className="text-[10px] font-black text-blue-500 uppercase">R</span>}
                    </div>

                    <div className="absolute -top-6">
                      <span className="text-[10px] text-muted-foreground font-mono">{idx}</span>
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
                      className={`px-4 py-2 border-2 rounded-lg flex flex-col items-center
                        ${qIdx === 0 ? 'bg-primary/20 border-primary text-primary' : 'bg-muted border-border text-muted-foreground'}
                      `}
                    >
                      <span className="text-[10px] font-bold opacity-60">i:{idx}</span>
                      <span className="text-sm font-black">{nums[idx]}</span>
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
                  className="w-10 h-10 bg-primary/20 border-2 border-primary/40 rounded-lg flex items-center justify-center font-bold text-primary text-sm"
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
