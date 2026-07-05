import React, { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { VisualizationCodePanel } from '../shared/VisualizationCodePanel';
import { VisualizationLayout } from '../shared/VisualizationLayout';
import type { StepLineNumberMap, VisualizationLanguageMap } from '@/types/visualization';

interface Step {
  nums: number[];
  rob1: number;
  rob2: number;
  currentMoney: number | null;
  temp: number | null;
  i: number;
  variables: Record<string, any>;
  explanation: string;
  pseudoStep: string;
  calc?: string;
}

const languages: VisualizationLanguageMap = {
  typescript: `function rob(nums: number[]): number {
  let rob1 = 0;
  let rob2 = 0;
  for (const money of nums) {
    const temp = Math.max(money + rob1, rob2);
    rob1 = rob2;
    rob2 = temp;
  }
  return rob2;
}`,
  python: `def rob(nums):
    rob1, rob2 = 0, 0
    for money in nums:
        temp = max(money + rob1, rob2)
        rob1 = rob2
        rob2 = temp
    return rob2`,
  java: `public static class Solution {
    public int rob(int[] nums) {
        int rob1 = 0;
        int rob2 = 0;
        for (int money : nums) {
            int temp = Math.max(money + rob1, rob2);
            rob1 = rob2;
            rob2 = temp;
        }
        return rob2;
    }
}`,
  cpp: `class Solution {
public:
int rob(vector<int>& nums) {
    int rob1 = 0;
    int rob2 = 0;
    for (int money : nums) {
        int temp = max(money + rob1, rob2);
        rob1 = rob2;
        rob2 = temp;
    }
    return rob2;
}
};`
};

export const HouseRobberVisualization: React.FC = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const nums = [4, 2, 3, 1];

  const { steps, stepLineNumbers } = useMemo(() => {
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

    let rob1 = 0;
    let rob2 = 0;

    // Initial state
    s.push({
      nums,
      rob1: 0,
      rob2: 0,
      currentMoney: null,
      temp: null,
      i: -1,
      variables: { nums: `[${nums.join(', ')}]` },
      explanation: "Initialize rob1 = 0 (representing the max money 2 houses back) and rob2 = 0 (representing the max money up to the previous house).",
      pseudoStep: "SET rob1 = 0, rob2 = 0"
    });
    addLines(2, 2, 3, 4);

    for (let i = 0; i < nums.length; i++) {
      const money = nums[i];

      // Loop check step
      s.push({
        nums,
        rob1,
        rob2,
        currentMoney: money,
        temp: null,
        i,
        variables: { money, rob1, rob2, i },
        explanation: `Process house ${i} containing $${money}.`,
        pseudoStep: `FOR EACH money IN nums (money = ${money})`
      });
      addLines(4, 3, 5, 6);

      // Math.max calculation
      const temp = Math.max(money + rob1, rob2);
      s.push({
        nums,
        rob1,
        rob2,
        currentMoney: money,
        temp,
        i,
        variables: { money, rob1, rob2, 'money + rob1': money + rob1, temp },
        explanation: `Decide whether to rob house ${i}. Robbing yields: money + rob1 = ${money} + ${rob1} = ${money + rob1}. Skipping yields: rob2 = ${rob2}. Max is ${temp}.`,
        pseudoStep: `SET temp = MAX(money + rob1, rob2) (${temp})`,
        calc: `max(${money} + ${rob1}, ${rob2}) = ${temp}`
      });
      addLines(5, 4, 6, 7);

      // rob1 = rob2
      rob1 = rob2;
      s.push({
        nums,
        rob1,
        rob2,
        currentMoney: money,
        temp,
        i,
        variables: { money, rob1, rob2, temp },
        explanation: `Update rob1 to hold the value of rob2 (max money up to previous house): rob1 = ${rob1}.`,
        pseudoStep: `SET rob1 = rob2 (${rob1})`
      });
      addLines(6, 5, 7, 8);

      // rob2 = temp
      rob2 = temp;
      s.push({
        nums,
        rob1,
        rob2,
        currentMoney: money,
        temp,
        i,
        variables: { money, rob1, rob2, temp },
        explanation: `Update rob2 to hold the new maximum sum computed in temp: rob2 = ${rob2}.`,
        pseudoStep: `SET rob2 = temp (${rob2})`
      });
      addLines(7, 6, 8, 9);
    }

    // Return step
    s.push({
      nums,
      rob1,
      rob2,
      currentMoney: null,
      temp: null,
      i: nums.length,
      variables: { result: rob2 },
      explanation: `All houses processed. Return rob2 = $${rob2} as the maximum money that can be robbed without alerting the police.`,
      pseudoStep: `RETURN rob2 (${rob2})`
    });
    addLines(9, 7, 10, 11);

    return { steps: s, stepLineNumbers: lines };
  }, []);

  const step = steps[currentStepIndex];
  const pseudoSteps = steps.map((s) => s.pseudoStep);

  return (
    <VisualizationLayout
      leftContent={
        <div className="flex flex-col h-full justify-between gap-6">
          <div className="space-y-6">
            <Card className="p-6 bg-card/60 backdrop-blur border-border/50 shadow-sm overflow-hidden relative">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest text-center mb-6">
                Neighborhood Houses
              </h3>
              <div className="flex gap-6 justify-center items-end min-h-[140px] pb-10 pt-4">
                {nums.map((money, idx) => {
                  const isCurrent = idx === step.i;
                  const isPast = idx < step.i;

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
                            : isPast
                              ? "border-green-500/50 bg-green-500/5 opacity-70"
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
            </Card>

            {step.calc && (
              <Card className="p-4 bg-primary/5 border-primary/10">
                <h3 className="font-semibold mb-2 text-xs text-primary uppercase tracking-wider">Calculation</h3>
                <p className="font-mono text-center text-lg font-bold">{step.calc}</p>
              </Card>
            )}

            <Card className="p-4 bg-muted/20 border border-border/40 rounded-lg text-xs space-y-1.5 text-muted-foreground leading-relaxed">
              <h4 className="font-bold text-muted-foreground uppercase text-[10px] tracking-wider mb-2">
                Why this works
              </h4>
              <p>
                For each house, the robber can choose to rob it or skip it.
              </p>
              <p>
                Robbing the current house means adding its money to the maximum money robbed from houses up to `i - 2` (`rob1`).
              </p>
              <p>
                Skipping means carrying over the maximum money robbed from houses up to `i - 1` (`rob2`).
              </p>
              <p>
                We keep track of these two values using rolling variables `rob1` and `rob2` to achieve O(N) time and O(1) space complexity.
              </p>
            </Card>
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
          <Card className="p-4 bg-primary/5 border-primary/20">
            <h4 className="text-xs font-bold uppercase tracking-widest text-primary mb-2">Step Explanation</h4>
            <p className="text-sm text-foreground leading-relaxed font-medium min-h-[40px]">
              {step.explanation}
            </p>
          </Card>
          <VariablePanel variables={step.variables} />
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

export default HouseRobberVisualization;
