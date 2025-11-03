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
      highlighting: [0],
      variables: { seen: new Set(), current: 1, index: 0, found: false },
      explanation: "Check element 1. Not in set yet. Add to set: {1}",
      highlightedLine: 4
    },
    {
      array: nums,
      highlighting: [1],
      variables: { seen: new Set([1]), current: 2, index: 1, found: false },
      explanation: "Check element 2. Not in set. Add to set: {1, 2}",
      highlightedLine: 6
    },
    {
      array: nums,
      highlighting: [2],
      variables: { seen: new Set([1, 2]), current: 3, index: 2, found: false },
      explanation: "Check element 3. Not in set. Add to set: {1, 2, 3}",
      highlightedLine: 6
    },
    {
      array: nums,
      highlighting: [3],
      variables: { seen: new Set([1, 2, 3]), current: 1, index: 3, found: true },
      explanation: "Check element 1. Already in set! Duplicate found. Return true",
      highlightedLine: 5
    }
  ];

  const code = `function containsDuplicate(nums: number[]): boolean {
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
