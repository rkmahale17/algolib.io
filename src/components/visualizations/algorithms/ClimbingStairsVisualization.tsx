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
      explanation: "Starting with n = 5. We need to find the number of ways to climb 5 stairs.",
      highlightedLines: [1],
      lineExecution: "function climbStairs(n: number): number {",
      highlighting: []
    },
    {
      array: [1, 1],
      variables: { n: 5, one: 1, two: 1 },
      explanation: "Initialize one = 1 and two = 1. 'one' tracks ways to reach previous step, 'two' tracks steps before that.",
      highlightedLines: [4, 5],
      lineExecution: "let one = 1; let two = 1;",
      highlighting: [0, 1]
    },
    // i = 0
    {
      array: [1, 1],
      variables: { n: 5, one: 1, two: 1, i: 0 },
      explanation: "Start loop from i = 0 to n - 1 (4). Iteration 1 starts.",
      highlightedLines: [8],
      lineExecution: "for (let i = 0; i < n - 1; i++)",
      highlighting: []
    },
    {
      array: [1, 1],
      variables: { n: 5, one: 1, two: 1, i: 0, temp: 1 },
      explanation: "Store current value of 'one' in 'temp'.",
      highlightedLines: [9],
      lineExecution: "const temp = one;",
      highlighting: []
    },
    {
      array: [1, 1, 2],
      variables: { n: 5, one: 2, two: 1, i: 0, temp: 1 },
      explanation: "Update 'one' to sum of previous two (1 + 1 = 2). This is ways to reach step 2.",
      highlightedLines: [10],
      lineExecution: "one = one + two;",
      highlighting: [2]
    },
    {
      array: [1, 1, 2],
      variables: { n: 5, one: 2, two: 1, i: 0, temp: 1 },
      explanation: "Shift 'two' forward to 'temp' (old 'one').",
      highlightedLines: [11],
      lineExecution: "two = temp;",
      highlighting: []
    },
    // i = 1
    {
      array: [1, 1, 2],
      variables: { n: 5, one: 2, two: 1, i: 1 },
      explanation: "Loop iteration i = 1.",
      highlightedLines: [8],
      lineExecution: "for (let i = 0; i < n - 1; i++)",
      highlighting: []
    },
    {
      array: [1, 1, 2],
      variables: { n: 5, one: 2, two: 1, i: 1, temp: 2 },
      explanation: "Store 'one' (2) in 'temp'.",
      highlightedLines: [9],
      lineExecution: "const temp = one;",
      highlighting: []
    },
    {
      array: [1, 1, 2, 3],
      variables: { n: 5, one: 3, two: 1, i: 1, temp: 2 },
      explanation: "Update 'one' = 2 + 1 = 3. Ways to reach step 3.",
      highlightedLines: [10],
      lineExecution: "one = one + two;",
      highlighting: [3]
    },
    {
      array: [1, 1, 2, 3],
      variables: { n: 5, one: 3, two: 2, i: 1, temp: 2 },
      explanation: "Update 'two' = 2.",
      highlightedLines: [11],
      lineExecution: "two = temp;",
      highlighting: []
    },
    // i = 2
    {
      array: [1, 1, 2, 3],
      variables: { n: 5, one: 3, two: 2, i: 2 },
      explanation: "Loop iteration i = 2.",
      highlightedLines: [8],
      lineExecution: "for (let i = 0; i < n - 1; i++)",
      highlighting: []
    },
    {
      array: [1, 1, 2, 3],
      variables: { n: 5, one: 3, two: 2, i: 2, temp: 3 },
      explanation: "Store 'one' (3) in 'temp'.",
      highlightedLines: [9],
      lineExecution: "const temp = one;",
      highlighting: []
    },
    {
      array: [1, 1, 2, 3, 5],
      variables: { n: 5, one: 5, two: 2, i: 2, temp: 3 },
      explanation: "Update 'one' = 3 + 2 = 5. Ways to reach step 4.",
      highlightedLines: [10],
      lineExecution: "one = one + two;",
      highlighting: [4]
    },
    {
      array: [1, 1, 2, 3, 5],
      variables: { n: 5, one: 5, two: 3, i: 2, temp: 3 },
      explanation: "Update 'two' = 3.",
      highlightedLines: [11],
      lineExecution: "two = temp;",
      highlighting: []
    },
    // i = 3
    {
      array: [1, 1, 2, 3, 5],
      variables: { n: 5, one: 5, two: 3, i: 3 },
      explanation: "Loop iteration i = 3 (Final execution for n=5).",
      highlightedLines: [8],
      lineExecution: "for (let i = 0; i < n - 1; i++)",
      highlighting: []
    },
    {
      array: [1, 1, 2, 3, 5],
      variables: { n: 5, one: 5, two: 3, i: 3, temp: 5 },
      explanation: "Store 'one' (5) in 'temp'.",
      highlightedLines: [9],
      lineExecution: "const temp = one;",
      highlighting: []
    },
    {
      array: [1, 1, 2, 3, 5, 8],
      variables: { n: 5, one: 8, two: 3, i: 3, temp: 5 },
      explanation: "Update 'one' = 5 + 3 = 8. Ways to reach step 5.",
      highlightedLines: [10],
      lineExecution: "one = one + two;",
      highlighting: [5]
    },
    {
      array: [1, 1, 2, 3, 5, 8],
      variables: { n: 5, one: 8, two: 5, i: 3, temp: 5 },
      explanation: "Update 'two' = 5.",
      highlightedLines: [11],
      lineExecution: "two = temp;",
      highlighting: []
    },
    // End
    {
      array: [1, 1, 2, 3, 5, 8],
      variables: { n: 5, one: 8, two: 5, i: 4 },
      explanation: "Loop condition i < n - 1 (4 < 4) is false. Exit loop.",
      highlightedLines: [8],
      lineExecution: "i < n - 1 -> false",
      highlighting: []
    },
    {
      array: [1, 1, 2, 3, 5, 8],
      variables: { n: 5, one: 8 },
      explanation: "Return 'one', which is 8. There are 8 ways to climb 5 stairs.",
      highlightedLines: [14],
      lineExecution: "return one;",
      highlighting: [5]
    }
  ];

  const code = `function climbStairs(n: number): number {
    // one: ways to reach the previous step
    // two: ways to reach two steps before
    let one = 1;
    let two = 1;

    // Loop n - 1 times
    for (let i = 0; i < n - 1; i++) {
        const temp = one;    // Store current value
        one = one + two;     // Sum of previous two
        two = temp;          // Shift forward
    }

    return one;
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
              <h3 className="text-sm font-semibold mb-3 text-center">Climbing Stairs (n=5)</h3>
              <div className="flex justify-center gap-2 flex-wrap">
                {step.array.map((val, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex flex-col items-center"
                  >
                    <div className={`w-14 h-14 rounded-lg flex items-center justify-center border-2 transition-all duration-300 ${
                      step.highlighting.includes(idx)
                        ? 'bg-primary text-primary-foreground border-primary scale-110'
                        : 'bg-primary/20 border-primary'
                    }`}>
                      <span className="font-bold text-lg">{val}</span>
                    </div>
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