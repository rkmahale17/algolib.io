import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { VisualizationCodePanel } from '../shared/VisualizationCodePanel';
import { VisualizationLayout } from '../shared/VisualizationLayout';
import type { StepLineNumberMap, VisualizationLanguageMap } from '@/types/visualization';

interface Step {
  numbers: number[];
  l: number | null;
  r: number | null;
  curSum: number | string;
  target: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  variables: Record<string, any>;
  explanation: string;
  pseudoStep: string;
}

const languages: VisualizationLanguageMap = {
  typescript: `function twoSum(numbers: number[], target: number): number[] {
    let l = 0;
    let r = numbers.length - 1;
    while (l < r) {
        const curSum = numbers[l] + numbers[r];
        if (curSum > target) {
            r--;
        } else if (curSum < target) {
            l++;
        } else {
            return [l + 1, r + 1];
        }
    }
    return [];
}`,

  python: `def twoSum(numbers: list[int], target: int) -> list[int]:
    l = 0
    r = len(numbers) - 1
    while l < r:
        curSum = numbers[l] + numbers[r]
        if curSum > target:
            r -= 1
        elif curSum < target:
            l += 1
        else:
            return [l + 1, r + 1]
    return []`,

  java: `public int[] twoSum(int[] numbers, int target) {
    int l = 0;
    int r = numbers.length - 1;
    while (l < r) {
        int curSum = numbers[l] + numbers[r];
        if (curSum > target) {
            r--;
        } else if (curSum < target) {
            l++;
        } else {
            return new int[]{l + 1, r + 1};
        }
    }
    return new int[]{};
}`,

  cpp: `vector<int> twoSum(vector<int>& numbers, int target) {
    int l = 0;
    int r = numbers.size() - 1;
    while (l < r) {
        int curSum = numbers[l] + numbers[r];
        if (curSum > target) {
            r--;
        } else if (curSum < target) {
            l++;
        } else {
            return {l + 1, r + 1};
        }
    }
    return {};
}`,
};

function generateVisualizationData() {
  const numbers = [2, 3, 5, 8, 11, 15];
  const target = 11;
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

  let l = 0;
  let r = numbers.length - 1;

  // Step 0: Initialization
  steps.push({
    numbers: [...numbers],
    l,
    r,
    curSum: '-',
    target,
    variables: {
      l,
      r,
      curSum: '-',
      'numbers[l]': numbers[l],
      'numbers[r]': numbers[r],
      target,
    },
    explanation: `Initialize left pointer l = 0 (value ${numbers[l]}) and right pointer r = ${r} (value ${numbers[r]}).`,
    pseudoStep: `SET l = 0, r = ${r}`,
  });
  addLines(2, 2, 2, 2);

  while (l < r) {
    // Step A: Loop Condition Check
    steps.push({
      numbers: [...numbers],
      l,
      r,
      curSum: '-',
      target,
      variables: {
        l,
        r,
        curSum: '-',
        'numbers[l]': numbers[l],
        'numbers[r]': numbers[r],
        target,
      },
      explanation: `Check loop condition: l (${l}) < r (${r}) is true.`,
      pseudoStep: `WHILE l < r  →  ${l} < ${r}  →  YES ✓`,
    });
    addLines(4, 4, 4, 4);

    const curSum = numbers[l] + numbers[r];

    // Step B: Calculate Sum
    steps.push({
      numbers: [...numbers],
      l,
      r,
      curSum,
      target,
      variables: {
        l,
        r,
        curSum,
        'numbers[l]': numbers[l],
        'numbers[r]': numbers[r],
        target,
      },
      explanation: `Calculate current sum: numbers[l] (${numbers[l]}) + numbers[r] (${numbers[r]}) = ${curSum}.`,
      pseudoStep: `SET curSum = numbers[l] + numbers[r]  →  ${numbers[l]} + ${numbers[r]} = ${curSum}`,
    });
    addLines(5, 5, 5, 5);

    if (curSum > target) {
      // Step C: Check if greater than target
      steps.push({
        numbers: [...numbers],
        l,
        r,
        curSum,
        target,
        variables: {
          l,
          r,
          curSum,
          'numbers[l]': numbers[l],
          'numbers[r]': numbers[r],
          target,
        },
        explanation: `Compare sum (${curSum}) with target (${target}). Since sum > target, we need a smaller sum. Move the right pointer leftward.`,
        pseudoStep: `IF curSum (${curSum}) > target (${target})  →  YES ✓`,
      });
      addLines(6, 6, 6, 6);

      r--;

      // Step D: Move right pointer
      steps.push({
        numbers: [...numbers],
        l,
        r,
        curSum,
        target,
        variables: {
          l,
          r,
          curSum,
          'numbers[l]': numbers[l],
          'numbers[r]': numbers[r],
          target,
        },
        explanation: `Decrement right pointer: r is now ${r} (value ${numbers[r]}).`,
        pseudoStep: `DECREMENT r → ${r}`,
      });
      addLines(7, 7, 7, 7);
    } else if (curSum < target) {
      // Step C: Check if less than target
      steps.push({
        numbers: [...numbers],
        l,
        r,
        curSum,
        target,
        variables: {
          l,
          r,
          curSum,
          'numbers[l]': numbers[l],
          'numbers[r]': numbers[r],
          target,
        },
        explanation: `Compare sum (${curSum}) with target (${target}). Since sum < target, we need a larger sum. Move the left pointer rightward.`,
        pseudoStep: `ELSE IF curSum (${curSum}) < target (${target})  →  YES ✓`,
      });
      addLines(8, 8, 8, 8);

      l++;

      // Step D: Move left pointer
      steps.push({
        numbers: [...numbers],
        l,
        r,
        curSum,
        target,
        variables: {
          l,
          r,
          curSum,
          'numbers[l]': numbers[l],
          'numbers[r]': numbers[r],
          target,
        },
        explanation: `Increment left pointer: l is now ${l} (value ${numbers[l]}).`,
        pseudoStep: `INCREMENT l → ${l}`,
      });
      addLines(9, 9, 9, 9);
    } else {
      // Step E: Target Found
      steps.push({
        numbers: [...numbers],
        l,
        r,
        curSum,
        target,
        variables: {
          l,
          r,
          curSum,
          'numbers[l]': numbers[l],
          'numbers[r]': numbers[r],
          target,
          result: `[${l + 1}, ${r + 1}]`,
        },
        explanation: `Target found! The elements at 1-based positions ${l + 1} and ${r + 1} sum to ${target}.`,
        pseudoStep: `RETURN [l + 1, r + 1]  →  [${l + 1}, ${r + 1}]`,
      });
      addLines(11, 11, 11, 11);
      break;
    }
  }

  return { steps, stepLineNumbers };
}

