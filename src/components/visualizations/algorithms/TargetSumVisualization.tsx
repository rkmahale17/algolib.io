import { useState, useMemo } from "react";
import { SimpleStepControls } from "../shared/SimpleStepControls";
import { VariablePanel } from "../shared/VariablePanel";
import { VisualizationCodePanel } from "../shared/VisualizationCodePanel";
import { VisualizationLayout } from "../shared/VisualizationLayout";
import { Card } from "@/components/ui/card";
import type { VisualizationLanguageMap, StepLineNumberMap } from "@/types/visualization";

interface Step {
  dp: number[];
  nums: number[];
  target: number;
  newTarget: number;
  i: number;
  j: number | null;
  message: string;
  pseudoStep: string;
  variables: Record<string, any>;
}

const languages: VisualizationLanguageMap = {
  typescript: `function findTargetSumWays(nums: number[], target: number): number {
  let sum = 0;
  for (const num of nums) {
    sum += num;
  }
  if (Math.abs(target) > sum) return 0;
  if ((sum + target) % 2 !== 0) return 0;
  const newTarget = (sum + target) / 2;
  const dp: number[] = new Array(newTarget + 1).fill(0);
  dp[0] = 1;
  for (const num of nums) {
    for (let j = newTarget; j >= num; j--) {
      dp[j] += dp[j - num];
    }
  }
  return dp[newTarget];
}`,
  python: `def findTargetSumWays(nums: list[int], target: int) -> int:
    total_sum = sum(nums)
    if (total_sum + target) % 2 != 0 or abs(target) > total_sum:
        return 0
    positive_sum = (total_sum + target) // 2
    dp = [0] * (positive_sum + 1)
    dp[0] = 1
    for num in nums:
        for i in range(positive_sum, num - 1, -1):
            dp[i] += dp[i - num]
    return dp[positive_sum]`,
  java: `public static class Solution {
    public int findTargetSumWays(int[] nums, int target) {
        int sum = 0;
        for (int num : nums) {
            sum += num;
        }
        if (Math.abs(target) > sum) {
            return 0;
        }
        if ((sum + target) % 2 != 0) {
            return 0;
        }
        int newTarget = (sum + target) / 2;
        int[] dp = new int[newTarget + 1];
        dp[0] = 1;
        for (int num : nums) {
            for (int i = newTarget; i >= num; i--) {
                dp[i] += dp[i - num];
            }
        }
        return dp[newTarget];
    }
}`,
  cpp: `class Solution {
public:
    int findTargetSumWays(vector<int>& nums, int target) {
        int sum = 0;
        for (int num : nums) {
            sum += num;
        }
        if (sum < abs(target) || (sum + target) % 2 != 0) {
            return 0;
        }
        int newTarget = (sum + target) / 2;
        vector<int> dp(newTarget + 1, 0);
        dp[0] = 1;
        for (int num : nums) {
            for (int i = newTarget; i >= num; i--) {
                dp[i] += dp[i - num];
            }
        }
        return dp[newTarget];
    }
};`
};

