import { useState, useMemo } from 'react';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { VisualizationCodePanel } from '../shared/VisualizationCodePanel';
import { VisualizationLayout } from '../shared/VisualizationLayout';
import { Card } from '@/components/ui/card';
import type { VisualizationLanguageMap, StepLineNumberMap } from '@/types/visualization';

interface Step {
  grid: number[][];
  highlighting: {r: number, c: number}[];
  variables: Record<string, any>;
  explanation: string;
  pseudoStep: string;
}

const languages: VisualizationLanguageMap = {
  typescript: `function change(amount: number, coins: number[]): number {
  const dp: number[][] = Array.from(
    { length: amount + 1 },
    () => Array(coins.length + 1).fill(0)
  );
  dp[0] = Array(coins.length + 1).fill(1);
  for (let a = 1; a <= amount; a++) {
    for (let i = coins.length - 1; i >= 0; i--) {
      dp[a][i] = dp[a][i + 1];
      if (a - coins[i] >= 0) {
        dp[a][i] += dp[a - coins[i]][i];
      }
    }
  }
  return dp[amount][0];
}`,
  python: `def change(amount: int, coins: list[int]) -> int:
    dp = [0] * (amount + 1)
    dp[0] = 1
    for coin in coins:
        for a in range(coin, amount + 1):
            dp[a] += dp[a - coin]
    return dp[amount]`,
  java: `class Solution {
    public int change(int amount, int[] coins) {
        int[][] dp = new int[amount + 1][coins.length + 1];
        for (int i = 0; i <= coins.length; i++) {
            dp[0][i] = 1;
        }
        for (int a = 1; a <= amount; a++) {
            for (int i = coins.length - 1; i >= 0; i--) {
                dp[a][i] = dp[a][i + 1];
                if (a - coins[i] >= 0) {
                    dp[a][i] += dp[a - coins[i]][i];
                }
            }
        }
        return dp[amount][0];
    }
}`,
  cpp: `class Solution {
public:
    int change(int amount, vector<int>& coins) {
        vector<vector<int>> dp(amount + 1, vector<int>(coins.size() + 1, 0));
        for (int i = 0; i <= coins.size(); ++i) {
            dp[0][i] = 1;
        }
        for (int a = 1; a <= amount; ++a) {
            for (int i = coins.size() - 1; i >= 0; --i) {
                dp[a][i] = dp[a][i + 1];
                if (a - coins[i] >= 0) {
                    dp[a][i] += dp[a - coins[i]][i];
                }
            }
        }
        return dp[amount][0];
    }
};`
};

