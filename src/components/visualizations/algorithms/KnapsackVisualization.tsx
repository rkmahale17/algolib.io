import React, { useState } from 'react';
import { Info } from 'lucide-react';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { VisualizationCodePanel } from '../shared/VisualizationCodePanel';
import type { StepLineNumberMap, VisualizationLanguageMap } from '@/types/visualization';

interface Step {
  dp: number[][];
  rowLabels: string[];
  i: number;
  coinValue: number;
  w: number;
  value: number;
  explanation: string;
  pseudoStep: string;
}

const languages: VisualizationLanguageMap = {
  typescript: `function change(amount: number, coins: number[]): number {
  let dp: number[] = new Array(amount + 1).fill(0);
  dp[0] = 1;
  for (let i = coins.length - 1; i >= 0; i--) {
    const nextDP: number[] = new Array(amount + 1).fill(0);
    nextDP[0] = 1;
    for (let a = 1; a <= amount; a++) {
      nextDP[a] = dp[a];
      if (a - coins[i] >= 0) {
        nextDP[a] += nextDP[a - coins[i]];
      }
    }
    dp = nextDP;
  }
  return dp[amount];
}`,

  python: `def change(amount: int, coins: list[int]) -> int:
  dp = [0] * (amount + 1)
  dp[0] = 1
  for i in range(len(coins) - 1, -1, -1):
    next_dp = [0] * (amount + 1)
    next_dp[0] = 1
    for a in range(1, amount + 1):
      next_dp[a] = dp[a]
      if a - coins[i] >= 0:
        next_dp[a] += next_dp[a - coins[i]]
    dp = next_dp
  return dp[amount]`,

  java: `public static class Solution {
    public int change(int amount, int[] coins) {
        int[] dp = new int[amount + 1];
        dp[0] = 1;
        for (int i = coins.length - 1; i >= 0; i--) {
            int[] nextDP = new int[amount + 1];
            nextDP[0] = 1;
            for (int a = 1; a <= amount; a++) {
                nextDP[a] = dp[a];
                if (a - coins[i] >= 0) {
                    nextDP[a] += nextDP[a - coins[i]];
                }
            }
            dp = nextDP;
        }
        return dp[amount];
    }
}`,

  cpp: `class Solution {
public:
    int change(int amount, vector<int>& coins) {
        vector<int> dp(amount + 1, 0);
        dp[0] = 1;
        for (int i = coins.size() - 1; i >= 0; i--) {
            vector<int> nextDP(amount + 1, 0);
            nextDP[0] = 1;
            for (int a = 1; a <= amount; a++) {
                nextDP[a] = dp[a];
                if (a - coins[i] >= 0) {
                    nextDP[a] += nextDP[a - coins[i]];
                }
            }
            dp = nextDP;
        }
        return dp[amount];
    }
};`
};

function generateVisualizationData() {
  const coins = [1, 2, 5];
  const amount = 5;
  const n = coins.length;

  const historicalDP: number[][] = [];
  const rowLabels: string[] = ['Init'];
  const steps: Step[] = [];
  const stepLineNumbers: StepLineNumberMap = {
    typescript: [],
    python: [],
    java: [],
    cpp: []
  };

  const addLines = (ts: number, py: number, java: number, cpp: number) => {
    stepLineNumbers.typescript!.push(ts);
    stepLineNumbers.python!.push(py);
    stepLineNumbers.java!.push(java);
    stepLineNumbers.cpp!.push(cpp);
  };

  let currentDP: number[] = new Array(amount + 1).fill(0);
  currentDP[0] = 1;
  historicalDP.push([...currentDP]);

  steps.push({
    dp: historicalDP.map((row) => [...row]),
    rowLabels: [...rowLabels],
    i: -1,
    coinValue: 0,
    w: 0,
    value: currentDP[0],
    explanation: 'Initialize dp array. Base case: there is 1 way to make amount 0 using no coins.',
    pseudoStep: 'SET dp[0] = 1',
  });
  addLines(3, 3, 4, 5);

  for (let i = n - 1; i >= 0; i--) {
    const coin = coins[i];
    const nextDP: number[] = new Array(amount + 1).fill(0);
    nextDP[0] = 1;

    historicalDP.push([...nextDP]);
    rowLabels.push(`Coin ${coin}`);

    steps.push({
      dp: historicalDP.map((row) => [...row]),
      rowLabels: [...rowLabels],
      i,
      coinValue: coin,
      w: 0,
      value: nextDP[0],
      explanation: `Process coin ${coin}. Initialize nextDP[0] to 1 because there is always 1 way to make amount 0.`,
      pseudoStep: `SET nextDP[0] = 1 FOR coin = ${coin}`,
    });
    addLines(6, 5, 6, 7);

    for (let a = 1; a <= amount; a++) {
      nextDP[a] = currentDP[a];
      historicalDP[historicalDP.length - 1][a] = nextDP[a];

      steps.push({
        dp: historicalDP.map((row) => [...row]),
        rowLabels: [...rowLabels],
        i,
        coinValue: coin,
        w: a,
        value: nextDP[a],
        explanation: `Amount ${a}: Exclude coin ${coin}. Inherit ${currentDP[a]} ways from the previous DP row.`,
        pseudoStep: `SET nextDP[${a}] = dp[${a}]`,
      });
      addLines(10, 8, 9, 10);

      if (a - coin >= 0) {
        nextDP[a] += nextDP[a - coin];
        historicalDP[historicalDP.length - 1][a] = nextDP[a];

        steps.push({
          dp: historicalDP.map((row) => [...row]),
          rowLabels: [...rowLabels],
          i,
          coinValue: coin,
          w: a,
          value: nextDP[a],
          explanation: `Amount ${a}: Include coin ${coin}. Add nextDP[${a - coin}] (${nextDP[a - coin]} ways) -> Total: ${nextDP[a]}`,
          pseudoStep: `SET nextDP[${a}] = nextDP[${a}] + nextDP[${a - coin}]`,
        });
        addLines(13, 10, 11, 12);
      }
    }

    currentDP = [...nextDP];
    steps.push({
      dp: historicalDP.map((row) => [...row]),
      rowLabels: [...rowLabels],
      i,
      coinValue: coin,
      w: amount,
      value: currentDP[amount],
      explanation: `Finished passes for coin ${coin}. Copy nextDP back to dp for the next iteration.`,
      pseudoStep: 'SET dp = nextDP',
    });
    addLines(16, 11, 14, 15);
  }

  steps.push({
    dp: historicalDP.map((row) => [...row]),
    rowLabels: [...rowLabels],
    i: -1,
    coinValue: 0,
    w: amount,
    value: currentDP[amount],
    explanation: `All coins processed. The final cell dp[${amount}] holds the total distinct combinations: ${currentDP[amount]}.`,
    pseudoStep: `RETURN dp[${amount}]`,
  });
  addLines(18, 12, 16, 17);

  return { steps, stepLineNumbers };
}

