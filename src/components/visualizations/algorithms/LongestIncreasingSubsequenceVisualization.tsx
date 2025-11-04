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
      dpArray: [1, 1, 1, 1, 1, 1, 1, 1],
      numsArray: nums,
      highlighting: [],
      variables: { n: 8, maxLen: 1 },
      explanation: "Initialize: Create dp array of size n. Each element starts with 1 (every number is a subsequence of length 1)",
      highlightedLine: 0
    },
    {
      dpArray: [1, 1, 1, 1, 1, 1, 1, 1],
      numsArray: nums,
      highlighting: [0],
      variables: { i: 0, 'nums[i]': 10, 'dp[i]': 1 },
      explanation: "i=0: nums[0]=10. No previous elements, dp[0] stays 1",
      highlightedLine: 1
    },
    {
      dpArray: [1, 1, 1, 1, 1, 1, 1, 1],
      numsArray: nums,
      highlighting: [1],
      variables: { i: 1, 'nums[i]': 9, j: 0, 'nums[j]': 10 },
      explanation: "i=1: nums[1]=9. Check j=0: nums[0]=10 > 9, can't extend. dp[1] stays 1",
      highlightedLine: 2
    },
    {
      dpArray: [1, 1, 1, 1, 1, 1, 1, 1],
      numsArray: nums,
      highlighting: [2],
      variables: { i: 2, 'nums[i]': 2, j: '0,1', comparison: '10>2, 9>2' },
      explanation: "i=2: nums[2]=2. Check all j<2: all previous nums > 2, can't extend. dp[2] stays 1",
      highlightedLine: 2
    },
    {
      dpArray: [1, 1, 1, 2, 1, 1, 1, 1],
      numsArray: nums,
      highlighting: [3],
      variables: { i: 3, 'nums[i]': 5, j: 2, 'nums[j]': 2, 'dp[j]': 1 },
      explanation: "i=3: nums[3]=5. Check j=2: nums[2]=2 < 5 ✓. Can extend! dp[3] = dp[2] + 1 = 2",
      highlightedLine: 3
    },
    {
      dpArray: [1, 1, 1, 2, 2, 1, 1, 1],
      numsArray: nums,
      highlighting: [4],
      variables: { i: 4, 'nums[i]': 3, j: 2, 'nums[j]': 2, 'dp[j]': 1 },
      explanation: "i=4: nums[4]=3. Check j=2: nums[2]=2 < 3 ✓. dp[4] = dp[2] + 1 = 2",
      highlightedLine: 3
    },
    {
      dpArray: [1, 1, 1, 2, 2, 3, 1, 1],
      numsArray: nums,
      highlighting: [5],
      variables: { i: 5, 'nums[i]': 7, j: 3, 'nums[j]': 5, 'dp[j]': 2 },
      explanation: "i=5: nums[5]=7. Best: j=3, nums[3]=5 < 7. dp[5] = max(dp[2]+1, dp[3]+1, dp[4]+1) = 3",
      highlightedLine: 3
    },
    {
      dpArray: [1, 1, 1, 2, 2, 3, 4, 1],
      numsArray: nums,
      highlighting: [6],
      variables: { i: 6, 'nums[i]': 101, j: 5, 'nums[j]': 7, 'dp[j]': 3 },
      explanation: "i=6: nums[6]=101. Best: j=5, nums[5]=7 < 101. dp[6] = dp[5] + 1 = 4",
      highlightedLine: 3
    },
    {
      dpArray: [1, 1, 1, 2, 2, 3, 4, 4],
      numsArray: nums,
      highlighting: [7],
      variables: { i: 7, 'nums[i]': 18, j: 5, 'nums[j]': 7, 'dp[j]': 3 },
      explanation: "i=7: nums[7]=18. Best: j=5, nums[5]=7 < 18. dp[7] = dp[5] + 1 = 4",
      highlightedLine: 3
    },
    {
      dpArray: [1, 1, 1, 2, 2, 3, 4, 4],
      numsArray: nums,
      highlighting: [6],
      variables: { maxLen: 4, sequence: '[2,5,7,101] or [2,3,7,18]' },
      explanation: "Complete! Max length = 4. Example sequence: [2, 5, 7, 101] or [2, 3, 7, 18]",
      highlightedLine: 4
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

  const step = steps[currentStep];

  const leftContent = (
    <>
      <div className="space-y-2">
        <div className="text-xs font-semibold text-center mb-2">Input Array (nums)</div>
        <SimpleArrayVisualization
          array={step.numsArray}
          highlights={step.highlighting}
          label=""
        />
      </div>

      <div className="space-y-2">
        <div className="text-xs font-semibold text-center mb-2">DP Array (length of LIS ending at each index)</div>
        <SimpleArrayVisualization
          array={step.dpArray}
          highlights={step.highlighting}
          label=""
        />
      </div>
      
      <div className="p-4 bg-primary/20 rounded-lg border border-primary/30">
        <p className="text-sm font-medium">{step.explanation}</p>
      </div>

      <div className="p-4 bg-muted/50 rounded-lg border">
        <h3 className="font-semibold mb-2 text-sm">Algorithm:</h3>
        <div className="text-xs space-y-1 text-muted-foreground">
          <p>• dp[i] = length of LIS ending at index i</p>
          <p>• For each i, check all j {'<'} i</p>
          <p>• If nums[j] {'<'} nums[i], we can extend: dp[i] = max(dp[i], dp[j] + 1)</p>
          <p>• Time: O(n²), Space: O(n)</p>
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