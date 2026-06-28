import React, { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { VisualizationCodePanel } from '../shared/VisualizationCodePanel';
import { VisualizationLayout } from '../shared/VisualizationLayout';
import type { StepLineNumberMap, VisualizationLanguageMap } from '@/types/visualization';

interface Step {
  array: number[];
  dp: number[];
  currentIndex: number;
  compareIndex?: number;
  maxLength: number;
  explanation: string;
  pseudoStep: string;
}

const languages: VisualizationLanguageMap = {
  typescript: `function lengthOfLIS(nums: number[]): number {
  const n = nums.length;
  const LIS: number[] = new Array(n).fill(1);
  for (let i = n - 1; i >= 0; i--) {
    for (let j = i + 1; j < n; j++) {
      if (nums[i] < nums[j]) {
        LIS[i] = Math.max(LIS[i], 1 + LIS[j]);
      }
    }
  }
  return Math.max(...LIS);
}`,
  python: `def lengthOfLIS(nums):
    n = len(nums)
    LIS = [1] * n
    for i in range(n - 1, -1, -1):
        for j in range(i + 1, n):
            if nums[i] < nums[j]:
                LIS[i] = max(LIS[i], 1 + LIS[j])
    return max(LIS)`,
  java: `public static class Solution {
    public int lengthOfLIS(int[] nums) {
        int n = nums.length;
        int[] LIS = new int[n];
        for (int i = 0; i < n; i++) {
            LIS[i] = 1;
        }
        for (int i = n - 1; i >= 0; i--) {
            for (int j = i + 1; j < n; j++) {
                if (nums[i] < nums[j]) {
                    LIS[i] = Math.max(LIS[i], 1 + LIS[j]);
                }
            }
        }
        int maxLength = 0;
        for (int i = 0; i < n; i++) {
            maxLength = Math.max(maxLength, LIS[i]);
        }
        return maxLength;
    }
}`,
  cpp: `class Solution {
public:
    int lengthOfLIS(vector<int>& nums) {
        int n = nums.size();
        vector<int> LIS(n, 1);
        for (int i = n - 1; i >= 0; i--) {
            for (int j = i + 1; j < n; j++) {
                if (nums[i] < nums[j]) {
                    LIS[i] = max(LIS[i], 1 + LIS[j]);
                }
            }
        }
        return *max_element(LIS.begin(), LIS.end());
    }
};`
};

export const LISVisualization: React.FC = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const { steps, stepLineNumbers } = useMemo(() => {
    const nums = [10, 9, 2, 5, 3, 7, 101, 18];
    const n = nums.length;
    const LIS = new Array(n).fill(1);
    const s: Step[] = [];
    const lines: StepLineNumberMap = {
      typescript: [],
      python: [],
      java: [],
      cpp: []
    };

    const addLines = (ts: number, py: number, java: number, cpp: number) => {
      lines.typescript!.push(ts);
      lines.python!.push(py);
      lines.java!.push(java);
      lines.cpp!.push(cpp);
    };

    s.push({
      array: [...nums],
      dp: [...LIS],
      currentIndex: -1,
      compareIndex: undefined,
      maxLength: 1,
      explanation: 'Initialize LIS array with 1s. Every single element is an increasing subsequence of length 1.',
      pseudoStep: 'SET LIS = [1] * n',
    });
    addLines(3, 3, 4, 5);

    for (let i = n - 1; i >= 0; i--) {
      s.push({
        array: [...nums],
        dp: [...LIS],
        currentIndex: i,
        compareIndex: undefined,
        maxLength: Math.max(...LIS),
        explanation: `Outer loop moves backward: i = ${i} (value = ${nums[i]}). We compute LIS starting at index ${i}.`,
        pseudoStep: `FOR i = ${i} DOWNTO 0`,
      });
      addLines(4, 4, 8, 6);

      for (let j = i + 1; j < n; j++) {
        if (nums[i] < nums[j]) {
          const oldVal = LIS[i];
          LIS[i] = Math.max(LIS[i], 1 + LIS[j]);
          s.push({
            array: [...nums],
            dp: [...LIS],
            currentIndex: i,
            compareIndex: j,
            maxLength: Math.max(...LIS),
            explanation: `Compare nums[${i}] (${nums[i]}) < nums[${j}] (${nums[j]}) -> YES. Update LIS[${i}] = max(${oldVal}, 1 + LIS[${j}]) = ${LIS[i]}.`,
            pseudoStep: `IF nums[${i}] < nums[${j}] → YES ✓ → SET LIS[${i}] = MAX(LIS[${i}], 1 + LIS[${j}])`,
          });
          addLines(7, 7, 11, 9);
        } else {
          s.push({
            array: [...nums],
            dp: [...LIS],
            currentIndex: i,
            compareIndex: j,
            maxLength: Math.max(...LIS),
            explanation: `Compare nums[${i}] (${nums[i]}) < nums[${j}] (${nums[j]}) -> NO. Cannot extend the subsequence.`,
            pseudoStep: `IF nums[${i}] < nums[${j}] → NO ✗`,
          });
          addLines(6, 6, 10, 8);
        }
      }
    }

    s.push({
      array: [...nums],
      dp: [...LIS],
      currentIndex: -1,
      compareIndex: undefined,
      maxLength: Math.max(...LIS),
      explanation: `Calculations complete. The maximum length in LIS array is ${Math.max(...LIS)}.`,
      pseudoStep: `RETURN MAX(LIS) → ${Math.max(...LIS)}`,
    });
    addLines(11, 8, 19, 13);

    return { steps: s, stepLineNumbers: lines };
  }, []);

  const step = steps[currentStepIndex];
  const pseudoSteps = steps.map((s) => s.pseudoStep);
  const maxVal = Math.max(...step.array);

  return (
    <VisualizationLayout
      leftContent={
        <div className="flex flex-col h-full justify-between gap-6">
          <div className="space-y-6">
            <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest mb-4">
                Input Array (nums)
              </h3>
              <div className="flex items-end justify-start sm:justify-center gap-3 overflow-x-auto pb-4 pt-4 px-2">
                {step.array.map((value, idx) => {
                  const isI = idx === step.currentIndex;
                  const isJ = idx === step.compareIndex;
                  return (
                    <div
                      key={idx}
                      className="flex flex-col items-center gap-1 shrink-0"
                      style={{ minWidth: '32px' }}
                    >
                      <div
                        className={`w-8 rounded-t flex items-end justify-center pb-1 border-t border-l border-r font-mono transition-all duration-300 ${
                          isI
                            ? 'bg-orange-500/20 border-orange-500 shadow-lg scale-105 font-bold text-orange-500'
                            : isJ
                              ? 'bg-blue-500/20 border-blue-500 shadow-lg scale-105 font-bold text-blue-500'
                              : 'bg-muted/30 border-border text-foreground'
                        }`}
                        style={{
                          height: `${Math.max((value / maxVal) * 80, 24)}px`,
                        }}
                      >
                        <span className="text-[11px]">{value}</span>
                      </div>
                      <div className="flex flex-col items-center min-h-[20px] justify-center">
                        {isI && <span className="text-xs font-bold text-orange-500">i</span>}
                        {isJ && <span className="text-xs font-bold text-blue-500">j</span>}
                      </div>
                    </div>
                  );
                })}
              </div>

              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest mb-3 mt-4">
                DP Array (Longest Sequence Starting Here)
              </h3>
              <div className="flex gap-3 justify-start sm:justify-center overflow-x-auto pb-4 px-2">
                {step.dp.map((length, idx) => {
                  const isI = idx === step.currentIndex;
                  const isJ = idx === step.compareIndex;

                  let cellClass = 'bg-muted/30 border-border text-muted-foreground/85';
                  if (isI) {
                    cellClass = 'bg-orange-500/20 border-orange-500 shadow-lg text-orange-600 dark:text-orange-400 font-bold';
                  } else if (isJ) {
                    cellClass = 'bg-blue-500/20 border-blue-500 shadow-lg text-blue-600 dark:text-blue-400 font-bold';
                  } else if (length > 1) {
                    cellClass = 'bg-green-500/10 border-green-500/40 text-green-600 dark:text-green-400';
                  }

                  return (
                    <div key={idx} className="flex flex-col items-center gap-1">
                      <div
                        className={`w-8 h-8 rounded border flex items-center justify-center font-mono text-sm transition-all duration-300 ${cellClass}`}
                      >
                        {length}
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>

          <div className="space-y-4 mt-auto">
            <Card className="p-4 bg-primary/5 border-primary/20">
              <h4 className="text-xs font-bold uppercase tracking-widest text-primary mb-2">Step Explanation</h4>
              <p className="text-sm text-foreground leading-relaxed font-medium min-h-[40px]">
                {step.explanation}
              </p>
            </Card>

            <VariablePanel
              variables={{
                i: step.currentIndex !== -1 ? step.currentIndex : '-',
                j: step.compareIndex !== undefined ? step.compareIndex : '-',
                'nums[i]': step.currentIndex !== -1 ? step.array[step.currentIndex] : '-',
                'nums[j]': step.compareIndex !== undefined ? step.array[step.compareIndex] : '-',
                'LIS[i]': step.currentIndex !== -1 ? step.dp[step.currentIndex] : '-',
                max_lis: step.maxLength
              }}
            />

            <Card className="p-4 bg-muted/20 border border-border/40 rounded-lg text-xs space-y-1.5 text-muted-foreground leading-relaxed">
              <h4 className="font-bold text-muted-foreground uppercase text-[10px] tracking-wider mb-2">
                Why this works
              </h4>
              <p>
                For each element `nums[i]`, we look at all elements `nums[j]` to its right. If `nums[i] &lt; nums[j]`, then `nums[i]` can extend the increasing subsequence starting at `j`.
              </p>
              <p>
                We compute `LIS[i] = max(LIS[i], 1 + LIS[j])` for all valid `j`.
              </p>
              <p>
                The final result is the maximum value in the entire `LIS` array.
              </p>
            </Card>
          </div>
        </div>
      }
      rightContent={
        <VisualizationCodePanel
          languages={languages}
          stepLineNumbers={stepLineNumbers}
          pseudoSteps={pseudoSteps}
          activeStepIndex={currentStepIndex}
          onLanguageChange={() => setCurrentStepIndex(0)}
        />
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

export default LISVisualization;
