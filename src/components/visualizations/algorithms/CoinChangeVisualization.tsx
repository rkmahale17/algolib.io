import { useState } from 'react';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { AnimatedCodeEditor } from '../shared/AnimatedCodeEditor';
import { VisualizationLayout } from '../shared/VisualizationLayout';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';

interface Step {
  array: (number | string)[];
  highlighting: number[];
  variables: Record<string, any>;
  explanation: string;
  highlightedLines: number[];
  lineExecution: string;
}

export const CoinChangeVisualization = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const coins = [1, 2, 5];
  const amount = 6;
  
  // Helper to init array with logic value
  const INF = 7; // amount + 1
  
  const steps: Step[] = [
    {
      array: [],
      highlighting: [],
      variables: { coins: '[1,2,5]', amount: 6 },
      explanation: "Starting with coins [1,2,5] and amount 6. Goal: minimum coins.",
      highlightedLines: [1],
      lineExecution: "function coinChange(coins: number[], amount: number): number {"
    },
    {
      array: [7, 7, 7, 7, 7, 7, 7], // 0 to 6
      highlighting: [],
      variables: { coins: '[1,2,5]', amount: 6, 'amount + 1': 7 },
      explanation: "Initialize dp array of size 7 (amount + 1). Fill with 7 (amount + 1) as 'Infinity'.",
      highlightedLines: [4],
      lineExecution: "const dp: number[] = new Array(amount + 1).fill(amount + 1);"
    },
    {
      array: [0, 7, 7, 7, 7, 7, 7],
      highlighting: [0],
      variables: { amount: 6 },
      explanation: "Base case: 0 coins needed to make amount 0.",
      highlightedLines: [8],
      lineExecution: "dp[0] = 0;"
    },
    // a = 1
    {
      array: [0, 7, 7, 7, 7, 7, 7],
      highlighting: [],
      variables: { a: 1, amount: 6 },
      explanation: "Outer loop: a = 1. Trying to make amount 1.",
      highlightedLines: [11],
      lineExecution: "for (let a = 1; a <= amount; a++)"
    },
    {
      array: [0, 7, 7, 7, 7, 7, 7],
      highlighting: [],
      variables: { a: 1, coin: 1 },
      explanation: "Inner loop: Try coin = 1.",
      highlightedLines: [13],
      lineExecution: "for (const coin of coins)"
    },
    {
      array: [0, 7, 7, 7, 7, 7, 7],
      highlighting: [],
      variables: { a: 1, coin: 1 },
      explanation: "Check: 1 - 1 >= 0? Yes.",
      highlightedLines: [15],
      lineExecution: "if (a - coin >= 0)"
    },
    {
      array: [0, 1, 7, 7, 7, 7, 7],
      highlighting: [1],
      variables: { a: 1, coin: 1, 'dp[1]': 1 },
      explanation: "Update dp[1] = Math.min(7, 1 + dp[0]) = 1.",
      highlightedLines: [19],
      lineExecution: "dp[a] = Math.min(...) -> 1"
    },
    // a = 2
    {
      array: [0, 1, 7, 7, 7, 7, 7],
      highlighting: [],
      variables: { a: 2 },
      explanation: "Outer loop: a = 2.",
      highlightedLines: [11],
      lineExecution: "for (let a = 1; a <= amount; a++)"
    },
    {
      array: [0, 1, 7, 7, 7, 7, 7],
      highlighting: [],
      variables: { a: 2, coin: 1 },
      explanation: "Try coin = 1. Check 2 - 1 >= 0? Yes.",
      highlightedLines: [13, 15],
      lineExecution: "if (a - coin >= 0)"
    },
    {
      array: [0, 1, 2, 7, 7, 7, 7],
      highlighting: [2],
      variables: { a: 2, coin: 1, 'dp[2]': 2 },
      explanation: "dp[2] = Math.min(7, 1 + dp[1]) = 2.",
      highlightedLines: [19],
      lineExecution: "dp[2] = 2"
    },
    {
      array: [0, 1, 2, 7, 7, 7, 7],
      highlighting: [],
      variables: { a: 2, coin: 2 },
      explanation: "Try coin = 2. Check 2 - 2 >= 0? Yes.",
      highlightedLines: [13, 15],
      lineExecution: "if (a - coin >= 0)"
    },
    {
      array: [0, 1, 1, 7, 7, 7, 7],
      highlighting: [2],
      variables: { a: 2, coin: 2, 'dp[2]': 1 },
      explanation: "dp[2] = Math.min(2, 1 + dp[0]) = 1. Better solution found!",
      highlightedLines: [19],
      lineExecution: "dp[2] = 1"
    },
    // a = 3
    {
      array: [0, 1, 1, 7, 7, 7, 7],
      highlighting: [],
      variables: { a: 3 },
      explanation: "Outer loop: a = 3.",
      highlightedLines: [11],
      lineExecution: "for (let a = 1; a <= amount; a++)"
    },
    {
      array: [0, 1, 1, 2, 7, 7, 7],
      highlighting: [3],
      variables: { a: 3, coin: 1, 'dp[3]': 2 },
      explanation: "Try coin = 1: dp[3] = Math.min(7, 1 + dp[2]) = 2.",
      highlightedLines: [19],
      lineExecution: "dp[3] = 2"
    },
    {
      array: [0, 1, 1, 2, 7, 7, 7],
      highlighting: [3],
      variables: { a: 3, coin: 2, 'dp[3]': 2 },
      explanation: "Try coin = 2: dp[3] = Math.min(2, 1 + dp[1]) = Math.min(2, 2) = 2. No change.",
      highlightedLines: [19],
      lineExecution: "dp[3] = 2"
    },
     // a = 4
    {
      array: [0, 1, 1, 2, 7, 7, 7],
      highlighting: [],
      variables: { a: 4 },
      explanation: "Outer loop: a = 4.",
      highlightedLines: [11],
      lineExecution: "for (let a = 1; a <= amount; a++)"
    },
    {
      array: [0, 1, 1, 2, 3, 7, 7],
      highlighting: [4],
      variables: { a: 4, coin: 1, 'dp[4]': 3 },
      explanation: "Try coin = 1: dp[4] = 1 + dp[3] = 3.",
      highlightedLines: [19],
      lineExecution: "dp[4] = 3"
    },
    {
      array: [0, 1, 1, 2, 2, 7, 7],
      highlighting: [4],
      variables: { a: 4, coin: 2, 'dp[4]': 2 },
      explanation: "Try coin = 2: dp[4] = 1 + dp[2] = 2. Improved.",
      highlightedLines: [19],
      lineExecution: "dp[4] = 2"
    },
    // a = 5
    {
      array: [0, 1, 1, 2, 2, 7, 7],
      highlighting: [],
      variables: { a: 5 },
      explanation: "Outer loop: a = 5.",
      highlightedLines: [11],
      lineExecution: "for (let a = 1; a <= amount; a++)"
    },
    {
      array: [0, 1, 1, 2, 2, 3, 7],
      highlighting: [5],
      variables: { a: 5, coin: 1, 'dp[5]': 3 },
      explanation: "Try coin = 1: dp[5] = 1 + dp[4] = 3.",
      highlightedLines: [19],
      lineExecution: "dp[5] = 3"
    },
    {
      array: [0, 1, 1, 2, 2, 3, 7],
      highlighting: [5],
      variables: { a: 5, coin: 2, 'dp[5]': 3 },
      explanation: "Try coin = 2: dp[5] = 1 + dp[3] = 3. Same.",
      highlightedLines: [19],
      lineExecution: "dp[5] = 3"
    },
    {
      array: [0, 1, 1, 2, 2, 1, 7],
      highlighting: [5],
      variables: { a: 5, coin: 5, 'dp[5]': 1 },
      explanation: "Try coin = 5: dp[5] = 1 + dp[0] = 1. Much better!",
      highlightedLines: [19],
      lineExecution: "dp[5] = 1"
    },
    // a = 6
    {
      array: [0, 1, 1, 2, 2, 1, 7],
      highlighting: [],
      variables: { a: 6 },
      explanation: "Outer loop: a = 6 (Last iteration).",
      highlightedLines: [11],
      lineExecution: "for (let a = 1; a <= amount; a++)"
    },
    {
      array: [0, 1, 1, 2, 2, 1, 2],
      highlighting: [6],
      variables: { a: 6, coin: 1, 'dp[6]': 2 },
      explanation: "Try coin = 1: dp[6] = 1 + dp[5] = 2.",
      highlightedLines: [19],
      lineExecution: "dp[6] = 2"
    },
    {
      array: [0, 1, 1, 2, 2, 1, 2],
      highlighting: [6],
      variables: { a: 6, coin: 2, 'dp[6]': 2 },
      explanation: "Try coin = 2: dp[6] = 1 + dp[4] = 3 (vs 2). Keep 2.",
      highlightedLines: [19],
      lineExecution: "dp[6] = 1 + dp[4] (3) >= 2"
    },
    {
      array: [0, 1, 1, 2, 2, 1, 2],
      highlighting: [6],
      variables: { a: 6, coin: 5, 'dp[6]': 2 },
      explanation: "Try coin = 5: dp[6] = 1 + dp[1] = 2. Same.",
      highlightedLines: [19],
      lineExecution: "dp[6] = 1 + dp[1] (2) >= 2"
    },
    // End
    {
      array: [0, 1, 1, 2, 2, 1, 2],
      highlighting: [],
      variables: { amount: 6 },
      explanation: "Loop finished. Check return condition.",
      highlightedLines: [26],
      lineExecution: "return dp[amount] !== amount + 1 ..."
    },
    {
      array: [0, 1, 1, 2, 2, 1, 2],
      highlighting: [6],
      variables: { result: 2 },
      explanation: "Result is 2 (e.g. 5 + 1).",
      highlightedLines: [26],
      lineExecution: "return 2"
    }
  ];

  const code = `function coinChange(coins: number[], amount: number): number {
    // dp[i] will store the minimum number of coins
    // needed to make amount i
    const dp: number[] = new Array(amount + 1).fill(amount + 1);

    // Base case:
    // 0 coins are needed to make amount 0
    dp[0] = 0;

    // Build the DP table from amount 1 to amount
    for (let a = 1; a <= amount; a++) {
        // Try using each coin
        for (const coin of coins) {
            // Check if the coin can be used for this amount
            if (a - coin >= 0) {
                // Choose the minimum between:
                // 1) current value of dp[a]
                // 2) using this coin (1 + dp[a - coin])
                dp[a] = Math.min(dp[a], 1 + dp[a - coin]);
            }
        }
    }

    // If dp[amount] is still greater than amount,
    // it means the amount cannot be formed
    return dp[amount] !== amount + 1 ? dp[amount] : -1;
}`;

  const step = steps[currentStep];

  const displayArray = step.array.map(v => v === 7 ? '∞' : v);

  return (
    <VisualizationLayout
      leftContent={
        <>
          <motion.div
            key={`array-${currentStep}`}
          >
            <Card className="p-6">
              <h3 className="text-sm font-semibold mb-3">DP Array - Min Coins (Target: {amount})</h3>
              <div className="flex items-center gap-1 overflow-x-auto pb-2">
                {displayArray.map((value, index) => (
                  <motion.div
                    key={index}
                    className="flex flex-col items-center gap-1 flex-shrink-0"
                  >
                    <div
                      className={`w-10 h-10 rounded flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                        step.highlighting.includes(index)
                          ? 'bg-primary text-primary-foreground scale-110'
                          : 'bg-muted text-foreground'
                      }`}
                    >
                      {value}
                    </div>
                    <span className="text-[10px] text-muted-foreground">{index}</span>
                  </motion.div>
                ))}
              </div>
            </Card>
          </motion.div>
          
          <motion.div
            key={`execution-${currentStep}`}
          >
            <Card className="p-4 bg-muted/50">
              <div className="space-y-2">
                <div className="text-sm font-semibold text-primary">Current Execution:</div>
                <div className="text-sm font-mono bg-background/50 p-2 rounded">
                  {step.lineExecution}
                </div>
                <div className="text-sm text-muted-foreground pt-2">
                  {step.explanation}
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            key={`info-${currentStep}`}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <Card className="p-4 bg-muted/50">
              <div className="text-xs space-y-1 text-muted-foreground">
                <p><strong>Coins:</strong> {JSON.stringify(coins)}</p>
                <p><strong>Target:</strong> {amount}</p>
                <p><strong>Logic:</strong> {`dp[a] = min(dp[a], 1 + dp[a - coin])`}</p>
              </div>
            </Card>
          </motion.div>

          <motion.div
            key={`variables-${currentStep}`}
       
          >
            <VariablePanel variables={step.variables} />
          </motion.div>
        </>
      }
      rightContent={
        <AnimatedCodeEditor
          code={code}
          language="typescript"
          highlightedLines={step.highlightedLines}
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