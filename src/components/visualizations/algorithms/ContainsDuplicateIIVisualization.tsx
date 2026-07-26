import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { VisualizationCodePanel } from '../shared/VisualizationCodePanel';
import { VisualizationLayout } from '../shared/VisualizationLayout';
import type { StepLineNumberMap, VisualizationLanguageMap } from '@/types/visualization';

interface Step {
  nums: number[];
  left: number;
  right: number;
  windowSet: Set<number>;
  highlights: number[];
  variables: Record<string, any>;
  explanation: string;
  pseudoStep: string;
}

const languages: VisualizationLanguageMap = {
  typescript: `function containsNearbyDuplicate(nums: number[], k: number): boolean {
    const window = new Set<number>();
    let left = 0;
    for (let right = 0; right < nums.length; right++) {
        if (right - left > k) {
            window.delete(nums[left]);
            left++;
        }
        if (window.has(nums[right])) {
            return true;
        }
        window.add(nums[right]);
    }
    return false;
}`,

  python: `def containsNearbyDuplicate(nums: list[int], k: int) -> bool:
    window = set()
    left = 0
    for right in range(len(nums)):
        if right - left > k:
            window.discard(nums[left])
            left += 1
        if nums[right] in window:
            return True
        window.add(nums[right])
    return False`,

  java: `public static class Solution {
    public boolean containsNearbyDuplicate(int[] nums, int k) {
        Set<Integer> window = new HashSet<>();
        int left = 0;
        for (int right = 0; right < nums.length; right++) {
            if (right - left > k) {
                window.remove(nums[left]);
                left++;
            }
            if (window.contains(nums[right])) {
                return true;
            }
            window.add(nums[right]);
        }
        return false;
    }
}`,

  cpp: `class Solution {
public:
    bool containsNearbyDuplicate(vector<int>& nums, int k) {
        unordered_set<int> window;
        int left = 0;
        for (int right = 0; right < nums.size(); ++right) {
            if (right - left > k) {
                window.erase(nums[left]);
                left++;
            }
            if (window.count(nums[right])) {
                return true;
            }
            window.insert(nums[right]);
        }
        return false;
    }
};`,
};

