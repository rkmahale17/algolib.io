import { useState } from 'react';
import { SimpleArrayVisualization } from '../shared/SimpleArrayVisualization';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { CodeHighlighter } from '../shared/CodeHighlighter';
import { VisualizationLayout } from '../shared/VisualizationLayout';

export const ContainsDuplicateVisualization = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const nums = [1, 2, 3, 1];
  
  const steps = [
    {
      array: nums,
      highlighting: [],
      variables: { seen: new Set(), current: null, index: -1 },
      explanation: "Initialize empty Set. We'll check each number to see if it's already in the set.",
      highlightedLine: 1
    },
    {
      array: nums,
      highlighting: [0],
      variables: { seen: new Set(), current: 1, index: 0 },
      explanation: "i=0: num=1. Check if 1 is in set. seen.has(1) is false.",
      highlightedLine: 4
    },
    {
      array: nums,
      highlighting: [0],
      variables: { seen: new Set([1]), current: 1, index: 0 },
      explanation: "Not a duplicate. Add 1 to set. Set is now {1}.",
      highlightedLine: 6
    },
    {
      array: nums,
      highlighting: [1],
      variables: { seen: new Set([1]), current: 2, index: 1 },
      explanation: "i=1: num=2. Check if 2 is in set. seen.has(2) is false.",
      highlightedLine: 4
    },
    {
      array: nums,
      highlighting: [1],
      variables: { seen: new Set([1, 2]), current: 2, index: 1 },
      explanation: "Not a duplicate. Add 2 to set. Set is now {1, 2}.",
      highlightedLine: 6
    },
    {
      array: nums,
      highlighting: [2],
      variables: { seen: new Set([1, 2]), current: 3, index: 2 },
      explanation: "i=2: num=3. Check if 3 is in set. seen.has(3) is false.",
      highlightedLine: 4
    },
    {
      array: nums,
      highlighting: [2],
      variables: { seen: new Set([1, 2, 3]), current: 3, index: 2 },
      explanation: "Not a duplicate. Add 3 to set. Set is now {1, 2, 3}.",
      highlightedLine: 6
    },
    {
      array: nums,
      highlighting: [3],
      variables: { seen: new Set([1, 2, 3]), current: 1, index: 3 },
      explanation: "i=3: num=1. Check if 1 is in set. seen.has(1) is TRUE!",
      highlightedLine: 4
    },
    {
      array: nums,
      highlighting: [0, 3],
      variables: { seen: new Set([1, 2, 3]), current: 1, index: 3 },
      explanation: "Duplicate found! 1 appears at indices 0 and 3. Return true. Time: O(n), Space: O(n).",
      highlightedLine: 5
    }
  ];

  const code = `function containsDuplicate(nums: number[]): boolean {
  // Use a Set to track seen numbers
  const seen = new Set<number>();
  
  for (const num of nums) {
    if (seen.has(num)) {
      return true;
    }
    seen.add(num);
  }
  
  return false;
}`;

  const leftContent = (
    <>
      <SimpleArrayVisualization
        array={steps[currentStep].array}
        highlights={steps[currentStep].highlighting}
        label="Array"
      />
      
      <div className="p-4 bg-primary/20 rounded-lg border border-primary/30">
        <p className="text-sm font-medium">{steps[currentStep].explanation}</p>
      </div>

      <VariablePanel variables={{
        ...steps[currentStep].variables,
        seen: `{${Array.from(steps[currentStep].variables.seen).join(', ')}}`
      }} />
    </>
  );

  const rightContent = (
    <>
      <div className="text-sm font-semibold text-muted-foreground mb-2">TypeScript</div>
      <CodeHighlighter 
        code={code} 
        language="typescript"
        highlightedLine={steps[currentStep].highlightedLine}
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
