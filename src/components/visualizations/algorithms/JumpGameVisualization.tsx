import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { AnimatedCodeEditor } from '../shared/AnimatedCodeEditor';
import { VisualizationLayout } from '../shared/VisualizationLayout';
import { motion } from 'framer-motion';

interface Step {
  nums: number[];
  i: number;
  maxReach: number;
  variables: Record<string, any>;
  explanation: string;
  highlightedLines: number[];
  lineExecution: string;
}

export const JumpGameVisualization = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const nums = [2, 3, 1, 1, 4];

  const steps: Step[] = [
    {
      nums,
      i: -1,
      maxReach: 0,
      variables: { nums: '[2,3,1,1,4]' },
      explanation: "Given jump array [2,3,1,1,4]. Each value = max jump distance from that position. Can we reach last index (4)?",
      highlightedLines: [1],
      lineExecution: "function canJump(nums: number[]): boolean"
    },
    {
      nums,
      i: -1,
      maxReach: 0,
      variables: { maxReach: 0 },
      explanation: "Initialize maxReach = 0. Tracks the furthest index we can reach.",
      highlightedLines: [2],
      lineExecution: "let maxReach = 0;"
    },
    {
      nums,
      i: 0,
      maxReach: 0,
      variables: { i: 0, n: 5 },
      explanation: "Start loop: i = 0. Check: 0 < 5? Yes, continue.",
      highlightedLines: [4],
      lineExecution: "for (let i = 0; i < nums.length; i++) // i=0"
    },
    {
      nums,
      i: 0,
      maxReach: 0,
      variables: { i: 0, maxReach: 0 },
      explanation: "Check if current position is reachable: i (0) > maxReach (0)? No, continue.",
      highlightedLines: [5],
      lineExecution: "if (i > maxReach) return false; // 0 > 0 -> false"
    },
    {
      nums,
      i: 0,
      maxReach: 2,
      variables: { maxReach: 2, calc: 'max(0, 0+2)' },
      explanation: "Update maxReach: max(0, 0+2) = 2. From index 0, we can reach up to index 2.",
      highlightedLines: [6],
      lineExecution: "maxReach = Math.max(maxReach, i + nums[i]); // max(0, 2) = 2"
    },
    {
      nums,
      i: 0,
      maxReach: 2,
      variables: { maxReach: 2, target: 4 },
      explanation: "Check if we've reached the end: maxReach (2) >= 4? No, continue.",
      highlightedLines: [7],
      lineExecution: "if (maxReach >= nums.length - 1) return true; // 2 >= 4 -> false"
    },
    {
      nums,
      i: 1,
      maxReach: 2,
      variables: { i: 1 },
      explanation: "Increment loop: i = 1. Check: 1 < 5? Yes, continue.",
      highlightedLines: [4],
      lineExecution: "for (let i = 1; i < nums.length; i++) // i=1"
    },
    {
      nums,
      i: 1,
      maxReach: 2,
      variables: { i: 1, maxReach: 2 },
      explanation: "Check reachability: i (1) > maxReach (2)? No, position 1 is reachable.",
      highlightedLines: [5],
      lineExecution: "if (i > maxReach) return false; // 1 > 2 -> false"
    },
    {
      nums,
      i: 1,
      maxReach: 4,
      variables: { maxReach: 4, calc: 'max(2, 1+3)' },
      explanation: "Update maxReach: max(2, 1+3) = 4. From index 1, we can reach up to index 4!",
      highlightedLines: [6],
      lineExecution: "maxReach = Math.max(maxReach, i + nums[i]); // max(2, 4) = 4"
    },
    {
      nums,
      i: 1,
      maxReach: 4,
      variables: { maxReach: 4, target: 4 },
      explanation: "Check if we've reached the end: maxReach (4) >= 4? Yes! Return true.",
      highlightedLines: [7],
      lineExecution: "if (maxReach >= nums.length - 1) return true; // 4 >= 4 -> true"
    },
    {
      nums,
      i: 1,
      maxReach: 4,
      variables: { result: true, maxReach: 4 },
      explanation: "Success! Can reach the last index. Greedy approach: always track furthest reachable position.",
      highlightedLines: [7],
      lineExecution: "return true;"
    },
    {
      nums,
      i: 1,
      maxReach: 4,
      variables: { canReach: true, complexity: 'O(n)' },
      explanation: "Algorithm complete! Time: O(n), Space: O(1). Greedy: if any position is unreachable, we can't continue.",
      highlightedLines: [7],
      lineExecution: "Result: true (can reach last index)"
    }
  ];

  const code = `function canJump(nums: number[]): boolean {
  let maxReach = 0;
  
  for (let i = 0; i < nums.length; i++) {
    if (i > maxReach) return false;
    maxReach = Math.max(maxReach, i + nums[i]);
    if (maxReach >= nums.length - 1) return true;
  }
  
  return false;
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
            <Card className="p-4">
              <h3 className="text-sm font-semibold mb-3">Array (max jump from each index)</h3>
              <div className="flex gap-2 flex-wrap">
                {step.nums.map((num, idx) => (
                  <div
                    key={idx}
                    className={`px-4 py-3 rounded font-mono text-center relative ${
                      idx === step.i
                        ? 'bg-primary text-primary-foreground ring-2 ring-primary'
                        : idx < step.i
                        ? 'bg-secondary'
                        : idx <= step.maxReach && step.i >= 0
                        ? 'bg-green-500/20'
                        : 'bg-muted'
                    }`}
                  >
                    <div className="text-xs">Index {idx}</div>
                    <div className="font-bold text-xl">{num}</div>
                    {idx === step.nums.length - 1 && (
                      <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                        🎯
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>

          <motion.div
            key={`reach-${currentStep}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="p-4">
              <h3 className="text-sm font-semibold mb-2">Max Reachable Index</h3>
              <div className="p-4 bg-green-500/20 rounded text-center">
                <div className="text-3xl font-bold text-green-600">{step.maxReach}</div>
              </div>
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
              <h3 className="font-semibold mb-2 text-sm">Greedy Approach:</h3>
              <div className="text-xs text-muted-foreground">
                Track the furthest index we can reach. If current index &gt; maxReach, we're stuck!
                Early return true when maxReach ≥ last index.
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
