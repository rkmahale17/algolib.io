import { useState } from 'react';
import { SimpleArrayVisualization } from '../shared/SimpleArrayVisualization';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { CodeHighlighter } from '../shared/CodeHighlighter';
import { VisualizationLayout } from '../shared/VisualizationLayout';

export const CountingBitsVisualization = () => {
  const [currentStep, setCurrentStep] = useState(0);
  
  const steps = [
    {
      array: [0],
      highlighting: [0],
      explanation: "dp[0] = 0 (binary: 0 has zero 1-bits)",
      highlightedLine: 2
    },
    {
      array: [0, 1],
      highlighting: [1],
      explanation: "dp[1] = dp[1>>1] + (1&1) = dp[0] + 1 = 1 (binary: 1 has one 1-bit)",
      highlightedLine: 7
    },
    {
      array: [0, 1, 1],
      highlighting: [2],
      explanation: "dp[2] = dp[2>>1] + (2&1) = dp[1] + 0 = 1 (binary: 10 has one 1-bit)",
      highlightedLine: 7
    },
    {
      array: [0, 1, 1, 2],
      highlighting: [3],
      explanation: "dp[3] = dp[3>>1] + (3&1) = dp[1] + 1 = 2 (binary: 11 has two 1-bits)",
      highlightedLine: 7
    },
    {
      array: [0, 1, 1, 2, 1],
      highlighting: [4],
      explanation: "dp[4] = dp[4>>1] + (4&1) = dp[2] + 0 = 1 (binary: 100 has one 1-bit)",
      highlightedLine: 7
    },
    {
      array: [0, 1, 1, 2, 1, 2],
      highlighting: [5],
      explanation: "dp[5] = dp[5>>1] + (5&1) = dp[2] + 1 = 2 (binary: 101 has two 1-bits)",
      highlightedLine: 9
    }
  ];

  const code = `function countBits(n: number): number[] {
  const result = new Array(n + 1).fill(0);
  
  for (let i = 1; i <= n; i++) {
    // Number of 1s in i = 
    // Number of 1s in (i>>1) + last bit of i
    result[i] = result[i >> 1] + (i & 1);
  }
  
  return result;
}`;

  const leftContent = (
    <>
      <SimpleArrayVisualization
        array={steps[currentStep].array}
        highlights={steps[currentStep].highlighting}
        label="dp[] - Count of 1-bits for each number"
      />
      
      <div className="p-4 bg-primary/20 rounded-lg border border-primary/30">
        <p className="text-sm font-medium">{steps[currentStep].explanation}</p>
      </div>

      <div className="p-4 bg-muted/50 rounded-lg border">
        <h3 className="font-semibold mb-2 text-sm">How it works:</h3>
        <div className="text-xs space-y-1 text-muted-foreground">
          <p>• i {'>'} {'>'} 1: divide by 2 (remove last bit)</p>
          <p>• i & 1: check if last bit is 1</p>
          <p>• Reuse previous results for O(n) time!</p>
        </div>
      </div>
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
