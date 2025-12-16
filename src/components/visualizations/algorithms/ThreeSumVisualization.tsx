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
      variables: { result: '[]', i: -1, left: -1, right: -1, target: 0 },
      explanation: "Given array: [-1,0,1,2,-1,-4]. First, sort it for two-pointer approach.",
      highlightedLine: 1
    },
    {
      array: sortedArray,
      highlights: [],
      variables: { result: '[]', i: -1, left: -1, right: -1, target: 0 },
      explanation: "After sorting: [-4,-1,-1,0,1,2]. Now use fixed pointer i + two pointers (left, right).",
      highlightedLine: 2
    },
    {
      array: sortedArray,
      highlights: [0, 1, 5],
      variables: { result: '[]', i: 0, left: 1, right: 5, target: 4 },
      explanation: "i=0, nums[i]=-4, target=-(-4)=4. left=1, right=5. sum = -1+2 = 1 < 4.",
      highlightedLine: 14
    },
    {
      array: sortedArray,
      highlights: [0, 2, 5],
      variables: { result: '[]', i: 0, left: 2, right: 5, target: 4 },
      explanation: "sum too small, move left++. left=2. sum = -1+2 = 1 < 4.",
      highlightedLine: 26
    },
    {
      array: sortedArray,
      highlights: [0, 3, 5],
      variables: { result: '[]', i: 0, left: 3, right: 5, target: 4 },
      explanation: "left=3. sum = 0+2 = 2 < 4. Move left++.",
      highlightedLine: 26
    },
    {
      array: sortedArray,
      highlights: [0, 4, 5],
      variables: { result: '[]', i: 0, left: 4, right: 5, target: 4 },
      explanation: "left=4. sum = 1+2 = 3 < 4. Move left++. Now left>=right, done with i=0.",
      highlightedLine: 26
    },
    {
      array: sortedArray,
      highlights: [1, 2, 5],
      variables: { result: '[]', i: 1, left: 2, right: 5, target: 1 },
      explanation: "i=1, nums[i]=-1, target=1. left=2, right=5. sum = -1+2 = 1. Found triplet!",
      highlightedLine: 16
    },
    {
      array: sortedArray,
      highlights: [1, 2, 5],
      variables: { result: '[[-1,-1,2]]', i: 1, left: 2, right: 5, target: 1 },
      explanation: "Add [-1,-1,2] to result. Skip duplicates, move both pointers.",
      highlightedLine: 17
    },
    {
      array: sortedArray,
      highlights: [1, 3, 4],
      variables: { result: '[[-1,-1,2]]', i: 1, left: 3, right: 4, target: 1 },
      explanation: "After skipping duplicates: left=3, right=4. sum = 0+1 = 1. Another triplet!",
      highlightedLine: 16
    },
    {
      array: sortedArray,
      highlights: [1, 3, 4],
      variables: { result: '[[-1,-1,2],[-1,0,1]]', i: 1, left: 3, right: 4, target: 1 },
      explanation: "Add [-1,0,1] to result. Move pointers. Now left>=right, done with i=1.",
      highlightedLine: 17
    },
    {
      array: sortedArray,
      highlights: [2],
      variables: { result: '[[-1,-1,2],[-1,0,1]]', i: 2, left: -1, right: -1, target: 1 },
      explanation: "i=2. nums[2]=-1 same as nums[1]. Skip duplicate (line 7).",
      highlightedLine: 7
    },
    {
      array: sortedArray,
      highlights: [3, 4, 5],
      variables: { result: '[[-1,-1,2],[-1,0,1]]', i: 3, left: 4, right: 5, target: 0 },
      explanation: "i=3, nums[i]=0, target=0. left=4, right=5. sum = 1+2 = 3 > 0. Move right--.",
      highlightedLine: 28
    },
    {
      array: sortedArray,
      highlights: [3, 4, 4],
      variables: { result: '[[-1,-1,2],[-1,0,1]]', i: 3, left: 4, right: 4, target: 0 },
      explanation: "right=4. Now left>=right, done with i=3. No more valid i values.",
      highlightedLine: 28
    },
    {
      array: sortedArray,
      highlights: [],
      variables: { result: '[[-1,-1,2],[-1,0,1]]', i: 3, left: -1, right: -1, target: 0 },
      explanation: "Complete! Found 2 triplets: [[-1,-1,2], [-1,0,1]]. Time: O(n²), Space: O(1).",
      highlightedLine: 33
    }
  ];

  const code = `function threeSum(nums: number[]): number[][] {
  nums.sort((a, b) => a - b);
  const result: number[][] = [];
  
  for (let i = 0; i < nums.length - 2; i++) {
    // Skip duplicates for first number
    if (i > 0 && nums[i] === nums[i - 1]) {
      continue;
    }
    
    let left = i + 1, right = nums.length - 1;
    const target = -nums[i];
    
    while (left < right) {
      const currentSum = nums[left] + nums[right];
      
      if (currentSum === target) {
        result.push([nums[i], nums[left], nums[right]]);
        
        // Skip duplicates for second and third numbers
        while (left < right && nums[left] === nums[left + 1]) left++;
        while (left < right && nums[right] === nums[right - 1]) right--;
        
        left++;
        right--;
      } else if (currentSum < target) {
        left++;
      } else {
        right--;
      }
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
              <div className="flex items-center justify-center gap-2 min-h-[200px] flex-wrap">
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
