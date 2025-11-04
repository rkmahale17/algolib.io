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
      result: [0, 0, 0, 0],
      highlights: [],
      variables: { i: -1, prefix_prod: 1, suffix_prod: 1 },
      explanation: "Array: [1,2,3,4]. We'll compute prefix products (left to right) and suffix products (right to left).",
      highlightedLine: 0
    },
    {
      array,
      prefix: [1, 0, 0, 0],
      suffix: [0, 0, 0, 0],
      result: [1, 0, 0, 0],
      highlights: [0],
      variables: { i: 0, prefix_prod: 1, suffix_prod: 1 },
      explanation: "i=0: result[0] = 1 (no elements to the left). prefix_prod = 1.",
      highlightedLine: 3
    },
    {
      array,
      prefix: [1, 1, 0, 0],
      suffix: [0, 0, 0, 0],
      result: [1, 1, 0, 0],
      highlights: [1],
      variables: { i: 1, prefix_prod: 1, suffix_prod: 1 },
      explanation: "i=1: result[1] = 1 (product of elements left of index 1). Update prefix_prod = 1*1 = 1.",
      highlightedLine: 3
    },
    {
      array,
      prefix: [1, 1, 2, 0],
      suffix: [0, 0, 0, 0],
      result: [1, 1, 2, 0],
      highlights: [2],
      variables: { i: 2, prefix_prod: 2, suffix_prod: 1 },
      explanation: "i=2: result[2] = 2 (1*2). Update prefix_prod = 1*2 = 2.",
      highlightedLine: 3
    },
    {
      array,
      prefix: [1, 1, 2, 6],
      suffix: [0, 0, 0, 0],
      result: [1, 1, 2, 6],
      highlights: [3],
      variables: { i: 3, prefix_prod: 6, suffix_prod: 1 },
      explanation: "i=3: result[3] = 6 (1*2*3). Update prefix_prod = 2*3 = 6. Prefix pass complete.",
      highlightedLine: 4
    },
    {
      array,
      prefix: [1, 1, 2, 6],
      suffix: [0, 0, 0, 1],
      result: [1, 1, 2, 6],
      highlights: [3],
      variables: { i: 3, prefix_prod: 6, suffix_prod: 1 },
      explanation: "Now suffix pass (right to left). i=3: suffix_prod = 1 (no elements to right).",
      highlightedLine: 6
    },
    {
      array,
      prefix: [1, 1, 2, 6],
      suffix: [0, 0, 4, 1],
      result: [1, 1, 8, 6],
      highlights: [2],
      variables: { i: 2, prefix_prod: 6, suffix_prod: 4 },
      explanation: "i=2: result[2] = 2 * 4 = 8. Update suffix_prod = 4*1 = 4.",
      highlightedLine: 8
    },
    {
      array,
      prefix: [1, 1, 2, 6],
      suffix: [0, 12, 4, 1],
      result: [1, 12, 8, 6],
      highlights: [1],
      variables: { i: 1, prefix_prod: 6, suffix_prod: 12 },
      explanation: "i=1: result[1] = 1 * 12 = 12. Update suffix_prod = 12*1 = 12.",
      highlightedLine: 8
    },
    {
      array,
      prefix: [1, 1, 2, 6],
      suffix: [24, 12, 4, 1],
      result: [24, 12, 8, 6],
      highlights: [0],
      variables: { i: 0, prefix_prod: 6, suffix_prod: 24 },
      explanation: "i=0: result[0] = 1 * 24 = 24. Final result: [24, 12, 8, 6]",
      highlightedLine: 9
    },
    {
      array,
      prefix: [1, 1, 2, 6],
      suffix: [24, 12, 4, 1],
      result: [24, 12, 8, 6],
      highlights: [],
      variables: { i: -1, prefix_prod: 6, suffix_prod: 24 },
      explanation: "Complete! Time: O(n), Space: O(1) (output array doesn't count).",
      highlightedLine: 10
    }
  ];

  const code = `function productExceptSelf(nums: number[]): number[] {
  const n = nums.length;
  const result = new Array(n).fill(1);
  let prefix = 1;
  for (let i = 0; i < n; i++) {
    result[i] = prefix;
    prefix *= nums[i];
  }
  let suffix = 1;
  for (let i = n - 1; i >= 0; i--) {
    result[i] *= suffix;
    suffix *= nums[i];
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
                <div className="flex items-center justify-center gap-2">
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
                <div className="flex items-center justify-center gap-2">
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
