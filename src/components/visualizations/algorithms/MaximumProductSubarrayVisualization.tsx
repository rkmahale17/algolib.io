import { useState } from 'react';
import { motion } from 'framer-motion';
import { SimpleArrayVisualization } from '../shared/SimpleArrayVisualization';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { AnimatedCodeEditor } from '../shared/AnimatedCodeEditor';
import { VisualizationLayout } from '../shared/VisualizationLayout';

export const MaximumProductSubarrayVisualization = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const nums = [2, 3, -2, 4];
  
  // Line-by-line execution steps - like a real debugger
  const steps = [
    {
      array: nums,
      highlighting: [],
      variables: {},
      explanation: "🎬 Starting execution: Input array [2, 3, -2, 4]",
      highlightedLines: [1],
      lineExecution: "function maxProduct(nums: number[])"
    },
    {
      array: nums,
      highlighting: [],
      variables: { 'nums.length': 4 },
      explanation: "✅ Check if array is empty: nums.length = 4 (not empty, continue)",
      highlightedLines: [2],
      lineExecution: "if (nums.length === 0) return 0;"
    },
    {
      array: nums,
      highlighting: [0],
      variables: { maxProduct: 2, 'nums[0]': 2 },
      explanation: "📝 Initialize maxProduct = nums[0] = 2",
      highlightedLines: [4],
      lineExecution: "let maxProduct = nums[0];"
    },
    {
      array: nums,
      highlighting: [0],
      variables: { maxProduct: 2, currentMax: 2, 'nums[0]': 2 },
      explanation: "📝 Initialize currentMax = nums[0] = 2 (tracks max product ending here)",
      highlightedLines: [5],
      lineExecution: "let currentMax = nums[0];"
    },
    {
      array: nums,
      highlighting: [0],
      variables: { maxProduct: 2, currentMax: 2, currentMin: 2, 'nums[0]': 2 },
      explanation: "📝 Initialize currentMin = nums[0] = 2 (tracks min product ending here)",
      highlightedLines: [6],
      lineExecution: "let currentMin = nums[0];"
    },
    // Loop iteration 1: i=1, num=3
    {
      array: nums,
      highlighting: [0],
      variables: { maxProduct: 2, currentMax: 2, currentMin: 2, i: 1 },
      explanation: "🔄 Loop: Start iteration with i = 1",
      highlightedLines: [8],
      lineExecution: "for (let i = 1; i < nums.length; i++)"
    },
    {
      array: nums,
      highlighting: [0, 1],
      variables: { maxProduct: 2, currentMax: 2, currentMin: 2, i: 1, num: 3, 'nums[1]': 3 },
      explanation: "📥 Get current number: num = nums[1] = 3",
      highlightedLines: [9],
      lineExecution: "const num = nums[i];"
    },
    {
      array: nums,
      highlighting: [0, 1],
      variables: { maxProduct: 2, currentMax: 2, currentMin: 2, i: 1, num: 3, tempMax: 2 },
      explanation: "💾 Save currentMax before updating: tempMax = 2",
      highlightedLines: [11],
      lineExecution: "const tempMax = currentMax;"
    },
    {
      array: nums,
      highlighting: [0, 1],
      variables: { maxProduct: 2, currentMax: 6, currentMin: 2, i: 1, num: 3, tempMax: 2 },
      explanation: "🔢 Calculate currentMax = max(3, 3×2, 3×2) = max(3, 6, 6) = 6",
      highlightedLines: [13],
      lineExecution: "currentMax = Math.max(num, num * currentMax, num * currentMin);"
    },
    {
      array: nums,
      highlighting: [0, 1],
      variables: { maxProduct: 2, currentMax: 6, currentMin: 3, i: 1, num: 3, tempMax: 2 },
      explanation: "🔢 Calculate currentMin = min(3, 3×2, 3×2) = min(3, 6, 6) = 3",
      highlightedLines: [14],
      lineExecution: "currentMin = Math.min(num, num * tempMax, num * currentMin);"
    },
    {
      array: nums,
      highlighting: [0, 1],
      variables: { maxProduct: 6, currentMax: 6, currentMin: 3, i: 1, num: 3 },
      explanation: "✨ Update global max: maxProduct = max(2, 6) = 6",
      highlightedLines: [16],
      lineExecution: "maxProduct = Math.max(maxProduct, currentMax);"
    },
    // Loop iteration 2: i=2, num=-2
    {
      array: nums,
      highlighting: [0, 1],
      variables: { maxProduct: 6, currentMax: 6, currentMin: 3, i: 2 },
      explanation: "🔄 Loop: Continue with i = 2",
      highlightedLines: [8],
      lineExecution: "for (let i = 1; i < nums.length; i++)"
    },
    {
      array: nums,
      highlighting: [0, 1, 2],
      variables: { maxProduct: 6, currentMax: 6, currentMin: 3, i: 2, num: -2, 'nums[2]': -2 },
      explanation: "📥 Get current number: num = nums[2] = -2 ⚠️ NEGATIVE!",
      highlightedLines: [9],
      lineExecution: "const num = nums[i];"
    },
    {
      array: nums,
      highlighting: [0, 1, 2],
      variables: { maxProduct: 6, currentMax: 6, currentMin: 3, i: 2, num: -2, tempMax: 6 },
      explanation: "💾 Save currentMax before updating: tempMax = 6",
      highlightedLines: [11],
      lineExecution: "const tempMax = currentMax;"
    },
    {
      array: nums,
      highlighting: [0, 1, 2],
      variables: { maxProduct: 6, currentMax: -2, currentMin: 3, i: 2, num: -2, tempMax: 6 },
      explanation: "🔢 Calculate currentMax = max(-2, -2×6, -2×3) = max(-2, -12, -6) = -2",
      highlightedLines: [13],
      lineExecution: "currentMax = Math.max(num, num * currentMax, num * currentMin);"
    },
    {
      array: nums,
      highlighting: [0, 1, 2],
      variables: { maxProduct: 6, currentMax: -2, currentMin: -12, i: 2, num: -2, tempMax: 6 },
      explanation: "🔢 Calculate currentMin = min(-2, -2×6, -2×3) = min(-2, -12, -6) = -12 (negative flipped it!)",
      highlightedLines: [14],
      lineExecution: "currentMin = Math.min(num, num * tempMax, num * currentMin);"
    },
    {
      array: nums,
      highlighting: [0, 1, 2],
      variables: { maxProduct: 6, currentMax: -2, currentMin: -12, i: 2, num: -2 },
      explanation: "✨ Update global max: maxProduct = max(6, -2) = 6 (stays 6)",
      highlightedLines: [16],
      lineExecution: "maxProduct = Math.max(maxProduct, currentMax);"
    },
    // Loop iteration 3: i=3, num=4
    {
      array: nums,
      highlighting: [0, 1, 2],
      variables: { maxProduct: 6, currentMax: -2, currentMin: -12, i: 3 },
      explanation: "🔄 Loop: Continue with i = 3",
      highlightedLines: [8],
      lineExecution: "for (let i = 1; i < nums.length; i++)"
    },
    {
      array: nums,
      highlighting: [0, 1, 2, 3],
      variables: { maxProduct: 6, currentMax: -2, currentMin: -12, i: 3, num: 4, 'nums[3]': 4 },
      explanation: "📥 Get current number: num = nums[3] = 4",
      highlightedLines: [9],
      lineExecution: "const num = nums[i];"
    },
    {
      array: nums,
      highlighting: [0, 1, 2, 3],
      variables: { maxProduct: 6, currentMax: -2, currentMin: -12, i: 3, num: 4, tempMax: -2 },
      explanation: "💾 Save currentMax before updating: tempMax = -2",
      highlightedLines: [11],
      lineExecution: "const tempMax = currentMax;"
    },
    {
      array: nums,
      highlighting: [0, 1, 2, 3],
      variables: { maxProduct: 6, currentMax: 4, currentMin: -12, i: 3, num: 4, tempMax: -2 },
      explanation: "🔢 Calculate currentMax = max(4, 4×(-2), 4×(-12)) = max(4, -8, -48) = 4",
      highlightedLines: [13],
      lineExecution: "currentMax = Math.max(num, num * currentMax, num * currentMin);"
    },
    {
      array: nums,
      highlighting: [0, 1, 2, 3],
      variables: { maxProduct: 6, currentMax: 4, currentMin: -48, i: 3, num: 4, tempMax: -2 },
      explanation: "🔢 Calculate currentMin = min(4, 4×(-2), 4×(-12)) = min(4, -8, -48) = -48",
      highlightedLines: [14],
      lineExecution: "currentMin = Math.min(num, num * tempMax, num * currentMin);"
    },
    {
      array: nums,
      highlighting: [0, 1, 2, 3],
      variables: { maxProduct: 6, currentMax: 4, currentMin: -48, i: 3, num: 4 },
      explanation: "✨ Update global max: maxProduct = max(6, 4) = 6 (stays 6)",
      highlightedLines: [16],
      lineExecution: "maxProduct = Math.max(maxProduct, currentMax);"
    },
    // Loop end
    {
      array: nums,
      highlighting: [0, 1],
      variables: { maxProduct: 6, currentMax: 4, currentMin: -48, i: 4 },
      explanation: "🔄 Loop: i = 4, condition (i < 4) is false, exit loop",
      highlightedLines: [8],
      lineExecution: "for (let i = 1; i < nums.length; i++)"
    },
    {
      array: nums,
      highlighting: [0, 1],
      variables: { result: 6 },
      explanation: "🎉 Return result: maxProduct = 6. Best subarray is [2,3] with product 6!",
      highlightedLines: [19],
      lineExecution: "return maxProduct;"
    }
  ];

  const code = `function maxProduct(nums: number[]): number {
  if (nums.length === 0) return 0;
  
  let maxProduct = nums[0];
  let currentMax = nums[0];
  let currentMin = nums[0];
  
  for (let i = 1; i < nums.length; i++) {
    const num = nums[i];
    
    const tempMax = currentMax;
    
    currentMax = Math.max(num, num * currentMax, num * currentMin);
    currentMin = Math.min(num, num * tempMax, num * currentMin);
    
    maxProduct = Math.max(maxProduct, currentMax);
  }
  
  return maxProduct;
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
          highlights={steps[currentStep].highlighting}
          label="Array"
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
          💡 <strong>Key Insight:</strong> Tracking both max and min is crucial! A negative number can flip the smallest product into the largest.
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
