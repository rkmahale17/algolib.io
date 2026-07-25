import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { VisualizationCodePanel } from '../shared/VisualizationCodePanel';
import { VisualizationLayout } from '../shared/VisualizationLayout';
import type { StepLineNumberMap, VisualizationLanguageMap } from '@/types/visualization';

interface Step {
  nums: number[];
  l: number;
  r: number | null;
  readIdx: number | null;
  writeIdx: number | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  variables: Record<string, any>;
  explanation: string;
  pseudoStep: string;
}

const languages: VisualizationLanguageMap = {
  typescript: `function removeDuplicates(nums: number[]): number {
    if (nums.length === 0) {
        return 0;
    }
    let l = 1;
    for (let r = 1; r < nums.length; r++) {
        if (nums[r] !== nums[r - 1]) {
            nums[l] = nums[r];
            l++;
        }
    }
    return l;
}`,

  python: `def removeDuplicates(nums: list[int]) -> int:
    if not nums:
        return 0
    l = 1
    for r in range(1, len(nums)):
        if nums[r] != nums[r - 1]:
            nums[l] = nums[r]
            l += 1
    return l`,

  java: `public int removeDuplicates(int[] nums) {
    if (nums.length === 0) {
        return 0;
    }
    int l = 1;
    for (int r = 1; r < nums.length; r++) {
        if (nums[r] != nums[r - 1]) {
            nums[l] = nums[r];
            l++;
        }
    }
    return l;
}`,

  cpp: `int removeDuplicates(vector<int>& nums) {
    if (nums.empty()) {
        return 0;
    }
    int l = 1;
    for (int r = 1; r < nums.size(); r++) {
        if (nums[r] != nums[r - 1]) {
            nums[l] = nums[r];
            l++;
        }
    }
    return l;
}`,
};

function generateVisualizationData() {
  const initialNums = [1, 1, 2, 2, 3];
  const nums = [...initialNums];
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

  let l = 1;

  // Step 0: Initialization
  steps.push({
    nums: [...nums],
    l,
    r: null,
    readIdx: null,
    writeIdx: null,
    variables: {
      l,
      r: '-',
      'nums[r]': '-',
      'nums[r-1]': '-',
      nums: `[${nums.join(', ')}]`,
    },
    explanation: 'Initialize the slow pointer l = 1. Since the array is sorted, the first element nums[0] is always unique and in its correct final position.',
    pseudoStep: 'SET l = 1',
  });
  addLines(5, 4, 5, 5);

  for (let r = 1; r < nums.length; r++) {
    // Step A: Loop Header
    steps.push({
      nums: [...nums],
      l,
      r,
      readIdx: null,
      writeIdx: null,
      variables: {
        l,
        r,
        'nums[r]': nums[r],
        'nums[r-1]': nums[r - 1],
        nums: `[${nums.join(', ')}]`,
      },
      explanation: `Examine the element at fast pointer r = ${r} (value ${nums[r]}) and compare it with the preceding element at index ${r - 1} (value ${nums[r - 1]}).`,
      pseudoStep: `FOR r = ${r} TO ${nums.length - 1}:`,
    });
    addLines(6, 5, 6, 6);

    const isDifferent = nums[r] !== nums[r - 1];

    // Step B: Condition Check
    steps.push({
      nums: [...nums],
      l,
      r,
      readIdx: r,
      writeIdx: null,
      variables: {
        l,
        r,
        'nums[r]': nums[r],
        'nums[r-1]': nums[r - 1],
        nums: `[${nums.join(', ')}]`,
      },
      explanation: `Check if nums[r] (${nums[r]}) is different from nums[r-1] (${nums[r - 1]}) → ${isDifferent ? 'YES' : 'NO'}.`,
      pseudoStep: `IF nums[r] (${nums[r]}) != nums[r-1] (${nums[r - 1]}) → ${isDifferent ? 'YES ✓' : 'NO ✗'}`,
    });
    addLines(7, 6, 7, 7);

    if (isDifferent) {
      // Step C: Assignment/Copy
      nums[l] = nums[r];
      steps.push({
        nums: [...nums],
        l,
        r,
        readIdx: r,
        writeIdx: l,
        variables: {
          l,
          r,
          'nums[r]': nums[r],
          'nums[r-1]': nums[r - 1],
          nums: `[${nums.join(', ')}]`,
        },
        explanation: `Found a new unique element ${nums[r]}. Copy it to the position pointed to by slow pointer l = ${l}.`,
        pseudoStep: `SET nums[l] = nums[r]  →  nums[${l}] = ${nums[r]}`,
      });
      addLines(8, 7, 8, 8);

      // Step D: Increment slow pointer
      l++;
      steps.push({
        nums: [...nums],
        l,
        r,
        readIdx: null,
        writeIdx: null,
        variables: {
          l,
          r,
          'nums[r]': nums[r],
          'nums[r-1]': nums[r - 1],
          nums: `[${nums.join(', ')}]`,
        },
        explanation: `Increment slow pointer l to ${l} to prepare for the next unique element.`,
        pseudoStep: `INCREMENT l → ${l}`,
      });
      addLines(9, 8, 9, 9);
    }
  }

  // Final Step: Return
  steps.push({
    nums: [...nums],
    l,
    r: null,
    readIdx: null,
    writeIdx: null,
    variables: {
      l,
      r: '-',
      'nums[r]': '-',
      'nums[r-1]': '-',
      nums: `[${nums.join(', ')}]`,
      result: l,
    },
    explanation: `All elements processed. Return the count of unique elements, l = ${l}. The first ${l} elements of the array now contain the unique elements.`,
    pseudoStep: `RETURN l (${l})`,
  });
  addLines(12, 9, 12, 12);

  return { steps, stepLineNumbers };
}

