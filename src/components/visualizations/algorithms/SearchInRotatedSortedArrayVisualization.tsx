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
      explanation: "Search target=0 in rotated array [4,5,6,7,0,1,2]. Use modified binary search.",
      highlightedLine: 1
    },
    {
      array,
      highlights: [0, 6],
      variables: { left: 0, right: 6, mid: -1, target, found: false },
      explanation: "Initialize: left=0, right=6. We'll check which half is sorted at each step.",
      highlightedLine: 3
    },
    {
      array,
      highlights: [0, 3, 6],
      variables: { left: 0, right: 6, mid: 3, target, found: false },
      explanation: "mid=3, nums[mid]=7. Check if target==7? No. nums[left]=4 <= nums[mid]=7, so LEFT half is sorted.",
      highlightedLine: 6
    },
    {
      array,
      highlights: [0, 3, 6],
      variables: { left: 0, right: 6, mid: 3, target, found: false },
      explanation: "Left sorted [4,5,6,7]. Is target=0 in range [4,7]? No. Search RIGHT half instead.",
      highlightedLine: 16
    },
    {
      array,
      highlights: [4, 6],
      variables: { left: 4, right: 6, mid: -1, target, found: false },
      explanation: "Move left=mid+1=4. Now search in [0,1,2].",
      highlightedLine: 16
    },
    {
      array,
      highlights: [4, 5, 6],
      variables: { left: 4, right: 6, mid: 5, target, found: false },
      explanation: "mid=5, nums[mid]=1. target==1? No. nums[left]=0 <= nums[mid]=1, so LEFT half [0,1] is sorted.",
      highlightedLine: 11
    },
    {
      array,
      highlights: [4, 5],
      variables: { left: 4, right: 5, mid: 5, target, found: false },
      explanation: "Is target=0 in sorted range [0,1]? Yes! (0 <= 0 < 1). Search left half.",
      highlightedLine: 13
    },
    {
      array,
      highlights: [4, 5],
      variables: { left: 4, right: 4, mid: -1, target, found: false },
      explanation: "Move right=mid-1=4. Now left=4, right=4.",
      highlightedLine: 14
    },
    {
      array,
      highlights: [4],
      variables: { left: 4, right: 4, mid: 4, target, found: false },
      explanation: "mid=4, nums[mid]=0. Check if target==0? YES!",
      highlightedLine: 6
    },
    {
      array,
      highlights: [4],
      variables: { left: 4, right: 4, mid: 4, target, found: true },
      explanation: "Found target at index 4! Return 4. Time: O(log n), Space: O(1).",
      highlightedLine: 7
    }
  ];

  const code = `function search(nums: number[], target: number): number {
  let left = 0, right = nums.length - 1;
  
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    
    if (nums[mid] === target) {
      return mid;
    }
    
    // Determine which half is sorted
    if (nums[left] <= nums[mid]) {
      // Left half is sorted
      if (nums[left] <= target && target < nums[mid]) {
        right = mid - 1;
      } else {
        left = mid + 1;
      }
    } else {
      // Right half is sorted
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
              <div className="flex items-center justify-center gap-2 min-h-[200px] flex-wrap">
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
