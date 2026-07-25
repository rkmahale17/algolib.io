import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { VisualizationCodePanel } from '../shared/VisualizationCodePanel';
import { VisualizationLayout } from '../shared/VisualizationLayout';
import type { StepLineNumberMap, VisualizationLanguageMap } from '@/types/visualization';

interface Step {
  nums: number[];
  i1: number | null;
  i2: number | null;
  l: number | null;
  r: number | null;
  quad: number[];
  results: number[][];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  variables: Record<string, any>;
  explanation: string;
  pseudoStep: string;
}

const languages: VisualizationLanguageMap = {
  typescript: `function fourSum(nums: number[], target: number): number[][] {
    nums.sort((a, b) => a - b);
    const res: number[][] = [];
    const quad: number[] = [];
    function kSum(k: number, start: number, target: number): void {
        if (k !== 2) {
            for (let i = start; i <= nums.length - k; i++) {
                if (i > start && nums[i] === nums[i - 1]) {
                    continue;
                }
                quad.push(nums[i]);
                kSum(k - 1, i + 1, target - nums[i]);
                quad.pop();
            }
            return;
        }
        let l = start;
        let r = nums.length - 1;
        while (l < r) {
            const sum = nums[l] + nums[r];
            if (sum < target) {
                l++;
            } else if (sum > target) {
                r--;
            } else {
                res.push([...quad, nums[l], nums[r]]);
                l++;
                while (l < r && nums[l] === nums[l - 1]) {
                    l++;
                }
            }
        }
    }
    kSum(4, 0, target);
    return res;
}`,

  python: `def fourSum(nums: list[int], target: int) -> list[list[int]]:
    nums.sort()
    res: list[list[int]] = []
    quad: list[int] = []
    def kSum(k: int, start: int, target: int) -> None:
        if k == 2:
            l = start
            r = len(nums) - 1
            while l < r:
                current_sum = nums[l] + nums[r]
                if current_sum < target:
                    l += 1
                elif current_sum > target:
                    r -= 1
                else:
                    res.append(quad + [nums[l], nums[r]])
                    l += 1
                    while l < r and nums[l] == nums[l - 1]:
                        l += 1
            return
        for i in range(start, len(nums) - k + 1):
            if i > start and nums[i] == nums[i - 1]:
                continue
            quad.append(nums[i])
            kSum(k - 1, i + 1, target - nums[i])
            quad.pop()
    kSum(4, 0, target)
    return res`,

  java: `public List<List<Integer>> fourSum(int[] nums, int target) {
    Arrays.sort(nums);
    List<List<Integer>> res = new ArrayList<>();
    List<Integer> quad = new ArrayList<>();
    kSum(4, 0, (long) target, nums, quad, res);
    return res;
}

private void kSum(int k, int start, long target, int[] nums, List<Integer> quad, List<List<Integer>> res) {
    if (k == 2) {
        int left = start;
        int right = nums.length - 1;
        while (left < right) {
            long sum = (long)nums[left] + nums[right];
            if (sum < target) {
                left++;
            } else if (sum > target) {
                right--;
            } else {
                List<Integer> currentQuad = new ArrayList<>(quad);
                currentQuad.add(nums[left]);
                currentQuad.add(nums[right]);
                res.add(currentQuad);
                left++;
                while (left < right && nums[left] == nums[left - 1]) {
                    left++;
                }
            }
        }
        return;
    }
    for (int i = start; i <= nums.length - k; i++) {
        if (i > start && nums[i] == nums[i - 1]) {
            continue;
        }
        quad.add(nums[i]);
        kSum(k - 1, i + 1, target - nums[i], nums, quad, res);
        quad.remove(quad.size() - 1);
    }
}`,

  cpp: `vector<vector<int>> fourSum(vector<int>& nums, int target) {
    sort(nums.begin(), nums.end());
    vector<vector<int>> results;
    vector<int> current_quad;
    kSum(4, 0, (long long)target, nums, current_quad, results);
    return results;
}

void kSum(int k, int start, long long target, vector<int>& nums, vector<int>& current_quad, vector<vector<int>>& results) {
    if (start + k > nums.size()) {
        return;
    }
    if (k == 2) {
        int l = start;
        int r = nums.size() - 1;
        while (l < r) {
            long long sum = (long long)nums[l] + nums[r];
            if (sum < target) {
                l++;
            } else if (sum > target) {
                r--;
            } else {
                vector<int> combination = current_quad;
                combination.push_back(nums[l]);
                combination.push_back(nums[r]);
                results.push_back(combination);
                l++;
                while (l < r && nums[l] == nums[l - 1]) {
                    l++;
                }
            }
        }
        return;
    }
    for (int i = start; i <= (int)nums.size() - k; i++) {
        if (i > start && nums[i] == nums[i - 1]) {
            continue;
        }
        current_quad.push_back(nums[i]);
        kSum(k - 1, i + 1, target - nums[i], nums, current_quad, results);
        current_quad.pop_back();
    }
}`,
};

