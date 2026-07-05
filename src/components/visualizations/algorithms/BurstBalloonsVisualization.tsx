import React, { useState, useMemo } from "react";
import { SimpleStepControls } from "../shared/SimpleStepControls";
import { VariablePanel } from "../shared/VariablePanel";
import { VisualizationCodePanel } from "../shared/VisualizationCodePanel";
import { VisualizationLayout } from "../shared/VisualizationLayout";
import { Card } from "@/components/ui/card";
import type { VisualizationLanguageMap, StepLineNumberMap } from "@/types/visualization";

interface Step {
  dp: number[][];
  nums: number[];
  i: number;
  j: number;
  k: number;
  len: number;
  message: string;
  pseudoStep: string;
  variables: Record<string, any>;
}

const languages: VisualizationLanguageMap = {
  typescript: `function maxCoins(nums: number[]): number {
  nums = [1, ...nums, 1];
  const n = nums.length;
  const dp: number[][] = Array(n).fill(null).map(() => Array(n).fill(0));
  for (let len = 2; len < n; len++) {
    for (let i = 1; i < n - len + 1; i++) {
      let j = i + len - 1;
      for (let k = i; k < j; k++) {
        dp[i][j] = Math.max(
          dp[i][j], 
          dp[i][k] + dp[k + 1][j] + nums[i - 1] * nums[k] * nums[j]
        );
      }
    }
  }
  return dp[1][n - 1];
}`,
  python: `def maxCoins(nums):
    nums = [1] + nums + [1]
    n = len(nums)
    dp = [[0] * n for _ in range(n)]
    for length in range(2, n):
        for left in range(n - length):
            right = left + length
            for i in range(left + 1, right):
                dp[left][right] = max(
                    dp[left][right],
                    nums[left] * nums[i] * nums[right] + dp[left][i] + dp[i][right]
                )
    return dp[0][n - 1]`,
  java: `public static class Solution {
    public int maxCoins(int[] nums) {
        int n = nums.length;
        int[] paddedNums = new int[n + 2];
        paddedNums[0] = paddedNums[n + 1] = 1;
        System.arraycopy(nums, 0, paddedNums, 1, n);
        int[][] dp = new int[n + 2][n + 2];
        for (int len = 2; len < n + 2; len++) {
            for (int left = 0; left < n + 2 - len; left++) {
                int right = left + len;
                for (int i = left + 1; i < right; i++) {
                    dp[left][right] = Math.max(
                        dp[left][right],
                        dp[left][i] + paddedNums[left] * paddedNums[i] * paddedNums[right] + dp[i][right]
                    );
                }
            }
        }
        return dp[0][n + 1];
    }
}`,
  cpp: `class Solution {
public:
    int maxCoins(vector<int>& nums) {
        int n = nums.size();
        nums.insert(nums.begin(), 1);
        nums.push_back(1);
        vector<vector<int>> dp(n + 2, vector<int>(n + 2, 0));
        for (int len = 1; len <= n; ++len) {
            for (int i = 1; i <= n - len + 1; ++i) {
                int j = i + len - 1;
                for (int k = i; k <= j; ++k) {
                    dp[i][j] = max(
                        dp[i][j], 
                        nums[i - 1] * nums[k] * nums[j + 1] + dp[i][k - 1] + dp[k + 1][j]
                    );
                }
            }
        }
        return dp[1][n];
    }
};`
};

