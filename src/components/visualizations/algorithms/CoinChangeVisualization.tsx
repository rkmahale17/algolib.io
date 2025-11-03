import { useState } from 'react';
import { SimpleArrayVisualization } from '../shared/SimpleArrayVisualization';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { CodeHighlighter } from '../shared/CodeHighlighter';
import { VisualizationLayout } from '../shared/VisualizationLayout';

export const CoinChangeVisualization = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const coins = [1, 2, 5];
  const amount = 11;
  
  const steps = [
    {
      array: [0, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity],
      highlighting: [0],
      variables: { amount: 0, coins: '[1,2,5]', minCoins: 0 },
      explanation: "Initialize: dp[0] = 0 (0 coins needed for amount 0). Rest = infinity",
      highlightedLine: 2
    },
    {
      array: [0, 1, 1, 2, 2, 1, 2, 2, 3, 3, 2, 3],
      highlighting: [1, 2],
      variables: { amount: '1-2', coins: '[1,2,5]', minCoins: 'calculating...' },
      explanation: "For amounts 1-2: try each coin and take minimum",
      highlightedLine: 5
    },
    {
      array: [0, 1, 1, 2, 2, 1, 2, 2, 3, 3, 2, 3],
      highlighting: [5],
      variables: { amount: 5, coins: '[1,2,5]', minCoins: 1 },
      explanation: "For amount 5: can use one coin of value 5 → dp[5] = 1",
      highlightedLine: 7
    },
    {
      array: [0, 1, 1, 2, 2, 1, 2, 2, 3, 3, 2, 3],
      highlighting: [11],
      variables: { amount: 11, coins: '[1,2,5]', minCoins: 3 },
      explanation: "Amount 11: min(dp[10]+1, dp[9]+1, dp[6]+1) = 3. Answer: 3 coins (5+5+1)",
      highlightedLine: 10
    }
  ];

  const code = `function coinChange(coins: number[], amount: number): number {
  const dp = new Array(amount + 1).fill(Infinity);
  dp[0] = 0;  // 0 coins for amount 0
  
  for (let i = 1; i <= amount; i++) {
    for (const coin of coins) {
      if (coin <= i) {
        dp[i] = Math.min(dp[i], dp[i - coin] + 1);
      }
    }
  }
  
  return dp[amount] === Infinity ? -1 : dp[amount];
}`;

  const leftContent = (
    <>
      <SimpleArrayVisualization
        array={steps[currentStep].array.map(v => v === Infinity ? '∞' : v)}
        highlights={steps[currentStep].highlighting}
        label="dp[] - Minimum coins needed for each amount"
      />
      
      <div className="p-4 bg-primary/20 rounded-lg border border-primary/30">
        <p className="text-sm font-medium">{steps[currentStep].explanation}</p>
      </div>

      <VariablePanel variables={steps[currentStep].variables} />
    </>
  );

  const rightContent = (
    <>
      <div className="text-sm font-semibold text-muted-foreground mb-2">TypeScript</div>
      <CodeHighlighter 
        code={code} 
        language="typescript"
        highlightedLine={steps[currentStep].highlightedLine}
      />
    </>
  );

  const controls = (
    <SimpleStepControls
      currentStep={currentStep}
      totalSteps={steps.length}
      onStepChange={setCurrentStep}
    />
  );

  return (
    <VisualizationLayout
      leftContent={leftContent}
      rightContent={rightContent}
      controls={controls}
    />
  );
};
