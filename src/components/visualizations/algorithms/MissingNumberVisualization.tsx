import { useState } from 'react';
import { ArrayVisualization } from '../ArrayVisualization';
import { StepControls } from '../shared/StepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { CodeHighlighter } from '../shared/CodeHighlighter';

export const MissingNumberVisualization = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const nums = [3, 0, 1];
  
  const steps = [
    {
      array: nums,
      highlighting: [],
      variables: { result: 3, operation: 'Start with n' },
      explanation: "XOR approach: Start with result = n (length of array) = 3"
    },
    {
      array: nums,
      highlighting: [0],
      variables: { result: '3 ^ 0 ^ 3 = 0', operation: 'XOR index 0 and value 3' },
      explanation: "result ^= 0 (index) ^= 3 (value). 3 ^ 0 ^ 3 = 0"
    },
    {
      array: nums,
      highlighting: [1],
      variables: { result: '0 ^ 1 ^ 0 = 1', operation: 'XOR index 1 and value 0' },
      explanation: "result ^= 1 (index) ^= 0 (value). 0 ^ 1 ^ 0 = 1"
    },
    {
      array: nums,
      highlighting: [2],
      variables: { result: '1 ^ 2 ^ 1 = 2', operation: 'XOR index 2 and value 1' },
      explanation: "result ^= 2 (index) ^= 1 (value). 1 ^ 2 ^ 1 = 2. Missing number is 2!"
    }
  ];

  const code = `def missingNumber(nums):
    result = len(nums)
    
    for i in range(len(nums)):
        result ^= i ^ nums[i]
    
    return result

# Alternative: Math formula
def missingNumber_sum(nums):
    n = len(nums)
    expected_sum = n * (n + 1) // 2
    actual_sum = sum(nums)
    return expected_sum - actual_sum`;

  return (
    <div className="space-y-6">
      <ArrayVisualization
        array={steps[currentStep].array}
        highlights={steps[currentStep].highlighting}
        label="Array"
      />
      
      <VariablePanel variables={steps[currentStep].variables} />
      
      <div className="p-4 bg-muted rounded-lg">
        <p className="text-sm">{steps[currentStep].explanation}</p>
        <div className="mt-2 text-xs text-muted-foreground">
          <p>XOR properties: a ^ a = 0, a ^ 0 = a</p>
          <p>All numbers except missing one will cancel out!</p>
        </div>
      </div>

      <CodeHighlighter code={code} language="python" />
      
      <StepControls
        currentStep={currentStep}
        totalSteps={steps.length}
        onStepChange={setCurrentStep}
      />
    </div>
  );
};