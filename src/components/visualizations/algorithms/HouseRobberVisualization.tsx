import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { AnimatedCodeEditor } from '../shared/AnimatedCodeEditor';
import { VisualizationLayout } from '../shared/VisualizationLayout';
import { motion } from 'framer-motion';

interface Step {
  nums: number[];
  dp: number[];
  i: number;
  variables: Record<string, any>;
  explanation: string;
  highlightedLines: number[];
  lineExecution: string;
}

export const HouseRobberVisualization = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const nums = [2, 7, 9, 3, 1];

  const steps: Step[] = [
    {
      nums,
      dp: [],
      i: -1,
      variables: { nums: '[2,7,9,3,1]' },
      explanation: "Given houses with money [2,7,9,3,1]. Cannot rob adjacent houses. Find maximum money.",
      highlightedLines: [1],
      lineExecution: "function rob(nums: number[]): number"
    },
    {
      nums,
      dp: [],
      i: -1,
      variables: { length: 5 },
      explanation: "Check edge case: nums.length > 0, continue.",
      highlightedLines: [2],
      lineExecution: "if (nums.length === 0) return 0; // false, continue"
    },
    {
      nums,
      dp: [],
      i: -1,
      variables: { length: 5 },
      explanation: "Check edge case: nums.length > 1, continue with full algorithm.",
      highlightedLines: [3],
      lineExecution: "if (nums.length === 1) return nums[0]; // false, continue"
    },
    {
      nums,
      dp: [0, 0, 0, 0, 0],
      i: -1,
      variables: { dpLength: 5 },
      explanation: "Create DP array of length 5. dp[i] = max money robbing houses 0..i.",
      highlightedLines: [5],
      lineExecution: "const dp = new Array(nums.length); // length = 5"
    },
    {
      nums,
      dp: [2, 0, 0, 0, 0],
      i: 0,
      variables: { 'dp[0]': 2, 'nums[0]': 2 },
      explanation: "Base case: dp[0] = nums[0] = 2. Rob first house.",
      highlightedLines: [6],
      lineExecution: "dp[0] = nums[0]; // dp[0] = 2"
    },
    {
      nums,
      dp: [2, 7, 0, 0, 0],
      i: 1,
      variables: { 'dp[1]': 7, max: 'max(2,7)=7' },
      explanation: "Base case: dp[1] = max(nums[0], nums[1]) = max(2, 7) = 7. Rob house 1.",
      highlightedLines: [7],
      lineExecution: "dp[1] = Math.max(nums[0], nums[1]); // max(2,7) = 7"
    },
    {
      nums,
      dp: [2, 7, 0, 0, 0],
      i: 2,
      variables: { i: 2, n: 5 },
      explanation: "Start loop: i = 2. Check: 2 < 5? Yes, continue.",
      highlightedLines: [9],
      lineExecution: "for (let i = 2; i < nums.length; i++) // i=2"
    },
    {
      nums,
      dp: [2, 7, 11, 0, 0],
      i: 2,
      variables: { 'dp[2]': 11, calc: 'max(7, 9+2)=11' },
      explanation: "dp[2] = max(dp[1], nums[2] + dp[0]) = max(7, 9+2) = 11. Rob houses 0 and 2.",
      highlightedLines: [10],
      lineExecution: "dp[i] = Math.max(dp[i-1], nums[i] + dp[i-2]); // max(7, 11) = 11"
    },
    {
      nums,
      dp: [2, 7, 11, 0, 0],
      i: 3,
      variables: { i: 3 },
      explanation: "Increment loop: i = 3. Check: 3 < 5? Yes, continue.",
      highlightedLines: [9],
      lineExecution: "for (let i = 3; i < nums.length; i++) // i=3"
    },
    {
      nums,
      dp: [2, 7, 11, 11, 0],
      i: 3,
      variables: { 'dp[3]': 11, calc: 'max(11, 3+7)=11' },
      explanation: "dp[3] = max(dp[2], nums[3] + dp[1]) = max(11, 3+7) = 11. Skip house 3.",
      highlightedLines: [10],
      lineExecution: "dp[i] = Math.max(dp[i-1], nums[i] + dp[i-2]); // max(11, 10) = 11"
    },
    {
      nums,
      dp: [2, 7, 11, 11, 0],
      i: 4,
      variables: { i: 4 },
      explanation: "Increment loop: i = 4. Check: 4 < 5? Yes, continue.",
      highlightedLines: [9],
      lineExecution: "for (let i = 4; i < nums.length; i++) // i=4"
    },
    {
      nums,
      dp: [2, 7, 11, 11, 12],
      i: 4,
      variables: { 'dp[4]': 12, calc: 'max(11, 1+11)=12' },
      explanation: "dp[4] = max(dp[3], nums[4] + dp[2]) = max(11, 1+11) = 12. Rob houses 0, 2, and 4.",
      highlightedLines: [10],
      lineExecution: "dp[i] = Math.max(dp[i-1], nums[i] + dp[i-2]); // max(11, 12) = 12"
    },
    {
      nums,
      dp: [2, 7, 11, 11, 12],
      i: 5,
      variables: { i: 5, n: 5 },
      explanation: "Increment loop: i = 5. Check: 5 < 5? No, exit loop.",
      highlightedLines: [9],
      lineExecution: "for (let i = 5; i < nums.length; i++) // 5 < 5 -> false"
    },
    {
      nums,
      dp: [2, 7, 11, 11, 12],
      i: 4,
      variables: { result: 12 },
      explanation: "Return dp[n-1] = dp[4] = 12. Maximum money is $12.",
      highlightedLines: [13],
      lineExecution: "return dp[nums.length - 1]; // dp[4] = 12"
    },
    {
      nums,
      dp: [2, 7, 11, 11, 12],
      i: 4,
      variables: { maxMoney: 12, houses: '[0,2,4]', complexity: 'O(n)' },
      explanation: "Algorithm complete! Rob houses [0,2,4] for maximum $12. Time: O(n), Space: O(n).",
      highlightedLines: [13],
      lineExecution: "Result: 12 (rob houses 0, 2, 4)"
    }
  ];

  const code = `function rob(nums: number[]): number {
  if (nums.length === 0) return 0;
  if (nums.length === 1) return nums[0];
  
  const dp = new Array(nums.length);
  dp[0] = nums[0];
  dp[1] = Math.max(nums[0], nums[1]);
  
  for (let i = 2; i < nums.length; i++) {
    dp[i] = Math.max(dp[i-1], nums[i] + dp[i-2]);
  }
  
  return dp[nums.length - 1];
}`;

  const step = steps[currentStep];

  return (
    <VisualizationLayout
      leftContent={
        <>
          <motion.div
            key={`houses-${currentStep}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="p-4">
              <h3 className="text-sm font-semibold mb-3">Houses (money in each)</h3>
              <div className="flex gap-2 flex-wrap">
                {step.nums.map((num, idx) => (
                  <div
                    key={idx}
                    className={`px-4 py-3 rounded font-mono text-center ${
                      idx === step.i
                        ? 'bg-primary text-primary-foreground ring-2 ring-primary'
                        : idx < step.i
                        ? 'bg-secondary'
                        : 'bg-muted'
                    }`}
                  >
                    <div className="text-xs">House {idx}</div>
                    <div className="font-bold">${num}</div>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>

          {step.dp.length > 0 && (
            <motion.div
              key={`dp-${currentStep}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card className="p-4">
                <h3 className="text-sm font-semibold mb-3">DP Array (max money up to house i)</h3>
                <div className="flex gap-2 flex-wrap">
                  {step.dp.map((val, idx) => (
                    <div
                      key={idx}
                      className={`px-4 py-3 rounded font-mono text-center ${
                        idx === step.i
                          ? 'bg-green-500/20 ring-2 ring-green-500'
                          : idx < step.i
                          ? 'bg-green-500/10'
                          : 'bg-muted'
                      }`}
                    >
                      <div className="text-xs">dp[{idx}]</div>
                      <div className="font-bold">${val}</div>
                    </div>
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
            key={`variables-${currentStep}`}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.3 }}
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
