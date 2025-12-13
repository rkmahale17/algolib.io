import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { VisualizationLayout } from '../shared/VisualizationLayout';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { AnimatedCodeEditor } from '../shared/AnimatedCodeEditor';
import { motion } from 'framer-motion';

interface Step {
  array: number[];
  highlights: number[];
  variables: Record<string, any>;
  explanation: string;
  highlightedLines: number[];
  lineExecution: string;
}

export const FindMinimumInRotatedSortedArrayVisualization = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const array = [4, 5, 6, 7, 0, 1, 2];

  const steps: Step[] = [
    {
      array,
      highlights: [],
      variables: { left: '?', right: '?', mid: '?' },
      explanation: "Starting with rotated sorted array [4,5,6,7,0,1,2]. Goal: Find minimum in O(log n) time.",
      highlightedLines: [1],
      lineExecution: "function findMin(nums: number[]): number {"
    },
    {
      array,
      highlights: [],
      variables: { left: '?', right: '?', mid: '?' },
      explanation: "Declaring left pointer to track search start boundary.",
      highlightedLines: [2],
      lineExecution: "let left = 0, right = nums.length - 1;"
    },
    {
      array,
      highlights: [0],
      variables: { left: 0, right: '?', mid: '?' },
      explanation: "left initialized to 0 (first index).",
      highlightedLines: [2],
      lineExecution: "let left = 0"
    },
    {
      array,
      highlights: [0, 6],
      variables: { left: 0, right: 6, mid: '?' },
      explanation: "right initialized to 6 (last index). Search space: [0...6].",
      highlightedLines: [2],
      lineExecution: "right = nums.length - 1 = 6"
    },
    {
      array,
      highlights: [0, 6],
      variables: { left: 0, right: 6, mid: '?' },
      explanation: "Check loop condition: left (0) < right (6)? Yes, continue.",
      highlightedLines: [4],
      lineExecution: "while (left < right)"
    },
    {
      array,
      highlights: [0, 6],
      variables: { left: 0, right: 6, mid: '?' },
      explanation: "Calculate mid index: (0 + 6) / 2 = 3.",
      highlightedLines: [5],
      lineExecution: "const mid = Math.floor((left + right) / 2)"
    },
    {
      array,
      highlights: [0, 3, 6],
      variables: { left: 0, right: 6, mid: 3 },
      explanation: "mid = 3. Now compare nums[mid]=7 with nums[right]=2.",
      highlightedLines: [5],
      lineExecution: "mid = 3"
    },
    {
      array,
      highlights: [3, 6],
      variables: { left: 0, right: 6, mid: 3 },
      explanation: "Check: nums[mid] (7) > nums[right] (2)? Yes!",
      highlightedLines: [7],
      lineExecution: "if (nums[mid] > nums[right])"
    },
    {
      array,
      highlights: [3, 6],
      variables: { left: 0, right: 6, mid: 3 },
      explanation: "Since 7 > 2, minimum must be in RIGHT half. Move left pointer.",
      highlightedLines: [8],
      lineExecution: "left = mid + 1"
    },
    {
      array,
      highlights: [4, 6],
      variables: { left: 4, right: 6, mid: 3 },
      explanation: "left updated to 4. Search space narrowed: [4...6].",
      highlightedLines: [8],
      lineExecution: "left = 4"
    },
    {
      array,
      highlights: [4, 6],
      variables: { left: 4, right: 6, mid: 3 },
      explanation: "Check loop condition: left (4) < right (6)? Yes, continue.",
      highlightedLines: [4],
      lineExecution: "while (left < right)"
    },
    {
      array,
      highlights: [4, 6],
      variables: { left: 4, right: 6, mid: 3 },
      explanation: "Calculate new mid: (4 + 6) / 2 = 5.",
      highlightedLines: [5],
      lineExecution: "const mid = Math.floor((left + right) / 2)"
    },
    {
      array,
      highlights: [4, 5, 6],
      variables: { left: 4, right: 6, mid: 5 },
      explanation: "mid = 5. Compare nums[mid]=1 with nums[right]=2.",
      highlightedLines: [5],
      lineExecution: "mid = 5"
    },
    {
      array,
      highlights: [5, 6],
      variables: { left: 4, right: 6, mid: 5 },
      explanation: "Check: nums[mid] (1) > nums[right] (2)? No, 1 < 2.",
      highlightedLines: [7],
      lineExecution: "if (nums[mid] > nums[right]) -> false"
    },
    {
      array,
      highlights: [5, 6],
      variables: { left: 4, right: 6, mid: 5 },
      explanation: "Minimum is in LEFT half (including mid). Move right pointer.",
      highlightedLines: [10],
      lineExecution: "right = mid"
    },
    {
      array,
      highlights: [4, 5],
      variables: { left: 4, right: 5, mid: 5 },
      explanation: "right updated to 5. Search space: [4...5].",
      highlightedLines: [10],
      lineExecution: "right = 5"
    },
    {
      array,
      highlights: [4, 5],
      variables: { left: 4, right: 5, mid: 5 },
      explanation: "Check loop condition: left (4) < right (5)? Yes, continue.",
      highlightedLines: [4],
      lineExecution: "while (left < right)"
    },
    {
      array,
      highlights: [4, 5],
      variables: { left: 4, right: 5, mid: 5 },
      explanation: "Calculate new mid: (4 + 5) / 2 = 4.",
      highlightedLines: [5],
      lineExecution: "const mid = Math.floor((left + right) / 2)"
    },
    {
      array,
      highlights: [4, 5],
      variables: { left: 4, right: 5, mid: 4 },
      explanation: "mid = 4. Compare nums[mid]=0 with nums[right]=1.",
      highlightedLines: [5],
      lineExecution: "mid = 4"
    },
    {
      array,
      highlights: [4, 5],
      variables: { left: 4, right: 5, mid: 4 },
      explanation: "Check: nums[mid] (0) > nums[right] (1)? No, 0 < 1.",
      highlightedLines: [7],
      lineExecution: "if (nums[mid] > nums[right]) -> false"
    },
    {
      array,
      highlights: [4, 5],
      variables: { left: 4, right: 5, mid: 4 },
      explanation: "Minimum is at mid or left. Move right to mid.",
      highlightedLines: [10],
      lineExecution: "right = mid"
    },
    {
      array,
      highlights: [4],
      variables: { left: 4, right: 4, mid: 4 },
      explanation: "right updated to 4. Search space: [4...4]. Converged!",
      highlightedLines: [10],
      lineExecution: "right = 4"
    },
    {
      array,
      highlights: [4],
      variables: { left: 4, right: 4, mid: 4 },
      explanation: "Check loop condition: left (4) < right (4)? No, exit loop.",
      highlightedLines: [4],
      lineExecution: "while (left < right) -> false"
    },
    {
      array,
      highlights: [4],
      variables: { left: 4, right: 4, mid: 4 },
      explanation: "Return nums[left] = nums[4] = 0. Minimum found!",
      highlightedLines: [13],
      lineExecution: "return nums[left] = 0"
    },
    {
      array,
      highlights: [4],
      variables: { left: 4, right: 4, mid: 4, result: 0 },
      explanation: "Algorithm complete! Found minimum: 0. Time: O(log n), Space: O(1).",
      highlightedLines: [13],
      lineExecution: "Result: 0"
    }
  ];

  const code = `function findMin(nums: number[]): number {
  let left = 0, right = nums.length - 1;

  if(nums.length == 0)
      return 0;  

  while (left < right) {
    const mid = Math.floor((left + right) / 2);
    
    if (nums[mid] > nums[right]) {
      left = mid + 1;
    } else {
      right = mid;
    }
  }
  
  return nums[left];
}`;

  const step = steps[currentStep];

  return (
    <VisualizationLayout
      leftContent={
        <>
          <motion.div
            key={`array-${currentStep}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="p-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-center">Find Minimum in Rotated Sorted Array</h3>
                <div className="flex items-center justify-center gap-2 min-h-[200px] flex-wrap">
                  {step.array.map((value, index) => (
                    <motion.div
                      key={index}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex flex-col items-center gap-2"
                    >
                      <div
                        className={`w-14 h-14 rounded flex items-center justify-center font-bold transition-all duration-300 ${
                          step.highlights.includes(index)
                            ? 'bg-primary text-primary-foreground scale-110'
                            : 'bg-muted text-foreground'
                        }`}
                      >
                        {value}
                      </div>
                      <span className="text-xs text-muted-foreground">[{index}]</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            key={`explanation-${currentStep}`}
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
