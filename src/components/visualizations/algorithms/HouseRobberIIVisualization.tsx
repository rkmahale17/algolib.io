import React, { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { VisualizationCodePanel } from '../shared/VisualizationCodePanel';
import { VisualizationLayout } from '../shared/VisualizationLayout';
import type { StepLineNumberMap, VisualizationLanguageMap } from '@/types/visualization';

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
  pseudoStep: string;
  calc?: string;
}

const languages: VisualizationLanguageMap = {
  typescript: `function rob(nums: number[]): number {
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
}`,
  python: `def rob(nums):
    if len(nums) == 1:
        return nums[0]
    def rob_linear(start, end):
        rob1 = 0
        rob2 = 0
        for i in range(start, end + 1):
            temp = max(rob1 + nums[i], rob2)
            rob1 = rob2
            rob2 = temp
        return rob2
    return max(
        rob_linear(0, len(nums) - 2),
        rob_linear(1, len(nums) - 1)
    )`,
  java: `public static class Solution {
    public int rob(int[] nums) {
        if (nums.length == 1) return nums[0];
        int case1 = robLinear(nums, 0, nums.length - 2);
        int case2 = robLinear(nums, 1, nums.length - 1);
        return Math.max(case1, case2);
    }
    private int robLinear(int[] nums, int start, int end) {
        int rob1 = 0;
        int rob2 = 0;
        for (int i = start; i <= end; i++) {
            int temp = Math.max(rob1 + nums[i], rob2);
            rob1 = rob2;
            rob2 = temp;
        }
        return rob2;
    }
}`,
  cpp: `class Solution {
public:
    int robLinear(vector<int>& nums, int start, int end) {
        int rob1 = 0;
        int rob2 = 0;
        for (int i = start; i <= end; i++) {
            int temp = max(rob1 + nums[i], rob2);
            rob1 = rob2;
            rob2 = temp;
        }
        return rob2;
    }
    int rob(vector<int>& nums) {
        if (nums.size() == 1) return nums[0];
        int case1 = robLinear(nums, 0, nums.size() - 2);
        int case2 = robLinear(nums, 1, nums.size() - 1);
        return max(case1, case2);
    }
};`
};

