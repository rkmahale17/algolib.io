import React, { useEffect, useRef, useState } from "react";

import { AnimatedCodeEditor } from "../shared/AnimatedCodeEditor";
import { SimpleStepControls } from "../shared/SimpleStepControls";
import { VariablePanel } from "../shared/VariablePanel";
import { VisualizationLayout } from "../shared/VisualizationLayout";
import { Card } from "@/components/ui/card";

interface Step {
  array: number[];
  dp: number[];
  currentIndex: number; // i
  compareIndex?: number; // j
  maxLength: number;
  explanation: string;
  lineExecution: string;
  lineNumber: number[];
}

export const LISVisualization: React.FC = () => {
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const code = `function lengthOfLIS(nums: number[]): number {
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
}`;

  const generateSteps = () => {
    const nums = [10, 9, 2, 5, 3, 7, 101, 18];
    const n = nums.length;
    const LIS = new Array(n).fill(1);
    const newSteps: Step[] = [];

    newSteps.push({
      array: [...nums],
      dp: [...LIS],
      currentIndex: -1,
      maxLength: 1,
      explanation: "Initialize LIS array with 1s.\nEvery individual element is technically an increasing subsequence of length 1 by itself.",
      lineExecution: "const LIS: number[] = new Array(n).fill(1);",
      lineNumber: [3],
    });

    for (let i = n - 1; i >= 0; i--) {
      newSteps.push({
        array: [...nums],
        dp: [...LIS],
        currentIndex: i,
        maxLength: Math.max(...LIS),
        explanation: `Outer loop moves backward: i = ${i} (Base Value: ${nums[i]}).\nWe are finding the longest increasing subsequence that STARTS precisely at index ${i}.`,
        lineExecution: "for (let i = n - 1; i >= 0; i--)",
        lineNumber: [4],
      });

      for (let j = i + 1; j < n; j++) {
        if (nums[i] < nums[j]) {
          const oldVal = LIS[i];
          LIS[i] = Math.max(LIS[i], 1 + LIS[j]);

          newSteps.push({
            array: [...nums],
            dp: [...LIS],
            currentIndex: i,
            compareIndex: j,
            maxLength: Math.max(...LIS),
            explanation: `Compare nums[${i}] (${nums[i]}) with nums[${j}] (${nums[j]}).\nYes, ${nums[i]} < ${nums[j]}.\nUpdate LIS[${i}] = max(${oldVal}, 1 + LIS[${j}]) becomes ${LIS[i]}!`,
            lineExecution: "if (nums[i] < nums[j]) { LIS[i] = Math.max(...) }",
            lineNumber: [6, 7],
          });
        } else {
          newSteps.push({
            array: [...nums],
            dp: [...LIS],
            currentIndex: i,
            compareIndex: j,
            maxLength: Math.max(...LIS),
            explanation: `Compare nums[${i}] (${nums[i]}) with nums[${j}] (${nums[j]}).\nNo, ${nums[i]} is NOT strictly less than ${nums[j]}, unable to add to sequence. Skip.`,
            lineExecution: "if (nums[i] < nums[j])",
            lineNumber: [6],
          });
        }
      }
    }

    newSteps.push({
      array: [...nums],
      dp: [...LIS],
      currentIndex: -1,
      maxLength: Math.max(...LIS),
      explanation: `The loops have completed computing lengths from right to left.\nThe overall Longest Increasing Subsequence length is the maximum value tracked completely across the DP array: ${Math.max(...LIS)}.`,
      lineExecution: "return Math.max(...LIS);",
      lineNumber: [11],
    });

    setSteps(newSteps);
  };

  useEffect(() => {
    generateSteps();
  }, []);

  if (steps.length === 0) return null;

  const currentStep = steps[currentStepIndex];
  const maxVal = Math.max(...currentStep.array);

  return (
    <VisualizationLayout
      leftContent={
        <div className="space-y-6 flex flex-col h-full">
          <div>
            <h2 className="text-lg font-bold text-foreground mb-4 opacity-90">
              Bottom-Up Approach
            </h2>
            <Card className="p-6 bg-card/60 backdrop-blur border-border/50 shadow-sm overflow-hidden">
              <h3 className="text-sm font-semibold text-black dark:text-white mb-4 border-b border-primary/20 pb-2">
                 Input Array (nums)
              </h3>
              <div className="flex items-end justify-start sm:justify-center gap-3 overflow-x-auto pb-4 pt-4 px-2">
                {currentStep.array.map((value, idx) => {
                  const isI = idx === currentStep.currentIndex;
                  const isJ = idx === currentStep.compareIndex;
                  return (
                    <div
                      key={idx}
                      className="flex flex-col items-center gap-1 shrink-0"
                      style={{ minWidth: '32px' }}
                    >
                      <div
                        className={`w-8 rounded-t flex items-end justify-center pb-1 border-t-2 border-l-2 border-r-2 font-normal text-black dark:text-white ${
                            isI
                              ? "bg-orange-400 border-orange-500 shadow-lg z-10"
                              : isJ
                                ? "bg-blue-400 border-blue-500 shadow-lg z-10"
                                : "bg-white dark:bg-card border-gray-300 dark:border-border"
                          }`}
                        style={{
                          height: `${Math.max((value / maxVal) * 80, 24)}px`,
                        }}
                      >
                        <span className="text-[11px]">{value}</span>
                      </div>
                      <div className="flex flex-col items-center">
                         {isI && <div className="mt-1 text-[10px] font-black text-primary bg-primary/20 px-1 rounded uppercase tracking-tighter">i</div>}
                         {isJ && <div className="mt-1 text-[10px] font-black text-secondary bg-secondary/20 px-1 rounded uppercase tracking-tighter">j</div>}
                         {(!isI && !isJ) && <div className="mt-1 h-[15px] w-full"></div>}
                      </div>
                    </div>
                  );
                })}
              </div>

              <h3 className="text-sm font-semibold text-black dark:text-white mb-3 mt-4 border-b border-primary/20 pb-2">
                 DP Array (Longest Sequence Starting Here)
              </h3>
              <div className="flex gap-3 justify-start sm:justify-center overflow-x-auto pb-4 px-2">
                {currentStep.dp.map((length, idx) => {
                   const isI = idx === currentStep.currentIndex;
                   const isJ = idx === currentStep.compareIndex;
                   
                   return (
                     <div key={idx} className="flex flex-col items-center gap-1">
                       <div
                         className={`w-8 h-8 rounded border-2 flex items-center justify-center font-normal text-sm text-black dark:text-white ${
                            isI
                             ? "bg-orange-400 border-orange-500 shadow-lg"
                             : isJ
                               ? "bg-blue-400 border-blue-500 shadow-lg"
                               : length > 1
                                 ? "bg-green-300 border-green-500 dark:bg-green-800 dark:border-green-600"
                                 : "bg-white dark:bg-card border-gray-300 dark:border-border"
                           }`}
                       >
                         {length}
                       </div>
                     </div>
                   );
                })}
              </div>
            </Card>
          </div>

          <div>
            <Card className="p-5 border-l-4 border-primary bg-primary/5 shadow-sm">
              <div className="space-y-4">
                <div>
                   <h4 className="text-[10px] font-bold uppercase tracking-[0.1em] text-primary/80 mb-2">
                     Current Execution
                   </h4>
                   <div className="text-sm font-mono bg-background/80 p-2.5 rounded-lg border border-border/50 shadow-sm inline-block">
                     {currentStep.lineExecution}
                   </div>
                </div>
                <div>
                   <h4 className="text-[10px] font-bold uppercase tracking-[0.1em] text-primary/80 mb-1">
                     Commentary
                   </h4>
                   <p className="text-[14px] font-medium leading-relaxed text-foreground/90 whitespace-pre-wrap">
                     {currentStep.explanation}
                   </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      }
      rightContent={
        <div className="space-y-6 flex flex-col h-full">
           <div className="flex-1 overflow-hidden min-h-[400px]">
             <AnimatedCodeEditor
               code={code}
               language="typescript"
               highlightedLines={currentStep.lineNumber}
             />
           </div>
           
           <div className="p-1">
             <VariablePanel 
                variables={{
                 i: currentStep.currentIndex !== -1 ? currentStep.currentIndex : undefined,
                 j: currentStep.compareIndex,
                 "nums[i]": currentStep.currentIndex !== -1 ? currentStep.array[currentStep.currentIndex] : undefined,
                 "nums[j]": currentStep.compareIndex !== undefined ? currentStep.array[currentStep.compareIndex] : undefined,
                 "LIS[i]": currentStep.currentIndex !== -1 ? currentStep.dp[currentStep.currentIndex] : undefined,
                 Max_LIS: currentStep.maxLength,
               }} 
             />
           </div>
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
