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
      explanation: "Starting with n = 5. Goal: Count set bits (1s) for numbers 0 through 5 using DP + Offset.",
      highlightedLines: [1],
      lineExecution: "function countBits(n: number): number[] {"
    },
    {
      array: [0, 0, 0, 0, 0, 0],
      highlighting: [],
      variables: { n: 5, ans: '[0,0,0,0,0,0]' },
      explanation: "Initialize 'ans' array of size n + 1 (6) with zeros.",
      highlightedLines: [3],
      lineExecution: "const ans: number[] = new Array(n + 1).fill(0);"
    },
    {
      array: [0, 0, 0, 0, 0, 0],
      highlighting: [],
      variables: { n: 5, offset: 1 },
      explanation: "Initialize offset = 1. 'offset' tracks the most recent power of 2.",
      highlightedLines: [7],
      lineExecution: "let offset = 1;"
    },
    // i = 1
    {
      array: [0, 0, 0, 0, 0, 0],
      highlighting: [1],
      variables: { n: 5, offset: 1, i: 1 },
      explanation: "Start loop at i = 1.",
      highlightedLines: [10],
      lineExecution: "for (let i = 1; i <= n; i++)"
    },
    {
      array: [0, 0, 0, 0, 0, 0],
      highlighting: [1],
      variables: { n: 5, offset: 1, i: 1 },
      explanation: "Check power of 2: i (1) == offset * 2 (2)? No.",
      highlightedLines: [13],
      lineExecution: "if (i === offset * 2)"
    },
    {
      array: [0, 1, 0, 0, 0, 0],
      highlighting: [1, 0],
      variables: { n: 5, offset: 1, i: 1, 'i-offset': 0 },
      explanation: "ans[1] = 1 + ans[1 - 1] = 1 + ans[0] = 1 + 0 = 1.",
      highlightedLines: [20],
      lineExecution: "ans[i] = 1 + ans[i - offset];"
    },
    // i = 2
    {
      array: [0, 1, 0, 0, 0, 0],
      highlighting: [2],
      variables: { n: 5, offset: 1, i: 2 },
      explanation: "Loop i = 2.",
      highlightedLines: [10],
      lineExecution: "for (let i = 1; i <= n; i++)"
    },
    {
      array: [0, 1, 0, 0, 0, 0],
      highlighting: [2],
      variables: { n: 5, offset: 1, i: 2 },
      explanation: "Check power of 2: i (2) == offset * 2 (2)? YES! New power of 2 found.",
      highlightedLines: [13],
      lineExecution: "if (i === offset * 2)"
    },
    {
      array: [0, 1, 0, 0, 0, 0],
      highlighting: [2],
      variables: { n: 5, offset: 2, i: 2 },
      explanation: "Update offset to current i (2).",
      highlightedLines: [14],
      lineExecution: "offset = i;"
    },
    {
      array: [0, 1, 1, 0, 0, 0],
      highlighting: [2, 0],
      variables: { n: 5, offset: 2, i: 2, 'i-offset': 0 },
      explanation: "ans[2] = 1 + ans[2 - 2] = 1 + ans[0] = 1 + 0 = 1.",
      highlightedLines: [20],
      lineExecution: "ans[i] = 1 + ans[i - offset];"
    },
    // i = 3
    {
      array: [0, 1, 1, 0, 0, 0],
      highlighting: [3],
      variables: { n: 5, offset: 2, i: 3 },
      explanation: "Loop i = 3.",
      highlightedLines: [10],
      lineExecution: "for (let i = 1; i <= n; i++)"
    },
    {
      array: [0, 1, 1, 0, 0, 0],
      highlighting: [3],
      variables: { n: 5, offset: 2, i: 3 },
      explanation: "Check power of 2: i (3) == offset * 2 (4)? No.",
      highlightedLines: [13],
      lineExecution: "if (i === offset * 2)"
    },
    {
      array: [0, 1, 1, 2, 0, 0],
      highlighting: [3, 1],
      variables: { n: 5, offset: 2, i: 3, 'i-offset': 1 },
      explanation: "ans[3] = 1 + ans[3 - 2] = 1 + ans[1] = 1 + 1 = 2.",
      highlightedLines: [20],
      lineExecution: "ans[i] = 1 + ans[i - offset];"
    },
    // i = 4
    {
      array: [0, 1, 1, 2, 0, 0],
      highlighting: [4],
      variables: { n: 5, offset: 2, i: 4 },
      explanation: "Loop i = 4.",
      highlightedLines: [10],
      lineExecution: "for (let i = 1; i <= n; i++)"
    },
    {
      array: [0, 1, 1, 2, 0, 0],
      highlighting: [4],
      variables: { n: 5, offset: 2, i: 4 },
      explanation: "Check power of 2: i (4) == offset * 2 (4)? YES! New power of 2 found.",
      highlightedLines: [13],
      lineExecution: "if (i === offset * 2)"
    },
    {
      array: [0, 1, 1, 2, 0, 0],
      highlighting: [4],
      variables: { n: 5, offset: 4, i: 4 },
      explanation: "Update offset to current i (4).",
      highlightedLines: [14],
      lineExecution: "offset = i;"
    },
    {
      array: [0, 1, 1, 2, 1, 0],
      highlighting: [4, 0],
      variables: { n: 5, offset: 4, i: 4, 'i-offset': 0 },
      explanation: "ans[4] = 1 + ans[4 - 4] = 1 + ans[0] = 1 + 0 = 1.",
      highlightedLines: [20],
      lineExecution: "ans[i] = 1 + ans[i - offset];"
    },
    // i = 5
    {
      array: [0, 1, 1, 2, 1, 0],
      highlighting: [5],
      variables: { n: 5, offset: 4, i: 5 },
      explanation: "Loop i = 5.",
      highlightedLines: [10],
      lineExecution: "for (let i = 1; i <= n; i++)"
    },
    {
      array: [0, 1, 1, 2, 1, 0],
      highlighting: [5],
      variables: { n: 5, offset: 4, i: 5 },
      explanation: "Check power of 2: i (5) == offset * 2 (8)? No.",
      highlightedLines: [13],
      lineExecution: "if (i === offset * 2)"
    },
    {
      array: [0, 1, 1, 2, 1, 2],
      highlighting: [5, 1],
      variables: { n: 5, offset: 4, i: 5, 'i-offset': 1 },
      explanation: "ans[5] = 1 + ans[5 - 4] = 1 + ans[1] = 1 + 1 = 2.",
      highlightedLines: [20],
      lineExecution: "ans[i] = 1 + ans[i - offset];"
    },
    // End
    {
      array: [0, 1, 1, 2, 1, 2],
      highlighting: [],
      variables: { n: 5, i: 6 },
      explanation: "Loop ends (i > n).",
      highlightedLines: [10],
      lineExecution: "for (let i = 1; i <= n; i++)"
    },
    {
      array: [0, 1, 1, 2, 1, 2],
      highlighting: [],
      variables: { n: 5, ans: '[0,1,1,2,1,2]' },
      explanation: "Return result array.",
      highlightedLines: [23],
      lineExecution: "return ans;"
    }
  ];

  const code = `function countBits(n: number): number[] {
    // ans[i] will store number of set bits in i
    const ans: number[] = new Array(n + 1).fill(0);

    // offset represents the most recent power of 2
    // example: 1, 2, 4, 8, ...
    let offset = 1;

    // Start from 1 because ans[0] = 0 by default
    for (let i = 1; i <= n; i++) {
        // When i reaches the next power of 2,
        // update offset
        if (i === offset * 2) {
            offset = i;
        }

        // Number of set bits in i is:
        // 1 (for the highest set bit) +
        // number of set bits in (i - offset)
        ans[i] = 1 + ans[i - offset];
    }

    return ans;
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
                label="ans[] - Count of set bits"
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
              <h3 className="font-semibold mb-2 text-sm">DP Pattern (Offset):</h3>
              <div className="text-xs space-y-1 text-muted-foreground">
                <p>• Offset tracks the most recent power of 2 (1, 2, 4...)</p>
                <p>• Numbers repeat the bit pattern of previous numbers + 1 bit</p>
                <p>• Formula: ans[i] = 1 + ans[i - offset]</p>
                <p>• Time: O(n), Space: O(n)</p>
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