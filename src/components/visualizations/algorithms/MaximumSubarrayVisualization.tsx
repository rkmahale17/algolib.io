import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { VisualizationLayout } from '../shared/VisualizationLayout';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { CodeHighlighter } from '../shared/CodeHighlighter';

interface Step {
  array: number[];
  highlights: number[];
  subarrayRange: number[];
  variables: Record<string, any>;
  explanation: string;
  highlightedLine: number;
}

export const MaximumSubarrayVisualization = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const array = [-2, 1, -3, 4, -1, 2, 1, -5, 4];

  const steps: Step[] = [
    {
      array,
      highlights: [],
      subarrayRange: [],
      variables: { i: -1, currentSum: 0, maxSum: -Infinity },
      explanation: "Kadane's Algorithm: Find max sum subarray. Initialize currentSum=0, maxSum=-∞.",
      highlightedLine: 0
    },
    {
      array,
      highlights: [0],
      subarrayRange: [],
      variables: { i: 0, currentSum: -2, maxSum: -2 },
      explanation: "i=0: nums[0]=-2. currentSum = max(0, 0) + (-2) = -2. maxSum = -2.",
      highlightedLine: 3
    },
    {
      array,
      highlights: [1],
      subarrayRange: [1],
      variables: { i: 1, currentSum: 1, maxSum: 1 },
      explanation: "i=1: nums[1]=1. currentSum = max(0, -2) + 1 = 1. maxSum = 1. Start new subarray.",
      highlightedLine: 3
    },
    {
      array,
      highlights: [1, 2],
      subarrayRange: [1, 2],
      variables: { i: 2, currentSum: -2, maxSum: 1 },
      explanation: "i=2: nums[2]=-3. currentSum = 1 + (-3) = -2. maxSum stays 1.",
      highlightedLine: 4
    },
    {
      array,
      highlights: [3],
      subarrayRange: [3],
      variables: { i: 3, currentSum: 4, maxSum: 4 },
      explanation: "i=3: nums[3]=4. currentSum = max(0, -2) + 4 = 4. maxSum = 4. New subarray starts.",
      highlightedLine: 3
    },
    {
      array,
      highlights: [3, 4],
      subarrayRange: [3, 4],
      variables: { i: 4, currentSum: 3, maxSum: 4 },
      explanation: "i=4: nums[4]=-1. currentSum = 4 + (-1) = 3. maxSum stays 4.",
      highlightedLine: 4
    },
    {
      array,
      highlights: [3, 4, 5],
      subarrayRange: [3, 4, 5],
      variables: { i: 5, currentSum: 5, maxSum: 5 },
      explanation: "i=5: nums[5]=2. currentSum = 3 + 2 = 5. maxSum = 5.",
      highlightedLine: 3
    },
    {
      array,
      highlights: [3, 4, 5, 6],
      subarrayRange: [3, 4, 5, 6],
      variables: { i: 6, currentSum: 6, maxSum: 6 },
      explanation: "i=6: nums[6]=1. currentSum = 5 + 1 = 6. maxSum = 6. This is our best subarray!",
      highlightedLine: 3
    },
    {
      array,
      highlights: [3, 4, 5, 6, 7],
      subarrayRange: [3, 4, 5, 6],
      variables: { i: 7, currentSum: 1, maxSum: 6 },
      explanation: "i=7: nums[7]=-5. currentSum = 6 + (-5) = 1. maxSum stays 6.",
      highlightedLine: 4
    },
    {
      array,
      highlights: [3, 4, 5, 6, 7, 8],
      subarrayRange: [3, 4, 5, 6],
      variables: { i: 8, currentSum: 5, maxSum: 6 },
      explanation: "i=8: nums[8]=4. currentSum = 1 + 4 = 5. maxSum stays 6.",
      highlightedLine: 4
    },
    {
      array,
      highlights: [3, 4, 5, 6],
      subarrayRange: [3, 4, 5, 6],
      variables: { i: 8, currentSum: 5, maxSum: 6 },
      explanation: "Complete! Max subarray: [4, -1, 2, 1] with sum = 6. Time: O(n), Space: O(1).",
      highlightedLine: 6
    }
  ];

  const code = `function maxSubArray(nums: number[]): number {
  let currentSum = 0;
  let maxSum = -Infinity;
  for (let i = 0; i < nums.length; i++) {
    currentSum = Math.max(0, currentSum) + nums[i];
    maxSum = Math.max(maxSum, currentSum);
  }
  return maxSum;
}`;

  const step = steps[currentStep];

  return (
    <VisualizationLayout
      leftContent={
        <>
          <Card className="p-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-center">Maximum Subarray - Kadane's Algorithm</h3>
              <div className="flex items-center justify-center gap-1 min-h-[200px] flex-wrap">
                {step.array.map((value, index) => (
                  <div key={index} className="flex flex-col items-center gap-2">
                    <div
                      className={`w-14 h-14 rounded flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                        step.subarrayRange.includes(index)
                          ? 'bg-primary text-primary-foreground scale-110 ring-2 ring-primary'
                          : step.highlights.includes(index)
                          ? 'bg-primary/50 text-primary-foreground'
                          : 'bg-muted text-foreground'
                      }`}
                    >
                      {value}
                    </div>
                    <span className="text-xs text-muted-foreground">[{index}]</span>
                  </div>
                ))}
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