function generateVisualizationData() {
  const initialNums = [3, 2, -1, 0, 1];
  const target = 4;
  const nums = [...initialNums].sort((a, b) => a - b);
  const steps: Step[] = [];
  const results: number[][] = [];
  const quad: number[] = [];

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

  // Push helper
  const pushStep = (
    i1: number | null,
    i2: number | null,
    l: number | null,
    r: number | null,
    explanation: string,
    pseudoStep: string,
    ts: number,
    py: number,
    java: number,
    cpp: number,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    additionalVars: Record<string, any> = {}
  ) => {
    steps.push({
      nums: [...nums],
      i1,
      i2,
      l,
      r,
      quad: [...quad],
      results: results.map((resArr) => [...resArr]),
      variables: {
        quad: `[${quad.join(', ')}]`,
        results: `[${results.map((resArr) => `[${resArr.join(', ')}]`).join(', ')}]`,
        target,
        ...additionalVars,
      },
      explanation,
      pseudoStep,
    });
    addLines(ts, py, java, cpp);
  };

  // Step 1: Sort
  pushStep(null, null, null, null, 'Sort the input array to allow skipping duplicates and enable the two-pointer technique.', 'nums.sort()  →  [-1, 0, 1, 2, 3]', 2, 2, 2, 2);

  // Define kSum recursive helper
  function kSum(k: number, start: number, currTarget: number, i1Val: number | null, i2Val: number | null): void {
    if (k !== 2) {
      for (let i = start; i <= nums.length - k; i++) {
        if (i > start && nums[i] === nums[i - 1]) {
          pushStep(
            k === 4 ? i : i1Val,
            k === 3 ? i : i2Val,
            null,
            null,
            `Element nums[${i}] = ${nums[i]} is a duplicate of nums[${i - 1}] = ${nums[i - 1]}. Skip to avoid duplicate quadruplets.`,
            `IF i > start AND nums[i] == nums[i-1]  →  YES ✓`,
            8, 22, 33, 36,
            { i, k, currTarget }
          );
          continue;
        }

        quad.push(nums[i]);
        pushStep(
          k === 4 ? i : i1Val,
          k === 3 ? i : i2Val,
          null,
          null,
          `Pick nums[${i}] = ${nums[i]} at level k = ${k}. Append to combination quad. Remaining target becomes ${currTarget} - ${nums[i]} = ${currTarget - nums[i]}.`,
          `quad.push(nums[i])  →  quad = [${quad.join(', ')}]`,
          11, 24, 36, 39,
          { i, k, currTarget }
        );

        kSum(k - 1, i + 1, currTarget - nums[i], k === 4 ? i : i1Val, k === 3 ? i : i2Val);

        quad.pop();
        pushStep(
          k === 4 ? i : i1Val,
          k === 3 ? i : i2Val,
          null,
          null,
          `Backtrack: remove last picked element ${nums[i]} from combination quad.`,
          `quad.pop()  →  quad = [${quad.join(', ')}]`,
          13, 26, 38, 41,
          { i, k, currTarget }
        );
      }
      return;
    }

    let l = start;
    let r = nums.length - 1;

    pushStep(
      i1Val,
      i2Val,
      l,
      r,
      `Base case k = 2 reached. Run two-pointer search on subarray starting at index ${start}. Target for this pair is ${currTarget}.`,
      `SET l = ${l}, r = ${r}`,
      17, 7, 11, 14,
      { l, r, currTarget }
    );

    while (l < r) {
      const sum = nums[l] + nums[r];

      pushStep(
        i1Val,
        i2Val,
        l,
        r,
        `Calculate sum: nums[l] (${nums[l]}) + nums[r] (${nums[r]}) = ${sum}. Target is ${currTarget}.`,
        `SET sum = nums[l] + nums[r]  →  ${nums[l]} + ${nums[r]} = ${sum}`,
        20, 10, 14, 17,
        { l, r, sum, currTarget }
      );

      if (sum < currTarget) {
        pushStep(
          i1Val,
          i2Val,
          l,
          r,
          `Since sum (${sum}) < target (${currTarget}), we need a larger sum. Increment left pointer l.`,
          `IF sum < target  →  ${sum} < ${currTarget}  →  YES ✓`,
          21, 11, 15, 18,
          { l, r, sum, currTarget }
        );
        l++;
      } else if (sum > currTarget) {
        pushStep(
          i1Val,
          i2Val,
          l,
          r,
          `Since sum (${sum}) > target (${currTarget}), we need a smaller sum. Decrement right pointer r.`,
          `ELSE IF sum > target  →  ${sum} > ${currTarget}  →  YES ✓`,
          23, 13, 17, 20,
          { l, r, sum, currTarget }
        );
        r--;
      } else {
        results.push([...quad, nums[l], nums[r]]);
        pushStep(
          i1Val,
          i2Val,
          l,
          r,
          `Found a valid pair! quad + [nums[l], nums[r]] = [${[...quad, nums[l], nums[r]].join(', ')}]. Add it to the results.`,
          `res.push([...quad, nums[l], nums[r]])`,
          26, 16, 23, 26,
          { l, r, sum, currTarget }
        );

        l++;
        pushStep(
          i1Val,
          i2Val,
          l,
          r,
          `Increment left pointer l to ${l} to look for other pairs.`,
          `INCREMENT l → ${l}`,
          27, 17, 24, 27,
          { l, r, sum, currTarget }
        );

        while (l < r && nums[l] === nums[l - 1]) {
          pushStep(
            i1Val,
            i2Val,
            l,
            r,
            `nums[l] = ${nums[l]} is equal to nums[l-1] = ${nums[l - 1]}. Increment left pointer to skip duplicates.`,
            `WHILE nums[l] == nums[l-1]  →  YES ✓`,
            28, 18, 25, 28,
            { l, r, sum, currTarget }
          );
          l++;
        }
      }
    }
  }

  // Initial call
  kSum(4, 0, target, null, null);

  // Return step
  pushStep(
    null,
    null,
    null,
    null,
    `Search complete. All unique quadruplets found: [${results.map((rArr) => `[${rArr.join(', ')}]`).join(', ')}].`,
    `RETURN res`,
    35, 28, 6, 6
  );

  return { steps, stepLineNumbers };
}

