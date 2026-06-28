import { useState, useMemo } from 'react';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { VisualizationCodePanel } from '../shared/VisualizationCodePanel';
import { VisualizationLayout } from '../shared/VisualizationLayout';
import { Card } from '@/components/ui/card';
import type { StepLineNumberMap, VisualizationLanguageMap } from '@/types/visualization';

interface Step {
  array: number[];
  highlighting: number[];
  variables: Record<string, any>;
  explanation: string;
  pseudoStep: string;
  calc?: string;
}

const languages: VisualizationLanguageMap = {
  typescript: `function coinChange(coins: number[], amount: number): number {
  const dp: number[] = new Array(amount + 1).fill(amount + 1);
  dp[0] = 0;
  for (let a = 1; a <= amount; a++) {
    for (const coin of coins) {
      if (a - coin >= 0) {
        dp[a] = Math.min(dp[a], 1 + dp[a - coin]);
      }
    }
  }
  return dp[amount] !== amount + 1 ? dp[amount] : -1;
}`,
  python: `def coinChange(coins, amount):
    dp = [amount + 1] * (amount + 1)
    dp[0] = 0
    for a in range(1, amount + 1):
        for coin in coins:
            if a - coin >= 0:
                dp[a] = min(dp[a], 1 + dp[a - coin])
    return dp[amount] if dp[amount] != amount + 1 else -1`,
  java: `public static class Solution {
    public int coinChange(int[] coins, int amount) {
        int[] dp = new int[amount + 1];
        Arrays.fill(dp, amount + 1);
        dp[0] = 0;
        for (int a = 1; a <= amount; a++) {
            for (int coin : coins) {
                if (a - coin >= 0) {
                    dp[a] = Math.min(dp[a], 1 + dp[a - coin]);
                }
            }
        }
        return dp[amount] != amount + 1 ? dp[amount] : -1;
    }
}`,
  cpp: `class Solution {
  public:
  int coinChange(vector<int>& coins, int amount) {
    vector<int> dp(amount + 1, amount + 1);
    dp[0] = 0;
    for (int a = 1; a <= amount; a++) {
        for (int coin : coins) {
            if (a - coin >= 0) {
                dp[a] = min(dp[a], 1 + dp[a - coin]);
            }
        }
    }
    return dp[amount] != amount + 1 ? dp[amount] : -1;
}
};`
};

