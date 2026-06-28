import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Info } from 'lucide-react';
import { VisualizationCodePanel } from '../shared/VisualizationCodePanel';
import { StepControls } from '../shared/StepControls';
import { VariablePanel } from '../shared/VariablePanel';
import type { StepLineNumberMap, VisualizationLanguageMap } from '@/types/visualization';

interface Step {
  array: number[];
  left: number;
  right: number;
  sum: number | string;
  target: number;
  explanation: string;
  pseudoStep: string;
  variables: Record<string, any>;
}

// ─── DB Codes (no comments, exact match) ────────────────────────────────

const languages: VisualizationLanguageMap = {
  typescript: `function twoPointers(arr: number[], target: number): number[] {
  let left = 0;
  let right = arr.length - 1;
  while (left < right) {
    const sum = arr[left] + arr[right];
    if (sum === target) {
      return [left, right];
    } else if (sum < target) {
      left++;
    } else {
      right--;
    }
  }
  return [-1, -1];
}`,

  python: `def twoPointers(arr: List[int], target: int) -> List[int]:
    left = 0
    right = len(arr) - 1
    while left < right:
        sum = arr[left] + arr[right]
        if sum == target:
            return [left, right]
        elif sum < target:
            left += 1
        else:
            right -= 1
    return [-1, -1]`,

  java: `public int[] twoPointers(int[] arr, int target) {
    if (arr == null || arr.length < 2) {
        return new int[]{-1, -1};
    }
    int left = 0;
    int right = arr.length - 1;
    while (left < right) {
        int sum = arr[left] + arr[right];
        if (sum == target) {
            return new int[]{left, right};
        } else if (sum < target) {
            left++;
        } else {
            right--;
        }
    }
    return new int[]{-1, -1};
}`,

  cpp: `std::vector<int> twoPointers(std::vector<int>& arr, int target) {
    if (arr.empty() || arr.size() < 2) {
        return {-1, -1};
    }
    int left = 0;
    int right = arr.size() - 1;
    while (left < right) {
        int sum = arr[left] + arr[right];
        if (sum == target) {
            return {left, right};
        } else if (sum < target) {
            left++;
        } else {
            right--;
        }
    }
    return {-1, -1};
}`
};

// ─── Step generator ──────────────────────────────────────────────────────────

