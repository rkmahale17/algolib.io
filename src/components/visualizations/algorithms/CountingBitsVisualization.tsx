import { useState } from 'react';
import { SimpleArrayVisualization } from '../shared/SimpleArrayVisualization';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { AnimatedCodeEditor } from '../shared/AnimatedCodeEditor';
import { VisualizationLayout } from '../shared/VisualizationLayout';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';

interface Step {
  array: number[];
  highlighting: number[];
  variables: Record<string, any>;
  explanation: string;
  highlightedLines: number[];
  lineExecution: string;
}

export const CountingBitsVisualization = () => {
  const [currentStep, setCurrentStep] = useState(0);
  
  const steps: Step[] = [
    {
      array: [],
      highlighting: [],
      variables: { n: 5 },
      explanation: "Starting with n = 5. Goal: Count 1-bits for numbers 0 through 5.",
      highlightedLines: [1],
      lineExecution: "function countBits(n: number): number[] {"
    },
    {
      array: [],
      highlighting: [],
      variables: { n: 5, size: 6 },
      explanation: "Create result array of size n + 1 = 6. Will store counts for 0, 1, 2, 3, 4, 5.",
      highlightedLines: [2],
      lineExecution: "const result = new Array(n + 1).fill(0);"
    },
    {
      array: [0],
      highlighting: [0],
      variables: { n: 5, i: 0, binary: '0' },
      explanation: "Initialize: result[0] = 0 (number 0 has zero 1-bits).",
      highlightedLines: [2],
      lineExecution: "result[0] = 0"
    },
    {
      array: [0],
      highlighting: [],
      variables: { n: 5, i: 1 },
      explanation: "Start loop: i = 1. Check condition: 1 <= 5? Yes, enter loop.",
      highlightedLines: [3],
      lineExecution: "for (let i = 1; i <= n; i++)"
    },
    {
      array: [0],
      highlighting: [],
      variables: { n: 5, i: 1, binary: '1', 'i>>1': '?' },
      explanation: "Calculate i >> 1 for i=1. Right shift 1 by 1 position.",
      highlightedLines: [4],
      lineExecution: "result[i] = result[i >> 1] + (i & 1);"
    },
    {
      array: [0],
      highlighting: [0],
      variables: { n: 5, i: 1, binary: '1', 'i>>1': 0 },
      explanation: "i >> 1 = 0. This means look at result[0].",
      highlightedLines: [4],
      lineExecution: "i >> 1 = 0"
    },
    {
      array: [0],
      highlighting: [0],
      variables: { n: 5, i: 1, binary: '1', 'i>>1': 0, 'i&1': 1 },
      explanation: "Calculate i & 1 = 1 & 1 = 1. Last bit of 1 (binary '1') is 1.",
      highlightedLines: [4],
      lineExecution: "i & 1 = 1"
    },
    {
      array: [0, 1],
      highlighting: [1],
      variables: { n: 5, i: 1, binary: '1', result: 1 },
      explanation: "result[1] = result[0] + 1 = 0 + 1 = 1. Binary '1' has one 1-bit.",
      highlightedLines: [4],
      lineExecution: "result[1] = 1"
    },
    {
      array: [0, 1],
      highlighting: [],
      variables: { n: 5, i: 2 },
      explanation: "Loop iteration: i = 2. Check: 2 <= 5? Yes, continue.",
      highlightedLines: [3],
      lineExecution: "for (let i = 2; i <= n; i++)"
    },
    {
      array: [0, 1],
      highlighting: [],
      variables: { n: 5, i: 2, binary: '10', 'i>>1': '?' },
      explanation: "Calculate i >> 1 for i=2 (binary '10'). Right shift.",
      highlightedLines: [4],
      lineExecution: "result[i] = result[i >> 1] + (i & 1);"
    },
    {
      array: [0, 1],
      highlighting: [1],
      variables: { n: 5, i: 2, binary: '10', 'i>>1': 1 },
      explanation: "i >> 1 = 1. Binary '10' shifted right is '1'. Look at result[1].",
      highlightedLines: [4],
      lineExecution: "i >> 1 = 1"
    },
    {
      array: [0, 1],
      highlighting: [1],
      variables: { n: 5, i: 2, binary: '10', 'i>>1': 1, 'i&1': 0 },
      explanation: "Calculate i & 1 = 2 & 1 = 0. Last bit of 2 (binary '10') is 0.",
      highlightedLines: [4],
      lineExecution: "i & 1 = 0"
    },
    {
      array: [0, 1, 1],
      highlighting: [2],
      variables: { n: 5, i: 2, binary: '10', result: 1 },
      explanation: "result[2] = result[1] + 0 = 1 + 0 = 1. Binary '10' has one 1-bit.",
      highlightedLines: [4],
      lineExecution: "result[2] = 1"
    },
    {
      array: [0, 1, 1],
      highlighting: [],
      variables: { n: 5, i: 3 },
      explanation: "Loop iteration: i = 3. Check: 3 <= 5? Yes, continue.",
      highlightedLines: [3],
      lineExecution: "for (let i = 3; i <= n; i++)"
    },
    {
      array: [0, 1, 1],
      highlighting: [1],
      variables: { n: 5, i: 3, binary: '11', 'i>>1': 1 },
      explanation: "i >> 1 = 1. Binary '11' shifted right is '1'. Look at result[1].",
      highlightedLines: [4],
      lineExecution: "i >> 1 = 1"
    },
    {
      array: [0, 1, 1],
      highlighting: [1],
      variables: { n: 5, i: 3, binary: '11', 'i>>1': 1, 'i&1': 1 },
      explanation: "Calculate i & 1 = 3 & 1 = 1. Last bit of 3 (binary '11') is 1.",
      highlightedLines: [4],
      lineExecution: "i & 1 = 1"
    },
    {
      array: [0, 1, 1, 2],
      highlighting: [3],
      variables: { n: 5, i: 3, binary: '11', result: 2 },
      explanation: "result[3] = result[1] + 1 = 1 + 1 = 2. Binary '11' has two 1-bits.",
      highlightedLines: [4],
      lineExecution: "result[3] = 2"
    },
    {
      array: [0, 1, 1, 2],
      highlighting: [],
      variables: { n: 5, i: 4 },
      explanation: "Loop iteration: i = 4. Check: 4 <= 5? Yes, continue.",
      highlightedLines: [3],
      lineExecution: "for (let i = 4; i <= n; i++)"
    },
    {
      array: [0, 1, 1, 2],
      highlighting: [2],
      variables: { n: 5, i: 4, binary: '100', 'i>>1': 2 },
      explanation: "i >> 1 = 2. Binary '100' shifted right is '10'. Look at result[2].",
      highlightedLines: [4],
      lineExecution: "i >> 1 = 2"
    },
    {
      array: [0, 1, 1, 2],
      highlighting: [2],
      variables: { n: 5, i: 4, binary: '100', 'i>>1': 2, 'i&1': 0 },
      explanation: "Calculate i & 1 = 4 & 1 = 0. Last bit of 4 (binary '100') is 0.",
      highlightedLines: [4],
      lineExecution: "i & 1 = 0"
    },
    {
      array: [0, 1, 1, 2, 1],
      highlighting: [4],
      variables: { n: 5, i: 4, binary: '100', result: 1 },
      explanation: "result[4] = result[2] + 0 = 1 + 0 = 1. Binary '100' has one 1-bit.",
      highlightedLines: [4],
      lineExecution: "result[4] = 1"
    },
    {
      array: [0, 1, 1, 2, 1],
      highlighting: [],
      variables: { n: 5, i: 5 },
      explanation: "Loop iteration: i = 5. Check: 5 <= 5? Yes, last iteration.",
      highlightedLines: [3],
      lineExecution: "for (let i = 5; i <= n; i++)"
    },
    {
      array: [0, 1, 1, 2, 1],
      highlighting: [2],
      variables: { n: 5, i: 5, binary: '101', 'i>>1': 2 },
      explanation: "i >> 1 = 2. Binary '101' shifted right is '10'. Look at result[2].",
      highlightedLines: [4],
      lineExecution: "i >> 1 = 2"
    },
    {
      array: [0, 1, 1, 2, 1],
      highlighting: [2],
      variables: { n: 5, i: 5, binary: '101', 'i>>1': 2, 'i&1': 1 },
      explanation: "Calculate i & 1 = 5 & 1 = 1. Last bit of 5 (binary '101') is 1.",
      highlightedLines: [4],
      lineExecution: "i & 1 = 1"
    },
    {
      array: [0, 1, 1, 2, 1, 2],
      highlighting: [5],
      variables: { n: 5, i: 5, binary: '101', result: 2 },
      explanation: "result[5] = result[2] + 1 = 1 + 1 = 2. Binary '101' has two 1-bits.",
      highlightedLines: [4],
      lineExecution: "result[5] = 2"
    },
    {
      array: [0, 1, 1, 2, 1, 2],
      highlighting: [],
      variables: { n: 5, i: 6 },
      explanation: "Check loop condition: i (6) <= n (5)? No, exit loop.",
      highlightedLines: [3],
      lineExecution: "for (let i = 6; i <= n; i++) -> false"
    },
    {
      array: [0, 1, 1, 2, 1, 2],
      highlighting: [],
      variables: { n: 5, result: '[0,1,1,2,1,2]' },
      explanation: "Return result array: [0,1,1,2,1,2]. Complete!",
      highlightedLines: [6],
      lineExecution: "return result;"
    },
    {
      array: [0, 1, 1, 2, 1, 2],
      highlighting: [],
      variables: { n: 5, result: '[0,1,1,2,1,2]' },
      explanation: "Algorithm complete! Time: O(n), Space: O(n). Used DP to reuse previous results.",
      highlightedLines: [6],
      lineExecution: "Result: [0,1,1,2,1,2]"
    }
  ];

  const code = `function countBits(n: number): number[] {
  const result = new Array(n + 1).fill(0);
  for (let i = 1; i <= n; i++) {
    result[i] = result[i >> 1] + (i & 1);
  }
  return result;
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
              <SimpleArrayVisualization
                array={step.array}
                highlights={step.highlighting}
                label="result[] - Count of 1-bits for each number"
              />
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
              <h3 className="font-semibold mb-2 text-sm">DP Pattern:</h3>
              <div className="text-xs space-y-1 text-muted-foreground">
                <p>• i {'>>'}  1: Removes last bit (divide by 2)</p>
                <p>• i & 1: Checks if last bit is 1</p>
                <p>• result[i] = result[i{'>>'}1] + (i&1)</p>
                <p>• Reuses previous results for O(n) time</p>
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