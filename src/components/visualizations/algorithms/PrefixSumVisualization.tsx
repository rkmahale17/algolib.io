import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Info } from 'lucide-react';
import { VisualizationCodePanel } from '../shared/VisualizationCodePanel';
import { StepControls } from '../shared/StepControls';
import { VariablePanel } from '../shared/VariablePanel';
import type { StepLineNumberMap, VisualizationLanguageMap } from '@/types/visualization';

interface Step {
  originalArray: number[];
  prefixArray: number[];
  currentIndex: number;
  sum: number | string;
  explanation: string;
  pseudoStep: string;
  variables: Record<string, any>;
}

// ─── DB Codes (no comments, exact match) ────────────────────────────────

const languages: VisualizationLanguageMap = {
  typescript: `function prefixSum(nums: number[]): number[] {
  if (!nums || nums.length === 0) {
    return [];
  }
  const prefix: number[] = new Array(nums.length).fill(0);
  prefix[0] = nums[0];
  for (let i = 1; i < nums.length; i++) {
    prefix[i] = prefix[i - 1] + nums[i];
  }
  return prefix;
}`,

  python: `def prefix_sum(nums):
    n = len(nums)
    prefix_sum_array = [0] * n
    if n > 0:
        prefix_sum_array[0] = nums[0]
        for i in range(1, n):
            prefix_sum_array[i] = prefix_sum_array[i - 1] + nums[i]
    return prefix_sum_array`,

  java: `public int[] prefixSum(int[] nums) {
    if (nums == null || nums.length == 0) {
        return new int[0];
    }
    int n = nums.length;
    int[] prefixSum = new int[n];
    prefixSum[0] = nums[0];
    for (int i = 1; i < n; i++) {
        prefixSum[i] = prefixSum[i - 1] + nums[i];
    }
    return prefixSum;
}`,

  cpp: `vector<int> prefixSum(const vector<int>& nums) {
    if (nums.empty()) {
        return {};
    }
    vector<int> prefixSums(nums.size(), 0);
    prefixSums[0] = nums[0];
    for (size_t i = 1; i < nums.size(); i++) {
        prefixSums[i] = prefixSums[i - 1] + nums[i];
    }
    return prefixSums;
}`
};

// ─── Step generator ──────────────────────────────────────────────────────────

function generateVisualizationData() {
  const array = [3, 1, 4, 1, 5, 9, 2];
  const steps: Step[] = [];
  const prefix: number[] = [];
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

  // Initial State
  steps.push({
    originalArray: [...array],
    prefixArray: [...prefix],
    currentIndex: -1,
    sum: '-',
    explanation: 'Start prefix sum calculation.',
    pseudoStep: 'START prefixSum(nums)',
    variables: { i: '-', 'arr[i]': '-', 'prefix[i-1]': '-', sum: '-', prefixLength: 0 }
  });
  addLines(1, 1, 1, 1);

  prefix.push(array[0]);
  steps.push({
    originalArray: [...array],
    prefixArray: [...prefix],
    currentIndex: 0,
    sum: array[0],
    explanation: `Initialize the first prefix element: prefix[0] = arr[0] = ${array[0]}.`,
    pseudoStep: `SET prefix[0] = arr[0]  →  ${array[0]}`,
    variables: { i: 0, 'arr[i]': array[0], 'prefix[i-1]': '-', sum: array[0], prefixLength: 1 }
  });
  addLines(6, 5, 7, 6);

  for (let i = 1; i < array.length; i++) {
    steps.push({
      originalArray: [...array],
      prefixArray: [...prefix],
      currentIndex: i,
      sum: prefix[i - 1],
      explanation: `Loop check: i = ${i}. We will compute the prefix sum up to index ${i}.`,
      pseudoStep: `FOR i = ${i} to arr.length − 1  →  i = ${i} < ${array.length}  →  YES ✓`,
      variables: { i, 'arr[i]': array[i], 'prefix[i-1]': prefix[i - 1], sum: prefix[i - 1], prefixLength: prefix.length }
    });
    addLines(7, 6, 8, 7);

    const currentVal = array[i];
    const prevSum = prefix[i - 1];
    const newSum = prevSum + currentVal;

    steps.push({
      originalArray: [...array],
      prefixArray: [...prefix],
      currentIndex: i,
      sum: newSum,
      explanation: `Calculate sum: prefix[${i - 1}] (${prevSum}) + arr[${i}] (${currentVal}) = ${newSum}.`,
      pseudoStep: `SET prefix[i] = prefix[i-1] + arr[i]  →  ${prevSum} + ${currentVal} = ${newSum}`,
      variables: { i, 'arr[i]': currentVal, 'prefix[i-1]': prevSum, sum: newSum, prefixLength: prefix.length }
    });
    addLines(8, 7, 9, 8);

    prefix.push(newSum);
    steps.push({
      originalArray: [...array],
      prefixArray: [...prefix],
      currentIndex: i,
      sum: newSum,
      explanation: `Store prefix[${i}] = ${newSum}.`,
      pseudoStep: `prefix[${i}] = ${newSum}`,
      variables: { i, 'arr[i]': currentVal, 'prefix[i-1]': prevSum, sum: newSum, prefixLength: prefix.length }
    });
    addLines(8, 7, 9, 8);
  }

  steps.push({
    originalArray: [...array],
    prefixArray: [...prefix],
    currentIndex: array.length - 1,
    sum: prefix[prefix.length - 1],
    explanation: 'Calculation complete. Return the final prefix sum array.',
    pseudoStep: 'RETURN prefix',
    variables: { i: '-', 'arr[i]': '-', 'prefix[i-1]': '-', sum: prefix[prefix.length - 1], prefixLength: prefix.length }
  });
  addLines(10, 8, 11, 10);

  return { steps, stepLineNumbers };
}

