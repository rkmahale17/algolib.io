import { useState } from 'react';
import { SimpleArrayVisualization } from '../shared/SimpleArrayVisualization';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { CodeHighlighter } from '../shared/CodeHighlighter';
import { VisualizationLayout } from '../shared/VisualizationLayout';

export const MissingNumberVisualization = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const nums = [3, 0, 1];
  
  const steps = [
    {
      array: nums,
      highlighting: [],
      variables: { result: 3, operation: 'Start with n' },
      explanation: "XOR approach: Initialize result = n (array length) = 3",
      highlightedLine: 2
    },
    {
      array: nums,
      highlighting: [0],
      variables: { result: '3 ^ 0 ^ 3 = 0', operation: 'XOR index 0 and value 3' },
      explanation: "result ^= 0 (index) ^= 3 (value). 3 ^ 0 ^ 3 = 0",
      highlightedLine: 5
    },
    {
      array: nums,
      highlighting: [1],
      variables: { result: '0 ^ 1 ^ 0 = 1', operation: 'XOR index 1 and value 0' },
      explanation: "result ^= 1 (index) ^= 0 (value). 0 ^ 1 ^ 0 = 1",
      highlightedLine: 5
    },
    {
      array: nums,
      highlighting: [2],
      variables: { result: '1 ^ 2 ^ 1 = 2', operation: 'XOR index 2 and value 1' },
      explanation: "result ^= 2 (index) ^= 1 (value). 1 ^ 2 ^ 1 = 2. Missing number is 2!",
      highlightedLine: 8
    }
  ];

  const code = `function missingNumber(nums: number[]): number {
  let result = nums.length;
  
  for (let i = 0; i < nums.length; i++) {
    result ^= i ^ nums[i];
  }
  
  return result;
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

      <div className="p-4 bg-muted/50 rounded-lg border">
        <h3 className="font-semibold mb-2 text-sm">XOR Properties:</h3>
        <div className="text-xs space-y-1 text-muted-foreground">
          <p>• a ^ a = 0</p>
          <p>• a ^ 0 = a</p>
          <p>• All numbers except missing one will cancel out!</p>
        </div>
      </div>

      <VariablePanel variables={steps[currentStep].variables} />
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
