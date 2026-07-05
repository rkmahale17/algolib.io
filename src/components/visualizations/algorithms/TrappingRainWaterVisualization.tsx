import React, { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { VisualizationCodePanel } from '../shared/VisualizationCodePanel';
import { VisualizationLayout } from '../shared/VisualizationLayout';
import { Info } from 'lucide-react';
import type { StepLineNumberMap, VisualizationLanguageMap } from '@/types/visualization';

interface Step {
  l: number;
  r: number;
  leftMax: number;
  rightMax: number;
  res: number;
  trappedWater: number[];
  explanation: string;
  pseudoStep: string;
  variables: Record<string, any>;
}

const height = [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1];

const languages: VisualizationLanguageMap = {
  typescript: `function trap(height: number[]): number {
  if (!height.length) return 0;
  let l = 0;
  let r = height.length - 1;
  let leftMax = height[l];
  let rightMax = height[r];
  let res = 0;
  while (l < r) {
    if (leftMax < rightMax) {
      l++;
      leftMax = Math.max(leftMax, height[l]);
      res += leftMax - height[l];
    } else {
      r--;
      rightMax = Math.max(rightMax, height[r]);
      res += rightMax - height[r];
    }
  }
  return res;
}`,
  python: `def trap(height: list[int]) -> int:
    if not height:
        return 0
    l = 0
    r = len(height) - 1
    left_max = height[l]
    right_max = height[r]
    res = 0
    while l < r:
        if left_max < right_max:
            l += 1
            left_max = max(left_max, height[l])
            res += left_max - height[l]
        else:
            r -= 1
            right_max = max(right_max, height[r])
            res += right_max - height[r]
    return res`,
  java: `public static class Solution {
    public int trap(int[] height) {
        if (height == null || height.length == 0) {
            return 0;
        }
        int left = 0;
        int right = height.length - 1;
        int leftMax = 0;
        int rightMax = 0;
        int totalWater = 0;
        while (left < right) {
            if (height[left] < height[right]) {
                if (height[left] >= leftMax) {
                    leftMax = height[left];
                } else {
                    totalWater += leftMax - height[left];
                }
                left++;
            } else {
                if (height[right] >= rightMax) {
                    rightMax = height[right];
                } else {
                    totalWater += rightMax - height[right];
                }
                right--;
            }
        }
        return totalWater;
    }
}`,
  cpp: `class Solution {
public:
    int trap(vector<int>& height) {
        if (height.empty()) {
            return 0;
        }
        int l = 0;
        int r = height.size() - 1;
        int leftMax = height[l];
        int rightMax = height[r];
        int res = 0;
        while (l < r) {
            if (leftMax < rightMax) {
                l++;
                leftMax = max(leftMax, height[l]);
                res += max(0, leftMax - height[l]);
            } else {
                r--;
                rightMax = max(rightMax, height[r]);
                res += max(0, rightMax - height[r]);
            }
        }
        return res;
    }
};`
};

export const TrappingRainWaterVisualization: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const { steps, stepLineNumbers } = useMemo(() => {
    const stepsList: Step[] = [];
    const lines: StepLineNumberMap = { typescript: [], python: [], java: [], cpp: [] };
    const trappedWater = new Array(height.length).fill(0);

    const getVariables = (currentL: number, currentR: number, leftMax: number, rightMax: number, res: number) => {
      return {
        l: currentL,
        r: currentR,
        'height[l]': height[currentL],
        'height[r]': height[currentR],
        leftMax,
        rightMax,
        res
      };
    };

    const pushStep = (
      explanation: string,
      pseudo: string,
      currentL: number,
      currentR: number,
      leftMax: number,
      rightMax: number,
      res: number,
      ts: number, py: number, jv: number, cp: number
    ) => {
      stepsList.push({
        l: currentL,
        r: currentR,
        leftMax,
        rightMax,
        res,
        trappedWater: [...trappedWater],
        explanation,
        pseudoStep: pseudo,
        variables: getVariables(currentL, currentR, leftMax, rightMax, res)
      });
      lines.typescript!.push(ts);
      lines.python!.push(py);
      lines.java!.push(jv);
      lines.cpp!.push(cp);
    };

    pushStep(
      "Start trap function. We check if the input array is empty.",
      "trap(height)",
      0, height.length - 1, 0, 0, 0,
      1, 1, 2, 3
    );

    pushStep(
      "Array is not empty. Proceeding to initialize variables.",
      "IF not height: RETURN 0",
      0, height.length - 1, 0, 0, 0,
      2, 2, 3, 4
    );

    let l = 0;
    let r = height.length - 1;
    pushStep(
      `Initialize left pointer l = 0 and right pointer r = ${r}.`,
      `l = 0, r = len(height) - 1`,
      l, r, 0, 0, 0,
      3, 4, 6, 7
    );

    let leftMax = height[l];
    let rightMax = height[r];
    let res = 0;
    pushStep(
      `Initialize leftMax to height[l] (${leftMax}), rightMax to height[r] (${rightMax}), and result res to 0.`,
      `left_max = height[l], right_max = height[r], res = 0`,
      l, r, leftMax, rightMax, res,
      5, 6, 8, 9
    );

    while (l < r) {
      pushStep(
        `Check loop condition: l < r (${l} < ${r} is true). The pointers have not met yet.`,
        `WHILE l < r`,
        l, r, leftMax, rightMax, res,
        8, 9, 11, 12
      );

      const leftSideProcess = leftMax < rightMax;
      pushStep(
        `Compare leftMax (${leftMax}) and rightMax (${rightMax}). Since leftMax ${leftSideProcess ? "<" : "≥"} rightMax, we process the ${leftSideProcess ? "left" : "right"} pointer side.`,
        `IF left_max < right_max`,
        l, r, leftMax, rightMax, res,
        9, 10, 12, 13
      );

      if (leftSideProcess) {
        l++;
        pushStep(
          `Increment left pointer l to ${l} (height[l] = ${height[l]}).`,
          `l += 1`,
          l, r, leftMax, rightMax, res,
          10, 11, 18, 14
        );

        const oldLeftMax = leftMax;
        leftMax = Math.max(leftMax, height[l]);
        pushStep(
          `Update leftMax to max(leftMax, height[l]) = max(${oldLeftMax}, ${height[l]}) = ${leftMax}.`,
          `left_max = max(left_max, height[l])`,
          l, r, leftMax, rightMax, res,
          11, 12, 13, 15
        );

        const water = leftMax - height[l];
        res += water;
        trappedWater[l] = water;
        pushStep(
          `Calculate trapped water at index ${l}: leftMax - height[l] = ${leftMax} - ${height[l]} = ${water} units. Add this to res.`,
          `res += left_max - height[l]`,
          l, r, leftMax, rightMax, res,
          12, 13, 16, 16
        );
      } else {
        r--;
        pushStep(
          `Decrement right pointer r to ${r} (height[r] = ${height[r]}).`,
          `r -= 1`,
          l, r, leftMax, rightMax, res,
          14, 15, 25, 18
        );

        const oldRightMax = rightMax;
        rightMax = Math.max(rightMax, height[r]);
        pushStep(
          `Update rightMax to max(rightMax, height[r]) = max(${oldRightMax}, ${height[r]}) = ${rightMax}.`,
          `right_max = max(right_max, height[r])`,
          l, r, leftMax, rightMax, res,
          15, 16, 20, 19
        );

        const water = rightMax - height[r];
        res += water;
        trappedWater[r] = water;
        pushStep(
          `Calculate trapped water at index ${r}: rightMax - height[r] = ${rightMax} - ${height[r]} = ${water} units. Add this to res.`,
          `res += right_max - height[r]`,
          l, r, leftMax, rightMax, res,
          16, 17, 22, 20
        );
      }
    }

    pushStep(
      `Loop terminated because left and right pointers met at index ${l} (l < r is false).`,
      `WHILE l < r`,
      l, r, leftMax, rightMax, res,
      8, 9, 11, 12
    );

    pushStep(
      `Return the total trapped rain water res = ${res} units.`,
      `RETURN res  →  ${res}`,
      l, r, leftMax, rightMax, res,
      19, 18, 28, 23
    );

    return { steps: stepsList, stepLineNumbers: lines };
  }, []);

  const step = steps[currentStep] || steps[0];
  const pseudoSteps = useMemo(() => steps.map((s) => s.pseudoStep), [steps]);
  const maxVal = Math.max(...height);

  return (
    <div className="space-y-6">
      <VisualizationLayout
        leftContent={
          <div className="space-y-6">
            {/* Elevation Map Card */}
            <Card className="bg-card border border-border/50 p-6 flex flex-col justify-between h-[360px]">
              {/* Visualizer Panel */}
              <div className="flex items-end justify-center gap-1 h-56 pt-8 relative">
                {height.map((hVal, idx) => {
                  const isLeft = idx === step.l;
                  const isRight = idx === step.r;
                  const waterVal = step.trappedWater[idx];

                  return (
                    <div key={idx} className="flex flex-col items-center flex-1 max-w-[40px] relative h-full">
                      {/* Pointer Label */}
                      {isLeft && isRight && (
                        <div className="absolute -top-7 text-[10px] font-bold text-indigo-500 bg-indigo-500/10 px-1 rounded border border-indigo-500/20 whitespace-nowrap z-10">
                          L & R
                        </div>
                      )}
                      {isLeft && !isRight && (
                        <div className="absolute -top-7 text-[10px] font-bold text-blue-500 bg-blue-500/10 px-1 rounded border border-blue-500/20 whitespace-nowrap z-10">
                          L
                        </div>
                      )}
                      {!isLeft && isRight && (
                        <div className="absolute -top-7 text-[10px] font-bold text-purple-500 bg-purple-500/10 px-1 rounded border border-purple-500/20 whitespace-nowrap z-10">
                          R
                        </div>
                      )}

                      {/* Stacking Height & Water */}
                      <div className="relative w-full h-full flex flex-col justify-end">
                        {waterVal > 0 && (
                          <div
                            className="w-full bg-gradient-to-t from-sky-500 to-sky-400 border-t border-sky-300/30 rounded-t-sm"
                            style={{ height: `${(waterVal / maxVal) * 100}%` }}
                          />
                        )}
                        <div
                          className={`w-full rounded-t-sm ${
                            isLeft || isRight
                              ? 'bg-primary shadow-md ring-2 ring-primary/30 ring-offset-1 ring-offset-background'
                              : 'bg-slate-300 dark:bg-slate-700 border border-slate-400/20 dark:border-slate-600/20'
                          }`}
                          style={{ height: `${(hVal / maxVal) * 100}%` }}
                        />
                      </div>
                      {/* Height Label */}
                      <span className={`text-[10px] font-mono mt-1 ${isLeft || isRight ? 'text-primary font-bold' : 'text-muted-foreground'}`}>
                        {hVal}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Legend and stats */}
              <div className="flex items-center justify-between border-t border-border/40 pt-4 mt-2 text-xs">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 bg-slate-300 dark:bg-slate-700 border border-slate-400/20 rounded-sm" />
                    <span className="text-muted-foreground text-[11px]">Elevation Bar</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 bg-gradient-to-t from-sky-500 to-sky-400 rounded-sm" />
                    <span className="text-muted-foreground text-[11px]">Trapped Water</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-blue-500 font-bold text-[11px]">L</span> / <span className="text-purple-500 font-bold text-[11px]">R</span>
                    <span className="text-muted-foreground text-[11px]">Pointers</span>
                  </div>
                </div>
                <div className="font-mono text-muted-foreground">
                  Total Trapped: <span className="text-sky-500 font-bold text-sm">{step.res}</span> units
                </div>
              </div>
            </Card>

            {/* Commentary Box Card */}
            <Card className="p-4 bg-primary/5 border-primary/20 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
              <h4 className="text-xs font-bold uppercase tracking-widest text-primary mb-2 flex items-center gap-2">
                <Info className="w-3.5 h-3.5" /> Reasoning Insight
              </h4>
              <p className="text-sm text-foreground leading-relaxed font-medium">{step.explanation}</p>
            </Card>
          </div>
        }
        rightContent={
          <div className="space-y-4">
            <VisualizationCodePanel
              languages={languages}
              stepLineNumbers={stepLineNumbers}
              pseudoSteps={pseudoSteps}
              activeStepIndex={currentStep}
              onLanguageChange={() => setCurrentStep(0)}
            />
            <VariablePanel variables={step.variables} />
          </div>
        }
        controls={
          <SimpleStepControls
            currentStep={currentStep}
            totalSteps={steps.length}
            onStepChange={setCurrentStep}
          />
        }
      />
    </div>
  );
};
export default TrappingRainWaterVisualization;