export const BurstBalloonsVisualization: React.FC = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const { steps, stepLineNumbers } = useMemo(() => {
    const originalNums = [3, 1, 5, 8];
    const nums = [1, ...originalNums, 1];
    const n = nums.length;

    const dp = Array.from({ length: n }, () => Array(n).fill(0));
    const newSteps: Step[] = [];
    const lines: StepLineNumberMap = { typescript: [], python: [], java: [], cpp: [] };

    const addStep = (
      i: number,
      j: number,
      k: number,
      len: number,
      message: string,
      pseudo: string,
      vars: any,
      ts: number, py: number, jv: number, cp: number
    ) => {
      newSteps.push({
        dp: dp.map((row) => [...row]),
        nums,
        i,
        j,
        k,
        len,
        message,
        pseudoStep: pseudo,
        variables: vars
      });
      lines.typescript!.push(ts);
      lines.python!.push(py);
      lines.java!.push(jv);
      lines.cpp!.push(cp);
    };

    addStep(
      -1, -1, -1, -1,
      `Welcome to the Burst Balloons game! We add a magic '1' balloon at both ends to make math easy. Our array becomes [${nums.join(", ")}].`,
      "maxCoins(nums=[3,1,5,8])",
      { originalNums: "[3,1,5,8]" },
      1, 1, 2, 3
    );

    addStep(
      -1, -1, -1, -1,
      `Create padded boundaries. Padded list: [${nums.join(", ")}].`,
      "SET nums = [1] + nums + [1]",
      { nums: `[${nums.join(",")}]` },
      2, 2, 6, 6
    );

    addStep(
      -1, -1, -1, -1,
      `Initialize DP grid of size ${n}x${n} with zeros. dp[i][j] will store the max coins from index i to j.`,
      `SET dp = [[0]*${n} for _ in range(${n})]`,
      { n },
      4, 4, 7, 7
    );

    for (let len = 2; len < n; len++) {
      for (let i = 1; i < n - len + 1; i++) {
        let j = i + len - 1;
        
        for (let k = i; k < j; k++) {
          addStep(
            i, j, k, len,
            `Consider subproblem from index ${i} to ${j}. Let balloon ${k} (value ${nums[k]}) be the last to pop in this range.`,
            `FOR length=${len}, left=${i}, right=${j}, lastPop=${k}`,
            { len, i, j, k, val: nums[k] },
            8, 8, 11, 11
          );

          const leftScore = dp[i][k];
          const rightScore = dp[k + 1][j];
          const popScore = nums[i - 1] * nums[k] * nums[j];
          const currentTotal = leftScore + rightScore + popScore;

          let msg = `If balloon ${k} pops last, coins = (${nums[i - 1]} * ${nums[k]} * ${nums[j]}) = ${popScore}.`;
          msg += ` Plus subproblem scores (${leftScore} + ${rightScore}) = ${currentTotal}.`;

          if (currentTotal > dp[i][j]) {
            dp[i][j] = currentTotal;
            msg += ` New record! Saving ${dp[i][j]} at dp[${i}][${j}].`;
          } else {
            msg += ` Previous record ${dp[i][j]} is better. Stays ${dp[i][j]}.`;
          }

          addStep(
            i, j, k, len,
            msg,
            `dp[${i}][${j}] = max(dp[${i}][${j}], dp[${i}][${k}] + dp[${k + 1}][${j}] + nums[${i - 1}]*nums[${k}]*nums[${j}])`,
            { leftScore, rightScore, popScore, currentTotal, best: dp[i][j] },
            9, 9, 12, 12
          );
        }
      }
    }

    addStep(
      1, n - 1, -1, -1,
      `All done! The max coins obtained by bursting all balloons is at dp[1][${n - 1}]: ${dp[1][n - 1]}!`,
      `RETURN dp[1][${n - 1}]  →  ${dp[1][n - 1]}`,
      { result: dp[1][n - 1] },
      16, 13, 19, 19
    );

    return { steps: newSteps, stepLineNumbers: lines };
  }, []);

  const pseudoSteps = useMemo(() => steps.map(s => s.pseudoStep), [steps]);

  if (steps.length === 0) return null;
  const currentStep = steps[currentStepIndex];
  const n = currentStep.nums.length;

  return (
    <VisualizationLayout
      leftContent={
        <div className="space-y-4">
          <Card className="bg-card rounded-lg p-6 border shadow-sm w-full overflow-hidden">
            <h3 className="text-sm font-semibold mb-4 text-muted-foreground uppercase tracking-wider text-center">Burst Balloons Arena</h3>
            
            <div className="flex w-full overflow-x-auto pb-6 mb-2">
              <div className="flex gap-3 px-4 pt-4 m-auto">
                {currentStep.nums.map((num, idx) => {
                  const isBoundary = idx === 0 || idx === n - 1;
                  const isK = idx === currentStep.k;
                  const isLeftBoundary = idx === currentStep.i - 1;
                  const isRightBoundary = idx === currentStep.j;
                  
                  return (
                    <div key={idx} className="flex flex-col items-center">
                      <div className="text-[10px] text-muted-foreground font-mono mb-1">{idx}</div>
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shadow-sm transition-all ${
                        isK ? 'bg-primary text-primary-foreground scale-110 ring-4 ring-primary/30' :
                        isLeftBoundary || isRightBoundary ? 'bg-orange-500/20 text-orange-600 border-2 border-orange-500/50 scale-105' :
                        isBoundary ? 'bg-muted border border-dashed border-muted-foreground/50 text-muted-foreground' : 
                        'bg-secondary text-secondary-foreground border border-border'
                      }`}>
                        {num}
                      </div>
                      <div className="text-[10px] h-4 mt-1 font-medium text-primary">
                        {isK ? 'Last Pop (k)' : (isLeftBoundary ? 'Left Border' : (isRightBoundary ? 'Right Border' : ''))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="overflow-x-auto mt-4">
              <table className="w-full border-collapse text-xs">
                <thead>
                  <tr>
                    <th className="border border-border p-2 bg-muted text-muted-foreground font-normal">
                      i \\ j
                    </th>
                    {Array.from({length: n}).map((_, idx) => (
                      <th key={idx} className="border border-border p-2 bg-muted text-center font-mono">
                        {idx}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {currentStep.dp.map((row, i) => (
                    <tr key={i}>
                      <td className="border border-border p-2 bg-muted font-semibold text-center font-mono">
                        {i}
                      </td>
                      {row.map((val, j) => {
                        const isCurrent = i === currentStep.i && j === currentStep.j;
                        const isDependency = currentStep.k !== -1 && (
                            (i === currentStep.i && j === currentStep.k) || 
                            (i === currentStep.k + 1 && j === currentStep.j)
                        );

                        return (
                          <td
                            key={j}
                            className={`border border-border p-2 text-center transition-all min-w-[40px] ${
                              isCurrent
                                ? "bg-primary/20 ring-2 ring-primary ring-inset font-bold text-primary"
                                : isDependency
                                ? "bg-primary/10 text-primary border-primary animate-pulse"
                                : j >= i && val > 0
                                ? "bg-green-500/10 text-green-700 dark:text-green-400 font-medium"
                                : j >= i
                                ? "text-muted-foreground"
                                : "bg-muted/30 text-transparent"
                            }`}
                          >
                            {j >= i ? val : ""}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          <Card className="p-4 bg-primary/5 border border-primary/20">
            <h4 className="text-xs font-bold uppercase tracking-widest text-primary mb-2">Algorithm Logic</h4>
            <p className="text-sm text-foreground leading-relaxed font-medium">
              {currentStep.message}
            </p>
          </Card>

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
          <VariablePanel
            variables={{
              "current length (len)": currentStep.len > 0 ? currentStep.len : "-",
              "start boundary (i-1)": currentStep.i > 0 ? currentStep.i - 1 : "-",
              "start balloon (i)": currentStep.i > 0 ? currentStep.i : "-",
              "end boundary (j)": currentStep.j > 0 ? currentStep.j : "-",
              "last pop (k)": currentStep.k > 0 ? currentStep.k : "-",
            }}
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
export default BurstBalloonsVisualization;
