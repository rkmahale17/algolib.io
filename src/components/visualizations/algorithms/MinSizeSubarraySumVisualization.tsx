import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { VisualizationCodePanel } from '../shared/VisualizationCodePanel';
import { VisualizationLayout } from '../shared/VisualizationLayout';
import type { StepLineNumberMap, VisualizationLanguageMap } from '@/types/visualization';

interface Step {
  nums: number[];
  target: number;
  left: number;
  right: number;
  total: number;
  result: number;
  highlights: number[];
  variables: Record<string, any>;
  explanation: string;
  pseudoStep: string;
}

const languages: VisualizationLanguageMap = {
  typescript: `function minSubArrayLen(target: number, nums: number[]): number {
    let left = 0;
    let total = 0;
    let result = Infinity;
    for (let right = 0; right < nums.length; right++) {
        total += nums[right];
        while (total >= target) {
            result = Math.min(result, right - left + 1);
            total -= nums[left];
            left++;
        }
    }
    return result === Infinity ? 0 : result;
}`,

  python: `def minSubArrayLen(target: int, nums: list[int]) -> int:
    left = 0
    total = 0
    result = float('inf')
    for right in range(len(nums)):
        total += nums[right]
        while total >= target:
            result = min(result, right - left + 1)
            total -= nums[left]
            left += 1
    return 0 if result == float('inf') else result`,

  java: `public static class Solution {
    public int minSubArrayLen(int target, int[] nums) {
        int left = 0;
        int total = 0;
        int result = Integer.MAX_VALUE;
        for (int right = 0; right < nums.length; right++) {
            total += nums[right];
            while (total >= target) {
                result = Math.min(result, right - left + 1);
                total -= nums[left];
                left++;
            }
        }
        return result == Integer.MAX_VALUE ? 0 : result;
    }
}`,

  cpp: `class Solution {
public:
    int minSubArrayLen(int target, vector<int>& nums) {
        int left = 0;
        long long total = 0;
        int result = INT_MAX;
        for (int right = 0; right < nums.size(); right++) {
            total += nums[right];
            while (total >= target) {
                result = min(result, right - left + 1);
                total -= nums[left];
                left++;
            }
        }
        return result == INT_MAX ? 0 : result;
    }
};`,
};