export const TwoSumIIVisualization: React.FC = () => {
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
              Two Sum II - Input Array Is Sorted
            </h2>
            <Card className="p-8 bg-card/60 backdrop-blur border-border/50 shadow-sm overflow-hidden relative">
              <div className="mb-10">
                <h4 className="text-xs font-semibold text-muted-foreground mb-6">Array State</h4>
                <div className="flex gap-4 justify-center items-start pt-10 pb-10">
                  {currentStep.numbers.map((num, idx) => {
                    const isLeft = currentStep.l === idx;
                    const isRight = currentStep.r === idx;

                    let bgClass = 'bg-muted/50 border-border';
                    let textClass = 'text-foreground';

                    if (isLeft) {
                      bgClass = 'bg-blue-500/10 dark:bg-blue-500/20 border-blue-500 scale-110 shadow-md';
                      textClass = 'text-blue-950 dark:text-blue-50';
                    }

                    if (isRight) {
                      bgClass = 'bg-violet-500/10 dark:bg-violet-500/20 border-violet-500 scale-110 shadow-md';
                      textClass = 'text-violet-950 dark:text-violet-50';
                    }

                    return (
                      <div key={idx} className="flex flex-col items-center gap-2 relative">
                        {isRight && (
                          <span className="absolute -top-9 left-1/2 -translate-x-1/2 text-[10px] font-bold text-violet-600 dark:text-violet-400 whitespace-nowrap bg-violet-100 dark:bg-violet-950 px-1.5 py-0.5 rounded border border-violet-500/30 z-20">
                            r (right)
                          </span>
                        )}

                        <div
                          className={`w-8 h-8 flex items-center justify-center rounded-lg border-2 font-bold transition-all duration-0 ${bgClass} ${textClass}`}
                        >
                          <span className="text-xs font-semibold">{num}</span>
                        </div>

                        {isLeft && (
                          <span className="absolute -bottom-9 left-1/2 -translate-x-1/2 text-[10px] font-bold text-blue-600 dark:text-blue-400 whitespace-nowrap bg-blue-100 dark:bg-blue-950 px-1.5 py-0.5 rounded border border-blue-500/30 z-20">
                            l (left)
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
