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
  
  const steps = [
    {
      array: nums,
      highlighting: [0],
      variables: { currentMax: 2, currentMin: 2, maxProduct: 2, i: 0 },
      explanation: "Step 1: Initialize with first element. maxProduct=2, currentMax=2, currentMin=2. We track both max and min because negative numbers can flip products.",
      highlightedLines: [3, 4, 5]
    },
    {
      array: nums,
      highlighting: [0, 1],
      variables: { currentMax: 6, currentMin: 3, maxProduct: 6, i: 1, num: 3, tempMax: 2 },
      explanation: "Step 2: Process nums[1]=3. Calculate new max and min by comparing: num alone (3), num*prevMax (3*2=6), num*prevMin (3*2=6). New currentMax=6, currentMin=3. Update maxProduct=6.",
      highlightedLines: [8, 11, 14, 15, 18]
    },
    {
      array: nums,
      highlighting: [0, 1, 2],
      variables: { currentMax: -2, currentMin: -12, maxProduct: 6, i: 2, num: -2, tempMax: 6 },
      explanation: "Step 3: Process nums[2]=-2 (negative!). Compare: -2 alone, -2*6=-12, -2*3=-6. New currentMax=-2, currentMin=-12. Negative flipped the values! maxProduct stays 6.",
      highlightedLines: [8, 11, 14, 15, 18]
    },
    {
      array: nums,
      highlighting: [0, 1, 2, 3],
      variables: { currentMax: 4, currentMin: -48, maxProduct: 6, i: 3, num: 4, tempMax: -2 },
      explanation: "Step 4: Process nums[3]=4. Compare: 4 alone, 4*(-2)=-8, 4*(-12)=-48. New currentMax=4, currentMin=-48. maxProduct remains 6.",
      highlightedLines: [8, 11, 14, 15, 18]
    },
    {
      array: nums,
      highlighting: [0, 1],
      variables: { currentMax: 4, currentMin: -48, maxProduct: 6, i: 3 },
      explanation: "Complete! Maximum product subarray is [2,3] with product=6. The negative value at index 2 broke the positive sequence. Time: O(n), Space: O(1).",
      highlightedLines: [21]
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
        className="p-4 bg-muted/50 rounded-lg border"
      >
        <p className="text-xs text-muted-foreground">
          💡 Key insight: Track both max and min products because multiplying by a negative number flips the sign, turning the smallest product into the largest!
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