export const CoinChangeVisualization = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const coins = [1, 2, 5];
  const amount = 6;
  const INF = amount + 1; // 7

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

    const dp = new Array(amount + 1).fill(INF);

    // Initial state
    s.push({
      array: [...dp],
      highlighting: [],
      variables: { coins: '[1, 2, 5]', amount },
      explanation: `Initialize DP table 'dp' of size ${amount + 1}. All values are filled with ${INF} (representing infinity).`,
      pseudoStep: `SET dp = array of size ${amount + 1} filled with ∞`
    });
    addLines(2, 2, 4, 4);

    // Base case
    dp[0] = 0;
    s.push({
      array: [...dp],
      highlighting: [0],
      variables: { coins: '[1, 2, 5]', amount, 'dp[0]': 0 },
      explanation: "Base Case: To make an amount of 0, we need exactly 0 coins. So dp[0] = 0.",
      pseudoStep: "SET dp[0] = 0"
    });
    addLines(3, 3, 5, 5);

    // Loop steps
    for (let a = 1; a <= amount; a++) {
      s.push({
        array: [...dp],
        highlighting: [a],
        variables: { coins: '[1, 2, 5]', amount, a },
        explanation: `Outer loop: Target amount a = ${a}. We will try to find the minimum coins to make this amount.`,
        pseudoStep: `FOR a = 1 TO ${amount} (a = ${a})`
      });
      addLines(4, 4, 6, 6);

      for (const coin of coins) {
        s.push({
          array: [...dp],
          highlighting: [a],
          variables: { coins: '[1, 2, 5]', amount, a, coin },
          explanation: `Try coin denomination: ${coin}.`,
          pseudoStep: `FOR EACH coin IN coins (coin = ${coin})`
        });
        addLines(5, 5, 7, 7);

        const checkCondition = a - coin >= 0;
        s.push({
          array: [...dp],
          highlighting: [a],
          variables: { coins: '[1, 2, 5]', amount, a, coin },
          explanation: `Check if coin ${coin} can be used: a - coin = ${a} - ${coin} = ${a - coin} >= 0? ${checkCondition ? "YES ✓" : "NO ✗"}`,
          pseudoStep: `IF a - coin >= 0 (${a} - ${coin} = ${a - coin} >= 0?)`
        });
        addLines(6, 6, 8, 8);

        if (checkCondition) {
          const prevVal = dp[a];
          const optionVal = 1 + dp[a - coin];
          dp[a] = Math.min(dp[a], optionVal);

          s.push({
            array: [...dp],
            highlighting: [a, a - coin],
            variables: {
              coins: '[1, 2, 5]',
              amount,
              a,
              coin,
              'dp[a]': dp[a],
              'dp[a-coin]': dp[a - coin],
              calc: `min(${prevVal === INF ? "∞" : prevVal}, 1 + ${dp[a - coin]})`
            },
            explanation: `Update dp[${a}] to the minimum of its current value (${prevVal === INF ? "∞" : prevVal}) and using this coin: 1 + dp[${a - coin}] (1 + ${dp[a - coin]} = ${optionVal}). New dp[${a}] = ${dp[a]}.`,
            pseudoStep: `SET dp[a] = min(dp[a], 1 + dp[a - coin])`,
            calc: `dp[${a}] = min(${prevVal === INF ? "∞" : prevVal}, 1 + ${dp[a - coin]}) = ${dp[a]}`
          });
          addLines(7, 7, 9, 9);
        }
      }
    }

    // Return checks
    const result = dp[amount];
    s.push({
      array: [...dp],
      highlighting: [amount],
      variables: { coins: '[1, 2, 5]', amount, 'dp[amount]': result },
      explanation: `Check if target amount can be formed: dp[${amount}] is ${result === INF ? "∞" : result}.`,
      pseudoStep: `IF dp[amount] != ∞`
    });
    addLines(11, 8, 13, 13);

    s.push({
      array: [...dp],
      highlighting: [amount],
      variables: { coins: '[1, 2, 5]', amount, result: result === INF ? -1 : result },
      explanation: `Return final result: ${result === INF ? -1 : result}.`,
      pseudoStep: `RETURN ${result === INF ? -1 : result}`
    });
    addLines(11, 8, 13, 13);

    return { steps: s, stepLineNumbers: lines };
  }, []);

  const step = steps[currentStepIndex];
  const pseudoSteps = steps.map(s => s.pseudoStep);

  return (
    <VisualizationLayout
      leftContent={
        <div className="flex flex-col h-full justify-between gap-6">
          <div className="space-y-6">
            <Card className="p-6 bg-card/60 backdrop-blur border-border/50 shadow-sm relative overflow-hidden">
              <div className="flex flex-col gap-4 mb-6 border-b border-primary/10 pb-4">
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">Available Coins</h3>
                  <div className="flex gap-3">
                    {coins.map((coinValue, idx) => {
                      const isTesting = step.variables.coin === coinValue;
                      return (
                        <div
                          key={idx}
                          className={`relative flex items-center justify-center w-12 h-12 rounded-full border-[3px] font-black text-lg transition-all duration-200 ${
                            isTesting
                              ? 'bg-orange-500/20 border-orange-500 text-orange-500 scale-[1.15] shadow-[0_0_15px_rgba(249,115,22,0.4)] z-10'
                              : 'bg-yellow-500/10 border-yellow-500/50 text-yellow-600 dark:text-yellow-500 opacity-60'
                          }`}
                        >
                          <div className="absolute w-[80%] h-[80%] rounded-full border border-current opacity-30 pointer-events-none"></div>
                          {coinValue}
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1">Target Amount</h3>
                  <div className="text-sm font-semibold text-primary bg-primary/10 px-4 py-2 rounded inline-block text-center border border-primary/10">
                    {amount}
                  </div>
                </div>
              </div>

              <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
                DP Tracking Array (Min Coins Needed)
              </h3>

              <div className="flex items-center gap-1.5 overflow-x-auto pb-4 pt-2 px-1">
                {step.array.map((value, index) => {
                  const isHighlighted = step.highlighting.includes(index);
                  const isBase = index === 0;
                  const displayVal = value === INF ? '∞' : value;

                  return (
                    <div key={index} className="flex flex-col items-center gap-1.5 flex-shrink-0">
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm border-2 transition-all duration-200 ${
                          isHighlighted
                            ? 'bg-primary border-primary text-primary-foreground scale-105 shadow-md ring-2 ring-primary/30 z-10'
                            : value === INF
                              ? 'bg-muted/30 text-muted-foreground/30 border-dashed border-border/40'
                              : isBase
                                ? 'bg-green-500/10 border-green-500/40 text-green-600 dark:text-green-400'
                                : 'bg-muted border-border text-foreground'
                        }`}
                      >
                        {displayVal}
                      </div>
                      <span className={`text-[10px] font-mono ${isHighlighted ? 'text-primary font-bold' : 'text-muted-foreground/75'}`}>
                        Amt {index}
                      </span>
                    </div>
                  );
                })}
              </div>
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
                To make amount `a`, we can try using each coin denomination. If we use coin `c`, we are left with amount `a - c`.
              </p>
              <p>
                The minimum number of coins to make `a` using coin `c` is `1 + dp[a - c]`. We take the minimum across all possible coins.
              </p>
              <p>
                This bottom-up dynamic programming approach solves smaller subproblems first, building up to the target `amount`.
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