function generateVisualizationData() {
  const nums = [1, 2, 3, 1, 1];
  const k = 2;
  const steps: Step[] = [];
  const windowSet = new Set<number>();

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

  // 1. Initial State / Function call
  steps.push({
    nums,
    left,
    right: 0,
    windowSet: new Set(windowSet),
    highlights: [],
    variables: { nums: `[${nums.join(', ')}]`, k, left, right: '0', window: '{}' },
    explanation: `Check if the array contains any duplicate values within a distance of k = ${k}. We will maintain a sliding window of size at most k + 1.`,
    pseudoStep: `CALL containsNearbyDuplicate(nums, k = ${k})`
  });
  addLines(1, 1, 2, 3);

  // 2. Initialize Set
  steps.push({
    nums,
    left,
    right: 0,
    windowSet: new Set(windowSet),
    highlights: [],
    variables: { nums: `[${nums.join(', ')}]`, k, left, right: '0', window: '{}' },
    explanation: "Initialize an empty hash set 'window' to track elements currently inside our sliding window.",
    pseudoStep: "SET window = {} (empty set)"
  });
  addLines(2, 2, 3, 4);

  // 3. Initialize Left pointer
  steps.push({
    nums,
    left,
    right: 0,
    windowSet: new Set(windowSet),
    highlights: [],
    variables: { nums: `[${nums.join(', ')}]`, k, left, right: '0', window: '{}' },
    explanation: "Initialize the left pointer to index 0. This tracks the oldest element in our sliding window.",
    pseudoStep: "SET left = 0"
  });
  addLines(3, 3, 4, 5);

  for (let right = 0; right < nums.length; right++) {
    const num = nums[right];

    // 4. Loop iteration starts
    steps.push({
      nums,
      left,
      right,
      windowSet: new Set(windowSet),
      highlights: [right],
      variables: { k, left, right, num, window: `{${Array.from(windowSet).join(', ')}}` },
      explanation: `Examine the next number nums[right] = ${num} at index ${right}.`,
      pseudoStep: `FOR right = ${right}`
    });
    addLines(4, 4, 5, 6);

    const isShrinking = right - left > k;

    // 5. Check window size constraint
    steps.push({
      nums,
      left,
      right,
      windowSet: new Set(windowSet),
      highlights: [right],
      variables: { k, left, right, "right - left": right - left, "right - left > k": isShrinking, window: `{${Array.from(windowSet).join(', ')}}` },
      explanation: `Check if window spans more than k index steps (right - left > k). Here, ${right} - ${left} = ${right - left}. ${isShrinking ? `This exceeds k (${k}), so we must shrink the window.` : `This is within the k distance (${k}), so no shrink is needed.`}`,
      pseudoStep: `IF right − left > k  →  ${right} − ${left} > ${k}  →  ${isShrinking ? 'YES ✓' : 'NO ✗'}`
    });
    addLines(5, 5, 6, 7);

    if (isShrinking) {
      const removedVal = nums[left];
      windowSet.delete(removedVal);

      // 6. Remove leftmost element from set
      steps.push({
        nums,
        left,
        right,
        windowSet: new Set(windowSet),
        highlights: [left],
        variables: { k, left, right, removed: removedVal, window: `{${Array.from(windowSet).join(', ')}}` },
        explanation: `Remove nums[left] = ${removedVal} from our window set because it is no longer within distance k of the current right index.`,
        pseudoStep: `CALL window.delete(nums[left] = ${removedVal})`
      });
      addLines(6, 6, 7, 8);

      left++;

      // 7. Increment left pointer
      steps.push({
        nums,
        left,
        right,
        windowSet: new Set(windowSet),
        highlights: [left],
        variables: { k, left, right, window: `{${Array.from(windowSet).join(', ')}}` },
        explanation: `Increment left pointer to ${left} to slide the window forward.`,
        pseudoStep: `SET left = left + 1  →  ${left}`
      });
      addLines(7, 7, 8, 9);
    }

    const hasDuplicate = windowSet.has(num);

    // 8. Check duplicate condition
    steps.push({
      nums,
      left,
      right,
      windowSet: new Set(windowSet),
      highlights: [right],
      variables: { k, left, right, num, "window.has(num)": hasDuplicate, window: `{${Array.from(windowSet).join(', ')}}` },
      explanation: `Check if nums[right] = ${num} already exists in our window set.`,
      pseudoStep: `IF nums[right] (${num}) IN window  →  ${hasDuplicate ? 'YES ✓' : 'NO ✗'}`
    });
    addLines(9, 8, 10, 11);

    if (hasDuplicate) {
      // 9. Found duplicate - return true
      steps.push({
        nums,
        left,
        right,
        windowSet: new Set(windowSet),
        highlights: [right],
        variables: { k, left, right, num, window: `{${Array.from(windowSet).join(', ')}}`, result: true },
        explanation: `Found duplicate! nums[right] = ${num} already exists in our window set. This means we have a duplicate within index distance k. Return true.`,
        pseudoStep: `RETURN true`
      });
      addLines(10, 9, 11, 12);
      return { steps, stepLineNumbers };
    }

    windowSet.add(num);

    // 10. Add current element to set
    steps.push({
      nums,
      left,
      right,
      windowSet: new Set(windowSet),
      highlights: [right],
      variables: { k, left, right, num, window: `{${Array.from(windowSet).join(', ')}}` },
      explanation: `Add current number ${num} to the window set and proceed to the next element.`,
      pseudoStep: `CALL window.add(${num})`
    });
    addLines(12, 10, 13, 14);
  }

  // 11. Loop completes - return false
  steps.push({
    nums,
    left,
    right: nums.length - 1,
    windowSet: new Set(windowSet),
    highlights: [],
    variables: { k, left, right: nums.length - 1, window: `{${Array.from(windowSet).join(', ')}}`, result: false },
    explanation: "Finished iterating through the array without finding any duplicates within distance k. Return false.",
    pseudoStep: "RETURN false"
  });
  addLines(14, 11, 15, 16);

  return { steps, stepLineNumbers };
}

export const ContainsDuplicateIIVisualization: React.FC = () => {
  const [{ steps, stepLineNumbers }] = useState(generateVisualizationData);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  if (steps.length === 0) return null;

  const currentStep = steps[currentStepIndex];
  const pseudoSteps = steps.map(s => s.pseudoStep);

  return (
    <VisualizationLayout
      leftContent={
        <div className="space-y-6 flex flex-col h-full">
          <div>
            <h2 className="text-lg font-bold text-foreground mb-4 opacity-90">
              Contains Duplicate II (Sliding Window Set)
            </h2>
            <Card className="p-8 bg-card/60 backdrop-blur border-border/50 shadow-sm overflow-hidden relative">
              <div className="mb-10">
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

              <div>
                <h4 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-4">Window Set Content</h4>
                <div className="min-h-[60px] p-4 bg-muted/20 border border-dashed border-gray-200 dark:border-zinc-800 rounded-xl flex flex-wrap gap-2 items-center justify-center">
                  {currentStep.windowSet.size === 0 ? (
                    <span className="text-xs text-gray-400 italic">Empty Set</span>
                  ) : (
                    Array.from(currentStep.windowSet).map((val) => (
                      <div key={val} className="px-3 py-1 bg-emerald-100 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 rounded-full font-bold text-sm shadow-sm ring-1 ring-emerald-500/10">
                        {val}
                      </div>
                    ))
                  )}
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
