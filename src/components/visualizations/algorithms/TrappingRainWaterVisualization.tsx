import React, { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { AnimatedCodeEditor } from '../shared/AnimatedCodeEditor';
import { VisualizationLayout } from '../shared/VisualizationLayout';
import { Info } from 'lucide-react';

interface Step {
  l: number;
  r: number;
  leftMax: number;
  rightMax: number;
  res: number;
  trappedWater: number[];
  explanation: string;
  lineExecution: string;
  highlightedLines: number[];
}

const height = [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1];

export const TrappingRainWaterVisualization: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const code = `function trap(height: number[]): number {
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
}`;

  const steps = useMemo(() => {
    const stepsList: Step[] = [];
    const trappedWater = new Array(height.length).fill(0);

    // Initial check (line 2)
    stepsList.push({
      l: 0,
      r: height.length - 1,
      leftMax: 0,
      rightMax: 0,
      res: 0,
      trappedWater: [...trappedWater],
      explanation: "Check if the input array is empty. Since the height array has elements, we proceed.",
      lineExecution: "if (!height.length) return 0;",
      highlightedLines: [2]
    });

    // Initialize pointers (lines 3-4)
    let l = 0;
    let r = height.length - 1;
    stepsList.push({
      l,
      r,
      leftMax: 0,
      rightMax: 0,
      res: 0,
      trappedWater: [...trappedWater],
      explanation: `Initialize two pointers: left pointer l = 0 and right pointer r = ${r}.`,
      lineExecution: `let l = 0;\nlet r = height.length - 1;`,
      highlightedLines: [3, 4]
    });

    // Initialize max variables and result (lines 5-7)
    let leftMax = height[l];
    let rightMax = height[r];
    let res = 0;
    stepsList.push({
      l,
      r,
      leftMax,
      rightMax,
      res,
      trappedWater: [...trappedWater],
      explanation: `Set leftMax to height[l] (${leftMax}) and rightMax to height[r] (${rightMax}). Initialize res (trapped water) to 0.`,
      lineExecution: `let leftMax = height[l];\nlet rightMax = height[r];\nlet res = 0;`,
      highlightedLines: [5, 6, 7]
    });

    // Loop
    while (l < r) {
      // Loop condition check
      stepsList.push({
        l,
        r,
        leftMax,
        rightMax,
        res,
        trappedWater: [...trappedWater],
        explanation: `Verify loop condition l < r (${l} < ${r} is true). The pointers have not met, so the loop continues.`,
        lineExecution: `while (l < r)`,
        highlightedLines: [8]
      });

      // Compare leftMax and rightMax
      stepsList.push({
        l,
        r,
        leftMax,
        rightMax,
        res,
        trappedWater: [...trappedWater],
        explanation: `Compare leftMax (${leftMax}) and rightMax (${rightMax}). Since leftMax ${leftMax < rightMax ? "<" : "≥"} rightMax, we process the ${leftMax < rightMax ? "left pointer (l)" : "right pointer (r)"} side.`,
        lineExecution: `if (leftMax < rightMax)`,
        highlightedLines: [9]
      });

      if (leftMax < rightMax) {
        l++;
        stepsList.push({
          l,
          r,
          leftMax,
          rightMax,
          res,
          trappedWater: [...trappedWater],
          explanation: `Increment left pointer l to ${l} (height[${l}] = ${height[l]}).`,
          lineExecution: `l++;`,
          highlightedLines: [10]
        });

        const oldLeftMax = leftMax;
        leftMax = Math.max(leftMax, height[l]);
        stepsList.push({
          l,
          r,
          leftMax,
          rightMax,
          res,
          trappedWater: [...trappedWater],
          explanation: `Update leftMax to max(leftMax, height[l]) = max(${oldLeftMax}, ${height[l]}) = ${leftMax}.`,
          lineExecution: `leftMax = Math.max(leftMax, height[l]);`,
          highlightedLines: [11]
        });

        const water = leftMax - height[l];
        res += water;
        trappedWater[l] = water;
        stepsList.push({
          l,
          r,
          leftMax,
          rightMax,
          res,
          trappedWater: [...trappedWater],
          explanation: `Calculate trapped water at index ${l}: leftMax - height[l] = ${leftMax} - ${height[l]} = ${water} units. Add this to res, making total water ${res} units.`,
          lineExecution: `res += leftMax - height[l];`,
          highlightedLines: [12]
        });
      } else {
        r--;
        stepsList.push({
          l,
          r,
          leftMax,
          rightMax,
          res,
          trappedWater: [...trappedWater],
          explanation: `Decrement right pointer r to ${r} (height[${r}] = ${height[r]}).`,
          lineExecution: `r--;`,
          highlightedLines: [14]
        });

        const oldRightMax = rightMax;
        rightMax = Math.max(rightMax, height[r]);
        stepsList.push({
          l,
          r,
          leftMax,
          rightMax,
          res,
          trappedWater: [...trappedWater],
          explanation: `Update rightMax to max(rightMax, height[r]) = max(${oldRightMax}, ${height[r]}) = ${rightMax}.`,
          lineExecution: `rightMax = Math.max(rightMax, height[r]);`,
          highlightedLines: [15]
        });

        const water = rightMax - height[r];
        res += water;
        trappedWater[r] = water;
        stepsList.push({
          l,
          r,
          leftMax,
          rightMax,
          res,
          trappedWater: [...trappedWater],
          explanation: `Calculate trapped water at index ${r}: rightMax - height[r] = ${rightMax} - ${height[r]} = ${water} units. Add this to res, making total water ${res} units.`,
          lineExecution: `res += rightMax - height[r];`,
          highlightedLines: [16]
        });
      }
    }

    // Loop terminated
    stepsList.push({
      l,
      r,
      leftMax,
      rightMax,
      res,
      trappedWater: [...trappedWater],
      explanation: `Verify loop condition l < r (${l} < ${r} is false). The pointers have met at index ${l}, so the loop terminates.`,
      lineExecution: `while (l < r)`,
      highlightedLines: [8]
    });

    // Return statement
    stepsList.push({
      l,
      r,
      leftMax,
      rightMax,
      res,
      trappedWater: [...trappedWater],
      explanation: `Return the total trapped rain water res = ${res} units.`,
      lineExecution: `return res;`,
      highlightedLines: [19]
    });

    return stepsList;
  }, []);

  const step = steps[currentStep] || steps[0];
  const maxVal = Math.max(...height);

  return (
    <VisualizationLayout
      controls={
        <SimpleStepControls
          currentStep={currentStep}
          totalSteps={steps.length}
          onStepChange={setCurrentStep}
        />
      }
      leftContent={
        <div className="space-y-4">
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
          <Card className="p-5 border-l-4 border-primary bg-primary/5 shadow-sm min-h-[120px]">
            <div className="flex items-start gap-3.5">
              <div className="p-2.5 rounded-xl bg-primary/10 text-primary shrink-0">
                <Info className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-[10px] font-bold uppercase tracking-[0.15em] text-primary/80">
                  Reasoning Insight
                </h4>
                <p className="text-[14px] font-medium leading-relaxed text-foreground/90">
                  {step.explanation}
                </p>
              </div>
            </div>
          </Card>

          {/* Variable Panel */}
          <VariablePanel
            variables={{
              l: step.l,
              r: step.r,
              'height[l]': height[step.l],
              'height[r]': height[step.r],
              leftMax: step.leftMax,
              rightMax: step.rightMax,
              res: step.res
            }}
          />
        </div>
      }
      rightContent={
        <Card className="h-full border border-border/50 overflow-hidden">
          <AnimatedCodeEditor
            code={code}
            highlightedLines={step.highlightedLines}
            language="typescript"
          />
        </Card>
      }
    />
  );
};
