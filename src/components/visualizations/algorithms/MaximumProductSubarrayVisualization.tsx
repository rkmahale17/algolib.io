import { useState } from 'react';
import { SimpleArrayVisualization } from '../shared/SimpleArrayVisualization';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { CodeHighlighter } from '../shared/CodeHighlighter';
import { VisualizationLayout } from '../shared/VisualizationLayout';

export const MaximumProductSubarrayVisualization = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const nums = [2, 3, -2, 4];
  
  const steps = [
    {
      array: nums,
      highlighting: [0],
      variables: { currentMax: 2, currentMin: 2, maxProduct: 2 },
      explanation: "Initialize: currentMax = 2, currentMin = 2, maxProduct = 2",
      highlightedLine: 2
    },
    {
      array: nums,
      highlighting: [0, 1],
      variables: { currentMax: 6, currentMin: 3, maxProduct: 6 },
      explanation: "Element 3: max = max(3, 3×2, 3×2) = 6, min = 3",
      highlightedLine: 8
    },
    {
      array: nums,
      highlighting: [0, 1, 2],
      variables: { currentMax: -2, currentMin: -12, maxProduct: 6 },
      explanation: "Element -2: max = -2, min = -12. Negative flips max/min!",
      highlightedLine: 9
    },
    {
      array: nums,
      highlighting: [3],
      variables: { currentMax: 4, currentMin: -48, maxProduct: 6 },
      explanation: "Element 4: max = 4, min = -48. Final maxProduct = 6 (subarray [2,3])",
      highlightedLine: 11
    }
  ];

  const code = `function maxProduct(nums: number[]): number {
  let maxProduct = nums[0];
  let currentMax = nums[0];
  let currentMin = nums[0];
  
  for (let i = 1; i < nums.length; i++) {
    const num = nums[i];
    const tempMax = currentMax;
    currentMax = Math.max(num, num * currentMax, num * currentMin);
    currentMin = Math.min(num, num * tempMax, num * currentMin);
    
    maxProduct = Math.max(maxProduct, currentMax);
  }
  
  return maxProduct;
}`;

  const leftContent = (
    <>
      <SimpleArrayVisualization
        array={steps[currentStep].array}
        highlights={steps[currentStep].highlighting}
        label="Array"
      />
      
      <div className="p-4 bg-primary/20 rounded-lg border border-primary/30">
        <p className="text-sm font-medium">{steps[currentStep].explanation}</p>
      </div>

      <div className="p-4 bg-muted/50 rounded-lg border">
        <p className="text-xs text-muted-foreground">
          Tip: Track both max and min because negatives can flip them!
        </p>
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
