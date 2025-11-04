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
      variables: { result: 3, resultBinary: '11', operation: 'Initialize' },
      explanation: "XOR approach: result = n (array length) = 3. Array: [3, 0, 1], range should be [0,1,2,3]",
      highlightedLine: 0
    },
    {
      array: nums,
      highlighting: [],
      variables: { result: 3, i: 0, 'nums[0]': 3 },
      explanation: "Start loop: i = 0. Will XOR with index 0 and value nums[0] = 3",
      highlightedLine: 1
    },
    {
      array: nums,
      highlighting: [0],
      variables: { result: 3, i: 0, operation: 'result ^= 0' },
      explanation: "Step 1: result ^= i → 3 ^ 0 = 3 (XOR with index)",
      highlightedLine: 2,
      calc: '11 ^ 00 = 11'
    },
    {
      array: nums,
      highlighting: [0],
      variables: { result: 0, i: 0, operation: 'result ^= nums[0]', resultBinary: '00' },
      explanation: "Step 2: result ^= nums[0] → 3 ^ 3 = 0 (XOR with value). 3 cancels out!",
      highlightedLine: 2,
      calc: '11 ^ 11 = 00'
    },
    {
      array: nums,
      highlighting: [],
      variables: { result: 0, i: 1, 'nums[1]': 0 },
      explanation: "Loop: i = 1. Will XOR with index 1 and value nums[1] = 0",
      highlightedLine: 1
    },
    {
      array: nums,
      highlighting: [1],
      variables: { result: 1, i: 1, operation: 'result ^= 1', resultBinary: '01' },
      explanation: "Step 1: result ^= i → 0 ^ 1 = 1 (XOR with index)",
      highlightedLine: 2,
      calc: '00 ^ 01 = 01'
    },
    {
      array: nums,
      highlighting: [1],
      variables: { result: 1, i: 1, operation: 'result ^= nums[1]', resultBinary: '01' },
      explanation: "Step 2: result ^= nums[1] → 1 ^ 0 = 1 (XOR with value). 0 cancels out!",
      highlightedLine: 2,
      calc: '01 ^ 00 = 01'
    },
    {
      array: nums,
      highlighting: [],
      variables: { result: 1, i: 2, 'nums[2]': 1 },
      explanation: "Loop: i = 2. Will XOR with index 2 and value nums[2] = 1",
      highlightedLine: 1
    },
    {
      array: nums,
      highlighting: [2],
      variables: { result: 3, i: 2, operation: 'result ^= 2', resultBinary: '11' },
      explanation: "Step 1: result ^= i → 1 ^ 2 = 3 (XOR with index)",
      highlightedLine: 2,
      calc: '01 ^ 10 = 11'
    },
    {
      array: nums,
      highlighting: [2],
      variables: { result: 2, i: 2, operation: 'result ^= nums[2]', resultBinary: '10' },
      explanation: "Step 2: result ^= nums[2] → 3 ^ 1 = 2 (XOR with value). 1 cancels out!",
      highlightedLine: 2,
      calc: '11 ^ 01 = 10'
    },
    {
      array: nums,
      highlighting: [],
      variables: { result: 2, answer: 2 },
      explanation: "Exit loop. Return result = 2. The missing number is 2! All others cancelled via XOR.",
      highlightedLine: 3,
      calc: 'Result: 10 (binary) = 2 (decimal)'
    }
  ];

  const code = `function missingNumber(nums: number[]): number {
  let result = nums.length;
  for (let i = 0; i < nums.length; i++) {
    result ^= i ^ nums[i];
  }
  return result;
}`;

  const step = steps[currentStep];

  const leftContent = (
    <>
      <SimpleArrayVisualization
        array={step.array}
        highlights={step.highlighting}
        label="Input Array"
      />

      {step.calc && (
        <div className="p-4 bg-accent/10 rounded-lg border border-accent/20">
          <h3 className="font-semibold mb-2 text-sm">Binary Calculation</h3>
          <p className="font-mono text-center text-lg">{step.calc}</p>
        </div>
      )}
      
      <div className="p-4 bg-primary/20 rounded-lg border border-primary/30">
        <p className="text-sm font-medium">{step.explanation}</p>
      </div>

      <div className="p-4 bg-muted/50 rounded-lg border">
        <h3 className="font-semibold mb-2 text-sm">XOR Properties:</h3>
        <div className="text-xs space-y-1 text-muted-foreground">
          <p>• a ^ a = 0 (any number XOR itself = 0)</p>
          <p>• a ^ 0 = a (any number XOR 0 = itself)</p>
          <p>• XOR is commutative: order doesn't matter</p>
          <p>• We XOR all indices [0,1,2,3] with all values [3,0,1]</p>
          <p>• Duplicates cancel out, leaving only the missing number!</p>
        </div>
      </div>

      <VariablePanel variables={step.variables} />
    </>
  );

  const rightContent = (
    <>
      <CodeHighlighter 
        code={code} 
        language="TypeScript"
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