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
  mid: number;
  target: number;
  found: boolean;
  explanation: string;
  pseudoStep: string;
  variables: Record<string, any>;
}

// ─── DB Codes (no comments, exact match) ────────────────────────────────

const languages: VisualizationLanguageMap = {
  typescript: `function search(nums: number[], target: number): number {
  let left = 0;
  let right = nums.length - 1;
  while (left <= right) {
    const mid = left + Math.floor((right - left) / 2);
    if (nums[mid] === target) {
      return mid;
    }
    else if (nums[mid] < target) {
      left = mid + 1;
    }
    else {
      right = mid - 1;
    }
  }
  return -1;
}`,

  python: `def search(nums: list[int], target: int) -> int:
    left = 0
    right = len(nums) - 1
    while left <= right:
        mid = left + (right - left) // 2
        if nums[mid] == target:
            return mid
        elif nums[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return -1`,

  java: `public int search(int[] nums, int target) {
        int left = 0;
        int right = nums.length - 1;
        while (left <= right) {
            int mid = left + (right - left) / 2;
            if (nums[mid] == target) {
                return mid;
            }
            else if (nums[mid] < target) {
                left = mid + 1;
            }
            else {
                right = mid - 1;
            }
        }
        return -1;
    }`,

  cpp: `int search(std::vector<int>& nums, int target) {
    int left = 0;
    int right = nums.size() - 1;
    while (left <= right) {
        int mid = left + (right - left) / 2;
        if (nums[mid] == target) {
            return mid;
        }
        else if (nums[mid] < target) {
            left = mid + 1;
        }
        else {
            right = mid - 1;
        }
    }
    return -1;
}`
};

// ─── Step generator ──────────────────────────────────────────────────────────

function generateVisualizationData() {
  const array = [1, 3, 5, 7, 9, 11, 13, 15, 17, 19];
  const target = 13;
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
    mid: -1,
    target,
    found: false,
    explanation: 'Start Binary Search on a sorted array.',
    pseudoStep: 'START search(nums, target)',
    variables: { target, left: '-', right: '-', mid: '-', searchSpace: array.length }
  });
  addLines(1, 1, 1, 1);

  let left = 0;
  steps.push({
    array: [...array],
    left: 0,
    right: -1,
    mid: -1,
    target,
    found: false,
    explanation: 'Initialize the left pointer to the first index (0).',
    pseudoStep: 'SET left = 0',
    variables: { target, left: 0, right: '-', mid: '-', searchSpace: array.length }
  });
  addLines(2, 2, 2, 2);

  let right = array.length - 1;
  steps.push({
    array: [...array],
    left,
    right,
    mid: -1,
    target,
    found: false,
    explanation: `Initialize the right pointer to the last index (${right}).`,
    pseudoStep: `SET right = arr.length − 1  →  ${right}`,
    variables: { target, left, right, mid: '-', searchSpace: array.length }
  });
  addLines(3, 3, 3, 3);

  while (left <= right) {
    steps.push({
      array: [...array],
      left,
      right,
      mid: -1,
      target,
      found: false,
      explanation: `Check loop condition: left (${left}) <= right (${right}) is true.`,
      pseudoStep: `WHILE left <= right  →  ${left} <= ${right}  →  YES ✓`,
      variables: { target, left, right, mid: '-', searchSpace: right - left + 1 }
    });
    addLines(4, 4, 4, 4);

    const mid = left + Math.floor((right - left) / 2);
    steps.push({
      array: [...array],
      left,
      right,
      mid,
      target,
      found: false,
      explanation: `Calculate mid index: left + floor((right - left) / 2) = ${mid}.`,
      pseudoStep: `SET mid = left + (right - left) / 2  →  ${mid}`,
      variables: { target, left, right, mid, 'arr[mid]': array[mid], searchSpace: right - left + 1 }
    });
    addLines(5, 5, 5, 5);

    steps.push({
      array: [...array],
      left,
      right,
      mid,
      target,
      found: false,
      explanation: `Compare value at mid arr[${mid}] (${array[mid]}) with target (${target}).`,
      pseudoStep: `IF arr[mid] == target  →  ${array[mid]} == ${target}  →  ${array[mid] === target ? 'YES ✓' : 'NO ✗'}`,
      variables: { target, left, right, mid, 'arr[mid]': array[mid], searchSpace: right - left + 1 }
    });
    addLines(6, 6, 6, 6);

    if (array[mid] === target) {
      steps.push({
        array: [...array],
        left,
        right,
        mid,
        target,
        found: true,
        explanation: `Target found at index ${mid}! Returning the index.`,
        pseudoStep: `RETURN mid  →  ${mid}`,
        variables: { target, left, right, mid, 'arr[mid]': array[mid], searchSpace: right - left + 1, result: mid }
      });
      addLines(7, 7, 7, 7);
      break;
    } else if (array[mid] < target) {
      steps.push({
        array: [...array],
        left,
        right,
        mid,
        target,
        found: false,
        explanation: `Since arr[mid] (${array[mid]}) < target (${target}), search the right half.`,
        pseudoStep: `ELSE IF arr[mid] < target  →  ${array[mid]} < ${target}  →  YES ✓`,
        variables: { target, left, right, mid, 'arr[mid]': array[mid], searchSpace: right - left + 1 }
      });
      addLines(9, 8, 9, 9);

      left = mid + 1;
      steps.push({
        array: [...array],
        left,
        right,
        mid,
        target,
        found: false,
        explanation: `Update left pointer to mid + 1 = ${left}.`,
        pseudoStep: 'left = mid + 1',
        variables: { target, left, right, mid, searchSpace: right - left + 1 }
      });
      addLines(10, 9, 10, 10);
    } else {
      steps.push({
        array: [...array],
        left,
        right,
        mid,
        target,
        found: false,
        explanation: `Since arr[mid] (${array[mid]}) > target (${target}), search the left half.`,
        pseudoStep: `ELSE IF arr[mid] < target  →  ${array[mid]} < ${target}  →  NO ✗`,
        variables: { target, left, right, mid, 'arr[mid]': array[mid], searchSpace: right - left + 1 }
      });
      addLines(9, 8, 9, 9);

      right = mid - 1;
      steps.push({
        array: [...array],
        left,
        right,
        mid,
        target,
        found: false,
        explanation: `Update right pointer to mid - 1 = ${right}.`,
        pseudoStep: 'right = mid - 1',
        variables: { target, left, right, mid, searchSpace: right - left + 1 }
      });
      addLines(13, 11, 13, 13);
    }
  }

  if (left > right) {
    steps.push({
      array: [...array],
      left,
      right,
      mid: -1,
      target,
      found: false,
      explanation: 'Search space exhausted. The target was not found in the array.',
      pseudoStep: 'RETURN -1',
      variables: { target, left, right, mid: '-', searchSpace: 0, result: -1 }
    });
    addLines(16, 12, 16, 16);
  }

  return { steps, stepLineNumbers };
}

