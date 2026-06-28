import { useEffect, useRef, useState, useMemo } from 'react';
import { StepControls } from '../shared/StepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { VisualizationCodePanel } from '../shared/VisualizationCodePanel';
import { VisualizationLayout } from '../shared/VisualizationLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import type { VisualizationLanguageMap, StepLineNumberMap } from '@/types/visualization';

interface Step {
  nums: number[];
  k: number;
  l: number;
  r: number;
  q: number[];
  output: number[];
  explanation: string;
  pseudoStep: string;
  variables: Record<string, any>;
  phase: 'init' | 'pop' | 'push' | 'shift' | 'result' | 'done';
}

// ─── Hardcoded code per language (No comments, no blank lines) ───────────────
const languages: VisualizationLanguageMap = {
  typescript: `function maxSlidingWindow(nums: number[], k: number): number[] {
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
}`,

  python: `def maxSlidingWindow(nums: list[int], k: int) -> list[int]:
    output = []
    q = []
    l = 0
    r = 0
    while r < len(nums):
        while q and nums[q[-1]] < nums[r]:
            q.pop()
        q.append(r)
        if l > q[0]:
            q.pop(0)
        if (r + 1) >= k:
            output.append(nums[q[0]])
            l += 1
        r += 1
    return output`,

  java: `public int[] maxSlidingWindow(int[] nums, int k) {
    if (nums.length == 0) return new int[0];
    int[] output = new int[nums.length - k + 1];
    Deque<Integer> q = new ArrayDeque<>();
    int l = 0;
    int r = 0;
    int idx = 0;
    while (r < nums.length) {
        while (!q.isEmpty() && nums[q.peekLast()] < nums[r]) {
            q.pollLast();
        }
        q.offerLast(r);
        if (l > q.peekFirst()) {
            q.pollFirst();
        }
        if ((r + 1) >= k) {
            output[idx++] = nums[q.peekFirst()];
            l += 1;
        }
        r += 1;
    }
    return output;
}`,

  cpp: `vector<int> maxSlidingWindow(vector<int>& nums, int k) {
    vector<int> output;
    deque<int> q;
    int l = 0;
    int r = 0;
    while (r < (int)nums.size()) {
        while (!q.empty() && nums[q.back()] < nums[r]) {
            q.pop_back();
        }
        q.push_back(r);
        if (l > q.front()) {
            q.pop_front();
        }
        if ((r + 1) >= k) {
            output.push_back(nums[q.front()]);
            l += 1;
        }
        r += 1;
    }
    return output;
}`
};

// ─── Step Generator ──────────────────────────────────────────────────────────
function generateVisualizationData() {
  const nums = [1, 3, -1, -3, 5, 3, 6, 7, 2, 4, 1, 6];
  const k = 3;
  const steps: Step[] = [];
  const output: number[] = [];
  let q: number[] = [];
  let l = 0;
  let r = 0;

  const stepLineNumbers: StepLineNumberMap = {
    typescript: [],
    python: [],
    java: [],
    cpp: []
  };

  const addLines = (ts: number, py: number, java: number, cpp: number) => {
    stepLineNumbers.typescript!.push(ts);
    stepLineNumbers.python!.push(py);
    stepLineNumbers.java!.push(java);
    stepLineNumbers.cpp!.push(cpp);
  };

  steps.push({
    nums, k, l, r, q: [], output: [],
    explanation: "Initialize output array and monotonic deque (stores indices of elements).",
    pseudoStep: "SET output = [], q = [] (monotonic deque)",
    variables: { nums: `[${nums.join(',')}]`, k },
    phase: 'init'
  });
  addLines(2, 2, 3, 2);

  steps.push({
    nums, k, l, r, q: [], output: [],
    explanation: "Initialize pointers 'l' (left) and 'r' (right).",
    pseudoStep: "SET l = 0, r = 0",
    variables: { l, r },
    phase: 'init'
  });
  addLines(4, 4, 5, 4);

  while (r < nums.length) {
    steps.push({
      nums, k, l, r, q: [...q], output: [...output],
      explanation: `Checking window ending at index ${r} (value = ${nums[r]}).`,
      pseudoStep: `WHILE r (${r}) < nums.length (${nums.length})`,
      variables: { l, r, currentVal: nums[r] },
      phase: 'init'
    });
    addLines(6, 6, 8, 6);

    // Monotonic deque: remove indices of smaller values from back
    while (q.length && nums[q[q.length - 1]] < nums[r]) {
      const poppedIdx = q[q.length - 1];
      steps.push({
        nums, k, l, r, q: [...q], output: [...output],
        explanation: `Value at back (${nums[poppedIdx]}) < current value (${nums[r]}). Popping smaller element from deque.`,
        pseudoStep: `WHILE q.length AND nums[q.back] (${nums[poppedIdx]}) < nums[r] (${nums[r]}) -> POP`,
        variables: { backVal: nums[poppedIdx], currentVal: nums[r] },
        phase: 'pop'
      });
      addLines(7, 7, 9, 7);
      q.pop();
    }

    q.push(r);
    steps.push({
      nums, k, l, r, q: [...q], output: [...output],
      explanation: `Push index ${r} to deque. Deque stores indices in decreasing order of corresponding values.`,
      pseudoStep: `PUSH index r (${r}) to q`,
      variables: { q: `[${q.join(',')}]` },
      phase: 'push'
    });
    addLines(10, 9, 12, 10);

    // Remove index if it's out of window bounds
    if (l > q[0]) {
      steps.push({
        nums, k, l, r, q: [...q], output: [...output],
        explanation: `Index ${q[0]} is outside the current window [${l}, ${r}]. Removing from front of deque.`,
        pseudoStep: `IF l (${l}) > q.front (${q[0]}) -> SHIFT/POP front`,
        variables: { l, outOfWindow: q[0] },
        phase: 'shift'
      });
      addLines(11, 10, 13, 11);
      q.shift();
    }

    // Check if window has reached size k
    if ((r + 1) >= k) {
      steps.push({
        nums, k, l, r, q: [...q], output: [...output],
        explanation: `Window size has reached ${k}. The maximum element is at the front of deque: nums[${q[0]}] = ${nums[q[0]]}.`,
        pseudoStep: `IF (r + 1) >= k -> APPEND nums[q.front] (${nums[q[0]]})`,
        variables: { max: nums[q[0]], window: `[${l}, ${r}]` },
        phase: 'result'
      });
      addLines(14, 12, 16, 14);
      output.push(nums[q[0]]);

      l += 1;
      steps.push({
        nums, k, l, r, q: [...q], output: [...output],
        explanation: `Increment left pointer 'l' to slide the window forward.`,
        pseudoStep: "SET l = l + 1",
        variables: { l, output: `[${output.join(',')}]` },
        phase: 'result'
      });
      addLines(16, 14, 18, 16);
    }

    r += 1;
    if (r < nums.length) {
      steps.push({
        nums, k, l, r, q: [...q], output: [...output],
        explanation: `Slide the right pointer 'r' forward.`,
        pseudoStep: "SET r = r + 1",
        variables: { r },
        phase: 'init'
      });
      addLines(18, 15, 20, 18);
    }
  }

  steps.push({
    nums, k, l, r: nums.length - 1, q: [...q], output: [...output],
    explanation: "Process finished. Returning all window maximums.",
    pseudoStep: "RETURN output",
    variables: { result: `[${output.join(',')}]` },
    phase: 'done'
  });
  addLines(20, 16, 22, 20);

  return { steps, stepLineNumbers };
}

