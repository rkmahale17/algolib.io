import { useState } from 'react';
import { SimpleArrayVisualization } from '../shared/SimpleArrayVisualization';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { CodeHighlighter } from '../shared/CodeHighlighter';
import { VisualizationLayout } from '../shared/VisualizationLayout';

export const CountingBitsVisualization = () => {
  const [currentStep, setCurrentStep] = useState(0);
  
  const steps = [
    {
      array: [0],
      highlighting: [0],
      variables: { n: 5, i: 0, binary: '0' },
      explanation: "Initialize: Create array of size n+1 = 6. dp[0] = 0 (zero has no 1-bits)",
      highlightedLine: 0
    },
    {
      array: [0, 0],
      highlighting: [],
      variables: { n: 5, i: 1, binary: '1' },
      explanation: "Start loop: i = 1. Will calculate dp[1]",
      highlightedLine: 1
    },
    {
      array: [0, 0],
      highlighting: [0],
      variables: { n: 5, i: 1, binary: '1', 'i>>1': 0, 'i&1': 1 },
      explanation: "i=1: i>>1 = 0, i&1 = 1. dp[1] = dp[0] + 1",
      highlightedLine: 2
    },
    {
      array: [0, 1],
      highlighting: [1],
      variables: { n: 5, i: 1, binary: '1', result: 1 },
      explanation: "dp[1] = 1 (binary '1' has one 1-bit)",
      highlightedLine: 2
    },
    {
      array: [0, 1, 0],
      highlighting: [],
      variables: { n: 5, i: 2, binary: '10' },
      explanation: "Loop: i = 2. Will calculate dp[2]",
      highlightedLine: 1
    },
    {
      array: [0, 1, 0],
      highlighting: [1],
      variables: { n: 5, i: 2, binary: '10', 'i>>1': 1, 'i&1': 0 },
      explanation: "i=2: i>>1 = 1 (binary 1), i&1 = 0. dp[2] = dp[1] + 0",
      highlightedLine: 2
    },
    {
      array: [0, 1, 1],
      highlighting: [2],
      variables: { n: 5, i: 2, binary: '10', result: 1 },
      explanation: "dp[2] = 1 (binary '10' has one 1-bit)",
      highlightedLine: 2
    },
    {
      array: [0, 1, 1, 0],
      highlighting: [],
      variables: { n: 5, i: 3, binary: '11' },
      explanation: "Loop: i = 3. Will calculate dp[3]",
      highlightedLine: 1
    },
    {
      array: [0, 1, 1, 0],
      highlighting: [1],
      variables: { n: 5, i: 3, binary: '11', 'i>>1': 1, 'i&1': 1 },
      explanation: "i=3: i>>1 = 1 (binary 1), i&1 = 1. dp[3] = dp[1] + 1",
      highlightedLine: 2
    },
    {
      array: [0, 1, 1, 2],
      highlighting: [3],
      variables: { n: 5, i: 3, binary: '11', result: 2 },
      explanation: "dp[3] = 2 (binary '11' has two 1-bits)",
      highlightedLine: 2
    },
    {
      array: [0, 1, 1, 2, 0],
      highlighting: [],
      variables: { n: 5, i: 4, binary: '100' },
      explanation: "Loop: i = 4. Will calculate dp[4]",
      highlightedLine: 1
    },
    {
      array: [0, 1, 1, 2, 0],
      highlighting: [2],
      variables: { n: 5, i: 4, binary: '100', 'i>>1': 2, 'i&1': 0 },
      explanation: "i=4: i>>1 = 2 (binary 10), i&1 = 0. dp[4] = dp[2] + 0",
      highlightedLine: 2
    },
    {
      array: [0, 1, 1, 2, 1],
      highlighting: [4],
      variables: { n: 5, i: 4, binary: '100', result: 1 },
      explanation: "dp[4] = 1 (binary '100' has one 1-bit)",
      highlightedLine: 2
    },
    {
      array: [0, 1, 1, 2, 1, 0],
      highlighting: [],
      variables: { n: 5, i: 5, binary: '101' },
      explanation: "Loop: i = 5. Will calculate dp[5]",
      highlightedLine: 1
    },
    {
      array: [0, 1, 1, 2, 1, 0],
      highlighting: [2],
      variables: { n: 5, i: 5, binary: '101', 'i>>1': 2, 'i&1': 1 },
      explanation: "i=5: i>>1 = 2 (binary 10), i&1 = 1. dp[5] = dp[2] + 1",
      highlightedLine: 2
    },
    {
      array: [0, 1, 1, 2, 1, 2],
      highlighting: [5],
      variables: { n: 5, i: 5, binary: '101', result: 2 },
      explanation: "dp[5] = 2 (binary '101' has two 1-bits)",
      highlightedLine: 2
    },
    {
      array: [0, 1, 1, 2, 1, 2],
      highlighting: [],
      variables: { n: 5, result: '[0,1,1,2,1,2]' },
      explanation: "Complete! Return result array. Time: O(n), Space: O(n)",
      highlightedLine: 3
    }
  ];

  const code = `function countBits(n: number): number[] {
  const result = new Array(n + 1).fill(0);
  for (let i = 1; i <= n; i++) {
    result[i] = result[i >> 1] + (i & 1);
  }
  return result;
}`;

  const step = steps[currentStep];

  const leftContent = (
    <>
      <SimpleArrayVisualization
        array={step.array}
        highlights={step.highlighting}
        label="dp[] - Count of 1-bits for each number"
      />
      
      <div className="p-4 bg-primary/20 rounded-lg border border-primary/30">
        <p className="text-sm font-medium">{step.explanation}</p>
      </div>

      <div className="p-4 bg-muted/50 rounded-lg border">
        <h3 className="font-semibold mb-2 text-sm">Pattern Explanation:</h3>
        <div className="text-xs space-y-1 text-muted-foreground">
          <p>• <code>i {'>'} {'>'} 1</code>: Divides by 2 (removes last bit)</p>
          <p>• <code>i & 1</code>: Checks if last bit is 1</p>
          <p>• <code>dp[i] = dp[i{'>'}{'>'}1] + (i&1)</code>: Reuse previous result!</p>
          <p>• Example: 5 (101) = 2 (10) shifted with 1 added = dp[2] + 1 = 1 + 1 = 2</p>
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