export const CoinChangeIIVisualization = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const coins = useMemo(() => [1, 2, 5], []);
  const amount = 5;

  const { steps, stepLineNumbers } = useMemo(() => {
    const s: Step[] = [];
    const lines: StepLineNumberMap = { typescript: [], python: [], java: [], cpp: [] };
    
    const addStep = (
      grid: number[][],
      highlighting: {r: number, c: number}[],
      explanation: string,
      pseudo: string,
      vars: any,
      ts: number, py: number, j: number, cpp: number
    ) => {
      s.push({
        grid: grid.map(row => [...row]),
        highlighting,
        explanation,
        pseudoStep: pseudo,
        variables: vars
      });
      lines.typescript!.push(ts);
      lines.python!.push(py);
      lines.java!.push(j);
      lines.cpp!.push(cpp);
    };

    addStep(
      [], [],
      "Starting with coins [1, 2, 5] and target amount 5.\nOur goal is to find the total number of combinations using a 2D DP table.",
      "change(amount=5, coins=[1, 2, 5])",
      { coins: '[1, 2, 5]', amount: 5 },
      1, 1, 2, 3
    );
    
    const dp = Array.from({ length: amount + 1 }, () => Array(coins.length + 1).fill(0));
    
    addStep(
      dp, [],
      "Initialize a 2D DP table of size (amount + 1) x (coins.length + 1) filled with 0s.\ndp[a][i] represents ways to make amount 'a' using coins from index 'i' to the end.",
      "SET dp = [[0]*(len(coins)+1) for _ in range(amount+1)]",
      { coins: '[1, 2, 5]', amount: 5 },
      2, 2, 3, 4
    );

    for (let i = 0; i <= coins.length; i++) {
      dp[0][i] = 1;
    }
    
    addStep(
      dp, Array.from({ length: coins.length + 1 }, (_, i) => ({ r: 0, c: i })),
      "Base case setup: If the target amount is 0, there is exactly 1 way to make it (by using no coins) regardless of which coins are available.",
      "dp[0][i] = 1",
      { amount: 5 },
      6, 3, 5, 6
    );

    addStep(
      dp, [],
      "Iterate through all target amounts from 1 to the given amount.",
      "FOR a FROM 1 TO amount  →  a = 1",
      { amount: 5 },
      7, 4, 7, 8
    );

    for (let a = 1; a <= amount; a++) {
      for (let i = coins.length - 1; i >= 0; i--) {
        addStep(
          dp, [],
          `For amount ${a}, consider using coin ${coins[i]} (at index ${i}).`,
          `FOR i FROM len(coins)-1 DOWNTO 0  →  i = ${i} (${coins[i]})`,
          { a, i, coin: coins[i] },
          8, 5, 8, 9
        );

        dp[a][i] = dp[a][i + 1];
        
        addStep(
          dp, [{r: a, c: i}, {r: a, c: i + 1}],
          `Initially, the ways to make amount ${a} using coins[${i}..end] includes the ways to make it WITHOUT using the current coin ${coins[i]} (which is dp[${a}][${i + 1}]).`,
          `SET dp[${a}][${i}] = dp[${a}][${i + 1}]  →  ${dp[a][i]}`,
          { a, i, [`dp[${a}][${i}]`]: dp[a][i] },
          9, 5, 9, 10
        );

        addStep(
          dp, [],
          `Check if we can use the current coin: is ${a} - ${coins[i]} >= 0? ${a - coins[i] >= 0 ? "Yes" : "No"}.`,
          `IF a - coins[i] >= 0  →  ${a} - ${coins[i]} >= 0`,
          { a, i, coin: coins[i] },
          10, 5, 10, 11
        );

        if (a - coins[i] >= 0) {
          const added = dp[a - coins[i]][i];
          dp[a][i] += added;
          addStep(
            dp, [{r: a, c: i}, {r: a - coins[i], c: i}],
            `We CAN use the coin! Add the ways to make the remaining amount ${a - coins[i]} using the same available coins (dp[${a - coins[i]}][${i}] = ${added}).\ndp[${a}][${i}] becomes ${dp[a][i]}.`,
            `SET dp[${a}][${i}] += dp[${a - coins[i]}][${i}]  →  ${dp[a][i]}`,
            { a, i, coin: coins[i], added, [`dp[${a}][${i}]`]: dp[a][i] },
            11, 6, 11, 12
          );
        }
      }
    }

    addStep(
      dp, [{r: amount, c: 0}],
      `Finished processing. The total number of combinations to make amount ${amount} using all coins (coins[0..end]) is at dp[${amount}][0], which is ${dp[amount][0]}.`,
      `RETURN dp[${amount}][0]  →  ${dp[amount][0]}`,
      { amount, result: dp[amount][0] },
      15, 7, 15, 16
    );

    return { steps: s, stepLineNumbers: lines };
  }, [coins]);

  const step = steps[currentStep];
  const pseudoSteps = useMemo(() => steps.map(s => s.pseudoStep), [steps]);

  return (
    <VisualizationLayout
      leftContent={
        <div className="space-y-6 flex flex-col h-full">
          <div>
            <Card className="p-6 bg-card/60 backdrop-blur border border-border shadow-sm relative overflow-hidden">
               <div className="flex flex-col gap-4 mb-6 border-b border-border pb-4">
                 <div>
                    <h3 className="text-xs font-black uppercase tracking-widest text-primary mb-2">Available Coins</h3>
                    <div className="flex gap-3">
                       {coins.map((coinValue, idx) => {
                          const isTesting = step.variables.coin === coinValue;
                          return (
                            <div key={idx} className={`relative flex items-center justify-center w-12 h-12 rounded-full border-[3px] font-black text-lg ${
                              isTesting 
                                ? 'bg-orange-500/20 border-orange-500 text-orange-500 scale-105 shadow-[0_0_15px_rgba(249,115,22,0.4)] z-10' 
                                : 'bg-yellow-500/10 border-yellow-500/70 text-yellow-600 dark:text-yellow-500 opacity-70'
                            }`}>
                               <div className="absolute w-[80%] h-[80%] rounded-full border border-current opacity-30 pointer-events-none"></div>
                               {coinValue}
                            </div>
                          );
                       })}
                    </div>
                 </div>
                 <div>
                    <h3 className="text-xs font-normal text-primary/70 mb-1">Objective</h3>
                    <div className="text-sm font-normal text-primary bg-primary/10 px-4 py-2 rounded inline-block text-center shadow-sm border border-primary/10">
                        <div className="text-xs text-primary/80 mb-0.5">Target</div>
                        <div className="text-lg font-semibold">{amount}</div>
                    </div>
                 </div>
               </div>

              <h3 className="text-xs font-black uppercase tracking-widest text-primary/70 mb-3">
                 2D DP Table (Combinations Count)
              </h3>
              
              <div className="overflow-x-auto pb-4 pt-2 px-1">
                {step.grid.length > 0 ? (
                  <table className="w-full text-center border-collapse">
                    <thead>
                      <tr>
                        <th className="text-[10px] font-mono font-bold text-muted-foreground/50 p-2 border-b border-border/50">Amt / Idx</th>
                        {step.grid[0].map((_, colIdx) => (
                          <th key={colIdx} className="text-[10px] font-mono font-bold text-muted-foreground/50 p-2 border-b border-border/50">
                            i={colIdx} <br/> {colIdx < coins.length ? `(${coins[colIdx]})` : '(∅)'}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {step.grid.map((row, rowIdx) => (
                        <tr key={rowIdx}>
                          <td className="text-[10px] font-mono font-bold text-muted-foreground/50 p-2 border-r border-border/50">
                            Amt {rowIdx}
                          </td>
                          {row.map((val, colIdx) => {
                            const isHighlighted = step.highlighting.some(h => h.r === rowIdx && h.c === colIdx);
                            const isBase = rowIdx === 0;
                            return (
                              <td key={colIdx} className="p-1.5">
                                <div className={`w-8 h-8 mx-auto rounded flex items-center justify-center font-bold text-sm transition-all duration-100 ${
                                  isHighlighted
                                    ? 'bg-primary text-primary-foreground border-2 border-primary shadow-lg ring-2 ring-primary/30 z-10 scale-105'
                                    : isBase
                                      ? 'bg-green-500/10 border border-green-500/30 text-green-500/80'
                                      : 'bg-muted/80 text-foreground/80 border border-border'
                                }`}>
                                  {val}
                                </div>
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="text-sm text-muted-foreground italic h-[52px] flex items-center justify-center">Table not initialized yet</div>
                )}
              </div>
            </Card>
          </div>

          <div>
            <Card className="p-4 border-primary/20 bg-primary/5 relative overflow-hidden shadow-sm">
              <div className="space-y-3">
                <div>
                   <h4 className="text-[10px] font-bold uppercase tracking-[0.1em] text-primary/80 mb-1">
                     Commentary
                   </h4>
                   <p className="text-[13px] font-medium leading-relaxed text-foreground/90 whitespace-pre-wrap">
                     {step.explanation}
                   </p>
                </div>
              </div>
            </Card>
          </div>
          <VariablePanel variables={step.variables} />
        </div>
      }
      rightContent={
        <VisualizationCodePanel
          languages={languages}
          stepLineNumbers={stepLineNumbers}
          pseudoSteps={pseudoSteps}
          activeStepIndex={currentStep}
          onLanguageChange={() => setCurrentStep(0)}
        />
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
export default CoinChangeIIVisualization;
