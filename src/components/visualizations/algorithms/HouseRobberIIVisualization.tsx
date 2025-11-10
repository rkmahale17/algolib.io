import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { AnimatedCodeEditor } from '../shared/AnimatedCodeEditor';
import { VisualizationLayout } from '../shared/VisualizationLayout';
import { motion } from 'framer-motion';

interface Step {
  nums: number[];
  range: string;
  prev: number;
  curr: number;
  i: number;
  start: number;
  end: number;
  variables: Record<string, any>;
  explanation: string;
  highlightedLines: number[];
  lineExecution: string;
}

export const HouseRobberIIVisualization = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const nums = [2, 3, 2];

  const steps: Step[] = [
    {
      nums,
      range: "",
      prev: 0,
      curr: 0,
      i: -1,
      start: 0,
      end: 0,
      variables: { nums: '[2,3,2]' },
      explanation: "Houses arranged in a circle. Cannot rob first AND last house. Need special handling.",
      highlightedLines: [1],
      lineExecution: "function rob(nums: number[]): number"
    },
    {
      nums,
      range: "",
      prev: 0,
      curr: 0,
      i: -1,
      start: 0,
      end: 0,
      variables: { length: 3 },
      explanation: "Check edge case: nums.length > 1, continue with circular logic.",
      highlightedLines: [2],
      lineExecution: "if (nums.length === 1) return nums[0]; // false, continue"
    },
    {
      nums,
      range: "",
      prev: 0,
      curr: 0,
      i: -1,
      start: 0,
      end: 0,
      variables: {},
      explanation: "Define robLinear helper function to rob houses in a range [start, end].",
      highlightedLines: [4],
      lineExecution: "function robLinear(start: number, end: number): number"
    },
    {
      nums,
      range: "[0..1]",
      prev: 0,
      curr: 0,
      i: 0,
      start: 0,
      end: 1,
      variables: { start: 0, end: 1, range: '[0..1]' },
      explanation: "Case 1: Rob houses [0..n-2] = [0..1], excluding last house.",
      highlightedLines: [5],
      lineExecution: "let prev = 0, curr = 0;"
    },
    {
      nums,
      range: "[0..1]",
      prev: 0,
      curr: 0,
      i: 0,
      start: 0,
      end: 1,
      variables: { i: 0 },
      explanation: "Start loop: i = 0 (start). Check: 0 <= 1? Yes.",
      highlightedLines: [6],
      lineExecution: "for (let i = start; i <= end; i++) // i=0"
    },
    {
      nums,
      range: "[0..1]",
      prev: 0,
      curr: 2,
      i: 0,
      start: 0,
      end: 1,
      variables: { temp: 2, 'nums[0]': 2 },
      explanation: "i=0: temp = max(curr, nums[0] + prev) = max(0, 2+0) = 2.",
      highlightedLines: [7],
      lineExecution: "const temp = Math.max(curr, nums[i] + prev); // max(0, 2) = 2"
    },
    {
      nums,
      range: "[0..1]",
      prev: 0,
      curr: 2,
      i: 0,
      start: 0,
      end: 1,
      variables: { prev: 0, curr: 2 },
      explanation: "Update: prev = 0, curr = 2.",
      highlightedLines: [8, 9],
      lineExecution: "prev = curr; curr = temp; // prev=0, curr=2"
    },
    {
      nums,
      range: "[0..1]",
      prev: 2,
      curr: 3,
      i: 1,
      start: 0,
      end: 1,
      variables: { i: 1, temp: 3 },
      explanation: "i=1: temp = max(2, nums[1] + 0) = max(2, 3) = 3. Update prev=2, curr=3.",
      highlightedLines: [7, 8, 9],
      lineExecution: "temp = max(2, 3+0) = 3; prev=2, curr=3"
    },
    {
      nums,
      range: "[0..1]",
      prev: 2,
      curr: 3,
      i: 2,
      start: 0,
      end: 1,
      variables: { i: 2, end: 1 },
      explanation: "i=2: Check 2 <= 1? No, exit loop. Return curr = 3.",
      highlightedLines: [6],
      lineExecution: "for (let i = 2; i <= end; i++) // 2 <= 1 -> false"
    },
    {
      nums,
      range: "[0..1]",
      prev: 2,
      curr: 3,
      i: -1,
      start: 0,
      end: 1,
      variables: { 'robLinear(0,1)': 3 },
      explanation: "robLinear(0, 1) returns 3. Max money robbing houses [0..1].",
      highlightedLines: [11],
      lineExecution: "return curr; // 3"
    },
    {
      nums,
      range: "[1..2]",
      prev: 0,
      curr: 0,
      i: 1,
      start: 1,
      end: 2,
      variables: { start: 1, end: 2, range: '[1..2]' },
      explanation: "Case 2: Rob houses [1..n-1] = [1..2], excluding first house.",
      highlightedLines: [5, 6],
      lineExecution: "let prev = 0, curr = 0; for i=1"
    },
    {
      nums,
      range: "[1..2]",
      prev: 0,
      curr: 3,
      i: 1,
      start: 1,
      end: 2,
      variables: { temp: 3, 'nums[1]': 3 },
      explanation: "i=1: temp = max(0, 3+0) = 3. Update curr=3.",
      highlightedLines: [7, 8, 9],
      lineExecution: "temp = max(0, 3) = 3; prev=0, curr=3"
    },
    {
      nums,
      range: "[1..2]",
      prev: 3,
      curr: 3,
      i: 2,
      start: 1,
      end: 2,
      variables: { i: 2, 'nums[2]': 2 },
      explanation: "i=2: temp = max(3, 2+0) = max(3, 2) = 3. No change.",
      highlightedLines: [7, 8, 9],
      lineExecution: "temp = max(3, 2) = 3; prev=3, curr=3"
    },
    {
      nums,
      range: "[1..2]",
      prev: 3,
      curr: 3,
      i: -1,
      start: 1,
      end: 2,
      variables: { 'robLinear(1,2)': 3 },
      explanation: "robLinear(1, 2) returns 3. Max money robbing houses [1..2].",
      highlightedLines: [11],
      lineExecution: "return curr; // 3"
    },
    {
      nums,
      range: "both",
      prev: 0,
      curr: 0,
      i: -1,
      start: 0,
      end: 0,
      variables: { case1: 3, case2: 3, result: 3 },
      explanation: "Return max(case1, case2) = max(3, 3) = 3. Maximum money is $3.",
      highlightedLines: [14, 15, 16, 17],
      lineExecution: "return Math.max(robLinear(0,1), robLinear(1,2)); // max(3,3) = 3"
    },
    {
      nums,
      range: "both",
      prev: 0,
      curr: 0,
      i: -1,
      start: 0,
      end: 0,
      variables: { maxMoney: 3, complexity: 'O(n)' },
      explanation: "Algorithm complete! Can't rob both first and last. Rob middle house for $3. Time: O(n), Space: O(1).",
      highlightedLines: [14, 15, 16, 17],
      lineExecution: "Result: 3"
    }
  ];

  const code = `function rob(nums: number[]): number {
  if (nums.length === 1) return nums[0];
  
  function robLinear(start: number, end: number): number {
    let prev = 0, curr = 0;
    for (let i = start; i <= end; i++) {
      const temp = Math.max(curr, nums[i] + prev);
      prev = curr;
      curr = temp;
    }
    return curr;
  }
  
  return Math.max(
    robLinear(0, nums.length - 2),
    robLinear(1, nums.length - 1)
  );
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
              <h3 className="text-sm font-semibold mb-3">Houses in Circle</h3>
              <div className="flex gap-2 flex-wrap items-center">
                {step.nums.map((num, idx) => (
                  <div
                    key={idx}
                    className={`px-4 py-3 rounded font-mono text-center ${
                      step.range === '[0..1]' && idx <= 1
                        ? 'bg-primary text-primary-foreground'
                        : step.range === '[1..2]' && idx >= 1
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    }`}
                  >
                    <div className="text-xs">House {idx}</div>
                    <div className="font-bold">${num}</div>
                  </div>
                ))}
                <div className="text-xl">🔄</div>
              </div>
              {step.range && step.range !== 'both' && (
                <div className="text-xs mt-2 text-muted-foreground">
                  Current range: {step.range}
                </div>
              )}
            </Card>
          </motion.div>

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
            <Card className="p-4 bg-blue-500/10">
              <h3 className="font-semibold mb-2 text-sm">Key Insight:</h3>
              <div className="text-xs text-muted-foreground">
                Houses form a circle, so we can't rob both house 0 and house n-1. Solution: Run
                linear rob twice - once excluding last house, once excluding first house.
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
