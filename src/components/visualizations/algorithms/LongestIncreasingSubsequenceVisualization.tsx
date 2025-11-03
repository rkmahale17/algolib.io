import { useState } from 'react';
import { SimpleArrayVisualization } from '../shared/SimpleArrayVisualization';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { CodeHighlighter } from '../shared/CodeHighlighter';

export const LongestIncreasingSubsequenceVisualization = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const nums = [10, 9, 2, 5, 3, 7, 101, 18];
  
  const steps = [
    {
      array: [1, 1, 1, 1, 1, 1, 1, 1],
      highlighting: [0],
      variables: { index: 0, current: 10, maxLength: 1 },
      explanation: "Initialize dp[i] = 1 for all positions. Each element is a subsequence of length 1"
    },
    {
      array: [1, 1, 1, 1, 1, 1, 1, 1],
      highlighting: [1],
      variables: { index: 1, current: 9, maxLength: 1 },
      explanation: "nums[1]=9: No previous smaller elements. dp[1]=1"
    },
    {
      array: [1, 1, 1, 1, 1, 1, 1, 1],
      highlighting: [2],
      variables: { index: 2, current: 2, maxLength: 1 },
      explanation: "nums[2]=2: No previous smaller elements. dp[2]=1"
    },
    {
      array: [1, 1, 1, 2, 1, 1, 1, 1],
      highlighting: [3],
      variables: { index: 3, current: 5, maxLength: 2 },
      explanation: "nums[3]=5: Can extend from 2. dp[3]=dp[2]+1=2. Sequence: [2,5]"
    },
    {
      array: [1, 1, 1, 2, 2, 1, 1, 1],
      highlighting: [4],
      variables: { index: 4, current: 3, maxLength: 2 },
      explanation: "nums[4]=3: Can extend from 2. dp[4]=dp[2]+1=2. Sequence: [2,3]"
    },
    {
      array: [1, 1, 1, 2, 2, 3, 1, 1],
      highlighting: [5],
      variables: { index: 5, current: 7, maxLength: 3 },
      explanation: "nums[5]=7: Can extend from [2,5] or [2,3]. dp[5]=3. Sequence: [2,3,7] or [2,5,7]"
    },
    {
      array: [1, 1, 1, 2, 2, 3, 4, 1],
      highlighting: [6],
      variables: { index: 6, current: 101, maxLength: 4 },
      explanation: "nums[6]=101: Can extend from [2,3,7]. dp[6]=4. Sequence: [2,3,7,101]"
    },
    {
      array: [1, 1, 1, 2, 2, 3, 4, 4],
      highlighting: [7],
      variables: { index: 7, current: 18, maxLength: 4 },
      explanation: "nums[7]=18: Can extend from [2,3,7]. dp[7]=4. Final answer: 4"
    }
  ];

  const code = `def lengthOfLIS(nums):
    n = len(nums)
    dp = [1] * n  # Each element is LIS of length 1
    
    for i in range(1, n):
        for j in range(i):
            if nums[j] < nums[i]:
                dp[i] = max(dp[i], dp[j] + 1)
    
    return max(dp)

# Optimized O(n log n) with binary search
def lengthOfLIS_optimized(nums):
    tails = []  # tails[i] = smallest tail of LIS of length i+1
    
    for num in nums:
        left, right = 0, len(tails)
        while left < right:
            mid = (left + right) // 2
            if tails[mid] < num:
                left = mid + 1
            else:
                right = mid
        
        if left == len(tails):
            tails.append(num)
        else:
            tails[left] = num
    
    return len(tails)`;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-primary/10 rounded-lg">
          <h3 className="font-semibold mb-2">Input Array</h3>
          <div className="font-mono">[{nums.join(', ')}]</div>
        </div>
        <div className="p-4 bg-secondary/10 rounded-lg">
          <h3 className="font-semibold mb-2">Current Element</h3>
          <div className="font-mono text-2xl">{nums[steps[currentStep].variables.index]}</div>
        </div>
      </div>

      <SimpleArrayVisualization
        array={steps[currentStep].array}
        highlights={steps[currentStep].highlighting}
        label="dp[] - Length of LIS ending at each index"
      />
      
      <VariablePanel variables={steps[currentStep].variables} />
      
      <div className="p-4 bg-muted rounded-lg">
        <p className="text-sm">{steps[currentStep].explanation}</p>
        <p className="text-xs text-muted-foreground mt-2">
          For each position, check all previous elements and extend the longest subsequence
        </p>
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
