import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { SimpleArrayVisualization } from '../shared/SimpleArrayVisualization';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { CodeHighlighter } from '../shared/CodeHighlighter';
import { VisualizationLayout } from '../shared/VisualizationLayout';

export const HouseRobberIIVisualization = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const nums = [2, 3, 2];
  
  const steps = [
    {
      array: nums,
      highlighting: [],
      case: 0,
      variables: {},
      explanation: "Houses=[2,3,2] in a circle. First and last are adjacent! Can't rob both. Split into 2 cases.",
      highlightedLine: 2
    },
    {
      array: nums,
      highlighting: [0, 1],
      case: 1,
      variables: { case: 'Case 1', range: '0 to n-2', houses: '[2,3]' },
      explanation: "Case 1: Rob houses 0 to n-2 (exclude last). Houses=[2,3]. Apply House Robber I.",
      highlightedLine: 11
    },
    {
      array: [2, 3],
      highlighting: [1],
      case: 1,
      variables: { prev2: 0, prev1: 2, current: 3, max: 3 },
      explanation: "Case 1 result: max(2+0, 0) then max(3+0, 2) = 3. Rob house 1 (value 3).",
      highlightedLine: 11
    },
    {
      array: nums,
      highlighting: [1, 2],
      case: 2,
      variables: { case: 'Case 2', range: '1 to n-1', houses: '[3,2]' },
      explanation: "Case 2: Rob houses 1 to n-1 (exclude first). Houses=[3,2]. Apply House Robber I.",
      highlightedLine: 12
    },
    {
      array: [3, 2],
      highlighting: [0],
      case: 2,
      variables: { prev2: 0, prev1: 3, current: 2, max: 3 },
      explanation: "Case 2 result: max(3+0, 0) then max(2+0, 3) = 3. Rob house 0 (value 3).",
      highlightedLine: 12
    },
    {
      array: nums,
      highlighting: [1],
      case: 0,
      variables: { case1: 3, case2: 3, result: 3 },
      explanation: "Final: max(Case 1, Case 2) = max(3, 3) = 3. Rob middle house. Time: O(n), Space: O(1).",
      highlightedLine: 13
    }
  ];

  const code = `function rob(nums: number[]): number {
  if (nums.length === 1) return nums[0];
  
  const robLinear = (start: number, end: number): number => {
    let prev2 = 0, prev1 = 0;
    for (let i = start; i <= end; i++) {
      const temp = Math.max(nums[i] + prev2, prev1);
      prev2 = prev1;
      prev1 = temp;
    }
    return prev1;
  };
  
  // Case 1: Rob houses 0 to n-2 (exclude last)
  // Case 2: Rob houses 1 to n-1 (exclude first)
  return Math.max(robLinear(0, nums.length - 2),
                  robLinear(1, nums.length - 1));
}`;

  const step = steps[currentStep];

  const leftContent = (
    <>
      <Card className="p-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-center">House Robber II (Circular)</h3>
          <div className="flex items-center justify-center">
            <div className="relative">
              <div className="flex gap-2">
                {step.array.map((num, i) => (
                  <div key={i} className={`w-12 h-12 rounded flex items-center justify-center font-bold ${
                    step.highlighting.includes(i) ? 'bg-primary text-primary-foreground' : 'bg-muted'
                  }`}>
                    {num}
                  </div>
                ))}
              </div>
              {step.case === 0 && (
                <div className="absolute -top-3 left-0 right-0 text-center text-xs text-muted-foreground">
                  ↻ Circular
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>

      <div className="p-4 bg-primary/20 rounded-lg border border-primary/30">
        <p className="text-sm font-medium">{step.explanation}</p>
      </div>

      <div className="p-4 bg-muted/50 rounded-lg border">
        <p className="text-xs text-muted-foreground">
          <strong>Key insight:</strong> Circular means first and last are neighbors. Solve twice: (1) without last, (2) without first.
        </p>
      </div>

      <VariablePanel variables={step.variables} />
    </>
  );

  const rightContent = (
    <>
      <div className="text-sm font-semibold text-muted-foreground mb-2">TypeScript</div>
      <CodeHighlighter 
        code={code} 
        language="typescript"
        highlightedLine={step.highlightedLine}
      />
    </>
  );

  const controls = (
    <SimpleStepControls
      currentStep={currentStep}
      totalSteps={steps.length}
      onStepChange={setCurrentStep}
    />
  );

  return (
    <VisualizationLayout
      leftContent={leftContent}
      rightContent={rightContent}
      controls={controls}
    />
  );
};
