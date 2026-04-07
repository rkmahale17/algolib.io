import React, { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { AnimatedCodeEditor } from '../shared/AnimatedCodeEditor';
import { VisualizationLayout } from '../shared/VisualizationLayout';

interface Step {
  nums: number[];
  i: number | null;
  start: number | null;
  end: number | null;
  rob1: number | null;
  rob2: number | null;
  temp: number | null;
  caseName: string;
  variables: Record<string, any>;
  explanation: string;
  lineExecution: string;
  highlightedLines: number[];
}

export const HouseRobberIIVisualization: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const nums = [4, 2, 3, 1];

  const code = `function rob(nums: number[]): number {
  if (nums.length === 1) return nums[0];
  const robLinear = (start: number, end: number): number => {
    let rob1 = 0;
    let rob2 = 0;
    for (let i = start; i <= end; i++) {
      const temp = Math.max(rob1 + nums[i], rob2);
      rob1 = rob2;
      rob2 = temp;
    }
    return rob2;
  };
  const case1 = robLinear(0, nums.length - 2);
  const case2 = robLinear(1, nums.length - 1);
  return Math.max(case1, case2);
}`;

  const steps = useMemo(() => {
    const stepsList: Step[] = [];
    const n = nums.length;

    stepsList.push({
      nums,
      i: null,
      start: null,
      end: null,
      rob1: null,
      rob2: null,
      temp: null,
      caseName: "",
      variables: { nums: `[${nums.join(', ')}]` },
      explanation: "Function started. Input houses array represents a circular street.",
      lineExecution: "function rob(nums: number[]): number {",
      highlightedLines: [1]
    });

    if (n === 1) {
      stepsList.push({
        nums,
        i: 0,
        start: null,
        end: null,
        rob1: null,
        rob2: null,
        temp: null,
        caseName: "",
        variables: { length: 1, result: nums[0] },
        explanation: "Only one house exists. Max money is simply the value of this house.",
        lineExecution: "if (nums.length === 1) return nums[0];",
        highlightedLines: [2]
      });
      return stepsList;
    }

    stepsList.push({
      nums,
      i: null,
      start: null,
      end: null,
      rob1: null,
      rob2: null,
      temp: null,
      caseName: "",
      variables: { length: n },
      explanation: "Define a helper function 'robLinear' to calculate the maximum money robbed for a linear subarray of houses.",
      lineExecution: "const robLinear = (start: number, end: number): number => {",
      highlightedLines: [3]
    });

    const simulateCase = (start: number, end: number, caseLabel: string) => {
      let rob1 = 0;
      let rob2 = 0;

      stepsList.push({
        nums,
        i: null,
        start,
        end,
        rob1: null,
        rob2: null,
        temp: null,
        caseName: caseLabel,
        variables: { start, end },
        explanation: `Processing ${caseLabel}: Houses in range [${start}, ${end}]. This scenario ignores house ${start === 0 ? n - 1 : 0} to handle the circular constraint.`,
        lineExecution: `const ${caseLabel} = robLinear(${start}, nums.length - ${start === 0 ? 2 : 1});`,
        highlightedLines: caseLabel === "case1" ? [13] : [14]
      });

      stepsList.push({
        nums,
        i: null,
        start,
        end,
        rob1: 0,
        rob2: 0,
        temp: null,
        caseName: caseLabel,
        variables: { rob1: 0, rob2: 0 },
        explanation: "Initialize rob1 = 0 and rob2 = 0 for the linear pass.",
        lineExecution: "let rob1 = 0;\nlet rob2 = 0;",
        highlightedLines: [4, 5]
      });

      for (let i = start; i <= end; i++) {
        const money = nums[i];
        stepsList.push({
          nums,
          i,
          start,
          end,
          rob1,
          rob2,
          temp: null,
          caseName: caseLabel,
          variables: { i, money, rob1, rob2 },
          explanation: `Inner loop iteration for house ${i}. Comparing robbing house ${i} vs. skipping it.`,
          lineExecution: "for (let i = start; i <= end; i++) {",
          highlightedLines: [6]
        });

        const temp = Math.max(rob1 + money, rob2);
        stepsList.push({
          nums,
          i,
          start,
          end,
          rob1,
          rob2,
          temp,
          caseName: caseLabel,
          variables: { money, rob1, rob2, "money+rob1": money + rob1, "max": temp },
          explanation: `Calculate temp: max(money + rob1, rob2) = max(${money} + ${rob1}, ${rob2}) = ${temp}.`,
          lineExecution: "const temp = Math.max(rob1 + nums[i], rob2);",
          highlightedLines: [7]
        });

        rob1 = rob2;
        stepsList.push({
          nums,
          i,
          start,
          end,
          rob1,
          rob2,
          temp,
          caseName: caseLabel,
          variables: { rob1 },
          explanation: `Shift window: rob1 becomes old rob2 (${rob1}).`,
          lineExecution: "rob1 = rob2;",
          highlightedLines: [8]
        });

        rob2 = temp;
        stepsList.push({
          nums,
          i,
          start,
          end,
          rob1,
          rob2,
          temp,
          caseName: caseLabel,
          variables: { rob2 },
          explanation: `Shift window: rob2 becomes temp (${temp}).`,
          lineExecution: "rob2 = temp;",
          highlightedLines: [9]
        });
      }

      stepsList.push({
        nums,
        i: null,
        start,
        end,
        rob1,
        rob2,
        temp: null,
        caseName: caseLabel,
        variables: { [`${caseLabel}_result`]: rob2 },
        explanation: `Pass complete. The maximum for houses in range [${start}, ${end}] is ${rob2}.`,
        lineExecution: "return rob2;",
        highlightedLines: [11]
      });

      return rob2;
    };

    const res1 = simulateCase(0, n - 2, "case1");
    const res2 = simulateCase(1, n - 1, "case2");

    stepsList.push({
      nums,
      i: null,
      start: null,
      end: null,
      rob1: null,
      rob2: null,
      temp: null,
      caseName: "comparison",
      variables: { case1: res1, case2: res2, result: Math.max(res1, res2) },
      explanation: `Finally, return the maximum of Case 1 (${res1}) and Case 2 (${res2}): ${Math.max(res1, res2)}.`,
      lineExecution: "return Math.max(case1, case2);",
      highlightedLines: [15]
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
              House Robber II (Circular)
            </h2>
            <Card className="p-6 bg-card/60 backdrop-blur border-border/50 shadow-sm overflow-hidden relative">
              <div className="text-center mb-4">
                <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                  step.caseName === "case1" ? "bg-blue-100 text-blue-700" :
                  step.caseName === "case2" ? "bg-green-100 text-green-700" :
                  "bg-muted text-muted-foreground"
                }`}>
                  {step.caseName ? step.caseName.toUpperCase() : "START"}
                </span>
              </div>
              
              <div className="flex gap-4 justify-center items-end min-h-[160px] pb-20">
                {nums.map((money, idx) => {
                  const isInRange = step.start !== null && step.end !== null && idx >= step.start && idx <= step.end;
                  const isCurrent = idx === step.i && step.i !== null;
                  const isExcluded = step.start !== null && !isInRange;
                  
                  return (
                    <div key={idx} className="flex flex-col items-center gap-1 group relative">
                      <div 
                        className={`w-10 bg-white dark:bg-card border-2 rounded-t-lg flex items-center justify-center font-bold text-black dark:text-white transition-colors duration-0 ${
                          isCurrent ? "border-orange-500 bg-orange-100 dark:bg-orange-900/30 shadow-lg" : 
                          isInRange ? "border-blue-500 bg-blue-50 dark:bg-blue-900/10" : 
                          isExcluded ? "border-dashed border-gray-100 opacity-20" :
                          "border-gray-200 dark:border-border"
                        }`}
                        style={{ height: `${40 + (money * 6)}px` }}
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

              {step.rob1 !== null && step.rob2 !== null && (
                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                    <h4 className="text-[10px] font-bold uppercase tracking-wider text-blue-600 mb-1">rob1</h4>
                    <div className="text-xl font-bold text-black">${step.rob1}</div>
                  </div>
                  <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                    <h4 className="text-[10px] font-bold uppercase tracking-wider text-green-600 mb-1">rob2</h4>
                    <div className="text-xl font-bold text-black">${step.rob2}</div>
                  </div>
                </div>
              )}
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