function generateVisualizationData() {
  const array = [1, 3, 4, 6, 8, 9, 11, 12, 15];
  const target = 15;
  const steps: Step[] = [];
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
    array: [...array],
    left: -1,
    right: -1,
    sum: '-',
    target,
    explanation: 'Start of Two Pointers search in sorted array.',
    pseudoStep: 'START twoPointers(arr, target)',
    variables: { target, left: '-', right: '-', sum: '-' }
  });
  addLines(1, 1, 1, 1);

  let left = 0;
  steps.push({
    array: [...array],
    left: 0,
    right: -1,
    sum: '-',
    target,
    explanation: 'Initialize the left pointer to the first index (0).',
    pseudoStep: 'SET left = 0',
    variables: { target, left: 0, right: '-', sum: '-' }
  });
  addLines(2, 2, 5, 5);

  let right = array.length - 1;
  steps.push({
    array: [...array],
    left,
    right,
    sum: '-',
    target,
    explanation: `Initialize the right pointer to the last index (${right}).`,
    pseudoStep: `SET right = arr.length − 1  →  ${right}`,
    variables: { target, left, right, sum: '-' }
  });
  addLines(3, 3, 6, 6);

  while (left < right) {
    steps.push({
      array: [...array],
      left,
      right,
      sum: '-',
      target,
      explanation: `Check loop condition: left (${left}) < right (${right}) is true.`,
      pseudoStep: `WHILE left < right  →  ${left} < ${right}  →  YES ✓`,
      variables: { target, left, right, sum: '-' }
    });
    addLines(4, 4, 7, 7);

    const sum = array[left] + array[right];
    steps.push({
      array: [...array],
      left,
      right,
      sum,
      target,
      explanation: `Calculate sum of values: arr[left] (${array[left]}) + arr[right] (${array[right]}) = ${sum}.`,
      pseudoStep: `SET sum = arr[left] + arr[right]  →  ${array[left]} + ${array[right]} = ${sum}`,
      variables: { target, left, right, sum, 'arr[left]': array[left], 'arr[right]': array[right] }
    });
    addLines(5, 5, 8, 8);

    steps.push({
      array: [...array],
      left,
      right,
      sum,
      target,
      explanation: `Compare sum (${sum}) with target (${target}).`,
      pseudoStep: `IF sum == target  →  ${sum} == ${target}  →  ${sum === target ? 'YES ✓' : 'NO ✗'}`,
      variables: { target, left, right, sum, 'arr[left]': array[left], 'arr[right]': array[right] }
    });
    addLines(6, 6, 9, 9);

    if (sum === target) {
      steps.push({
        array: [...array],
        left,
        right,
        sum,
        target,
        explanation: `Target found! The pointers at indices [${left}, ${right}] sum to the target.`,
        pseudoStep: `RETURN [left, right]  →  [${left}, ${right}]`,
        variables: { target, left, right, sum, 'arr[left]': array[left], 'arr[right]': array[right], result: `[${left}, ${right}]` }
      });
      addLines(7, 7, 10, 10);
      break;
    } else if (sum < target) {
      steps.push({
        array: [...array],
        left,
        right,
        sum,
        target,
        explanation: `Since sum (${sum}) < target (${target}), we need a larger sum. Move left pointer rightward.`,
        pseudoStep: `ELSE IF sum < target  →  ${sum} < ${target}  →  YES ✓`,
        variables: { target, left, right, sum, 'arr[left]': array[left], 'arr[right]': array[right] }
      });
      addLines(8, 8, 11, 11);

      left++;
      steps.push({
        array: [...array],
        left,
        right,
        sum,
        target,
        explanation: `Increment left pointer: left is now ${left}.`,
        pseudoStep: 'left++  (increment left pointer)',
        variables: { target, left, right, sum, 'arr[left]': array[left], 'arr[right]': array[right] }
      });
      addLines(9, 9, 12, 12);
    } else {
      steps.push({
        array: [...array],
        left,
        right,
        sum,
        target,
        explanation: `Since sum (${sum}) > target (${target}), we need a smaller sum. Move right pointer leftward.`,
        pseudoStep: `ELSE IF sum < target  →  ${sum} < ${target}  →  NO ✗`,
        variables: { target, left, right, sum, 'arr[left]': array[left], 'arr[right]': array[right] }
      });
      addLines(8, 8, 11, 11);

      right--;
      steps.push({
        array: [...array],
        left,
        right,
        sum,
        target,
        explanation: `Decremented right pointer: right is now ${right}.`,
        pseudoStep: 'right--  (decrement right pointer)',
        variables: { target, left, right, sum, 'arr[left]': array[left], 'arr[right]': array[right] }
      });
      addLines(11, 11, 14, 14);
    }
  }

  if (left >= right) {
    steps.push({
      array: [...array],
      left,
      right,
      sum: '-',
      target,
      explanation: 'Pointers crossed or met. Target sum was not found in the array.',
      pseudoStep: 'RETURN [-1, -1]',
      variables: { target, left, right, sum: '-', result: '[-1, -1]' }
    });
    addLines(14, 12, 17, 17);
  }

  return { steps, stepLineNumbers };
}

// ─── Component ───────────────────────────────────────────────────────────────

export const TwoPointersVisualization = () => {
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
  const getMaxValue = () => Math.max(...currentStep.array);
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
        {/* Left Column: Visualizer, Commentary, and Variables */}
        <div className="space-y-4">
          <div className="bg-card/50 backdrop-blur-sm rounded-xl border border-border/50 p-6 flex flex-col justify-center min-h-[300px]">
            <div className="flex items-end justify-center gap-2 h-64 pt-12">
              {currentStep.array.map((value, index) => {
                const isLeft = index === currentStep.left;
                const isRight = index === currentStep.right;
                const isActive = isLeft || isRight;

                return (
                  <div
                    key={index}
                    className="flex flex-col items-center gap-2 flex-1 max-w-[60px] relative"
                  >
                    {isLeft && (
                      <div className="absolute -top-7 text-xs font-bold text-blue-500 animate-bounce whitespace-nowrap">
                        Left
                      </div>
                    )}
                    {isRight && (
                      <div className="absolute -top-7 text-xs font-bold text-blue-500 animate-bounce whitespace-nowrap">
                        Right
                      </div>
                    )}
                    <div
                      className={`w-full rounded-t transition-all duration-300 ${isActive
                        ? 'bg-primary shadow-lg shadow-primary/30 scale-105'
                        : 'bg-primary/20 border-t border-primary/30'
                        }`}
                      style={{
                        height: `${(value / getMaxValue()) * 100}%`,
                        minHeight: '20px'
                      }}
                    />
                    <span
                      className={`text-xs font-mono transition-colors ${isActive ? 'text-primary font-bold text-sm' : 'text-muted-foreground'
                        }`}
                    >
                      {value}
                    </span>
                  </div>
                );
              })}
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
export default TwoPointersVisualization;
