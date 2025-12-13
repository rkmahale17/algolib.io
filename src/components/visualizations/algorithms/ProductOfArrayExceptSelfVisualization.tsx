import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { VisualizationLayout } from '../shared/VisualizationLayout';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { CodeHighlighter } from '../shared/CodeHighlighter';

interface Step {
  array: number[];
  prefix: number[];
  suffix: number[];
  result: number[];
  highlights: number[];
  variables: Record<string, any>;
  explanation: string;
  highlightedLine: number;
}

export const ProductOfArrayExceptSelfVisualization = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const array = [1, 2, 3, 4];

  const steps: Step[] = [
    {
      array,
      prefix: [0, 0, 0, 0],
      suffix: [0, 0, 0, 0],
      result: [1, 1, 1, 1],
      highlights: [],
      variables: { i: -1, leftProduct: 1, rightProduct: 1 },
      explanation: "Initialize result array with 1s. We'll do two passes: left products, then right products.",
      highlightedLine: 2
    },
    {
      array,
      prefix: [1, 0, 0, 0],
      suffix: [0, 0, 0, 0],
      result: [1, 1, 1, 1],
      highlights: [0],
      variables: { i: 0, leftProduct: 1, rightProduct: 1 },
      explanation: "Pass 1, i=0: result[0]=leftProduct=1 (no elements to left). Then leftProduct *= nums[0] = 1*1 = 1.",
      highlightedLine: 7
    },
    {
      array,
      prefix: [1, 1, 0, 0],
      suffix: [0, 0, 0, 0],
      result: [1, 1, 1, 1],
      highlights: [1],
      variables: { i: 1, leftProduct: 1, rightProduct: 1 },
      explanation: "i=1: result[1]=leftProduct=1 (only 1 to the left). Then leftProduct *= nums[1] = 1*2 = 2.",
      highlightedLine: 8
    },
    {
      array,
      prefix: [1, 1, 2, 0],
      suffix: [0, 0, 0, 0],
      result: [1, 1, 2, 1],
      highlights: [2],
      variables: { i: 2, leftProduct: 2, rightProduct: 1 },
      explanation: "i=2: result[2]=leftProduct=2 (1*2). Then leftProduct *= nums[2] = 2*3 = 6.",
      highlightedLine: 8
    },
    {
      array,
      prefix: [1, 1, 2, 6],
      suffix: [0, 0, 0, 0],
      result: [1, 1, 2, 6],
      highlights: [3],
      variables: { i: 3, leftProduct: 6, rightProduct: 1 },
      explanation: "i=3: result[3]=leftProduct=6 (1*2*3). Then leftProduct *= nums[3] = 6*4 = 24. Left pass done.",
      highlightedLine: 8
    },
    {
      array,
      prefix: [1, 1, 2, 6],
      suffix: [0, 0, 0, 1],
      result: [1, 1, 2, 6],
      highlights: [3],
      variables: { i: 3, leftProduct: 24, rightProduct: 1 },
      explanation: "Pass 2 (right to left), i=3: result[3] *= rightProduct. 6*1=6. Then rightProduct *= nums[3] = 1*4 = 4.",
      highlightedLine: 14
    },
    {
      array,
      prefix: [1, 1, 2, 6],
      suffix: [0, 0, 4, 1],
      result: [1, 1, 8, 6],
      highlights: [2],
      variables: { i: 2, leftProduct: 24, rightProduct: 4 },
      explanation: "i=2: result[2] *= rightProduct. 2*4=8. Then rightProduct *= nums[2] = 4*3 = 12.",
      highlightedLine: 15
    },
    {
      array,
      prefix: [1, 1, 2, 6],
      suffix: [0, 12, 4, 1],
      result: [1, 12, 8, 6],
      highlights: [1],
      variables: { i: 1, leftProduct: 24, rightProduct: 12 },
      explanation: "i=1: result[1] *= rightProduct. 1*12=12. Then rightProduct *= nums[1] = 12*2 = 24.",
      highlightedLine: 15
    },
    {
      array,
      prefix: [1, 1, 2, 6],
      suffix: [24, 12, 4, 1],
      result: [24, 12, 8, 6],
      highlights: [0],
      variables: { i: 0, leftProduct: 24, rightProduct: 24 },
      explanation: "i=0: result[0] *= rightProduct. 1*24=24. Right pass complete!",
      highlightedLine: 15
    },
    {
      array,
      prefix: [1, 1, 2, 6],
      suffix: [24, 12, 4, 1],
      result: [24, 12, 8, 6],
      highlights: [],
      variables: { i: 0, leftProduct: 24, rightProduct: 24 },
      explanation: "Complete! Result: [24,12,8,6]. Time: O(n), Space: O(1) excluding output.",
      highlightedLine: 18
    }
  ];

  const code = `function productExceptSelf(nums: number[]): number[] {
  const n = nums.length;
  const result = new Array(n).fill(1);
  
  // Calculate left products
  let leftProduct = 1;
  for (let i = 0; i < n; i++) {
    result[i] = leftProduct;
    leftProduct *= nums[i];
  }
  
  // Calculate right products and multiply with left
  let rightProduct = 1;
  for (let i = n - 1; i >= 0; i--) {
    result[i] *= rightProduct;
    rightProduct *= nums[i];
  }
  
  return result;
}`;

  const step = steps[currentStep];

  return (
    <VisualizationLayout
      leftContent={
        <>
          <Card className="p-6">
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-center">Product of Array Except Self</h3>
              
              <div className="space-y-2">
                <div className="text-xs font-semibold text-center">Original Array</div>
                <div className="flex items-center justify-center gap-2 flex-wrap">
                  {step.array.map((value, index) => (
                    <div key={index} className="flex flex-col items-center gap-1">
                      <div className={`w-12 h-12 rounded flex items-center justify-center font-bold text-sm ${
                        step.highlights.includes(index) ? 'bg-primary text-primary-foreground' : 'bg-muted'
                      }`}>
                        {value}
                      </div>
                      <span className="text-xs text-muted-foreground">[{index}]</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-xs font-semibold text-center">Result Array</div>
                <div className="flex items-center justify-center gap-2 flex-wrap">
                  {step.result.map((value, index) => (
                    <div key={index} className="flex flex-col items-center gap-1">
                      <div className={`w-12 h-12 rounded flex items-center justify-center font-bold text-sm ${
                        step.highlights.includes(index) ? 'bg-primary text-primary-foreground' : 'bg-muted/50'
                      }`}>
                        {value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="text-sm text-center p-4 bg-muted/50 rounded">
                {step.explanation}
              </div>
            </div>
          </Card>
          <VariablePanel variables={step.variables} />
        </>
      }
      rightContent={
        <CodeHighlighter
          code={code}
          highlightedLine={step.highlightedLine}
          language="TypeScript"
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
