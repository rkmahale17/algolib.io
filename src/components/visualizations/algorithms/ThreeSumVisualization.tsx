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

export const ThreeSumVisualization = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const originalArray = [-1, 0, 1, 2, -1, -4];
  const sortedArray = [-4, -1, -1, 0, 1, 2];

  const steps: Step[] = [
    {
      array: originalArray,
      highlights: [],
      variables: { result: [], i: -1, left: -1, right: -1, sum: null },
      explanation: "Start with unsorted array. First, we need to sort it.",
      highlightedLine: 0
    },
    {
      array: sortedArray,
      highlights: [],
      variables: { result: [], i: -1, left: -1, right: -1, sum: null },
      explanation: "Array sorted: [-4, -1, -1, 0, 1, 2]. Now we'll use three pointers.",
      highlightedLine: 1
    },
    {
      array: sortedArray,
      highlights: [0],
      variables: { result: [], i: 0, left: 1, right: 5, sum: null },
      explanation: "i=0 (val=-4), left=1, right=5. We'll find triplets that sum to 0.",
      highlightedLine: 3
    },
    {
      array: sortedArray,
      highlights: [0, 1, 5],
      variables: { result: [], i: 0, left: 1, right: 5, sum: -3 },
      explanation: "sum = -4 + (-1) + 2 = -3. Sum < 0, so move left pointer right.",
      highlightedLine: 6
    },
    {
      array: sortedArray,
      highlights: [0, 2, 5],
      variables: { result: [], i: 0, left: 2, right: 5, sum: -3 },
      explanation: "left=2. sum = -4 + (-1) + 2 = -3. Still < 0, move left right.",
      highlightedLine: 7
    },
    {
      array: sortedArray,
      highlights: [0, 3, 5],
      variables: { result: [], i: 0, left: 3, right: 5, sum: -2 },
      explanation: "left=3. sum = -4 + 0 + 2 = -2. Still < 0, move left right.",
      highlightedLine: 7
    },
    {
      array: sortedArray,
      highlights: [0, 4, 5],
      variables: { result: [], i: 0, left: 4, right: 5, sum: -1 },
      explanation: "left=4. sum = -4 + 1 + 2 = -1. Still < 0. left >= right, done with i=0.",
      highlightedLine: 7
    },
    {
      array: sortedArray,
      highlights: [1],
      variables: { result: [], i: 1, left: 2, right: 5, sum: null },
      explanation: "i=1 (val=-1), left=2, right=5. Find triplets starting with -1.",
      highlightedLine: 3
    },
    {
      array: sortedArray,
      highlights: [1, 2, 5],
      variables: { result: [], i: 1, left: 2, right: 5, sum: 0 },
      explanation: "sum = -1 + (-1) + 2 = 0. Found triplet! Add [-1, -1, 2] to result.",
      highlightedLine: 8
    },
    {
      array: sortedArray,
      highlights: [1, 3, 4],
      variables: { result: [[-1, -1, 2]], i: 1, left: 3, right: 4, sum: null },
      explanation: "Move both pointers. left=3, right=4. Continue searching.",
      highlightedLine: 9
    },
    {
      array: sortedArray,
      highlights: [1, 3, 4],
      variables: { result: [[-1, -1, 2]], i: 1, left: 3, right: 4, sum: 0 },
      explanation: "sum = -1 + 0 + 1 = 0. Found another! Add [-1, 0, 1] to result.",
      highlightedLine: 8
    },
    {
      array: sortedArray,
      highlights: [1, 3, 4],
      variables: { result: [[-1, -1, 2], [-1, 0, 1]], i: 1, left: 4, right: 3, sum: null },
      explanation: "left >= right, done with i=1. Move to next unique element.",
      highlightedLine: 10
    },
    {
      array: sortedArray,
      highlights: [2],
      variables: { result: [[-1, -1, 2], [-1, 0, 1]], i: 2, left: -1, right: -1, sum: null },
      explanation: "i=2 has same value as i=1 (-1). Skip to avoid duplicates.",
      highlightedLine: 4
    },
    {
      array: sortedArray,
      highlights: [3],
      variables: { result: [[-1, -1, 2], [-1, 0, 1]], i: 3, left: 4, right: 5, sum: null },
      explanation: "i=3 (val=0), left=4, right=5. Check remaining elements.",
      highlightedLine: 3
    },
    {
      array: sortedArray,
      highlights: [3, 4, 5],
      variables: { result: [[-1, -1, 2], [-1, 0, 1]], i: 3, left: 4, right: 5, sum: 3 },
      explanation: "sum = 0 + 1 + 2 = 3. Sum > 0, move right pointer left.",
      highlightedLine: 11
    },
    {
      array: sortedArray,
      highlights: [3, 4, 5],
      variables: { result: [[-1, -1, 2], [-1, 0, 1]], i: 3, left: 4, right: 4, sum: null },
      explanation: "left >= right, done. Final result: [[-1, -1, 2], [-1, 0, 1]]",
      highlightedLine: 12
    }
  ];

  const code = `function threeSum(nums: number[]): number[][] {
  nums.sort((a, b) => a - b);
  const result: number[][] = [];
  for (let i = 0; i < nums.length - 2; i++) {
    if (i > 0 && nums[i] === nums[i - 1]) continue;
    let left = i + 1, right = nums.length - 1;
    while (left < right) {
      const sum = nums[i] + nums[left] + nums[right];
      if (sum === 0) {
        result.push([nums[i], nums[left], nums[right]]);
        while (left < right && nums[left] === nums[left + 1]) left++;
        while (left < right && nums[right] === nums[right - 1]) right--;
        left++; right--;
      } else if (sum < 0) left++;
      else right--;
    }
  }
  return result;
}`;

  const step = steps[currentStep];

  return (
    <VisualizationLayout
      leftContent={
        <>
          <Card className="p-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-center">3Sum - Two Pointer Approach</h3>
              <div className="flex items-center justify-center gap-2 min-h-[200px]">
                {step.array.map((value, index) => (
                  <div key={index} className="flex flex-col items-center gap-2">
                    <div
                      className={`w-16 h-16 rounded flex items-center justify-center font-bold transition-all duration-300 ${
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
