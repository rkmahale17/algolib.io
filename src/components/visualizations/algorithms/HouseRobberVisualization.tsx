import React, { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { AnimatedCodeEditor } from '../shared/AnimatedCodeEditor';
import { VisualizationLayout } from '../shared/VisualizationLayout';

interface Step {
  nums: number[];
  rob1: number;
  rob2: number;
  currentMoney: number | null;
  temp: number | null;
  i: number;
  variables: Record<string, any>;
  explanation: string;
  lineExecution: string;
  highlightedLines: number[];
}

export const HouseRobberVisualization: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const nums = [4, 2, 3, 1];

  const code = `function rob(nums: number[]): number {
  let rob1 = 0;
  let rob2 = 0;
  for (const money of nums) {
    const temp = Math.max(money + rob1, rob2);
    rob1 = rob2;
    rob2 = temp;
  }
  return rob2;
}`;

  const steps = useMemo(() => {
    const stepsList: Step[] = [];
    let rob1 = 0;
    let rob2 = 0;

    stepsList.push({
      nums,
      rob1: 0,
      rob2: 0,
      currentMoney: null,
      temp: null,
      i: -1,
      variables: { nums: `[${nums.join(', ')}]` },
      explanation: "Function started. Input houses array received.",
      lineExecution: "function rob(nums: number[]): number {",
      highlightedLines: [1]
    });

    stepsList.push({
      nums,
      rob1: 0,
      rob2: 0,
      currentMoney: null,
      temp: null,
      i: -1,
      variables: { rob1: 0, rob2: 0 },
      explanation: "Initialize rob1 = 0 (max money found 2 houses back) and rob2 = 0 (max money found up to previous house).",
      lineExecution: "let rob1 = 0;\nlet rob2 = 0;",
      highlightedLines: [2, 3]
    });

    for (let i = 0; i < nums.length; i++) {
      const money = nums[i];

      stepsList.push({
        nums,
        rob1,
        rob2,
        currentMoney: money,
        temp: null,
        i,
        variables: { money, rob1, rob2 },
        explanation: `Entering loop to process house at index ${i} containing $${money}.`,
        lineExecution: "for (const money of nums) {",
        highlightedLines: [4]
      });

      const temp = Math.max(money + rob1, rob2);

      stepsList.push({
        nums,
        rob1,
        rob2,
        currentMoney: money,
        temp,
        i,
        variables: { money, rob1, rob2, "money+rob1": money + rob1, "max": temp },
        explanation: `Decide whether to rob house ${i}.\nIf robbed: Current money ($${money}) + rob1 ($${rob1}) = $${money + rob1}.\nIf skipped: Use rob2 ($${rob2}).\nResulting in temp = $${temp}.`,
        lineExecution: "const temp = Math.max(money + rob1, rob2);",
        highlightedLines: [5]
      });

      rob1 = rob2;
      stepsList.push({
        nums,
        rob1,
        rob2,
        currentMoney: money,
        temp,
        i,
        variables: { rob1, rob2 },
        explanation: `Update rob1 to rob2 ($${rob2}). This prepares the window for the next iteration.`,
        lineExecution: "rob1 = rob2;",
        highlightedLines: [6]
      });

      rob2 = temp;
      stepsList.push({
        nums,
        rob1,
        rob2,
        currentMoney: money,
        temp,
        i,
        variables: { rob1, rob2, temp },
        explanation: `Update rob2 to temp ($${temp}), representing the new maximum value robbable including houses up to this point.`,
        lineExecution: "rob2 = temp;",
        highlightedLines: [7]
      });
    }

    stepsList.push({
      nums,
      rob1,
      rob2,
      currentMoney: null,
      temp: null,
      i: nums.length,
      variables: { result: rob2 },
      explanation: `Finished processing all houses. The maximum amount robbed is stored in rob2: $${rob2}.`,
      lineExecution: "return rob2;",
      highlightedLines: [10]
    });

    return stepsList;
  }, [nums]);

  const step = steps[currentStep];

  return (
    <VisualizationLayout
      leftContent={
        <div className="space-y-6 flex flex-col h-full">
          <div>
            <h2 className="text-lg font-bold text-foreground mb-4 opacity-90">
              House Robber (Bottom-Up)
            </h2>
            <Card className="p-6 bg-card/60 backdrop-blur border-border/50 shadow-sm overflow-hidden relative">
              <div className="flex gap-4 justify-center items-end min-h-[160px] pb-20">
                {nums.map((money, idx) => {
                  const isCurrent = idx === step.i;
                  const isPast = idx < step.i;
                  
                  return (
                    <div key={idx} className="flex flex-col items-center gap-1 group relative">
                      <div 
                        className={`w-10 bg-white dark:bg-card border-2 rounded-t-lg flex items-center justify-center font-bold text-black dark:text-white transition-colors duration-0 ${
                          isCurrent ? "border-orange-500 bg-orange-100 dark:bg-orange-900/30" : 
                          isPast ? "border-green-500 bg-green-50/50 dark:bg-green-900/10 opacity-70" : 
                          "border-gray-200 dark:border-border"
                        }`}
                        style={{ height: `${40 + (money * 3)}px` }}
                      >
                        ${money}
                      </div>
                      
                      {isCurrent && (
                        <div className="absolute top-full mt-4 w-10 h-10 flex items-center justify-center -translate-x-1/2 left-1/2">
                          <img 
                            src="/robber.png" 
                            alt="Robber" 
                            className="w-full h-full object-contain"
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                  <h4 className="text-[10px] font-bold uppercase tracking-wider text-blue-600 mb-1">rob1 (i-2)</h4>
                  <div className="text-2xl font-bold text-black">${step.rob1}</div>
                </div>
                <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                  <h4 className="text-[10px] font-bold uppercase tracking-wider text-green-600 mb-1">rob2 (i-1)</h4>
                  <div className="text-2xl font-bold text-black">${step.rob2}</div>
                </div>
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
                       {step.lineExecution}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-[10px] font-bold uppercase tracking-[0.1em] text-primary/80 mb-1">
                       Commentary
                    </h4>
                    <p className="text-[14px] font-medium leading-relaxed text-foreground/90 whitespace-pre-wrap text-black">
                       {step.explanation}
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
               highlightedLines={step.highlightedLines}
             />
           </div>
           
           <div className="p-1">
             <VariablePanel variables={step.variables} />
           </div>
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
  );
};
