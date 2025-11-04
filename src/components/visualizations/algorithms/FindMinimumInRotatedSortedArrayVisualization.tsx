import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { VisualizationLayout } from '../shared/VisualizationLayout';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { CodeHighlighter } from '../shared/CodeHighlighter';

interface Step {
  array: number[];
  highlights: number[];
  variables: Record<string, any>;
  explanation: string;
  highlightedLine: number;
}

export const FindMinimumInRotatedSortedArrayVisualization = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const array = [4, 5, 6, 7, 0, 1, 2];

  const steps: Step[] = [
    {
      array,
      highlights: [],
      variables: { left: 0, right: 6, mid: -1, min: null },
      explanation: "Rotated sorted array: [4,5,6,7,0,1,2]. Use binary search to find minimum.",
      highlightedLine: 0
    },
    {
      array,
      highlights: [0, 3, 6],
      variables: { left: 0, right: 6, mid: 3, min: null },
      explanation: "left=0, right=6, mid=3. nums[mid]=7 > nums[right]=2. Min is in right half.",
      highlightedLine: 3
    },
    {
      array,
      highlights: [4, 5, 6],
      variables: { left: 4, right: 6, mid: 5, min: null },
      explanation: "left=4, right=6, mid=5. nums[mid]=1 < nums[right]=2. Min could be mid or left of mid.",
      highlightedLine: 6
    },
    {
      array,
      highlights: [4, 4, 5],
      variables: { left: 4, right: 5, mid: 4, min: null },
      explanation: "left=4, right=5, mid=4. nums[mid]=0 < nums[right]=1. Search left half.",
      highlightedLine: 6
    },
    {
      array,
      highlights: [4],
      variables: { left: 4, right: 4, mid: 4, min: 0 },
      explanation: "left=4, right=4. Found minimum: 0 at index 4. Time: O(log n).",
      highlightedLine: 8
    }
  ];

  const code = `function findMin(nums: number[]): number {
  let left = 0, right = nums.length - 1;
  while (left < right) {
    const mid = Math.floor((left + right) / 2);
    if (nums[mid] > nums[right]) {
      left = mid + 1;
    } else {
      right = mid;
    }
  }
  return nums[left];
}`;

  const step = steps[currentStep];

  return (
    <VisualizationLayout
      leftContent={
        <>
          <Card className="p-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-center">Find Minimum in Rotated Sorted Array</h3>
              <div className="flex items-center justify-center gap-2 min-h-[200px]">
                {step.array.map((value, index) => (
                  <div key={index} className="flex flex-col items-center gap-2">
                    <div
                      className={`w-14 h-14 rounded flex items-center justify-center font-bold transition-all duration-300 ${
                        step.highlights.includes(index)
                          ? 'bg-primary text-primary-foreground scale-110'
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