export const HouseRobberIIVisualization: React.FC = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const nums = [4, 2, 3, 1];

  const { steps, stepLineNumbers } = useMemo(() => {
    const stepsList: Step[] = [];
    const n = nums.length;
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

    // 1. Initial entry
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
      explanation: "Function started. Since the houses are circular, robbing both the first and last houses is forbidden.",
      pseudoStep: "CALL rob(nums)"
    });
    addLines(1, 1, 2, 13);

    // 2. Helper def
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
      explanation: "Define a helper method 'robLinear' to rob a linear sequence of houses within a specified range.",
      pseudoStep: "DEFINE robLinear(start, end)"
    });
    addLines(3, 4, 8, 3);

    const simulateCase = (start: number, end: number, caseLabel: string) => {
      let rob1 = 0;
      let rob2 = 0;

      // Call helper step
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
        explanation: `Start ${caseLabel}: Rob houses from index ${start} to ${end}. This handles the circle constraint by excluding one boundary house.`,
        pseudoStep: `CALL robLinear(${start}, ${end})`
      });
      addLines(caseLabel === "case1" ? 13 : 14, caseLabel === "case1" ? 13 : 14, caseLabel === "case1" ? 4 : 5, caseLabel === "case1" ? 14 : 15);

      // Initialize rob1, rob2
      stepsList.push({
        nums,
        i: null,
        start,
        end,
        rob1: 0,
        rob2: 0,
        temp: null,
        caseName: caseLabel,
        variables: { start, end, rob1: 0, rob2: 0 },
        explanation: `Within robLinear(${start}, ${end}): Initialize rob1 = 0 (representing maximum up to i-2) and rob2 = 0 (representing maximum up to i-1).`,
        pseudoStep: "SET rob1 = 0, rob2 = 0"
      });
      addLines(4, 5, 9, 4);

      for (let i = start; i <= end; i++) {
        const money = nums[i];

        // Loop check step
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
          explanation: `Loop iteration: i = ${i}, money = $${money}. Decide whether to rob house ${i} or skip it.`,
          pseudoStep: `FOR i = ${start} TO ${end} (i = ${i})`
        });
        addLines(6, 7, 11, 6);

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
          variables: { i, money, rob1, rob2, 'money + rob1': money + rob1, temp },
          explanation: `Calculate temp: Either rob house ${i} ($${money} + rob1: $${rob1} = $${money + rob1}) or skip it (rob2: $${rob2}). Max is $${temp}.`,
          pseudoStep: `SET temp = MAX(rob1 + nums[i], rob2) (${temp})`,
          calc: `max(${rob1} + ${money}, ${rob2}) = ${temp}`
        });
        addLines(7, 8, 12, 7);

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
          variables: { i, money, rob1, rob2, temp },
          explanation: `Shift window: rob1 becomes rob2 ($${rob1}).`,
          pseudoStep: `SET rob1 = rob2 (${rob1})`
        });
        addLines(8, 9, 13, 8);

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
          variables: { i, money, rob1, rob2, temp },
          explanation: `Shift window: rob2 becomes temp ($${temp}).`,
          pseudoStep: `SET rob2 = temp (${temp})`
        });
        addLines(9, 10, 14, 9);
      }

      // Return step
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
        explanation: `Completed linear pass for range [${start}, ${end}]. Return rob2 = $${rob2}.`,
        pseudoStep: `RETURN rob2 (${rob2})`
      });
      addLines(11, 11, 16, 11);

      return rob2;
    };

    const res1 = simulateCase(0, n - 2, "case1");
    const res2 = simulateCase(1, n - 1, "case2");

    // Final return step
    stepsList.push({
      nums,
      i: null,
      start: null,
      end: null,
      rob1: null,
      rob2: null,
      temp: null,
      caseName: "comparison",
      variables: { case1: res1, case2: res2, max: Math.max(res1, res2) },
      explanation: `Return the overall maximum of both cases: max(case1: $${res1}, case2: $${res2}) = $${Math.max(res1, res2)}.`,
      pseudoStep: `RETURN MAX(case1, case2) (${Math.max(res1, res2)})`,
      calc: `max(${res1}, ${res2}) = ${Math.max(res1, res2)}`
    });
    addLines(15, 12, 6, 16);

    return { steps: stepsList, stepLineNumbers: lines };
  }, []);

  const step = steps[currentStepIndex];
  const pseudoSteps = steps.map((s) => s.pseudoStep);

  return (
    <VisualizationLayout
      leftContent={
        <div className="flex flex-col h-full justify-between gap-6">
          <div className="space-y-6">
            <Card className="p-6 bg-card/60 backdrop-blur border-border/50 shadow-sm overflow-hidden relative">
              <div className="text-center mb-6">
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest ${
                  step.caseName === "case1" ? "bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/25" :
                  step.caseName === "case2" ? "bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/25" :
                  "bg-muted text-muted-foreground"
                }`}>
                  {step.caseName ? step.caseName.toUpperCase() : "Circular Setup"}
                </span>
              </div>

              <div className="flex gap-6 justify-center items-end min-h-[140px] pb-10 pt-4">
                {nums.map((money, idx) => {
                  const isInRange = step.start !== null && step.end !== null && idx >= step.start && idx <= step.end;
                  const isCurrent = idx === step.i && step.i !== null;
                  const isExcluded = step.start !== null && !isInRange;

                  return (
                    <div key={idx} className="flex flex-col items-center gap-2 relative">
                      {isCurrent && (
                        <div className="absolute -top-10 text-2xl animate-bounce">
                          👤
                        </div>
                      )}

                      <div
                        className={`w-14 rounded-t-xl flex flex-col items-center justify-end pb-3 font-bold border-2 transition-all duration-200 ${
                          isCurrent
                            ? "border-orange-500 bg-orange-500/10 scale-105 shadow-md"
                            : isInRange
                              ? "border-blue-500 bg-blue-500/5 text-blue-600 dark:text-blue-400"
                              : isExcluded
                                ? "border-dashed border-muted/50 opacity-20"
                                : "border-border bg-muted/30"
                        }`}
                        style={{ height: `${60 + (money * 15)}px` }}
                      >
                        <span className="text-xl mb-1">🏠</span>
                        <span className="text-xs text-foreground font-mono font-bold">${money}</span>
                      </div>
                      <span className="text-[10px] text-muted-foreground font-mono">House {idx}</span>
                    </div>
                  );
                })}
              </div>

              {step.rob1 !== null && step.rob2 !== null && (
                <div className="grid grid-cols-2 gap-4 mt-6 border-t border-border/40 pt-4">
                  <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/30">
                    <h4 className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-1">
                      rob1 (Max up to i-2)
                    </h4>
                    <div className="text-xl font-bold text-foreground font-mono">${step.rob1}</div>
                  </div>
                  <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/30">
                    <h4 className="text-[10px] font-bold uppercase tracking-wider text-green-600 dark:text-green-400 mb-1">
                      rob2 (Max up to i-1)
                    </h4>
                    <div className="text-xl font-bold text-foreground font-mono">${step.rob2}</div>
                  </div>
                </div>
              )}
            </Card>

            {step.calc && (
              <Card className="p-4 bg-primary/5 border-primary/10">
                <h3 className="font-semibold mb-2 text-xs text-primary uppercase tracking-wider">Calculation</h3>
                <p className="font-mono text-center text-lg font-bold">{step.calc}</p>
              </Card>
            )}
          </div>

          <div className="space-y-4 mt-auto">
            <Card className="p-4 bg-primary/5 border-primary/20">
              <h4 className="text-xs font-bold uppercase tracking-widest text-primary mb-2">Step Explanation</h4>
              <p className="text-sm text-foreground leading-relaxed font-medium min-h-[40px]">
                {step.explanation}
              </p>
            </Card>

            <VariablePanel variables={step.variables} />

            <Card className="p-4 bg-muted/20 border border-border/40 rounded-lg text-xs space-y-1.5 text-muted-foreground leading-relaxed">
              <h4 className="font-bold text-muted-foreground uppercase text-[10px] tracking-wider mb-2">
                Why this works
              </h4>
              <p>
                Since the houses are in a circle, we cannot rob both the first and last houses.
              </p>
              <p>
                This circular problem can be simplified into two linear subproblems (House Robber I):
              </p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground mt-1">
                <li><span className="font-semibold text-foreground">Case 1:</span> Rob houses 0 to n-2 (skipping the last house).</li>
                <li><span className="font-semibold text-foreground">Case 2:</span> Rob houses 1 to n-1 (skipping the first house).</li>
              </ul>
              <p className="mt-1">
                Taking the maximum of these two linear cases yields the optimal circular solution.
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

export default HouseRobberIIVisualization;
