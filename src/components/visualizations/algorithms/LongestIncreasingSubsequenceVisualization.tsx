import { useState } from 'react';
import { SimpleArrayVisualization } from '../shared/SimpleArrayVisualization';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { CodeHighlighter } from '../shared/CodeHighlighter';
import { VisualizationLayout } from '../shared/VisualizationLayout';

export const LongestIncreasingSubsequenceVisualization = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const nums = [10, 9, 2, 5, 3, 7, 101, 18];
  
  const steps = [
    {
      array: [1, 1, 1, 1, 1, 1, 1, 1],
      highlighting: [0],
      variables: { index: 0, current: 10, maxLength: 1 },
      explanation: "Initialize dp[i] = 1 for all positions",
      highlightedLine: 2
    },
    {
      array: [1, 1, 1, 2, 1, 1, 1, 1],
      highlighting: [3],
      variables: { index: 3, current: 5, maxLength: 2 },
      explanation: "nums[3]=5: Can extend from 2. dp[3]=2",
      highlightedLine: 7
    },
    {
      array: [1, 1, 1, 2, 2, 3, 1, 1],
      highlighting: [5],
      variables: { index: 5, current: 7, maxLength: 3 },
      explanation: "nums[5]=7: Can extend from [2,5] or [2,3]. dp[5]=3",
      highlightedLine: 7
    },
    {
      array: [1, 1, 1, 2, 2, 3, 4, 4],
      highlighting: [7],
      variables: { index: 7, current: 18, maxLength: 4 },
      explanation: "Final answer: 4",
      highlightedLine: 10
    }
  ];

  const code = `function lengthOfLIS(nums: number[]): number {
  const n = nums.length;
  const dp = new Array(n).fill(1);
  
  for (let i = 1; i < n; i++) {
    for (let j = 0; j < i; j++) {
      if (nums[j] < nums[i]) {
        dp[i] = Math.max(dp[i], dp[j] + 1);
      }
    }
  }
  
  return Math.max(...dp);
}`;

  const leftContent = (
    <>
      <SimpleArrayVisualization
        array={steps[currentStep].array}
        highlights={steps[currentStep].highlighting}
        label="dp[] - Length of LIS ending at each index"
      />
      
      <div className="p-4 bg-primary/20 rounded-lg border border-primary/30">
        <p className="text-sm font-medium">{steps[currentStep].explanation}</p>
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
