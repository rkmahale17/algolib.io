import { useState } from 'react';
import { SimpleArrayVisualization } from '../shared/SimpleArrayVisualization';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { CodeHighlighter } from '../shared/CodeHighlighter';

export const ContainsDuplicateVisualization = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const nums = [1, 2, 3, 1];
  
  const steps = [
    {
      array: nums,
      highlighting: [0],
      variables: { seen: new Set(), current: 1, index: 0, found: false },
      explanation: "Check element 1. Not in set yet. Add to set: {1}"
    },
    {
      array: nums,
      highlighting: [1],
      variables: { seen: new Set([1]), current: 2, index: 1, found: false },
      explanation: "Check element 2. Not in set. Add to set: {1, 2}"
    },
    {
      array: nums,
      highlighting: [2],
      variables: { seen: new Set([1, 2]), current: 3, index: 2, found: false },
      explanation: "Check element 3. Not in set. Add to set: {1, 2, 3}"
    },
    {
      array: nums,
      highlighting: [3],
      variables: { seen: new Set([1, 2, 3]), current: 1, index: 3, found: true },
      explanation: "Check element 1. Already in set! Duplicate found. Return true"
    }
  ];

  const code = `def containsDuplicate(nums):
    seen = set()
    
    for num in nums:
        if num in seen:
            return True
        seen.add(num)
    
    return False`;

  return (
    <div className="space-y-6">
      <SimpleArrayVisualization
        array={steps[currentStep].array}
        highlights={steps[currentStep].highlighting}
        label="Array"
      />
      
      <VariablePanel variables={{
        ...steps[currentStep].variables,
        seen: `{${Array.from(steps[currentStep].variables.seen).join(', ')}}`
      }} />
      
      <div className="p-4 bg-muted rounded-lg">
        <p className="text-sm">{steps[currentStep].explanation}</p>
      </div>

      <CodeHighlighter code={code} language="python" />
      
      <SimpleStepControls
        currentStep={currentStep}
        totalSteps={steps.length}
        onStepChange={setCurrentStep}
      />
    </div>
  );
};