export const SlidingWindowMaxVisualization = () => {
  const { steps, stepLineNumbers } = useMemo(generateVisualizationData, []);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const nums = [1, 3, -1, -3, 5, 3, 6, 7, 2, 4, 1, 6];
  const k = 3;

  useEffect(() => {
    if (isPlaying && currentStepIndex < steps.length - 1) {
      intervalRef.current = setInterval(() => {
        setCurrentStepIndex(prev => {
          if (prev >= steps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 1000 / speed);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, currentStepIndex, steps.length, speed]);

  const handlePlay = () => setIsPlaying(true);
  const handlePause = () => setIsPlaying(false);
  const handleStepForward = () => currentStepIndex < steps.length - 1 && setCurrentStepIndex(p => p + 1);
  const handleStepBack = () => currentStepIndex > 0 && setCurrentStepIndex(p => p - 1);
  const handleReset = () => {
    setCurrentStepIndex(0);
    setIsPlaying(false);
  };

  const step = steps[currentStepIndex];
  const pseudoSteps = useMemo(() => steps.map(s => s.pseudoStep), [steps]);

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
                      transition={{ duration: 0.1 }}
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
                            transition={{ duration: 0.1 }}
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
                            transition={{ duration: 0.1 }}
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
                      initial={{ scale: 0, x: 10 }}
                      animate={{ scale: 1, x: 0 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ duration: 0.1 }}
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
                  transition={{ duration: 0.1 }}
                  className="w-8 h-8 bg-primary/20 border-2 border-primary/40 rounded-lg flex items-center justify-center font-bold text-primary text-xs"
                >
                  {val}
                </motion.div>
              ))}
              {step.output.length === 0 && <span className="text-xs text-muted-foreground italic leading-10">Waiting for window size {k}...</span>}
            </div>
          </Card>

          <div className="bg-accent/50 rounded-lg border border-accent p-4">
            <p className="text-sm font-medium text-foreground">{step.explanation}</p>
          </div>

          <VariablePanel variables={step.variables} />
        </div>
      }
      rightContent={
        <VisualizationCodePanel
          languages={languages}
          stepLineNumbers={stepLineNumbers}
          pseudoSteps={pseudoSteps}
          activeStepIndex={currentStepIndex}
          onLanguageChange={handleReset}
        />
      }
      controls={
        <StepControls
          isPlaying={isPlaying}
          onPlay={handlePlay}
          onPause={handlePause}
          onStepForward={handleStepForward}
          onStepBack={handleStepBack}
          onReset={handleReset}
          speed={speed}
          onSpeedChange={setSpeed}
          currentStep={currentStepIndex}
          totalSteps={steps.length - 1}
        />
      }
    />
  );
};
