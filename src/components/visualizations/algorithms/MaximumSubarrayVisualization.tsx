import { useState } from 'react';
import { motion } from 'framer-motion';
import { SimpleArrayVisualization } from '../shared/SimpleArrayVisualization';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { AnimatedCodeEditor } from '../shared/AnimatedCodeEditor';
import { VisualizationLayout } from '../shared/VisualizationLayout';

interface Step {
  array: number[];
  highlighting: number[];
  subarrayRange: number[];
  variables: Record<string, any>;
  explanation: string;
  highlightedLines: number[];
  lineExecution: string;
}

export const MaximumSubarrayVisualization = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const nums = [-2, 1, -3, 4, -1, 2, 1, -5, 4];
  
  const steps: Step[] = [
    {
      array: nums,
      highlighting: [],
      subarrayRange: [],
      variables: {},
      explanation: "🎬 Starting execution: Input array [-2, 1, -3, 4, -1, 2, 1, -5, 4]",
      highlightedLines: [1],
      lineExecution: "function maxSubArray(nums: number[])"
    },
    {
      array: nums,
      highlighting: [0],
      subarrayRange: [0],
      variables: { maxSum: -2, 'nums[0]': -2 },
      explanation: "📝 Initialize maxSum = nums[0] = -2",
      highlightedLines: [2],
      lineExecution: "let maxSum = nums[0];"
    },
    {
      array: nums,
      highlighting: [0],
      subarrayRange: [0],
      variables: { maxSum: -2, currentSum: -2, 'nums[0]': -2 },
      explanation: "📝 Initialize currentSum = nums[0] = -2 (tracks sum ending here)",
      highlightedLines: [3],
      lineExecution: "let currentSum = nums[0];"
    },
    {
      array: nums,
      highlighting: [0],
      subarrayRange: [0],
      variables: { maxSum: -2, currentSum: -2, i: 1 },
      explanation: "🔄 Loop: Start iteration with i = 1",
      highlightedLines: [5],
      lineExecution: "for (let i = 1; i < nums.length; i++)"
    },
    {
      array: nums,
      highlighting: [0, 1],
      subarrayRange: [1],
      variables: { maxSum: -2, currentSum: 1, i: 1, 'nums[1]': 1, 'comparison': 'max(1, -2+1) = max(1, -1)' },
      explanation: "🔢 i=1: currentSum = max(nums[1], currentSum + nums[1]) = max(1, -1) = 1. Start new subarray!",
      highlightedLines: [6],
      lineExecution: "currentSum = Math.max(nums[i], currentSum + nums[i]);"
    },
    {
      array: nums,
      highlighting: [0, 1],
      subarrayRange: [1],
      variables: { maxSum: 1, currentSum: 1, i: 1 },
      explanation: "✨ Update global max: maxSum = max(-2, 1) = 1",
      highlightedLines: [7],
      lineExecution: "maxSum = Math.max(maxSum, currentSum);"
    },
    {
      array: nums,
      highlighting: [1],
      subarrayRange: [1],
      variables: { maxSum: 1, currentSum: 1, i: 2 },
      explanation: "🔄 Loop: Continue with i = 2",
      highlightedLines: [5],
      lineExecution: "for (let i = 1; i < nums.length; i++)"
    },
    {
      array: nums,
      highlighting: [1, 2],
      subarrayRange: [1, 2],
      variables: { maxSum: 1, currentSum: -2, i: 2, 'nums[2]': -3, 'comparison': 'max(-3, 1+(-3)) = max(-3, -2)' },
      explanation: "🔢 i=2: currentSum = max(-3, 1-3) = max(-3, -2) = -2. Extend subarray",
      highlightedLines: [6],
      lineExecution: "currentSum = Math.max(nums[i], currentSum + nums[i]);"
    },
    {
      array: nums,
      highlighting: [1, 2],
      subarrayRange: [1, 2],
      variables: { maxSum: 1, currentSum: -2, i: 2 },
      explanation: "✨ Update global max: maxSum = max(1, -2) = 1 (stays 1)",
      highlightedLines: [7],
      lineExecution: "maxSum = Math.max(maxSum, currentSum);"
    },
    {
      array: nums,
      highlighting: [2],
      subarrayRange: [1, 2],
      variables: { maxSum: 1, currentSum: -2, i: 3 },
      explanation: "🔄 Loop: Continue with i = 3",
      highlightedLines: [5],
      lineExecution: "for (let i = 1; i < nums.length; i++)"
    },
    {
      array: nums,
      highlighting: [2, 3],
      subarrayRange: [3],
      variables: { maxSum: 1, currentSum: 4, i: 3, 'nums[3]': 4, 'comparison': 'max(4, -2+4) = max(4, 2)' },
      explanation: "🔢 i=3: currentSum = max(4, -2+4) = max(4, 2) = 4. Start new subarray!",
      highlightedLines: [6],
      lineExecution: "currentSum = Math.max(nums[i], currentSum + nums[i]);"
    },
    {
      array: nums,
      highlighting: [2, 3],
      subarrayRange: [3],
      variables: { maxSum: 4, currentSum: 4, i: 3 },
      explanation: "✨ Update global max: maxSum = max(1, 4) = 4 🎉",
      highlightedLines: [7],
      lineExecution: "maxSum = Math.max(maxSum, currentSum);"
    },
    {
      array: nums,
      highlighting: [3],
      subarrayRange: [3],
      variables: { maxSum: 4, currentSum: 4, i: 4 },
      explanation: "🔄 Loop: Continue with i = 4",
      highlightedLines: [5],
      lineExecution: "for (let i = 1; i < nums.length; i++)"
    },
    {
      array: nums,
      highlighting: [3, 4],
      subarrayRange: [3, 4],
      variables: { maxSum: 4, currentSum: 3, i: 4, 'nums[4]': -1, 'comparison': 'max(-1, 4+(-1)) = max(-1, 3)' },
      explanation: "🔢 i=4: currentSum = max(-1, 4-1) = max(-1, 3) = 3. Extend subarray",
      highlightedLines: [6],
      lineExecution: "currentSum = Math.max(nums[i], currentSum + nums[i]);"
    },
    {
      array: nums,
      highlighting: [3, 4],
      subarrayRange: [3, 4],
      variables: { maxSum: 4, currentSum: 3, i: 4 },
      explanation: "✨ Update global max: maxSum = max(4, 3) = 4 (stays 4)",
      highlightedLines: [7],
      lineExecution: "maxSum = Math.max(maxSum, currentSum);"
    },
    {
      array: nums,
      highlighting: [4],
      subarrayRange: [3, 4],
      variables: { maxSum: 4, currentSum: 3, i: 5 },
      explanation: "🔄 Loop: Continue with i = 5",
      highlightedLines: [5],
      lineExecution: "for (let i = 1; i < nums.length; i++)"
    },
    {
      array: nums,
      highlighting: [4, 5],
      subarrayRange: [3, 4, 5],
      variables: { maxSum: 4, currentSum: 5, i: 5, 'nums[5]': 2, 'comparison': 'max(2, 3+2) = max(2, 5)' },
      explanation: "🔢 i=5: currentSum = max(2, 3+2) = max(2, 5) = 5. Extend subarray",
      highlightedLines: [6],
      lineExecution: "currentSum = Math.max(nums[i], currentSum + nums[i]);"
    },
    {
      array: nums,
      highlighting: [4, 5],
      subarrayRange: [3, 4, 5],
      variables: { maxSum: 5, currentSum: 5, i: 5 },
      explanation: "✨ Update global max: maxSum = max(4, 5) = 5 🎉",
      highlightedLines: [7],
      lineExecution: "maxSum = Math.max(maxSum, currentSum);"
    },
    {
      array: nums,
      highlighting: [5],
      subarrayRange: [3, 4, 5],
      variables: { maxSum: 5, currentSum: 5, i: 6 },
      explanation: "🔄 Loop: Continue with i = 6",
      highlightedLines: [5],
      lineExecution: "for (let i = 1; i < nums.length; i++)"
    },
    {
      array: nums,
      highlighting: [5, 6],
      subarrayRange: [3, 4, 5, 6],
      variables: { maxSum: 5, currentSum: 6, i: 6, 'nums[6]': 1, 'comparison': 'max(1, 5+1) = max(1, 6)' },
      explanation: "🔢 i=6: currentSum = max(1, 5+1) = max(1, 6) = 6. Extend subarray",
      highlightedLines: [6],
      lineExecution: "currentSum = Math.max(nums[i], currentSum + nums[i]);"
    },
    {
      array: nums,
      highlighting: [5, 6],
      subarrayRange: [3, 4, 5, 6],
      variables: { maxSum: 6, currentSum: 6, i: 6 },
      explanation: "✨ Update global max: maxSum = max(5, 6) = 6 🎉 New best!",
      highlightedLines: [7],
      lineExecution: "maxSum = Math.max(maxSum, currentSum);"
    },
    {
      array: nums,
      highlighting: [6],
      subarrayRange: [3, 4, 5, 6],
      variables: { maxSum: 6, currentSum: 6, i: 7 },
      explanation: "🔄 Loop: Continue with i = 7",
      highlightedLines: [5],
      lineExecution: "for (let i = 1; i < nums.length; i++)"
    },
    {
      array: nums,
      highlighting: [6, 7],
      subarrayRange: [3, 4, 5, 6],
      variables: { maxSum: 6, currentSum: 1, i: 7, 'nums[7]': -5, 'comparison': 'max(-5, 6+(-5)) = max(-5, 1)' },
      explanation: "🔢 i=7: currentSum = max(-5, 6-5) = max(-5, 1) = 1. Extend but sum drops",
      highlightedLines: [6],
      lineExecution: "currentSum = Math.max(nums[i], currentSum + nums[i]);"
    },
    {
      array: nums,
      highlighting: [6, 7],
      subarrayRange: [3, 4, 5, 6],
      variables: { maxSum: 6, currentSum: 1, i: 7 },
      explanation: "✨ Update global max: maxSum = max(6, 1) = 6 (stays 6)",
      highlightedLines: [7],
      lineExecution: "maxSum = Math.max(maxSum, currentSum);"
    },
    {
      array: nums,
      highlighting: [7],
      subarrayRange: [3, 4, 5, 6],
      variables: { maxSum: 6, currentSum: 1, i: 8 },
      explanation: "🔄 Loop: Continue with i = 8 (last element)",
      highlightedLines: [5],
      lineExecution: "for (let i = 1; i < nums.length; i++)"
    },
    {
      array: nums,
      highlighting: [7, 8],
      subarrayRange: [3, 4, 5, 6],
      variables: { maxSum: 6, currentSum: 5, i: 8, 'nums[8]': 4, 'comparison': 'max(4, 1+4) = max(4, 5)' },
      explanation: "🔢 i=8: currentSum = max(4, 1+4) = max(4, 5) = 5. Extend subarray",
      highlightedLines: [6],
      lineExecution: "currentSum = Math.max(nums[i], currentSum + nums[i]);"
    },
    {
      array: nums,
      highlighting: [7, 8],
      subarrayRange: [3, 4, 5, 6],
      variables: { maxSum: 6, currentSum: 5, i: 8 },
      explanation: "✨ Update global max: maxSum = max(6, 5) = 6 (stays 6)",
      highlightedLines: [7],
      lineExecution: "maxSum = Math.max(maxSum, currentSum);"
    },
    {
      array: nums,
      highlighting: [],
      subarrayRange: [3, 4, 5, 6],
      variables: { maxSum: 6, currentSum: 5, i: 9 },
      explanation: "🔄 Loop: i = 9, condition (i < 9) is false, exit loop",
      highlightedLines: [5],
      lineExecution: "for (let i = 1; i < nums.length; i++)"
    },
    {
      array: nums,
      highlighting: [],
      subarrayRange: [3, 4, 5, 6],
      variables: { result: 6 },
      explanation: "🎉 Return result: maxSum = 6. Best subarray is [4,-1,2,1] with sum 6!",
      highlightedLines: [10],
      lineExecution: "return maxSum;"
    }
  ];

  const code = `function maxSubArray(nums: number[]): number {
  let maxSum = nums[0];
  let currentSum = nums[0];
  
  for (let i = 1; i < nums.length; i++) {
    currentSum = Math.max(nums[i], currentSum + nums[i]);
    maxSum = Math.max(maxSum, currentSum);
  }
  
  return maxSum;
}`;

  const leftContent = (
    <>
      <motion.div
        key={currentStep}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <SimpleArrayVisualization
          array={steps[currentStep].array}
          highlights={[...steps[currentStep].highlighting, ...steps[currentStep].subarrayRange]}
          label="Array (Best subarray highlighted with full color)"
        />
      </motion.div>
      
      <motion.div 
        key={`explanation-${currentStep}`}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="p-4 bg-primary/20 rounded-lg border border-primary/30"
      >
        <p className="text-sm font-medium">{steps[currentStep].explanation}</p>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="p-3 bg-muted/50 rounded-lg border"
      >
        <div className="text-xs font-mono text-muted-foreground">
          <span className="text-primary font-semibold">Line {steps[currentStep].highlightedLines[0]}:</span>{' '}
          {steps[currentStep].lineExecution}
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.25 }}
        className="p-3 bg-accent/50 rounded-lg border border-accent"
      >
        <p className="text-xs text-muted-foreground">
          💡 <strong>Kadane's Algorithm:</strong> At each position, decide whether to extend the current subarray or start fresh. Track the maximum sum seen so far.
        </p>
      </motion.div>

      <motion.div
        key={`variables-${currentStep}`}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, delay: 0.3 }}
      >
        <VariablePanel variables={steps[currentStep].variables} />
      </motion.div>
    </>
  );

  const rightContent = (
    <AnimatedCodeEditor
      code={code}
      language="TypeScript"
      highlightedLines={steps[currentStep].highlightedLines}
    />
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
