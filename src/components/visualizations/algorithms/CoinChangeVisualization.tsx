import { useState } from 'react';
import { SimpleArrayVisualization } from '../shared/SimpleArrayVisualization';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { AnimatedCodeEditor } from '../shared/AnimatedCodeEditor';
import { VisualizationLayout } from '../shared/VisualizationLayout';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';

interface Step {
  array: (number | typeof Infinity)[];
  highlighting: number[];
  variables: Record<string, any>;
  explanation: string;
  highlightedLines: number[];
  lineExecution: string;
}

export const CoinChangeVisualization = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const coins = [1, 2, 5];
  const amount = 11;
  
  const steps: Step[] = [
    {
      array: [],
      highlighting: [],
      variables: { coins: '[1,2,5]', amount: 11 },
      explanation: "Starting with coins [1,2,5] and amount 11. Find minimum coins needed.",
      highlightedLines: [1],
      lineExecution: "function coinChange(coins: number[], amount: number): number {"
    },
    {
      array: [],
      highlighting: [],
      variables: { coins: '[1,2,5]', amount: 11, size: 12 },
      explanation: "Create dp array of size amount + 1 = 12. Fill with Infinity.",
      highlightedLines: [2],
      lineExecution: "const dp = new Array(amount + 1).fill(Infinity);"
    },
    {
      array: [0, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity],
      highlighting: [0],
      variables: { coins: '[1,2,5]', amount: 11 },
      explanation: "Base case: dp[0] = 0. Zero coins needed for amount 0.",
      highlightedLines: [3],
      lineExecution: "dp[0] = 0;"
    },
    {
      array: [0, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity],
      highlighting: [],
      variables: { i: 1, amount: 11 },
      explanation: "Start outer loop: i = 1. Check: 1 <= 11? Yes, enter loop.",
      highlightedLines: [5],
      lineExecution: "for (let i = 1; i <= amount; i++)"
    },
    {
      array: [0, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity],
      highlighting: [1],
      variables: { i: 1, coin: 1 },
      explanation: "Inner loop: Try coin = 1. Check if coin (1) <= i (1)? Yes.",
      highlightedLines: [6, 7],
      lineExecution: "for (const coin of coins)"
    },
    {
      array: [0, 1, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity],
      highlighting: [1],
      variables: { i: 1, coin: 1, 'dp[1]': 1 },
      explanation: "dp[1] = min(Infinity, dp[0] + 1) = min(Infinity, 1) = 1.",
      highlightedLines: [8],
      lineExecution: "dp[1] = 1"
    },
    {
      array: [0, 1, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity],
      highlighting: [2],
      variables: { i: 2, coin: 1 },
      explanation: "i = 2: Try coin = 1. dp[2] = min(Infinity, dp[1] + 1) = 2.",
      highlightedLines: [8],
      lineExecution: "dp[2] = 2"
    },
    {
      array: [0, 1, 1, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity],
      highlighting: [2],
      variables: { i: 2, coin: 2, 'dp[2]': 1 },
      explanation: "i = 2: Try coin = 2. dp[2] = min(2, dp[0] + 1) = min(2, 1) = 1.",
      highlightedLines: [8],
      lineExecution: "dp[2] = 1"
    },
    {
      array: [0, 1, 1, 2, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity],
      highlighting: [3],
      variables: { i: 3 },
      explanation: "i = 3: Process with all coins. dp[3] = 2 (can use coins 1+2 or 1+1+1).",
      highlightedLines: [8],
      lineExecution: "dp[3] = 2"
    },
    {
      array: [0, 1, 1, 2, 2, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity],
      highlighting: [4],
      variables: { i: 4 },
      explanation: "i = 4: Process with all coins. dp[4] = 2 (can use 2+2).",
      highlightedLines: [8],
      lineExecution: "dp[4] = 2"
    },
    {
      array: [0, 1, 1, 2, 2, 1, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity],
      highlighting: [5],
      variables: { i: 5, coin: 5, 'dp[5]': 1 },
      explanation: "i = 5: Try coin = 5. dp[5] = min(3, dp[0] + 1) = 1. One coin of 5!",
      highlightedLines: [8],
      lineExecution: "dp[5] = 1"
    },
    {
      array: [0, 1, 1, 2, 2, 1, 2, 2, 3, 3, 2, Infinity],
      highlighting: [6, 7, 8, 9, 10],
      variables: { i: '6-10' },
      explanation: "Continue for i = 6 to 10. Calculate minimum coins for each amount.",
      highlightedLines: [8],
      lineExecution: "dp[6..10] calculated"
    },
    {
      array: [0, 1, 1, 2, 2, 1, 2, 2, 3, 3, 2, Infinity],
      highlighting: [11],
      variables: { i: 11, amount: 11 },
      explanation: "i = 11: Start calculating dp[11]. Try all coins.",
      highlightedLines: [6],
      lineExecution: "for (const coin of coins)"
    },
    {
      array: [0, 1, 1, 2, 2, 1, 2, 2, 3, 3, 2, Infinity],
      highlighting: [11, 10],
      variables: { i: 11, coin: 1, 'dp[10]': 2 },
      explanation: "Try coin = 1: dp[11] = min(Infinity, dp[10] + 1) = 3.",
      highlightedLines: [8],
      lineExecution: "dp[11] = min(Infinity, 2 + 1)"
    },
    {
      array: [0, 1, 1, 2, 2, 1, 2, 2, 3, 3, 2, Infinity],
      highlighting: [11, 9],
      variables: { i: 11, coin: 2, 'dp[9]': 3 },
      explanation: "Try coin = 2: dp[11] = min(3, dp[9] + 1) = min(3, 4) = 3.",
      highlightedLines: [8],
      lineExecution: "dp[11] = min(3, 3 + 1)"
    },
    {
      array: [0, 1, 1, 2, 2, 1, 2, 2, 3, 3, 2, 3],
      highlighting: [11, 6],
      variables: { i: 11, coin: 5, 'dp[6]': 2 },
      explanation: "Try coin = 5: dp[11] = min(3, dp[6] + 1) = min(3, 3) = 3.",
      highlightedLines: [8],
      lineExecution: "dp[11] = min(3, 2 + 1)"
    },
    {
      array: [0, 1, 1, 2, 2, 1, 2, 2, 3, 3, 2, 3],
      highlighting: [11],
      variables: { i: 12, amount: 11 },
      explanation: "Check loop condition: i (12) <= amount (11)? No, exit loop.",
      highlightedLines: [5],
      lineExecution: "for (let i = 12; i <= amount; i++) -> false"
    },
    {
      array: [0, 1, 1, 2, 2, 1, 2, 2, 3, 3, 2, 3],
      highlighting: [11],
      variables: { amount: 11, result: 3 },
      explanation: "Return dp[11] = 3. Minimum 3 coins needed: 5+5+1.",
      highlightedLines: [13],
      lineExecution: "return dp[amount] = 3"
    },
    {
      array: [0, 1, 1, 2, 2, 1, 2, 2, 3, 3, 2, 3],
      highlighting: [11],
      variables: { amount: 11, result: 3, solution: '5+5+1' },
      explanation: "Algorithm complete! Time: O(amount × coins), Space: O(amount).",
      highlightedLines: [13],
      lineExecution: "Result: 3 coins (5+5+1)"
    }
  ];

  const code = `function coinChange(coins: number[], amount: number): number {
  const dp = new Array(amount + 1).fill(Infinity);
  dp[0] = 0;
  
  for (let i = 1; i <= amount; i++) {
    for (const coin of coins) {
      if (coin <= i) {
        dp[i] = Math.min(dp[i], dp[i - coin] + 1);
      }
    }
  }
  
  return dp[amount] === Infinity ? -1 : dp[amount];
}`;

  const step = steps[currentStep];

  const displayArray = step.array.map(v => v === Infinity ? '∞' : v);

  return (
    <VisualizationLayout
      leftContent={
        <>
          <motion.div
            key={`array-${currentStep}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="p-6">
              <h3 className="text-sm font-semibold mb-3">DP Array - Minimum Coins for Each Amount</h3>
              <div className="flex items-center gap-1 overflow-x-auto">
                {displayArray.map((value, index) => (
                  <motion.div
                    key={index}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: index * 0.03 }}
                    className="flex flex-col items-center gap-1 flex-shrink-0"
                  >
                    <div
                      className={`w-12 h-12 rounded flex items-center justify-center font-bold text-xs transition-all duration-300 ${
                        step.highlighting.includes(index)
                          ? 'bg-primary text-primary-foreground scale-110'
                          : 'bg-muted text-foreground'
                      }`}
                    >
                      {value}
                    </div>
                    <span className="text-xs text-muted-foreground">{index}</span>
                  </motion.div>
                ))}
              </div>
            </Card>
          </motion.div>
          
          <motion.div
            key={`execution-${currentStep}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
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
                <p><strong>DP Formula:</strong> dp[i] = min(dp[i], dp[i-coin] + 1)</p>
              </div>
            </Card>
          </motion.div>

          <motion.div
            key={`variables-${currentStep}`}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.4 }}
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