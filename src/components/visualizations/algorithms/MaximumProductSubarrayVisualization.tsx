import { useState } from 'react';
import { SimpleArrayVisualization } from '../shared/SimpleArrayVisualization';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { CodeHighlighter } from '../shared/CodeHighlighter';

export const MaximumProductSubarrayVisualization = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const nums = [2, 3, -2, 4];
  
  const steps = [
    {
      array: nums,
      highlighting: [0],
      variables: { currentMax: 2, currentMin: 2, maxProduct: 2 },
      explanation: "Start: currentMax = 2, currentMin = 2, maxProduct = 2"
    },
    {
      array: nums,
      highlighting: [0, 1],
      variables: { currentMax: 6, currentMin: 3, maxProduct: 6 },
      explanation: "Element 3: max = max(3, 3×2, 3×2) = 6, min = min(3, 3×2, 3×2) = 3"
    },
    {
      array: nums,
      highlighting: [0, 1, 2],
      variables: { currentMax: -2, currentMin: -12, maxProduct: 6 },
      explanation: "Element -2: max = max(-2, -2×6, -2×3) = -2, min = -12. Negative flips max/min!"
    },
    {
      array: nums,
      highlighting: [3],
      variables: { currentMax: 4, currentMin: -48, maxProduct: 6 },
      explanation: "Element 4: max = 4, min = -48. Final maxProduct = 6 (subarray [2,3])"
    }
  ];

  const code = `def maxProduct(nums):
    max_product = nums[0]
    current_max = nums[0]
    current_min = nums[0]
    
    for i in range(1, len(nums)):
        num = nums[i]
        temp_max = current_max
        
        current_max = max(num, num * current_max, num * current_min)
        current_min = min(num, num * temp_max, num * current_min)
        
        max_product = max(max_product, current_max)
    
    return max_product`;

  return (
    <div className="space-y-6">
      <SimpleArrayVisualization
        array={steps[currentStep].array}
        highlights={steps[currentStep].highlighting}
        label="Array"
      />
      
      <VariablePanel variables={steps[currentStep].variables} />
      
      <div className="p-4 bg-muted rounded-lg">
        <p className="text-sm">{steps[currentStep].explanation}</p>
        <p className="text-xs text-muted-foreground mt-2">
          Tip: Track both max and min because negatives can flip them!
        </p>
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