function generateVisualizationData() {
  const nums = [2, 3, 1, 2, 4, 3];
  const target = 7;
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

  let left = 0;
  let total = 0;
  let result = Infinity;

  // 1. Initial State / Function call
  steps.push({
    nums,
    target,
    left: 0,
    right: 0,
    total: 0,
    result: Infinity,
    highlights: [],
    variables: { target, nums: `[${nums.join(', ')}]`, left: '0', total: '0', result: 'Infinity' },
    explanation: `Find the minimum length of a contiguous subarray whose sum is greater than or equal to target = ${target}.`,
    pseudoStep: `CALL minSubArrayLen(target = ${target}, nums)`
  });
  addLines(1, 1, 2, 3);

  // 2. Initialize left pointer
  steps.push({
    nums,
    target,
    left: 0,
    right: 0,
    total: 0,
    result: Infinity,
    highlights: [],
    variables: { target, left: 0, total: '0', result: 'Infinity' },
    explanation: "Initialize the left pointer of the sliding window to 0.",
    pseudoStep: "SET left = 0"
  });
  addLines(2, 2, 3, 4);

  // 3. Initialize total sum
  steps.push({
    nums,
    target,
    left: 0,
    right: 0,
    total: 0,
    result: Infinity,
    highlights: [],
    variables: { target, left: 0, total: 0, result: 'Infinity' },
    explanation: "Initialize the running total sum of the sliding window to 0.",
    pseudoStep: "SET total = 0"
  });
  addLines(3, 3, 4, 5);

  // 4. Initialize result length
  steps.push({
    nums,
    target,
    left: 0,
    right: 0,
    total: 0,
    result: Infinity,
    highlights: [],
    variables: { target, left: 0, total: 0, result: 'Infinity' },
    explanation: "Initialize result to Infinity. We will update this with the minimum window length found.",
    pseudoStep: "SET result = Infinity"
  });
  addLines(4, 4, 5, 6);

  for (let right = 0; right < nums.length; right++) {
    const num = nums[right];

    // Loop Header
    steps.push({
      nums,
      target,
      left,
      right,
      total,
      result,
      highlights: [right],
      variables: { target, left, right, num, total, result: result === Infinity ? 'Infinity' : result },
      explanation: `Expand the window by moving the right pointer to index ${right} (value ${num}).`,
      pseudoStep: `FOR right = ${right}`
    });
    addLines(5, 5, 6, 7);

    total += num;

    // Add to total
    steps.push({
      nums,
      target,
      left,
      right,
      total,
      result,
      highlights: [right],
      variables: { target, left, right, num, total, result: result === Infinity ? 'Infinity' : result },
      explanation: `Add nums[right] (${num}) to total. The window sum total is now ${total}.`,
      pseudoStep: `SET total = total + nums[right]  →  ${total}`
    });
    addLines(6, 6, 7, 8);

    // Inner while loop checking condition
    steps.push({
      nums,
      target,
      left,
      right,
      total,
      result,
      highlights: [right],
      variables: { target, left, right, total, "total >= target": total >= target, result: result === Infinity ? 'Infinity' : result },
      explanation: `Check if current window total sum (${total}) is greater than or equal to target (${target}).`,
      pseudoStep: `WHILE total >= target  →  ${total} >= ${target}  →  ${total >= target ? 'YES ✓' : 'NO ✗'}`
    });
    addLines(7, 7, 8, 9);

    while (total >= target) {
      const currentLength = right - left + 1;
      const prevResult = result;
      result = Math.min(result, currentLength);

      // Update result length
      steps.push({
        nums,
        target,
        left,
        right,
        total,
        result,
        highlights: Array.from({ length: currentLength }, (_, i) => left + i),
        variables: { target, left, right, total, "window size": currentLength, result },
        explanation: `Subarray [${nums.slice(left, right + 1).join(', ')}] satisfies sum >= target (${total} >= ${target}). Length is ${right} - ${left} + 1 = ${currentLength}. ${currentLength < prevResult ? `New minimum length found! Update result to ${result}.` : `Result remains ${result}.`}`,
        pseudoStep: `SET result = min(result, right − left + 1)  →  min(${prevResult === Infinity ? '∞' : prevResult}, ${currentLength}) = ${result}`
      });
      addLines(8, 8, 9, 10);

      const leftmostVal = nums[left];
      total -= leftmostVal;

      // Subtract leftmost element
      steps.push({
        nums,
        target,
        left,
        right,
        total,
        result,
        highlights: [left],
        variables: { target, left, right, total, removed: leftmostVal, result },
        explanation: `Shrink window from left to search for a potentially smaller subarray. Subtract nums[left] (${leftmostVal}) from total. total is now ${total}.`,
        pseudoStep: `SET total = total − nums[left]  →  ${total}`
      });
      addLines(9, 9, 10, 11);

      left++;

      // Increment left pointer
      steps.push({
        nums,
        target,
        left,
        right,
        total,
        result,
        highlights: [left],
        variables: { target, left, right, total, result },
        explanation: `Increment left pointer to ${left} to slide the window forward.`,
        pseudoStep: `SET left = left + 1  →  ${left}`
      });
      addLines(10, 10, 11, 12);

      // Recheck condition in while loop
      steps.push({
        nums,
        target,
        left,
        right,
        total,
        result,
        highlights: [right],
        variables: { target, left, right, total, "total >= target": total >= target, result },
        explanation: `Recheck if window sum (${total}) is still greater than or equal to target (${target}).`,
        pseudoStep: `WHILE total >= target  →  ${total} >= ${target}  →  ${total >= target ? 'YES ✓' : 'NO ✗'}`
      });
      addLines(7, 7, 8, 9);
    }
  }

  // End of loop - return final result
  steps.push({
    nums,
    target,
    left,
    right: nums.length - 1,
    total,
    result,
    highlights: [],
    variables: { target, left, right: nums.length - 1, result: result === Infinity ? 'Infinity' : result, finalResult: result === Infinity ? 0 : result },
    explanation: `Traversed entire array. The minimum valid subarray length found is ${result === Infinity ? 0 : result}.`,
    pseudoStep: `RETURN result === ∞ ? 0 : result  →  ${result === Infinity ? 0 : result}`
  });
  addLines(13, 11, 14, 15);

  return { steps, stepLineNumbers };
}

