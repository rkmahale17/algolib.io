import { useEffect, useRef, useState } from 'react';
import { VisualizationCodePanel } from '../shared/VisualizationCodePanel';
import { StepControls } from '../shared/StepControls';
import { VariablePanel } from '../shared/VariablePanel';
import type { StepLineNumberMap, VisualizationLanguageMap } from '@/types/visualization';

interface Step {
  array: number[];
  i: number;
  correctIndex: number;
  explanation: string;
  pseudoStep: string;
  variables: Record<string, any>;
  comparingIndices: number[];
  isSwap?: boolean;
}

// ─── Hardcoded code per language (no comments) ──────────────────────────────

const languages: VisualizationLanguageMap = {
  typescript: `function cyclicSort(nums: number[]): number[] {
  let i = 0;
  while (i < nums.length) {
    const correctIndex = nums[i] - 1;
    if (nums[i] !== nums[correctIndex]) {
      [nums[i], nums[correctIndex]] = [nums[correctIndex], nums[i]];
    } else {
      i++;
    }
  }
  return nums;
}`,

  python: `def cyclic_sort(nums):
    i = 0
    while i < len(nums):
        correct_index = nums[i] - 1
        if nums[i] != nums[correct_index]:
            nums[i], nums[correct_index] = nums[correct_index], nums[i]
        else:
            i += 1
    return nums`,

  java: `public static class Solution {
    public int[] cyclicSort(int[] nums) {
        int i = 0;
        while (i < nums.length) {
            int correctIndex = nums[i] - 1;
            if (nums[i] != nums[correctIndex]) {
                int temp = nums[i];
                nums[i] = nums[correctIndex];
                nums[correctIndex] = temp;
            } else {
                i++;
            }
        }
        return nums;
    }
}`,

  cpp: `class Solution {
    public:
    void cyclicSort(vector<int> &nums) {
        int i = 0;
        while (i < nums.size()) {
            int correctIdx = nums[i] - 1;
            if (nums[i] != nums[correctIdx]) {
                swap(nums[i], nums[correctIdx]);
            } else {
                i++;
            }
        }
    }
};`,
};

// ─── Step generator ──────────────────────────────────────────────────────────

function generateVisualizationData() {
  const nums = [3, 1, 5, 4, 2];
  const steps: Step[] = [];
  const array = [...nums];
  let i = 0;

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
    array: [...array],
    i: 0,
    correctIndex: -1,
    explanation: 'Start cyclic sort: place each number at its correct index (value - 1).',
    pseudoStep: 'START cyclicSort',
    variables: { i: 0, 'nums[i]': array[0], correctIndex: '-', 'nums[correctIndex]': '-', array: [...array] },
    comparingIndices: [],
    isSwap: false
  });
  addLines(2, 2, 3, 4);

  while (i < array.length) {
    const val = array[i];
    const correctIndex = val - 1;

    steps.push({
      array: [...array],
      i,
      correctIndex: -1,
      explanation: `Check loop condition: i (${i}) < nums.length (${array.length}) is true.`,
      pseudoStep: `WHILE i < nums.length  →  ${i} < ${array.length}  →  YES ✓`,
      variables: { i, 'nums[i]': val, correctIndex: '-', 'nums[correctIndex]': '-', array: [...array] },
      comparingIndices: [i],
      isSwap: false
    });
    addLines(3, 3, 4, 5);

    steps.push({
      array: [...array],
      i,
      correctIndex,
      explanation: `Value nums[i] = ${val}. Its correct index is value - 1 = ${correctIndex}.`,
      pseudoStep: `SET correctIndex = nums[i] − 1  →  ${val} − 1 = ${correctIndex}`,
      variables: { i, 'nums[i]': val, correctIndex, 'nums[correctIndex]': array[correctIndex], array: [...array] },
      comparingIndices: [i],
      isSwap: false
    });
    addLines(4, 4, 5, 6);

    steps.push({
      array: [...array],
      i,
      correctIndex,
      explanation: `Compare nums[i] (${val}) with nums[correctIndex] (${array[correctIndex]}).`,
      pseudoStep: `IF nums[i] != nums[correctIndex]  →  ${val} != ${array[correctIndex]}  →  ${val !== array[correctIndex] ? 'YES ✓' : 'NO ✗'}`,
      variables: { i, 'nums[i]': val, correctIndex, 'nums[correctIndex]': array[correctIndex], array: [...array] },
      comparingIndices: [i, correctIndex],
      isSwap: false
    });
    addLines(5, 5, 6, 7);

    if (array[i] !== array[correctIndex]) {
      const prevIVal = array[i];
      const prevCorrectVal = array[correctIndex];
      [array[i], array[correctIndex]] = [array[correctIndex], array[i]];

      steps.push({
        array: [...array],
        i,
        correctIndex,
        explanation: `Mismatch found! Swap elements at indices ${i} (${prevIVal}) and ${correctIndex} (${prevCorrectVal}).`,
        pseudoStep: `SWAP nums[i], nums[correctIndex]  →  swap index ${i} & ${correctIndex}`,
        variables: { i, 'nums[i]': array[i], correctIndex, 'nums[correctIndex]': array[correctIndex], array: [...array] },
        comparingIndices: [i, correctIndex],
        isSwap: true
      });
      addLines(6, 6, 7, 8);
    } else {
      i++;

      steps.push({
        array: [...array],
        i,
        correctIndex,
        explanation: `${val} is already at its correct index (${val - 1}). Increment i to ${i}.`,
        pseudoStep: 'ELSE: i++  (value is in place, move index forward)',
        variables: { i: i < array.length ? i : 'done', 'nums[i]': i < array.length ? array[i] : '-', correctIndex, 'nums[correctIndex]': array[correctIndex], array: [...array] },
        comparingIndices: [i - 1],
        isSwap: false
      });
      addLines(8, 8, 11, 10);
    }
  }

  steps.push({
    array: [...array],
    i,
    correctIndex: -1,
    explanation: 'Loop ends. All elements are sorted and placed at their correct indices.',
    pseudoStep: 'RETURN nums',
    variables: { i: 'done', 'nums[i]': '-', correctIndex: '-', 'nums[correctIndex]': '-', array: [...array], result: JSON.stringify(array) },
    comparingIndices: [],
    isSwap: false
  });
  addLines(11, 9, 14, 12);

  return { steps, stepLineNumbers };
}

