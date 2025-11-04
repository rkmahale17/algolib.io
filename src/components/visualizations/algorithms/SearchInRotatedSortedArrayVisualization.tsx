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

export const SearchInRotatedSortedArrayVisualization = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const array = [4, 5, 6, 7, 0, 1, 2];
  const target = 0;

  const steps: Step[] = [
    {
      array,
      highlights: [],
      variables: { left: 0, right: 6, mid: -1, target, found: false },
      explanation: "Search for target=0 in rotated array. Use modified binary search.",
      highlightedLine: 0
    },
    {
      array,
      highlights: [0, 3, 6],
      variables: { left: 0, right: 6, mid: 3, target, found: false },
      explanation: "mid=3, nums[mid]=7. Left half [4,5,6,7] is sorted. Target 0 not in range [4,7].",
      highlightedLine: 3
    },
    {
      array,
      highlights: [4, 5, 6],
      variables: { left: 4, right: 6, mid: 5, target, found: false },
      explanation: "Search right half. mid=5, nums[mid]=1. Right half [1,2] is sorted.",
      highlightedLine: 6
    },
    {
      array,
      highlights: [4, 5],
      variables: { left: 4, right: 5, mid: 4, target, found: false },
      explanation: "Target 0 not in [1,2]. Search left. mid=4, nums[mid]=0. Found target!",
      highlightedLine: 8
    },
    {
      array,
      highlights: [4],
      variables: { left: 4, right: 5, mid: 4, target, found: true },
      explanation: "Target found at index 4. Return 4. Time: O(log n).",
      highlightedLine: 9
    }
  ];

  const code = `function search(nums: number[], target: number): number {
  let left = 0, right = nums.length - 1;
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (nums[mid] === target) return mid;
    
    if (nums[left] <= nums[mid]) {
      if (nums[left] <= target && target < nums[mid]) {
        right = mid - 1;
      } else {
        left = mid + 1;
      }
    } else {
      if (nums[mid] < target && target <= nums[right]) {
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }
  }
  return -1;
}`;

  const step = steps[currentStep];

  return (
    <VisualizationLayout
      leftContent={
        <>
          <Card className="p-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-center">Search in Rotated Sorted Array</h3>
              <div className="text-sm text-center text-muted-foreground">
                Target: {target}
              </div>
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