export const MinSizeSubarraySumVisualization: React.FC = () => {
  const [{ steps, stepLineNumbers }] = useState(generateVisualizationData);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  if (steps.length === 0) return null;

  const currentStep = steps[currentStepIndex];
  const pseudoSteps = steps.map(s => s.pseudoStep);

  // Compute percentage progress of total sum vs target
  const sumProgress = Math.min(100, Math.round((currentStep.total / currentStep.target) * 100));

  return (
    <VisualizationLayout
      leftContent={
        <div className="space-y-6 flex flex-col h-full">
          <div>
            <h2 className="text-lg font-bold text-foreground mb-4 opacity-90">
              Minimum Size Subarray Sum (Sliding Window)
            </h2>
            <Card className="p-8 bg-card/60 backdrop-blur border-border/50 shadow-sm overflow-hidden relative">
              
              {/* Target Indicator */}
              <div className="mb-6 flex justify-between items-center bg-muted/20 border border-border/50 rounded-lg p-3">
                <span className="text-xs font-semibold text-muted-foreground">Target Sum Required:</span>
                <span className="px-2.5 py-1 bg-primary/10 border border-primary/20 text-primary font-bold text-sm rounded-md shadow-sm">
                  {currentStep.target}
                </span>
              </div>

              {/* Input Array and Pointers */}
              <div className="mb-8">
                <h4 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-6">Input Array & Window</h4>
                <div className="flex gap-3 justify-center items-start pt-8 pb-8">
                  {currentStep.nums.map((num, idx) => {
                    const isInWindow = idx >= currentStep.left && idx <= currentStep.right;
                    const isLeft = currentStep.left === idx;
                    const isRight = currentStep.right === idx;
                    const isHighlighted = currentStep.highlights.includes(idx);

                    let borderClass = 'border-gray-100 bg-white dark:border-zinc-800 dark:bg-zinc-950 text-foreground opacity-55';
                    if (isInWindow) {
                      borderClass = 'border-gray-300 bg-white dark:border-zinc-700 dark:bg-zinc-900 text-foreground';
                    }

                    if (isLeft) {
                      borderClass = 'border-blue-500 bg-blue-50/50 dark:border-blue-500/80 dark:bg-blue-950/20 text-foreground scale-110 shadow-sm';
                    }
                    if (isRight) {
                      borderClass = 'border-violet-500 bg-violet-50/50 dark:border-violet-500/80 dark:bg-violet-950/20 text-foreground scale-110 shadow-sm';
                    }
                    if (isLeft && isRight) {
                      borderClass = 'border-indigo-500 bg-indigo-50/50 dark:border-indigo-500/80 dark:bg-indigo-950/20 text-foreground scale-110 shadow-sm';
                    }

                    return (
                      <div key={idx} className="flex flex-col items-center gap-2 relative">
                        {isRight && (
                          <span className="absolute -top-7 left-1/2 -translate-x-1/2 text-[9px] font-bold text-violet-600 dark:text-violet-400 whitespace-nowrap bg-violet-100/80 dark:bg-violet-950/60 px-1 py-0.5 rounded border border-violet-500/20">
                            right
                          </span>
                        )}

                        <div 
                          className={`w-8 h-8 flex items-center justify-center rounded-lg border-2 font-black transition-all duration-0 ${borderClass} ${
                            isHighlighted ? 'ring-2 ring-offset-2 ring-primary/45 ring-offset-background' : ''
                          }`}
                        >
                          <span className="text-xs font-semibold">{num}</span>
                        </div>

                        {isLeft && (
                          <span className="absolute -bottom-7 left-1/2 -translate-x-1/2 text-[9px] font-bold text-blue-600 dark:text-blue-400 whitespace-nowrap bg-blue-100/80 dark:bg-blue-950/60 px-1 py-0.5 rounded border border-blue-500/20">
                            left
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Total Sum Progress & Minimum Result Length */}
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Current Sum</span>
                    <span className="text-xs font-bold text-foreground">
                      {currentStep.total} / {currentStep.target}
                    </span>
                  </div>
                  <div className="w-full bg-muted border border-border/30 rounded-full h-3 overflow-hidden shadow-inner">
                    <div 
                      className={`h-full transition-all duration-300 rounded-full ${
                        currentStep.total >= currentStep.target 
                          ? 'bg-emerald-500 dark:bg-emerald-600' 
                          : 'bg-indigo-500 dark:bg-indigo-600'
                      }`}
                      style={{ width: `${sumProgress}%` }}
                    />
                  </div>
                </div>

                <div className="flex justify-between items-center border-t border-border/40 pt-4">
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Min Length Result</span>
                  <span className="text-sm font-black px-2.5 py-0.5 bg-zinc-100 dark:bg-zinc-800 text-foreground rounded-md border border-border/50">
                    {currentStep.result === Infinity ? '∞' : currentStep.result}
                  </span>
                </div>
              </div>
            </Card>
          </div>

          <div className="mt-auto space-y-4">
            {/* Commentary box styled like the variable panel */}
            <div className="bg-muted/50 rounded-lg border border-border p-4">
              <h3 className="text-sm font-semibold mb-3 text-foreground">Commentary</h3>
              <p className="text-[14px] font-medium leading-relaxed text-muted-foreground whitespace-pre-wrap">
                {currentStep.explanation}
              </p>
            </div>
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
          {/* Variable section below the editor as requested */}
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