// ─── Component ───────────────────────────────────────────────────────────────

export const CyclicSortVisualization = () => {
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

  if (steps.length === 0) return null;

  const currentStep = steps[currentStepIndex];
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
        {/* Left: visual state */}
        <div className="space-y-4">
          <div className="bg-muted/30 rounded-lg border border-border/50 p-6">
            <div className="flex items-center justify-center gap-2 flex-wrap">
              {currentStep.array.map((value, index) => (
                <div key={index} className="flex flex-col items-center gap-1.5 animate-in fade-in zoom-in-95 duration-300">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs transition-all duration-300 border-2 ${currentStep.isSwap && currentStep.comparingIndices.includes(index)
                      ? 'bg-yellow-500 text-white border-yellow-600 shadow-lg scale-110 rotate-3'
                      : currentStep.comparingIndices.includes(index)
                        ? 'bg-primary text-primary-foreground border-primary shadow-md scale-105'
                        : index === currentStep.i
                          ? 'bg-blue-500/10 text-blue-500 border-blue-500/30'
                          : index === value - 1
                            ? 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/30'
                            : 'bg-primary/5 text-foreground border-primary/25'
                      }`}
                  >
                    {value}
                  </div>
                  <div className="flex flex-col items-center min-h-[2.5rem]">
                    <span className="text-[8px] uppercase font-bold text-muted-foreground/70 tracking-tighter">{index}</span>
                    <div className="flex flex-col gap-0.5 mt-0.5 items-center">
                      {index === currentStep.i && (
                        <span className="text-[10px] font-bold text-blue-500 animate-pulse whitespace-nowrap">i</span>
                      )}
                      {index === currentStep.correctIndex && (
                        <span className="text-[10px] font-bold text-blue-500 animate-pulse whitespace-nowrap">Target</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-accent/50 rounded-lg border border-accent p-4">
            <p className="text-sm font-medium text-foreground">{currentStep.explanation}</p>
          </div>

          <div className="bg-muted/50 rounded-lg border p-4">
            <h3 className="font-semibold mb-2 text-sm text-foreground">Cyclic Sort Strategy:</h3>
            <div className="text-xs space-y-1 text-muted-foreground">
              <p>• Applicable when numbers are in a defined range (e.g. 1 to n)</p>
              <p>• Iterate through array: value `x` should be at index `x - 1`</p>
              <p>• If element is not at its correct index, swap it with the element at its correct index</p>
              <p>• Do not increment `i` on swap; re-evaluate new element at index `i` until it is in place</p>
              <p>• Time: O(n) · Space: O(1)</p>
            </div>
          </div>

        </div>

        {/* Right: code / pseudocode panel and variables */}
        <div className="space-y-4">
          <VisualizationCodePanel
            languages={languages}
            stepLineNumbers={stepLineNumbers}
            pseudoSteps={pseudoSteps}
            activeStepIndex={currentStepIndex}
            onLanguageChange={handleReset}
          />
          <VariablePanel
            variables={{
              i: currentStep.i < currentStep.array.length ? currentStep.i : 'done',
              'nums[i]': currentStep.i < currentStep.array.length ? currentStep.array[currentStep.i] : '-',
              targetIndex: currentStep.correctIndex >= 0 ? currentStep.correctIndex : '-',
              'nums[target]': currentStep.correctIndex >= 0 ? currentStep.array[currentStep.correctIndex] : '-',
              array: JSON.stringify(currentStep.array)
            }}
          />
        </div>
      </div>
    </div>
  );
};
