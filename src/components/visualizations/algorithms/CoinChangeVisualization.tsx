import { useState } from 'react';
import { SimpleArrayVisualization } from '../shared/SimpleArrayVisualization';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { CodeHighlighter } from '../shared/CodeHighlighter';

export const CoinChangeVisualization = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const coins = [1, 2, 5];
  const amount = 11;
  
  const steps = [
    {
      array: [0, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity],
      highlighting: [0],
      variables: { amount: 0, coins: '[1,2,5]', minCoins: 0 },
      explanation: "dp[0] = 0 (0 coins needed for amount 0). Initialize rest to infinity"
    },
    {
      array: [0, 1, 1, 2, 2, 1, 2, 2, 3, 3, 2, 3],
      highlighting: [1, 2],
      variables: { amount: '1-2', coins: '[1,2,5]', minCoins: 'calculating...' },
      explanation: "For amount 1: try coin 1 → dp[1] = 1. For amount 2: min(coin 1 twice, coin 2 once) = 1"
    },
    {
      array: [0, 1, 1, 2, 2, 1, 2, 2, 3, 3, 2, 3],
      highlighting: [5],
      variables: { amount: 5, coins: '[1,2,5]', minCoins: 1 },
      explanation: "For amount 5: can use one coin of value 5 → dp[5] = 1"
    },
    {
      array: [0, 1, 1, 2, 2, 1, 2, 2, 3, 3, 2, 3],
      highlighting: [11],
      variables: { amount: 11, coins: '[1,2,5]', minCoins: 3 },
      explanation: "For amount 11: dp[11] = min(dp[10]+1, dp[9]+1, dp[6]+1) = 3. Answer: 3 coins (5+5+1)"
    }
  ];

  const code = `def coinChange(coins, amount):
    dp = [float('inf')] * (amount + 1)
    dp[0] = 0  # 0 coins for amount 0
    
    for i in range(1, amount + 1):
        for coin in coins:
            if coin <= i:
                dp[i] = min(dp[i], dp[i - coin] + 1)
    
    return dp[amount] if dp[amount] != float('inf') else -1`;

  return (
    <div className="space-y-6">
      <SimpleArrayVisualization
        array={steps[currentStep].array.map(v => v === Infinity ? '∞' : v)}
        highlights={steps[currentStep].highlighting}
        label="dp[] - Minimum coins needed for each amount"
      />
      
      <VariablePanel variables={steps[currentStep].variables} />
      
      <div className="p-4 bg-muted rounded-lg">
        <p className="text-sm">{steps[currentStep].explanation}</p>
      </div>

      <CodeHighlighter code={code} language="python" />
      
      <SimpleStepControls
        currentStep={currentStep}
        totalSteps={steps.length}
        onStepChange={setCurrentStep}
      />
    </div>
  );
};