export const TargetSumVisualization = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const nums = useMemo(() => [1, 1, 2], []);
  const target = 0;

  const { steps, stepLineNumbers } = useMemo(() => {
    const newSteps: Step[] = [];
    const lines: StepLineNumberMap = { typescript: [], python: [], java: [], cpp: [] };

    const addStep = (
      dp: number[],
      i: number,
      j: number | null,
      message: string,
      pseudo: string,
      vars: any,
      ts: number, py: number, jv: number, cp: number
    ) => {
      newSteps.push({
        dp: [...dp],
        nums,
        target,
        newTarget: (sum + target) / 2,
        i,
        j,
        message,
        pseudoStep: pseudo,
        variables: vars
      });
      lines.typescript!.push(ts);
      lines.python!.push(py);
      lines.java!.push(jv);
      lines.cpp!.push(cp);
    };

    let sum = 0;
    for (const num of nums) {
      sum += num;
    }

    addStep(
      [], -1, null,
      `Welcome! We have numbers [${nums.join(", ")}] and we want them to add up to ${target} by putting + or - in front of them. The sum of all numbers is ${sum}.`,
      `findTargetSumWays(nums=[${nums.join(",")}], target=${target})`,
      { nums: `[${nums.join(", ")}]`, target },
      1, 1, 2, 3
    );

    addStep(
      [], -1, null,
      `Sum up the input array. Total sum is ${sum}.`,
      `SET sum = sum(nums)  →  ${sum}`,
      { sum },
      2, 2, 3, 4
    );

    if (Math.abs(target) > sum) {
      addStep(
        [], -1, null,
        `Oops! Our target ${target} is bigger than our total sum ${sum}. It's impossible to reach!`,
        `IF Math.abs(target) > sum  →  ${Math.abs(target)} > ${sum}`,
        { target, sum },
        6, 3, 7, 8
      );
      return { steps: newSteps, stepLineNumbers: lines };
    }

    if ((sum + target) % 2 !== 0) {
      addStep(
        [], -1, null,
        `Math trick: The sum (${sum}) plus target (${target}) is odd, so we can't divide it evenly into + and - groups. Target is impossible!`,
        `IF (sum + target) % 2 != 0  →  (${sum} + ${target}) % 2 != 0`,
        { target, sum },
        7, 3, 10, 8
      );
      return { steps: newSteps, stepLineNumbers: lines };
    }

    const newTarget = (sum + target) / 2;
    addStep(
      [], -1, null,
      `Magic Math Trick! Instead of guessing + or -, we just need to find a group of numbers that add up exactly to (sum + target) / 2. Here, that's ${newTarget}!`,
      `SET newTarget = (sum + target) / 2  →  ${newTarget}`,
      { newTarget },
      8, 5, 13, 11
    );

    const dp: number[] = new Array(newTarget + 1).fill(0);
    addStep(
      dp, -1, null,
      `Let's make a row of boxes from 0 to ${newTarget}. Each box will hold "how many ways can we make this sum?". We start with 0 ways.`,
      `SET dp = [0] * (${newTarget} + 1)`,
      { dp: `[${dp.join(", ")}]` },
      9, 6, 14, 12
    );

    dp[0] = 1;
    addStep(
      dp, -1, null,
      `There is exactly 1 way to make a sum of 0: just don't pick any numbers! So we put a '1' in the 0 box.`,
      "dp[0] = 1",
      { dp: `[${dp.join(", ")}]` },
      10, 7, 15, 13
    );

    for (let idx = 0; idx < nums.length; idx++) {
      const num = nums[idx];
      addStep(
        dp, idx, null,
        `Now let's look at our number: ${num}.`,
        `FOR num IN nums  →  num = ${num}`,
        { idx, num },
        11, 8, 16, 14
      );

      for (let j = newTarget; j >= num; j--) {
        addStep(
          dp, idx, j,
          `Can we make sum ${j} using our number ${num}? We just need to check if we already figured out how to make sum ${j - num}!`,
          `FOR j FROM ${newTarget} DOWNTO ${num}  →  j = ${j}`,
          { idx, num, j, prevWays: dp[j - num] },
          12, 9, 17, 15
        );

        const prevWays = dp[j - num];
        dp[j] += prevWays;
        addStep(
          dp, idx, j,
          prevWays > 0
            ? `Yes! There are ${prevWays} ways to make sum ${j - num}. If we just add our number ${num} to them, we make sum ${j}! So we add ${prevWays} to box ${j}.`
            : `Oh no! We have 0 ways to make sum ${j - num}. Adding ${num} won't help us make sum ${j}. Box ${j} stays the same.`,
          `dp[${j}] += dp[${j - num}]  →  ${dp[j]}`,
          { idx, num, j, prevWays, updated: dp[j] },
          13, 10, 18, 16
        );
      }
    }

    addStep(
      dp, -1, null,
      `All done! The number in the last box tells us there are ${dp[newTarget]} ways to reach our target sum!`,
      `RETURN dp[${newTarget}]  →  ${dp[newTarget]}`,
      { result: dp[newTarget] },
      16, 11, 21, 19
    );

    return { steps: newSteps, stepLineNumbers: lines };
  }, [nums]);

  if (steps.length === 0) return null;
  const currentStep = steps[currentStepIndex];
  const pseudoSteps = useMemo(() => steps.map(s => s.pseudoStep), [steps]);

  return (
    <VisualizationLayout
      leftContent={
        <div className="space-y-6">
          <div className="bg-muted/30 rounded-lg border border-border/50 p-6 overflow-hidden flex justify-center w-full">
            <div className="space-y-6 w-full">
              {currentStep.dp.length > 0 && (
                <div className="bg-card w-full p-6 rounded-md shadow-sm border border-border/40">
                  <h4 className="text-sm font-semibold mb-4 flex justify-between items-center text-foreground">
                    Ways to reach sum (DP Array)
                    <span className="text-xs font-normal text-muted-foreground">
                      Target Sum: {currentStep.newTarget}
                    </span>
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {currentStep.dp.map((ways, idx) => {
                      const isCurrent = currentStep.j === idx;
                      const isDependency =
                        currentStep.i !== -1 &&
                        currentStep.j !== null &&
                        idx === currentStep.j - currentStep.nums[currentStep.i];
                      return (
                        <div
                          key={idx}
                          className={`flex flex-col items-center gap-1 p-1 rounded transition-all ${
                            isCurrent ? "ring-2 ring-primary ring-offset-2" : ""
                          }`}
                        >
                          <div className="text-[10px] text-muted-foreground font-mono">
                            idx {idx}
                          </div>
                          <div
                            className={`w-10 h-10 rounded flex items-center justify-center text-sm font-bold border-2 transition-all ${
                              ways > 0 && !isCurrent && !isDependency
                                ? "bg-green-500/20 border-green-500 text-green-700 dark:text-green-400"
                                : isDependency
                                ? "bg-primary/20 border-primary text-primary animate-pulse"
                                : isCurrent
                                ? "bg-accent border-primary text-foreground"
                                : "bg-muted border-border text-muted-foreground"
                            }`}
                          >
                            {ways}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="bg-accent/20 rounded-lg border border-accent/50 p-5 mt-2">
                <p className="text-base text-foreground leading-relaxed font-medium">
                  {currentStep.message}
                </p>
              </div>

              <div className="rounded-lg mt-4">
                <VariablePanel
                  variables={{
                    nums: `[${currentStep.nums.join(", ")}]`,
                    "target sum": currentStep.target,
                    "new target subset sum": currentStep.newTarget >= 0 ? currentStep.newTarget : "N/A",
                    "current index (i)": currentStep.i >= 0 ? currentStep.i : "N/A",
                    "current num (nums[i])": currentStep.i >= 0 ? currentStep.nums[currentStep.i] : "N/A",
                    "current checking sum (j)": currentStep.j !== null ? currentStep.j : "N/A",
                  }}
                />
              </div>
            </div>
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
export default TargetSumVisualization;