// ─── Component ───────────────────────────────────────────────────────────────

export const PrefixSumVisualization = () => {
  const [{ steps, stepLineNumbers }] = useState(generateVisualizationData);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

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
      }, 1200 / speed);
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

  if (steps.length === 0) return null;

  const currentStep = steps[currentStepIndex];
  const getMaxValue = () => Math.max(...currentStep.originalArray, ...currentStep.prefixArray);
  const pseudoSteps = steps.map(s => s.pseudoStep);

  return (
    <div className="space-y-6">
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Visual state */}
        <div className="space-y-4">
          <div className="bg-card/50 backdrop-blur-sm rounded-xl border border-border/50 p-6 space-y-6">
            <div>
              <h4 className="text-xs font-semibold mb-3 text-muted-foreground uppercase tracking-wider">Original Array</h4>
              <div className="flex items-end justify-center gap-2 h-32 pt-12">
                {currentStep.originalArray.map((value, index) => {
                  const isActive = index === currentStep.currentIndex;
                  return (
                    <div key={index} className="flex flex-col items-center gap-2 flex-1 max-w-[60px] relative">
                      {isActive && (
                        <div className="absolute -top-7 text-xs font-bold text-blue-500 animate-bounce whitespace-nowrap">
                          Current
                        </div>
                      )}
                      <div className="absolute inset-0 bottom-6 bg-muted/20 border border-dashed border-border/40 rounded-t -z-10" />
                      <div
                        className={`w-full rounded-t transition-all duration-300 ${isActive ? 'bg-primary shadow-lg shadow-primary/30 scale-105' : 'bg-primary/20 border-t border-primary/30'
                          }`}
                        style={{ height: `${(value / getMaxValue()) * 100}%`, minHeight: '20px' }}
                      />
                      <span className={`text-xs font-mono ${isActive ? 'text-primary font-bold text-sm' : 'text-muted-foreground'}`}>
                        {value}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div>
              <h4 className="text-xs font-semibold mb-3 text-muted-foreground uppercase tracking-wider">Prefix Sum Array</h4>
              <div className="flex items-end justify-center gap-2 h-32 pt-8">
                {currentStep.originalArray.map((_, index) => {
                  const value = currentStep.prefixArray[index];
                  const hasValue = value !== undefined;
                  const isActive = index === currentStep.currentIndex;
                  return (
                    <div key={index} className="flex flex-col items-center gap-2 flex-1 max-w-[60px] relative">
                      <div className="absolute inset-0 bottom-6 bg-muted/20 border border-dashed border-border/40 rounded-t -z-10" />
                      <div
                        className={`w-full rounded-t transition-all duration-300 ${isActive ? 'bg-primary shadow-lg shadow-primary/30 scale-105' : hasValue ? 'bg-gradient-to-t from-primary/60 to-primary/40' : 'opacity-0'
                          }`}
                        style={{ height: hasValue ? `${(value / getMaxValue()) * 100}%` : '0px', minHeight: hasValue ? '20px' : '0px' }}
                      />
                      <span className={`text-xs font-mono ${isActive ? 'text-primary font-bold text-sm' : 'text-muted-foreground'}`}>
                        {hasValue ? value : ''}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Commentary Panel */}
          <div className="bg-card/50 backdrop-blur-sm rounded-xl border border-border/50 p-6 relative overflow-hidden transition-all duration-300 shadow-sm">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border/40">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full bg-primary opacity-75 rounded-full" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
                  </span>
                  <span className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground">
                    Algorithm Commentary
                  </span>
                </div>
                <div className="font-mono text-[10px] tracking-tight bg-muted/60 text-muted-foreground px-2 py-0.5 rounded-full border border-border/40">
                  Step {currentStepIndex + 1} of {steps.length}
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                  <Info className="w-4.5 h-4.5 text-primary" />
                </div>
                <div className="space-y-1 flex-1">
                  <h4 className="text-[11px] font-bold uppercase tracking-widest text-primary/70">
                    Current Action
                  </h4>
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentStepIndex}
                      initial={{ y: 5, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -5, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="text-sm font-medium leading-relaxed text-foreground/90 select-none"
                    >
                      {currentStep.explanation}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>

          <VariablePanel variables={currentStep.variables} />
        </div>

        {/* Right Column: Code & Pseudocode Display */}
        <VisualizationCodePanel
          languages={languages}
          stepLineNumbers={stepLineNumbers}
          pseudoSteps={pseudoSteps}
          activeStepIndex={currentStepIndex}
          onLanguageChange={handleReset}
        />
      </div>
    </div>
  );
};
export default PrefixSumVisualization;
