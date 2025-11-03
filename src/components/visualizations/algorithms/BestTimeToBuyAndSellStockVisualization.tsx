import { useState } from 'react';
import { ArrayVisualization } from '../ArrayVisualization';
import { StepControls } from '../shared/StepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { CodeHighlighter } from '../shared/CodeHighlighter';

export const BestTimeToBuyAndSellStockVisualization = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const prices = [7, 1, 5, 3, 6, 4];
  
  const steps = [
    {
      array: prices,
      highlighting: [0],
      variables: { minPrice: 7, maxProfit: 0, currentDay: 0 },
      explanation: "Start with first day. minPrice = 7, maxProfit = 0"
    },
    {
      array: prices,
      highlighting: [1],
      variables: { minPrice: 1, maxProfit: 0, currentDay: 1 },
      explanation: "Day 1: price = 1. Update minPrice to 1 (lower than 7)"
    },
    {
      array: prices,
      highlighting: [2],
      variables: { minPrice: 1, maxProfit: 4, currentDay: 2 },
      explanation: "Day 2: price = 5. Profit = 5 - 1 = 4. Update maxProfit"
    },
    {
      array: prices,
      highlighting: [3],
      variables: { minPrice: 1, maxProfit: 4, currentDay: 3 },
      explanation: "Day 3: price = 3. Profit = 3 - 1 = 2. Keep maxProfit = 4"
    },
    {
      array: prices,
      highlighting: [4],
      variables: { minPrice: 1, maxProfit: 5, currentDay: 4 },
      explanation: "Day 4: price = 6. Profit = 6 - 1 = 5. Update maxProfit"
    },
    {
      array: prices,
      highlighting: [5],
      variables: { minPrice: 1, maxProfit: 5, currentDay: 5 },
      explanation: "Day 5: price = 4. Profit = 4 - 1 = 3. Keep maxProfit = 5. Final answer!"
    }
  ];

  const code = `def maxProfit(prices):
    min_price = float('inf')
    max_profit = 0
    
    for price in prices:
        min_price = min(min_price, price)
        profit = price - min_price
        max_profit = max(max_profit, profit)
    
    return max_profit`;

  return (
    <div className="space-y-6">
      <ArrayVisualization
        array={steps[currentStep].array}
        highlights={steps[currentStep].highlighting}
        label="Stock Prices"
      />
      
      <VariablePanel variables={steps[currentStep].variables} />
      
      <div className="p-4 bg-muted rounded-lg">
        <p className="text-sm">{steps[currentStep].explanation}</p>
      </div>

      <CodeHighlighter code={code} language="python" />
      
      <StepControls
        currentStep={currentStep}
        totalSteps={steps.length}
        onStepChange={setCurrentStep}
      />
    </div>
  );
};