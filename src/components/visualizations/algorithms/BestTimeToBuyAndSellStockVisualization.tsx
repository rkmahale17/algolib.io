import { useState } from 'react';
import { SimpleArrayVisualization } from '../shared/SimpleArrayVisualization';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { CodeHighlighter } from '../shared/CodeHighlighter';
import { VisualizationLayout } from '../shared/VisualizationLayout';

export const BestTimeToBuyAndSellStockVisualization = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const prices = [7, 1, 5, 3, 6, 4];
  
  const steps = [
    {
      array: prices,
      highlighting: [0],
      variables: { minPrice: 7, maxProfit: 0, currentDay: 0 },
      explanation: "Initialize: minPrice = 7, maxProfit = 0",
      highlightedLine: 1
    },
    {
      array: prices,
      highlighting: [1],
      variables: { minPrice: 1, maxProfit: 0, currentDay: 1 },
      explanation: "Day 1: price = 1. Update minPrice to 1 (lower than 7)",
      highlightedLine: 5
    },
    {
      array: prices,
      highlighting: [2],
      variables: { minPrice: 1, maxProfit: 4, currentDay: 2 },
      explanation: "Day 2: price = 5. Profit = 5 - 1 = 4. Update maxProfit",
      highlightedLine: 6
    },
    {
      array: prices,
      highlighting: [3],
      variables: { minPrice: 1, maxProfit: 4, currentDay: 3 },
      explanation: "Day 3: price = 3. Profit = 3 - 1 = 2. Keep maxProfit = 4",
      highlightedLine: 7
    },
    {
      array: prices,
      highlighting: [4],
      variables: { minPrice: 1, maxProfit: 5, currentDay: 4 },
      explanation: "Day 4: price = 6. Profit = 6 - 1 = 5. Update maxProfit!",
      highlightedLine: 7
    },
    {
      array: prices,
      highlighting: [5],
      variables: { minPrice: 1, maxProfit: 5, currentDay: 5 },
      explanation: "Day 5: price = 4. Profit = 4 - 1 = 3. Final answer: maxProfit = 5",
      highlightedLine: 10
    }
  ];

  const code = `function maxProfit(prices: number[]): number {
  let minPrice = Infinity;
  let maxProfit = 0;
  
  for (const price of prices) {
    minPrice = Math.min(minPrice, price);
    const profit = price - minPrice;
    maxProfit = Math.max(maxProfit, profit);
  }
  
  return maxProfit;
}`;

  const leftContent = (
    <>
      <SimpleArrayVisualization
        array={steps[currentStep].array}
        highlights={steps[currentStep].highlighting}
        label="Stock Prices"
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