export const RemoveDuplicatesFromSortedArrayVisualization: React.FC = () => {
  const [{ steps, stepLineNumbers }] = useState(generateVisualizationData);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  if (steps.length === 0) return null;

  const currentStep = steps[currentStepIndex];
  const pseudoSteps = steps.map((s) => s.pseudoStep);

  return (
    <VisualizationLayout
      leftContent={
        <div className="space-y-6 flex flex-col h-full">
          <div>
            <h2 className="text-lg font-bold text-foreground mb-4 opacity-90">
              Remove Duplicates from Sorted Array
            </h2>
            <Card className="p-8 bg-card/60 backdrop-blur border-border/50 shadow-sm overflow-hidden relative">
              <div className="mb-10">
                <h4 className="text-xs font-semibold text-muted-foreground mb-6">Array State</h4>
                <div className="flex gap-4 justify-center items-start pt-10 pb-10">
                  {currentStep.nums.map((num, idx) => {
                    const isRead = currentStep.readIdx === idx;
                    const isWrite = currentStep.writeIdx === idx;
                    const isUniquePrefix = idx < currentStep.l;

                    let bgClass = 'bg-muted/50 border-border';
                    let textClass = 'text-foreground';

                    if (isUniquePrefix) {
                      bgClass = 'bg-emerald-500/10 dark:bg-emerald-500/20 border-emerald-500/50';
                    }

                    if (isRead) {
                      bgClass = 'bg-orange-500/10 dark:bg-orange-500/20 border-orange-500 scale-110 shadow-md';
                      textClass = 'text-orange-950 dark:text-orange-50';
                    }

                    if (isWrite) {
                      bgClass = 'bg-violet-500 border-violet-500 scale-110 shadow-lg';
                      textClass = 'text-white';
                    }

                    return (
                      <div key={idx} className="flex flex-col items-center gap-2 relative">
                        {/* Pointers layout */}
                        {currentStep.r === idx && (
                          <span className="absolute -top-9 left-1/2 -translate-x-1/2 text-[10px] font-bold text-orange-600 dark:text-orange-400 whitespace-nowrap bg-orange-100 dark:bg-orange-950 px-1.5 py-0.5 rounded border border-orange-500/30 z-20">
                            r (fast)
                          </span>
                        )}

                        <div
                          className={`w-8 h-8 flex items-center justify-center rounded-lg border-2 font-bold transition-all duration-0 ${bgClass} ${textClass}`}
                        >
                          <span className="text-xs font-semibold">{num}</span>
                        </div>

                        {currentStep.l === idx && (
                          <span className="absolute -bottom-9 left-1/2 -translate-x-1/2 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 whitespace-nowrap bg-emerald-100 dark:bg-emerald-950 px-1.5 py-0.5 rounded border border-emerald-500/30 z-20">
                            l (slow)
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </Card>
          </div>

          <div className="mt-auto">
            <Card className="p-5 border border-border bg-background shadow-sm">
              <h4 className="text-xs font-semibold text-foreground mb-2">Commentary</h4>
              <p className="text-[14px] font-medium leading-relaxed text-muted-foreground whitespace-pre-wrap">
                {currentStep.explanation}
              </p>
            </Card>
          </div>
        </div>
      }
      rightContent={
        <div className="space-y-4">
          <VisualizationCodePanel
            languages={languages}
            stepLineNumbers={stepLineNumbers}
            pseudoSteps={pseudoSteps}
            activeStepIndex={currentStepIndex}
            onLanguageChange={() => setCurrentStepIndex(0)}
          />
          <VariablePanel variables={currentStep.variables} />
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