export const FourSumVisualization: React.FC = () => {
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
              4Sum
            </h2>
            <Card className="p-8 bg-card/60 backdrop-blur border-border/50 shadow-sm overflow-hidden relative">
              <div className="mb-14">
                <h4 className="text-xs font-semibold text-muted-foreground mb-6">Array State</h4>
                <div className="flex gap-4 justify-center items-start pt-14 pb-14">
                  {currentStep.nums.map((num, idx) => {
                    const isI1 = currentStep.i1 === idx;
                    const isI2 = currentStep.i2 === idx;
                    const isL = currentStep.l === idx;
                    const isR = currentStep.r === idx;

                    let bgClass = 'bg-muted/50 border-border';
                    let textClass = 'text-foreground';

                    if (isI1) {
                      bgClass = 'bg-orange-500/10 dark:bg-orange-500/20 border-orange-500 scale-110 shadow-md';
                      textClass = 'text-orange-950 dark:text-orange-50';
                    } else if (isI2) {
                      bgClass = 'bg-violet-500/10 dark:bg-violet-500/20 border-violet-500 scale-110 shadow-md';
                      textClass = 'text-violet-950 dark:text-violet-50';
                    } else if (isL) {
                      bgClass = 'bg-blue-500/10 dark:bg-blue-500/20 border-blue-500 scale-110 shadow-md';
                      textClass = 'text-blue-950 dark:text-blue-50';
                    } else if (isR) {
                      bgClass = 'bg-emerald-500/10 dark:bg-emerald-500/20 border-emerald-500 scale-110 shadow-md';
                      textClass = 'text-emerald-950 dark:text-emerald-50';
                    }

                    return (
                      <div key={idx} className="flex flex-col items-center gap-2 relative">
                        {/* Staggered Top Pointers */}
                        {isR && (
                          <span className="absolute -top-14 left-1/2 -translate-x-1/2 text-[9px] font-bold text-emerald-600 dark:text-emerald-400 whitespace-nowrap bg-emerald-100 dark:bg-emerald-950 px-1 py-0.5 rounded border border-emerald-500/20 z-20 shadow-sm">
                            r (right)
                          </span>
                        )}

                        {isL && (
                          <span className="absolute -top-9 left-1/2 -translate-x-1/2 text-[9px] font-bold text-blue-600 dark:text-blue-400 whitespace-nowrap bg-blue-100 dark:bg-blue-950 px-1 py-0.5 rounded border border-blue-500/20 z-20 shadow-sm">
                            l (left)
                          </span>
                        )}

                        <div
                          className={`w-8 h-8 flex items-center justify-center rounded-lg border-2 font-bold transition-all duration-0 ${bgClass} ${textClass}`}
                        >
                          <span className="text-xs font-semibold">{num}</span>
                        </div>

                        {/* Staggered Bottom Pointers */}
                        {isI2 && (
                          <span className="absolute -bottom-9 left-1/2 -translate-x-1/2 text-[9px] font-bold text-violet-600 dark:text-violet-400 whitespace-nowrap bg-violet-100 dark:bg-violet-950 px-1 py-0.5 rounded border border-violet-500/20 z-20 shadow-sm">
                            i2 (k=3)
                          </span>
                        )}

                        {isI1 && (
                          <span className="absolute -bottom-14 left-1/2 -translate-x-1/2 text-[9px] font-bold text-orange-600 dark:text-orange-400 whitespace-nowrap bg-orange-100 dark:bg-orange-950 px-1 py-0.5 rounded border border-orange-500/20 z-20 shadow-sm">
                            i1 (k=4)
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </Card>
          </div>

          <div className="mt-auto space-y-4">
            <Card className="p-5 border border-border bg-background shadow-sm">
              <h4 className="text-xs font-semibold text-foreground mb-2">Commentary</h4>
              <p className="text-[14px] font-medium leading-relaxed text-muted-foreground whitespace-pre-wrap">
                {currentStep.explanation}
              </p>
            </Card>
            <VariablePanel variables={currentStep.variables} />
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