export const KnapsackVisualization: React.FC = () => {
  const [{ steps, stepLineNumbers }] = useState(generateVisualizationData);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const handleReset = () => {
    setCurrentStepIndex(0);
  };

  const currentStep = steps[currentStepIndex];
  const pseudoSteps = steps.map((s) => s.pseudoStep);

  return (
    <div className="w-full space-y-6">
      <SimpleStepControls
        currentStep={currentStepIndex}
        totalSteps={steps.length}
        onStepChange={setCurrentStepIndex}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Visual State */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-card rounded-xl p-6 border border-border/50 shadow-sm">
            <h3 className="text-sm font-semibold mb-4 text-center text-foreground">Ways DP Table</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr>
                    <th className="border border-border p-2 bg-muted text-muted-foreground whitespace-nowrap">
                      Coins \ Amt
                    </th>
                    {currentStep.dp[0].map((_, w) => (
                      <th key={w} className="border border-border p-2 bg-muted text-muted-foreground">
                        {w}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {currentStep.dp.map((row, rowIdx) => (
                    <tr key={rowIdx}>
                      <td className="border border-border p-2 bg-muted font-semibold text-foreground whitespace-nowrap">
                        {currentStep.rowLabels[rowIdx]}
                      </td>
                      {row.map((val, a) => {
                        const isCurrentCell = rowIdx === currentStep.dp.length - 1 && a === currentStep.w;
                        const isPrevRowCell = rowIdx === currentStep.dp.length - 2 && a === currentStep.w;
                        const isSubtractCell =
                          rowIdx === currentStep.dp.length - 1 &&
                          currentStep.coinValue > 0 &&
                          a === currentStep.w - currentStep.coinValue;

                        let bgClass = '';
                        if (isCurrentCell) {
                          bgClass = 'bg-primary/20 font-bold text-primary';
                        } else if (isPrevRowCell) {
                          bgClass = 'bg-blue-500/10 italic text-blue-600 dark:text-blue-400';
                        } else if (isSubtractCell) {
                          bgClass = 'bg-green-500/20 font-bold text-green-600 dark:text-green-400';
                        } else if (val > 0) {
                          bgClass = 'bg-muted/30 text-foreground/80';
                        } else {
                          bgClass = 'text-muted-foreground/40';
                        }

                        return (
                          <td
                            key={a}
                            className={`border border-border p-2 text-center transition-all ${bgClass}`}
                          >
                            {val}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Commentary Panel */}
          <div className="bg-card/50 backdrop-blur-sm rounded-xl border border-border/50 p-6 relative overflow-hidden transition-all duration-300 shadow-sm">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border/40">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full bg-primary opacity-75 rounded-full" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
                  </span>
                  <span className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground">
                    Algorithm Commentary
                  </span>
                </div>
                <div className="font-mono text-[10px] tracking-tight bg-muted/60 text-muted-foreground px-2 py-0.5 rounded-full border border-border/40">
                  Step {currentStepIndex + 1} of {steps.length}
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                  <Info className="w-4.5 h-4.5 text-primary" />
                </div>
                <div className="space-y-1 flex-1">
                  <h4 className="text-[11px] font-bold uppercase tracking-widest text-primary/70">
                    Current Action
                  </h4>
                  <div className="text-sm font-medium leading-relaxed text-foreground/90 select-none">
                    {currentStep.explanation}
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Code Display and Variables */}
        <div className="lg:col-span-5 space-y-4">
          <VisualizationCodePanel
            languages={languages}
            stepLineNumbers={stepLineNumbers}
            pseudoSteps={pseudoSteps}
            activeStepIndex={currentStepIndex}
            onLanguageChange={handleReset}
          />
          <VariablePanel
            variables={{
              i: currentStep.i !== -1 ? currentStep.i : '-',
              coin: currentStep.coinValue !== 0 ? currentStep.coinValue : '-',
              a: currentStep.w !== 0 ? currentStep.w : '-',
              ways: currentStep.value
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default KnapsackVisualization;