// ─── Component ───────────────────────────────────────────────────────────────

export const BinarySearchVisualization = () => {
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
        {/* Left Column: Visual simulator, Commentary, and Variables */}
        <div className="space-y-4">
          <div className="bg-card/50 backdrop-blur-sm rounded-xl border border-border/50 p-6 flex flex-col justify-center min-h-[300px]">
            <div className="flex items-end justify-center gap-2 h-64 pt-20">
              {currentStep.array.map((value, index) => {
                const isLeft = index === currentStep.left;
                const isRight = index === currentStep.right;
                const isMid = index === currentStep.mid;
                const isFound = currentStep.found && isMid;
                const inRange = index >= currentStep.left && index <= currentStep.right;
                const isPointersSet = currentStep.left !== -1 && currentStep.right !== -1;

                return (
                  <div
                    key={index}
                    className="flex flex-col items-center gap-2 flex-1 max-w-[60px] relative"
                  >
                    <div className="h-16 flex flex-col justify-end items-center gap-0.5 mb-2 w-full absolute -top-16 z-20">
                      {isLeft && (
                        <span className="text-[10px] font-bold text-blue-500 animate-pulse whitespace-nowrap">Left</span>
                      )}
                      {isMid && (
                        <span className="text-[10px] font-bold text-blue-500 animate-pulse whitespace-nowrap">Mid</span>
                      )}
                      {isRight && (
                        <span className="text-[10px] font-bold text-blue-500 animate-pulse whitespace-nowrap">Right</span>
                      )}
                    </div>
                    <div
                      className={`w-full rounded-t transition-all duration-300 ${isFound
                        ? 'bg-green-500 shadow-lg shadow-green-500/30 scale-110'
                        : isMid
                          ? 'bg-accent shadow-lg shadow-accent/30 scale-105'
                          : (isPointersSet && inRange)
                            ? 'bg-primary shadow-sm shadow-primary/20'
                            : 'bg-primary/20 border-t border-primary/30'
                        }`}
                      style={{
                        height: `${(value / getMaxValue()) * 100}%`,
                        minHeight: '20px'
                      }}
                    />
                    <span
                      className={`text-xs font-mono transition-colors ${isFound
                        ? 'text-green-500 font-bold text-sm'
                        : isMid
                          ? 'text-accent font-bold text-sm'
                          : (isPointersSet && inRange)
                            ? 'text-primary font-semibold'
                            : 'text-muted-foreground'
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
export default BinarySearchVisualization;
