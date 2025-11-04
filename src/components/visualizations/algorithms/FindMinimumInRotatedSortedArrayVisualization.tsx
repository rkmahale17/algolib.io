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
      variables: { left: 0, right: 6, mid: -1 },
      explanation: "Array [4,5,6,7,0,1,2] is rotated. Use binary search to find minimum in O(log n) time.",
      highlightedLine: 1
    },
    {
      array,
      highlights: [0, 6],
      variables: { left: 0, right: 6, mid: -1 },
      explanation: "Initialize: left=0, right=6. We'll compare mid with right to determine which half to search.",
      highlightedLine: 3
    },
    {
      array,
      highlights: [0, 3, 6],
      variables: { left: 0, right: 6, mid: 3 },
      explanation: "mid=3. nums[mid]=7, nums[right]=2. Since 7>2, minimum is in RIGHT half (rotation point).",
      highlightedLine: 8
    },
    {
      array,
      highlights: [4, 6],
      variables: { left: 4, right: 6, mid: -1 },
      explanation: "Move left to mid+1. Now left=4, right=6. Continue binary search in right half.",
      highlightedLine: 9
    },
    {
      array,
      highlights: [4, 5, 6],
      variables: { left: 4, right: 6, mid: 5 },
      explanation: "mid=5. nums[mid]=1, nums[right]=2. Since 1<2, minimum could be mid or to its LEFT.",
      highlightedLine: 8
    },
    {
      array,
      highlights: [4, 5],
      variables: { left: 4, right: 5, mid: -1 },
      explanation: "Move right to mid. Now left=4, right=5. Narrowing search space.",
      highlightedLine: 12
    },
    {
      array,
      highlights: [4, 4, 5],
      variables: { left: 4, right: 5, mid: 4 },
      explanation: "mid=4. nums[mid]=0, nums[right]=1. Since 0<1, minimum is at mid or left of it.",
      highlightedLine: 8
    },
    {
      array,
      highlights: [4],
      variables: { left: 4, right: 4, mid: 4 },
      explanation: "Move right to mid. Now left=4, right=4. Loop ends: left==right.",
      highlightedLine: 12
    },
    {
      array,
      highlights: [4],
      variables: { left: 4, right: 4, mid: 4 },
      explanation: "Found! Minimum is nums[left]=nums[4]=0. Time: O(log n), Space: O(1).",
      highlightedLine: 16
    }
  ];

  const code = `function findMin(nums: number[]): number {
  let left = 0, right = nums.length - 1;
  
  while (left < right) {
    const mid = Math.floor((left + right) / 2);
    
    // If mid element is greater than right element,
    // minimum must be in right half
    if (nums[mid] > nums[right]) {
      left = mid + 1;
    } else {
      // Minimum is in left half (including mid)
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
