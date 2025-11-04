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
      variables: { currentMax: 2, currentMin: 2, maxProduct: 2, i: 0 },
      explanation: "Initialize: maxProduct=2, currentMax=2, currentMin=2. We track both max and min products.",
      highlightedLine: 3
    },
    {
      array: nums,
      highlighting: [0, 1],
      variables: { currentMax: 6, currentMin: 3, maxProduct: 6, i: 1, num: 3, tempMax: 2 },
      explanation: "i=1: num=3. tempMax=2. currentMax=max(3, 3*2, 3*2)=6. currentMin=min(3, 3*2, 3*2)=3. maxProduct=6.",
      highlightedLine: 14
    },
    {
      array: nums,
      highlighting: [0, 1, 2],
      variables: { currentMax: -2, currentMin: -12, maxProduct: 6, i: 2, num: -2, tempMax: 6 },
      explanation: "i=2: num=-2. tempMax=6. currentMax=max(-2, -2*6, -2*3)=-2. currentMin=min(-2, -2*6, -2*3)=-12.",
      highlightedLine: 15
    },
    {
      array: nums,
      highlighting: [0, 1, 2, 3],
      variables: { currentMax: 4, currentMin: -48, maxProduct: 6, i: 3, num: 4, tempMax: -2 },
      explanation: "i=3: num=4. tempMax=-2. currentMax=max(4, 4*(-2), 4*(-12))=4. currentMin=-48. maxProduct stays 6.",
      highlightedLine: 18
    },
    {
      array: nums,
      highlighting: [0, 1],
      variables: { currentMax: 4, currentMin: -48, maxProduct: 6, i: 3 },
      explanation: "Complete! Best product subarray is [2,3] = 6. Negative at index 2 broke the sequence. Time: O(n).",
      highlightedLine: 21
    }
  ];

  const code = `function maxProduct(nums: number[]): number {
  if (nums.length === 0) return 0;
  
  let maxProduct = nums[0];
  let currentMax = nums[0];
  let currentMin = nums[0];
  
  for (let i = 1; i < nums.length; i++) {
    const num = nums[i];
    
    // Store currentMax before updating
    const tempMax = currentMax;
    
    // Update max and min
    currentMax = Math.max(num, num * currentMax, num * currentMin);
    currentMin = Math.min(num, num * tempMax, num * currentMin);
    
    // Update global maximum
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
