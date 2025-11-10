import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { AnimatedCodeEditor } from '../shared/AnimatedCodeEditor';
import { VisualizationLayout } from '../shared/VisualizationLayout';
import { motion } from 'framer-motion';

interface Step {
  array: number[];
  variables: Record<string, any>;
  explanation: string;
  highlightedLines: number[];
  lineExecution: string;
  highlighting: number[];
}

export const ClimbingStairsVisualization = () => {
  const [currentStep, setCurrentStep] = useState(0);
  
  const steps: Step[] = [
    {
      array: [],
      variables: { n: 5 },
      explanation: "Starting with n = 5. Need to find number of ways to climb 5 stairs.",
      highlightedLines: [1],
      lineExecution: "function climbStairs(n: number): number {",
      highlighting: []
    },
    {
      array: [],
      variables: { n: 5 },
      explanation: "Check base case: if n <= 2? 5 > 2, so continue.",
      highlightedLines: [2],
      lineExecution: "if (n <= 2) return n;",
      highlighting: []
    },
    {
      array: [1],
      variables: { n: 5, prev2: 1 },
      explanation: "Initialize prev2 = 1. This represents ways to reach step 1.",
      highlightedLines: [4],
      lineExecution: "let prev2 = 1;",
      highlighting: [0]
    },
    {
      array: [1, 2],
      variables: { n: 5, prev2: 1, prev1: 2 },
      explanation: "Initialize prev1 = 2. This represents ways to reach step 2.",
      highlightedLines: [5],
      lineExecution: "let prev1 = 2;",
      highlighting: [1]
    },
    {
      array: [1, 2],
      variables: { n: 5, prev2: 1, prev1: 2, i: 3 },
      explanation: "Start loop: i = 3. Check condition: 3 <= 5? Yes, enter loop.",
      highlightedLines: [7],
      lineExecution: "for (let i = 3; i <= n; i++)",
      highlighting: []
    },
    {
      array: [1, 2],
      variables: { n: 5, prev2: 1, prev1: 2, i: 3, current: '?' },
      explanation: "Calculate current = prev1 + prev2.",
      highlightedLines: [8],
      lineExecution: "const current = prev1 + prev2;",
      highlighting: []
    },
    {
      array: [1, 2, 3],
      variables: { n: 5, prev2: 1, prev1: 2, i: 3, current: 3 },
      explanation: "current = 2 + 1 = 3. There are 3 ways to reach step 3.",
      highlightedLines: [8],
      lineExecution: "current = 3",
      highlighting: [2]
    },
    {
      array: [1, 2, 3],
      variables: { n: 5, prev2: 2, prev1: 2, i: 3, current: 3 },
      explanation: "Update: prev2 = prev1 = 2. Shift window for next iteration.",
      highlightedLines: [9],
      lineExecution: "prev2 = prev1;",
      highlighting: []
    },
    {
      array: [1, 2, 3],
      variables: { n: 5, prev2: 2, prev1: 3, i: 3, current: 3 },
      explanation: "Update: prev1 = current = 3. Ready for next step.",
      highlightedLines: [10],
      lineExecution: "prev1 = current;",
      highlighting: []
    },
    {
      array: [1, 2, 3],
      variables: { n: 5, prev2: 2, prev1: 3, i: 4 },
      explanation: "Loop iteration: i = 4. Check: 4 <= 5? Yes, continue.",
      highlightedLines: [7],
      lineExecution: "for (let i = 4; i <= n; i++)",
      highlighting: []
    },
    {
      array: [1, 2, 3, 5],
      variables: { n: 5, prev2: 2, prev1: 3, i: 4, current: 5 },
      explanation: "Calculate current = 3 + 2 = 5. There are 5 ways to reach step 4.",
      highlightedLines: [8],
      lineExecution: "current = 5",
      highlighting: [3]
    },
    {
      array: [1, 2, 3, 5],
      variables: { n: 5, prev2: 3, prev1: 5, i: 4 },
      explanation: "Update: prev2 = 3, prev1 = 5. Shift window.",
      highlightedLines: [9, 10],
      lineExecution: "prev2 = 3; prev1 = 5;",
      highlighting: []
    },
    {
      array: [1, 2, 3, 5],
      variables: { n: 5, prev2: 3, prev1: 5, i: 5 },
      explanation: "Loop iteration: i = 5. Check: 5 <= 5? Yes, last iteration.",
      highlightedLines: [7],
      lineExecution: "for (let i = 5; i <= n; i++)",
      highlighting: []
    },
    {
      array: [1, 2, 3, 5, 8],
      variables: { n: 5, prev2: 3, prev1: 5, i: 5, current: 8 },
      explanation: "Calculate current = 5 + 3 = 8. There are 8 ways to reach step 5!",
      highlightedLines: [8],
      lineExecution: "current = 8",
      highlighting: [4]
    },
    {
      array: [1, 2, 3, 5, 8],
      variables: { n: 5, prev2: 5, prev1: 8, i: 5 },
      explanation: "Update: prev2 = 5, prev1 = 8. Final values calculated.",
      highlightedLines: [9, 10],
      lineExecution: "prev2 = 5; prev1 = 8;",
      highlighting: []
    },
    {
      array: [1, 2, 3, 5, 8],
      variables: { n: 5, prev2: 5, prev1: 8, i: 6 },
      explanation: "Check loop condition: i (6) <= n (5)? No, exit loop.",
      highlightedLines: [7],
      lineExecution: "for (let i = 6; i <= n; i++) -> false",
      highlighting: []
    },
    {
      array: [1, 2, 3, 5, 8],
      variables: { n: 5, result: 8 },
      explanation: "Return prev1 = 8. There are 8 distinct ways to climb 5 stairs!",
      highlightedLines: [13],
      lineExecution: "return prev1 = 8",
      highlighting: [4]
    },
    {
      array: [1, 2, 3, 5, 8],
      variables: { n: 5, result: 8, pattern: 'Fibonacci!' },
      explanation: "Algorithm complete! This follows Fibonacci pattern. Time: O(n), Space: O(1).",
      highlightedLines: [13],
      lineExecution: "Result: 8 ways",
      highlighting: [4]
    }
  ];

  const code = `function climbStairs(n: number): number {
  if (n <= 2) return n;
  
  let prev2 = 1;
  let prev1 = 2;
  
  for (let i = 3; i <= n; i++) {
    const current = prev1 + prev2;
    prev2 = prev1;
    prev1 = current;
  }
  
  return prev1;
}`;

  const step = steps[currentStep];

  return (
    <VisualizationLayout
      leftContent={
        <>
          <motion.div
            key={`stairs-${currentStep}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="p-6">
              <h3 className="text-sm font-semibold mb-3 text-center">Climbing Stairs - Ways to Reach Each Step</h3>
              <div className="flex justify-center gap-2">
                {step.array.map((ways, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex flex-col items-center"
                  >
                    <div className={`w-16 h-16 rounded-lg flex items-center justify-center border-2 transition-all duration-300 ${
                      step.highlighting.includes(idx)
                        ? 'bg-primary text-primary-foreground border-primary scale-110'
                        : 'bg-primary/20 border-primary'
                    }`}>
                      <span className="font-bold text-xl">{ways}</span>
                    </div>
                    <span className="text-xs mt-2 text-muted-foreground">
                      Step {idx === 0 ? 1 : idx === 1 ? 2 : idx + 1}
                    </span>
                  </motion.div>
                ))}
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
            key={`pattern-${currentStep}`}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <Card className="p-4 bg-muted/50">
              <h3 className="font-semibold mb-2 text-sm">Pattern:</h3>
              <p className="text-xs text-muted-foreground">
                ways(n) = ways(n-1) + ways(n-2) - Fibonacci sequence!
              </p>
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