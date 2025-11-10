import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { AnimatedCodeEditor } from '../shared/AnimatedCodeEditor';
import { VisualizationLayout } from '../shared/VisualizationLayout';
import { motion } from 'framer-motion';

interface Step {
  dpArray: number[];
  numsArray: number[];
  highlighting: number[];
  variables: Record<string, any>;
  explanation: string;
  highlightedLines: number[];
  lineExecution: string;
}

export const LongestIncreasingSubsequenceVisualization = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const nums = [10, 9, 2, 5, 3, 7, 101, 18];
  
  const steps: Step[] = [
    {
      dpArray: [],
      numsArray: nums,
      highlighting: [],
      variables: { n: 8, nums: '[10,9,2,5,3,7,101,18]' },
      explanation: "Starting with nums = [10,9,2,5,3,7,101,18]. Find longest increasing subsequence.",
      highlightedLines: [1],
      lineExecution: "function lengthOfLIS(nums: number[]): number {"
    },
    {
      dpArray: [],
      numsArray: nums,
      highlighting: [],
      variables: { n: 8, nums: '[10,9,2,5,3,7,101,18]' },
      explanation: "Get array length: n = nums.length = 8.",
      highlightedLines: [2],
      lineExecution: "const n = nums.length = 8"
    },
    {
      dpArray: [1, 1, 1, 1, 1, 1, 1, 1],
      numsArray: nums,
      highlighting: [],
      variables: { n: 8 },
      explanation: "Initialize dp array: all values = 1 (each number is a subsequence of length 1).",
      highlightedLines: [3],
      lineExecution: "const dp = new Array(n).fill(1);"
    },
    {
      dpArray: [1, 1, 1, 1, 1, 1, 1, 1],
      numsArray: nums,
      highlighting: [0],
      variables: { i: 1, 'nums[0]': 10 },
      explanation: "Start outer loop: i = 1. Check: 1 < 8? Yes. Will compare with previous elements.",
      highlightedLines: [4],
      lineExecution: "for (let i = 1; i < n; i++)"
    },
    {
      dpArray: [1, 1, 1, 1, 1, 1, 1, 1],
      numsArray: nums,
      highlighting: [1, 0],
      variables: { i: 1, j: 0, 'nums[1]': 9, 'nums[0]': 10 },
      explanation: "i=1, j=0: Compare nums[0]=10 with nums[1]=9. 10 > 9, can't extend.",
      highlightedLines: [5, 6],
      lineExecution: "if (nums[j] < nums[i]) -> false"
    },
    {
      dpArray: [1, 1, 1, 1, 1, 1, 1, 1],
      numsArray: nums,
      highlighting: [2],
      variables: { i: 2, 'nums[2]': 2 },
      explanation: "i=2: Check all j<2. nums[0]=10 > 2, nums[1]=9 > 2. Can't extend. dp[2] stays 1.",
      highlightedLines: [4],
      lineExecution: "for (let i = 2; i < n; i++)"
    },
    {
      dpArray: [1, 1, 1, 1, 1, 1, 1, 1],
      numsArray: nums,
      highlighting: [3, 2],
      variables: { i: 3, j: 2, 'nums[3]': 5, 'nums[2]': 2 },
      explanation: "i=3, j=2: Compare nums[2]=2 with nums[3]=5. 2 < 5! Can extend.",
      highlightedLines: [6],
      lineExecution: "if (nums[j] < nums[i]) -> true"
    },
    {
      dpArray: [1, 1, 1, 2, 1, 1, 1, 1],
      numsArray: nums,
      highlighting: [3],
      variables: { i: 3, 'dp[3]': 2 },
      explanation: "dp[3] = max(1, dp[2] + 1) = max(1, 2) = 2. Subsequence: [2,5].",
      highlightedLines: [7],
      lineExecution: "dp[3] = 2"
    },
    {
      dpArray: [1, 1, 1, 2, 2, 1, 1, 1],
      numsArray: nums,
      highlighting: [4],
      variables: { i: 4, 'nums[4]': 3, 'dp[4]': 2 },
      explanation: "i=4: nums[4]=3. Can extend from nums[2]=2. dp[4] = 2. Subsequence: [2,3].",
      highlightedLines: [7],
      lineExecution: "dp[4] = 2"
    },
    {
      dpArray: [1, 1, 1, 2, 2, 1, 1, 1],
      numsArray: nums,
      highlighting: [5, 3],
      variables: { i: 5, j: 3, 'nums[5]': 7, 'nums[3]': 5 },
      explanation: "i=5, j=3: nums[3]=5 < nums[5]=7. Can extend!",
      highlightedLines: [6],
      lineExecution: "if (nums[j] < nums[i]) -> true"
    },
    {
      dpArray: [1, 1, 1, 2, 2, 3, 1, 1],
      numsArray: nums,
      highlighting: [5],
      variables: { i: 5, 'dp[5]': 3 },
      explanation: "dp[5] = max(1, dp[3] + 1) = 3. Best so far: [2,5,7].",
      highlightedLines: [7],
      lineExecution: "dp[5] = 3"
    },
    {
      dpArray: [1, 1, 1, 2, 2, 3, 1, 1],
      numsArray: nums,
      highlighting: [6, 5],
      variables: { i: 6, j: 5, 'nums[6]': 101, 'nums[5]': 7 },
      explanation: "i=6: nums[6]=101. Can extend from nums[5]=7.",
      highlightedLines: [6],
      lineExecution: "if (nums[j] < nums[i]) -> true"
    },
    {
      dpArray: [1, 1, 1, 2, 2, 3, 4, 1],
      numsArray: nums,
      highlighting: [6],
      variables: { i: 6, 'dp[6]': 4 },
      explanation: "dp[6] = dp[5] + 1 = 4. Longest so far: [2,5,7,101].",
      highlightedLines: [7],
      lineExecution: "dp[6] = 4"
    },
    {
      dpArray: [1, 1, 1, 2, 2, 3, 4, 1],
      numsArray: nums,
      highlighting: [7, 5],
      variables: { i: 7, j: 5, 'nums[7]': 18, 'nums[5]': 7 },
      explanation: "i=7: nums[7]=18. Can extend from nums[5]=7.",
      highlightedLines: [6],
      lineExecution: "if (nums[j] < nums[i]) -> true"
    },
    {
      dpArray: [1, 1, 1, 2, 2, 3, 4, 4],
      numsArray: nums,
      highlighting: [7],
      variables: { i: 7, 'dp[7]': 4 },
      explanation: "dp[7] = dp[5] + 1 = 4. Alternative: [2,5,7,18].",
      highlightedLines: [7],
      lineExecution: "dp[7] = 4"
    },
    {
      dpArray: [1, 1, 1, 2, 2, 3, 4, 4],
      numsArray: nums,
      highlighting: [],
      variables: { i: 8, n: 8 },
      explanation: "Check loop condition: i (8) < n (8)? No, exit loop.",
      highlightedLines: [4],
      lineExecution: "for (let i = 8; i < n; i++) -> false"
    },
    {
      dpArray: [1, 1, 1, 2, 2, 3, 4, 4],
      numsArray: nums,
      highlighting: [6, 7],
      variables: { maxLen: 4 },
      explanation: "Return max value in dp array: Math.max(...dp) = 4.",
      highlightedLines: [10],
      lineExecution: "return Math.max(...dp) = 4"
    },
    {
      dpArray: [1, 1, 1, 2, 2, 3, 4, 4],
      numsArray: nums,
      highlighting: [6, 7],
      variables: { maxLen: 4, examples: '[2,5,7,101] or [2,5,7,18]' },
      explanation: "Algorithm complete! Longest increasing subsequence has length 4. Time: O(n²), Space: O(n).",
      highlightedLines: [10],
      lineExecution: "Result: 4"
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

  return (
    <VisualizationLayout
      leftContent={
        <>
          <motion.div
            key={`nums-${currentStep}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="p-6">
              <div className="text-xs font-semibold text-center mb-2">Input Array (nums)</div>
              <div className="flex items-center gap-2 justify-center">
                {step.numsArray.map((value, index) => (
                  <motion.div
                    key={index}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex flex-col items-center gap-1"
                  >
                    <div
                      className={`w-12 h-12 rounded flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                        step.highlighting.includes(index)
                          ? 'bg-primary text-primary-foreground scale-110'
                          : 'bg-muted text-foreground'
                      }`}
                    >
                      {value}
                    </div>
                    <span className="text-xs text-muted-foreground">{index}</span>
                  </motion.div>
                ))}
              </div>
            </Card>
          </motion.div>

          {step.dpArray.length > 0 && (
            <motion.div
              key={`dp-${currentStep}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card className="p-6">
                <div className="text-xs font-semibold text-center mb-2">DP Array (LIS length ending at index)</div>
                <div className="flex items-center gap-2 justify-center">
                  {step.dpArray.map((value, index) => (
                    <motion.div
                      key={index}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex flex-col items-center gap-1"
                    >
                      <div
                        className={`w-12 h-12 rounded flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                          step.highlighting.includes(index)
                            ? 'bg-secondary text-secondary-foreground scale-110'
                            : 'bg-muted text-foreground'
                        }`}
                      >
                        {value}
                      </div>
                      <span className="text-xs text-muted-foreground">{index}</span>
                    </motion.div>
                  ))}
                </div>
              </Card>
            </motion.div>
          )}
          
          <motion.div
            key={`execution-${currentStep}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <Card className="p-4 bg-muted/50">
              <div className="space-y-2">
                <div className="text-sm font-semibold text-primary">Current Execution:</div>
                <div className="text-sm font-mono bg-background/50 p-2 rounded">
                  {step.lineExecution}
                </div>
                <div className="text-sm text-muted-foreground pt-2">
                  {step.explanation}
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            key={`algo-${currentStep}`}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <Card className="p-4 bg-muted/50">
              <h3 className="font-semibold mb-2 text-sm">Algorithm:</h3>
              <div className="text-xs space-y-1 text-muted-foreground">
                <p>• dp[i] = length of LIS ending at index i</p>
                <p>• For each i, check all j {'<'} i</p>
                <p>• If nums[j] {'<'} nums[i]: dp[i] = max(dp[i], dp[j] + 1)</p>
              </div>
            </Card>
          </motion.div>

          <motion.div
            key={`variables-${currentStep}`}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.4 }}
          >
            <VariablePanel variables={step.variables} />
          </motion.div>
        </>
      }
      rightContent={
        <AnimatedCodeEditor
          code={code}
          language="typescript"
          highlightedLines={step.highlightedLines}
        />
      }
      controls={
        <SimpleStepControls
          currentStep={currentStep}
          totalSteps={steps.length}
          onStepChange={setCurrentStep}
        />
      }
    />
  );
};