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
      highlighting: [],
      variables: { minPrice: 'Infinity', maxProfit: 0 },
      explanation: "Initialize: minPrice=Infinity, maxProfit=0. We'll track minimum price and max profit.",
      highlightedLine: 1
    },
    {
      array: prices,
      highlighting: [0],
      variables: { minPrice: 7, maxProfit: 0, price: 7 },
      explanation: "Day 0: price=7. Update minPrice=min(∞,7)=7. profit=7-7=0. maxProfit=0.",
      highlightedLine: 5
    },
    {
      array: prices,
      highlighting: [1],
      variables: { minPrice: 1, maxProfit: 0, price: 1 },
      explanation: "Day 1: price=1. Update minPrice=min(7,1)=1. profit=1-1=0. maxProfit=0.",
      highlightedLine: 5
    },
    {
      array: prices,
      highlighting: [2],
      variables: { minPrice: 1, maxProfit: 4, price: 5 },
      explanation: "Day 2: price=5. minPrice=1. profit=5-1=4. Update maxProfit=max(0,4)=4!",
      highlightedLine: 8
    },
    {
      array: prices,
      highlighting: [3],
      variables: { minPrice: 1, maxProfit: 4, price: 3 },
      explanation: "Day 3: price=3. minPrice=1. profit=3-1=2. maxProfit stays 4.",
      highlightedLine: 8
    },
    {
      array: prices,
      highlighting: [4],
      variables: { minPrice: 1, maxProfit: 5, price: 6 },
      explanation: "Day 4: price=6. minPrice=1. profit=6-1=5. Update maxProfit=max(4,5)=5!",
      highlightedLine: 8
    },
    {
      array: prices,
      highlighting: [5],
      variables: { minPrice: 1, maxProfit: 5, price: 4 },
      explanation: "Day 5: price=4. minPrice=1. profit=4-1=3. maxProfit stays 5.",
      highlightedLine: 8
    },
    {
      array: prices,
      highlighting: [],
      variables: { minPrice: 1, maxProfit: 5 },
      explanation: "Complete! Best strategy: Buy at 1, sell at 6. Maximum profit = 5. Time: O(n).",
      highlightedLine: 11
    }
  ];

  const code = `function maxProfit(prices: number[]): number {
  if (prices.length === 0) return 0;
  
  let minPrice = Infinity;
  let maxProfit = 0;
  
  for (const price of prices) {
    // Update minimum price seen so far
    minPrice = Math.min(minPrice, price);
    
    // Calculate profit if we sell at current price
    const profit = price - minPrice;
    
    // Update maximum profit
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
