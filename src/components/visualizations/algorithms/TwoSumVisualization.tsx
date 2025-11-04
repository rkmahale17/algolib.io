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

export const TwoSumVisualization = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const array = [2, 7, 11, 15];
  const target = 9;

  const steps: Step[] = [
    {
      array,
      highlights: [],
      variables: { target, map: {}, i: -1, complement: null, result: null },
      explanation: "Initialize: We have an array and target=9. We'll use a hash map to store numbers we've seen.",
      highlightedLine: 0
    },
    {
      array,
      highlights: [0],
      variables: { target, map: {}, i: 0, complement: 7, result: null },
      explanation: "At index 0: num=2, complement=9-2=7. Check if 7 exists in map. It doesn't.",
      highlightedLine: 3
    },
    {
      array,
      highlights: [0],
      variables: { target, map: { 2: 0 }, i: 0, complement: 7, result: null },
      explanation: "Store map[2]=0 (value 2 at index 0). Continue to next element.",
      highlightedLine: 6
    },
    {
      array,
      highlights: [1],
      variables: { target, map: { 2: 0 }, i: 1, complement: 2, result: null },
      explanation: "At index 1: num=7, complement=9-7=2. Check if 2 exists in map.",
      highlightedLine: 3
    },
    {
      array,
      highlights: [0, 1],
      variables: { target, map: { 2: 0 }, i: 1, complement: 2, result: null },
      explanation: "Found! 2 exists in map at index 0. We found our pair: indices [0, 1].",
      highlightedLine: 4
    },
    {
      array,
      highlights: [0, 1],
      variables: { target, map: { 2: 0, 7: 1 }, i: 1, complement: 2, result: [0, 1] },
      explanation: "Return [0, 1]. Time: O(n), Space: O(n) using hash map.",
      highlightedLine: 5
    }
  ];

  const code = `function twoSum(nums: number[], target: number): number[] {
  const map = new Map<number, number>();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement)!, i];
    }
    map.set(nums[i], i);
  }
  return [];
}`;

  const step = steps[currentStep];

  return (
    <VisualizationLayout
      leftContent={
        <>
          <Card className="p-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-center">Two Sum - Hash Map Approach</h3>
              <div className="text-sm text-center text-muted-foreground">
                Target: {target}
              </div>
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
